export const otpEmailTemplate = (otp, email) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Password Reset Code</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700;">Social Vault</h1>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding: 40px 32px;">
                  <h2 style="color: #1f2937; margin: 0 0 12px; font-size: 20px; font-weight: 600;">Password Reset Code</h2>
                  <p style="color: #6b7280; margin: 0 0 24px; font-size: 14px; line-height: 1.6;">
                    We received a request to reset the password for <strong>${email}</strong>. Use the verification code below to continue:
                  </p>
                  <div style="background-color: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 24px;">
                    <span style="font-size: 32px; font-weight: 700; color: #6366f1; letter-spacing: 8px;">${otp}</span>
                  </div>
                  <p style="color: #6b7280; margin: 0 0 8px; font-size: 14px; line-height: 1.6;">
                    This code will expire in <strong>10 minutes</strong>.
                  </p>
                  <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.6;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                    &copy; ${new Date().getFullYear()} Social Vault. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
