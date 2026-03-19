# 📧 Kronus Email Microservice

This is a standalone microservice for handling email operations in the Kronus platform, including OTP delivery and welcome emails.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Gmail account with app-specific password (for Gmail SMTP)

### Installation

```bash
cd email
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update environment variables:
   - `EMAIL_USER`: Your Gmail address
   - `EMAIL_PASSWORD`: Your app-specific Gmail password (see instructions below)
   - `FRONTEND_URL`: Your frontend URL (default: http://localhost:3000)

### Gmail App-Specific Password Setup

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-factor authentication if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and "Windows Computer" (or your device)
5. Generate password and copy it to `EMAIL_PASSWORD` in `.env`

### Running the Service

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /health

Response:
{
  "status": "ok",
  "service": "email-service",
  "timestamp": "2026-03-19T..."
}
```

### Send OTP Email
```
POST /send-otp

Request Body:
{
  "email": "user@example.com",
  "otp": "123456",
  "userName": "John Doe"  // optional
}

Response:
{
  "success": true,
  "message": "OTP email sent successfully",
  "messageId": "..."
}
```

### Send Welcome Email
```
POST /send-welcome

Request Body:
{
  "email": "user@example.com",
  "name": "John Doe",
  "userType": "buyer"  // or "seller"
}

Response:
{
  "success": true,
  "message": "Welcome email sent successfully"
}
```

## 🏗️ Architecture

- **Express.js**: REST API server
- **Nodemailer**: Email sending via SMTP (Gmail)
- **Zod**: Request validation
- **TypeScript**: Type-safe development

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Service port | 3001 |
| EMAIL_USER | Gmail address for sending emails | - |
| EMAIL_PASSWORD | Gmail app-specific password | - |
| FRONTEND_URL | Frontend base URL for email links | http://localhost:3000 |

## 🔒 Security Notes

- Never commit `.env` file to version control
- Use app-specific passwords, not your main Gmail password
- Implement rate limiting for production
- Add API authentication (API key/JWT) for production

## 📚 Integration with Backend

The backend auth service calls this microservice on:
1. OTP generation during signup
2. Phone/email verification
3. Password reset requests

## 🐛 Troubleshooting

**"Failed to send email"**: Check EMAIL_USER and EMAIL_PASSWORD values
**"Connection timeout"**: Verify network connectivity and Gmail SMTP settings
**"Invalid email"**: Ensure recipient email is valid

## 📖 Related Documentation

- [Backend Auth Service](../backend/src/modules/auth/README.md)
- [Frontend Auth Context](../frontend/lib/seller-auth.tsx)
- [Nodemailer Docs](https://nodemailer.com/)
