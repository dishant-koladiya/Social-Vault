import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import prisma from "../configs/prisma.js";
import sendEmail from "../configs/nodemailer.js";
import { otpEmailTemplate } from "../utils/emailTemplate.js";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      },
      select: { id: true, email: true, name: true, image: true, createdAt: true },
    });

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Registered successfully", user });
  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { password: _, ...userWithoutPassword } = user;
    res.json({ message: "Logged in successfully", user: userWithoutPassword });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: error.message || "Login failed" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, image: true, createdAt: true, earned: true, withdrawn: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (error) {
    console.log("Me error:", error);
    res.status(500).json({ message: error.message || "Failed to get user" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log(`Forgot password request for: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`No user found for email: ${email}`);
      return res.status(200).json({ message: "If an account exists with this email, you will receive a verification code." });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.passwordReset.updateMany({
      where: { email, used: false },
      data: { used: true },
    });

    await prisma.passwordReset.create({
      data: {
        email,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    const info = await sendEmail({
      to: email,
      subject: "Your Password Reset Code",
      html: otpEmailTemplate(otp, email),
    });

    console.log(`OTP email sent to: ${email}, messageId: ${info.messageId}`);
    res.status(200).json({ message: "If an account exists with this email, you will receive a verification code." });
  } catch (error) {
    console.log("Forgot password error:", error);
    res.status(500).json({ message: "Failed to process request" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        email,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    const isOtpValid = await bcrypt.compare(otp, resetRecord.otp);
    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    const resetToken = jwt.sign(
      { email, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ message: "Verification successful", resetToken });
  } catch (error) {
    console.log("Verify OTP error:", error);
    res.status(500).json({ message: "Failed to verify code" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword } = req.body;
    const userId = req.user.id;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (email !== undefined && email !== req.user.email) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required to change email" });
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: "Email is already in use" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      updateData.email = email;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No changes provided" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, email: true, name: true, image: true, createdAt: true },
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.log("Update profile error:", error);
    res.status(500).json({ message: error.message || "Failed to update profile" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: "Reset token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    if (decoded.purpose !== "password-reset") {
      return res.status(400).json({ message: "Invalid reset token" });
    }

    const user = await prisma.user.findUnique({ where: { email: decoded.email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email: decoded.email },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password" });
  }
};
