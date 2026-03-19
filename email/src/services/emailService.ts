import nodemailer from "nodemailer";

// Initialize transporter with Gmail (you can configure other providers)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use app-specific password for Gmail
    },
});

// Verify connection
transporter.verify((error, _success) => {
    if (error) {
        console.error("Email service configuration error:", error);
    } else {
        console.log("✓ Email service ready");
    }
});

interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

export async function sendOtpEmail(
    email: string,
    otp: string,
    userName?: string
): Promise<EmailResult> {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Kronus OTP - Verify Your Account",
            html: generateOtpEmailTemplate(otp, userName),
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Error sending OTP email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send email",
        };
    }
}

export async function sendWelcomeEmail(
    email: string,
    name: string,
    userType: "buyer" | "seller"
): Promise<EmailResult> {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to Kronus - Your Real Estate Journey Begins",
            html: generateWelcomeEmailTemplate(name, userType),
        };

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send email",
        };
    }
}

function generateOtpEmailTemplate(otp: string, userName?: string): string {
    const name = userName || "User";
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .otp-box { background: #f0f4ff; border-left: 4px solid #14b8a6; padding: 20px; margin: 20px 0; }
        .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 3px; color: #14b8a6; text-align: center; }
        .footer { text-align: center; font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #1e293b; margin: 0;">Kronus</h1>
          <p style="color: #64748b;">Verify Your Account</p>
        </div>
        
        <p>Hello ${name},</p>
        <p>Thank you for signing up with Kronus. Use the OTP below to verify your account:</p>
        
        <div class="otp-box">
          <div class="otp-code">${otp}</div>
        </div>
        
        <p style="color: #666; font-size: 14px;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
        
        <p>If you didn't request this OTP, please ignore this email.</p>
        
        <div class="footer">
          <p>© 2026 Kronus Infratech & Consultants. All rights reserved.</p>
          <p>Sonipat, Haryana | www.kronusinfra.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateWelcomeEmailTemplate(
    name: string,
    userType: "buyer" | "seller"
): string {
    const welcomeMessage =
        userType === "seller"
            ? "Welcome to the Kronus Seller Portal! Start listing your properties and connect with buyers."
            : "Welcome to Kronus! Explore premium properties and find your perfect home.";

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .button { display: inline-block; padding: 12px 30px; background: #14b8a6; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #1e293b;">Welcome to Kronus, ${name}!</h1>
        </div>
        
        <p>${welcomeMessage}</p>
        
        <p>Get started by exploring ${userType === "seller" ? "our seller dashboard" : "available properties"}.</p>
        
        <a href="${process.env.FRONTEND_URL}/${userType}/dashboard" class="button">
          Go to ${userType === "seller" ? "Seller" : "Buyer"} Dashboard
        </a>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">If you have any questions, feel free to reach out to our support team.</p>
        
        <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
          <p>© 2026 Kronus Infratech & Consultants. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
