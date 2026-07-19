import jwt from "jsonwebtoken";
import prisma from "../configs/prisma.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, image: true, createdAt: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth middleware error:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    const adminEmails = process.env.ADMIN_EMAILS?.split(",") || [];
    if (!adminEmails.includes(user.email)) {
      return res.status(403).json({ message: "Forbidden - Admin access required" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Admin auth middleware error:", error);
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};