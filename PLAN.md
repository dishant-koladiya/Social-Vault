# Login Page Redesign + Forgot Password Implementation Plan

## Overview
Redesign the login page with a modern split-screen UI and implement a complete production-level forgot password flow using Email + OTP verification with separate pages.

---

## 1. Database Schema Changes

**File:** `Backend/prisma/schema.prisma`

Add a `PasswordReset` model to store OTP tokens:

```prisma
model PasswordReset {
  id        String   @id @default(cuid())
  email     String
  otp       String
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  @@index([email])
}
```

Run `npx prisma db push` to apply schema changes.

---

## 2. Backend - Auth Controller Updates

**File:** `Backend/controllers/authController.js`

Add three new controller functions:

### `forgotPassword(req, res)`
- Accept `{ email }` in request body
- Validate email exists in database
- Generate 6-digit random OTP
- Hash the OTP with bcrypt
- Store hashed OTP + expiry (10 min) in `PasswordReset` table (mark previous unused OTPs as used)
- Send OTP via existing `sendEmail` from `configs/nodemailer.js`
- Always return success message (don't reveal if email exists - security)

### `verifyOtp(req, res)`
- Accept `{ email, otp }` in request body
- Find the most recent unused OTP for this email
- Check if expired (10 min window)
- Compare OTP with bcrypt
- If valid, return a temporary `resetToken` (JWT, 15 min expiry) to authorize password reset
- Mark OTP as used

### `resetPassword(req, res)`
- Accept `{ resetToken, newPassword }` in request body
- Verify the JWT reset token
- Hash the new password with bcrypt
- Update user's password in database
- Return success message

---

## 3. Backend - Auth Routes Updates

**File:** `Backend/routes/authRoutes.js`

Add three new routes (all public, no auth middleware):

```
POST /api/auth/forgot-password  → forgotPassword
POST /api/auth/verify-otp       → verifyOtp
POST /api/auth/reset-password   → resetPassword
```

---

## 4. Backend - Email Template

**File:** `Backend/utils/emailTemplate.js` (new file)

Create an HTML email template for the OTP that:
- Has a clean, branded design
- Displays the 6-digit OTP prominently
- Mentions 10-minute expiry
- Includes a "Not you?" security note

---

## 5. Frontend - Auth Context Updates

**File:** `frontend/src/context/AuthContext.jsx`

Add three new methods to the AuthProvider:

```js
forgotPassword(email)           // POST /api/auth/forgot-password
verifyOtp(email, otp)           // POST /api/auth/verify-otp  → returns { resetToken }
resetPassword(resetToken, newPassword)  // POST /api/auth/reset-password
```

Expose these via the context value alongside existing `login`, `register`, `logout`.

---

## 6. Frontend - Login Page UI Redesign

**File:** `frontend/src/pages/SignIn.jsx` (rewrite)

### Layout: Modern Split-Screen
- **Left panel (50%):** Gradient background (indigo-to-purple) with branding, tagline, and decorative elements
- **Right panel (50%):** White background with the login form

### Features:
- Email input with icon (Mail from lucide-react)
- Password input with show/hide toggle (Eye/EyeOff from lucide-react)
- "Forgot Password?" link below the password field → navigates to `/forgot-password`
- "Sign In" button with loading state
- "Don't have an account? Sign Up" link at bottom
- Form validation with inline error messages (not just toast)
- Responsive: stacks vertically on mobile, side-by-side on desktop (md: breakpoint)

### Icons/Visual Elements:
- Lock icon or shield icon in the left panel
- Input field icons (Mail, Lock)
- Smooth transitions and hover effects

---

## 7. Frontend - Forgot Password Page (Step 1: Enter Email)

**File:** `frontend/src/pages/ForgotPassword.jsx` (new)

### Layout: Same split-screen style (left branding panel + right form)
- Heading: "Forgot Password?"
- Subtext: "Enter your email and we'll send you a verification code"
- Email input with Mail icon
- "Send OTP" button
- "Back to Sign In" link
- On success: navigate to `/verify-otp?email=<email>`

---

## 8. Frontend - Verify OTP Page (Step 2: Enter OTP)

**File:** `frontend/src/pages/VerifyOtp.jsx` (new)

### Layout: Same split-screen style
- Heading: "Verification Code"
- Subtext: "We've sent a 6-digit code to your email"
- Email displayed (read-only, from URL params)
- 6 individual OTP input boxes (auto-advance on input, paste support)
- "Verify" button
- "Resend Code" link with countdown timer (60 seconds)
- On success: navigate to `/reset-password?email=<email>&token=<resetToken>`

---

## 9. Frontend - Reset Password Page (Step 3: New Password)

**File:** `frontend/src/pages/ResetPassword.jsx` (new)

### Layout: Same split-screen style
- Heading: "Reset Password"
- Subtext: "Enter your new password below"
- New password input with show/hide toggle
- Confirm password input with show/hide toggle
- Password strength indicator (visual bar: weak/medium/strong)
- "Reset Password" button
- On success: show toast, navigate to `/sign-in` with success message

---

## 10. Frontend - Routing Updates

**File:** `frontend/src/App.jsx`

Add three new routes:

```jsx
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/verify-otp" element={<VerifyOtp />} />
<Route path="/reset-password" element={<ResetPassword />} />
```

---

## 11. Frontend - Shared Auth Layout Component

**File:** `frontend/src/components/AuthLayout.jsx` (new)

Extract the split-screen layout into a reusable component used by all four auth pages (SignIn, ForgotPassword, VerifyOtp, ResetPassword):

```jsx
// Left panel: gradient + branding + tagline
// Right panel: {children} form content
```

This ensures visual consistency and avoids code duplication.

---

## Files Modified (Summary)

| File | Action |
|------|--------|
| `Backend/prisma/schema.prisma` | Add PasswordReset model |
| `Backend/controllers/authController.js` | Add forgotPassword, verifyOtp, resetPassword |
| `Backend/routes/authRoutes.js` | Add 3 new routes |
| `Backend/utils/emailTemplate.js` | **New** - OTP email HTML template |
| `frontend/src/context/AuthContext.jsx` | Add forgotPassword, verifyOtp, resetPassword methods |
| `frontend/src/components/AuthLayout.jsx` | **New** - shared split-screen layout |
| `frontend/src/pages/SignIn.jsx` | Rewrite with new UI |
| `frontend/src/pages/ForgotPassword.jsx` | **New** - enter email page |
| `frontend/src/pages/VerifyOtp.jsx` | **New** - enter OTP page |
| `frontend/src/pages/ResetPassword.jsx` | **New** - set new password page |
| `frontend/src/App.jsx` | Add 3 new routes |

---

## Security Considerations

- OTP is stored as bcrypt hash (not plaintext) in database
- OTP expires after 10 minutes
- Previous unused OTPs are invalidated when new one is generated
- Reset token is a short-lived JWT (15 min)
- Generic success messages regardless of email existence (prevents enumeration)
- Passwords validated and hashed with bcrypt before storage
- All new routes are public (no auth middleware needed)
- Rate limiting would be ideal but not in current codebase scope

---

## Verification

1. Run `npx prisma db push` to apply schema changes
2. Start backend: `node server.js` from Backend directory
3. Start frontend: `npm run dev` from frontend directory
4. Test login page renders with new split-screen UI
5. Test "Forgot Password" link navigates correctly
6. Test OTP email is sent and received
7. Test OTP verification flow
8. Test password reset flow
9. Test login with new password works
10. Test responsive layout on mobile/tablet/desktop
