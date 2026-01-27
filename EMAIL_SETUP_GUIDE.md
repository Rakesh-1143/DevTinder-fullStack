# DevTinder - Email Integration Setup Guide

## Email Feature Overview

When a user clicks "Interested" on a profile, an email notification is automatically sent to that user.

## Backend Setup (Nodemailer)

### 1. Install Dependencies

```bash
cd devtinder
npm install nodemailer
```

### 2. Configure Environment Variables

Create a `.env` file in the `devtinder` folder with:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
PORT=5000
DATABASE_URL=mongodb://localhost:27017/devtinder
JWT_SECRET=your-secret-key
```

### 3. Gmail App Password Setup

To send emails via Gmail:

1. Enable 2-Step Verification on your Google Account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer"
4. Generate a 16-character password
5. Use this as `EMAIL_PASSWORD` in your `.env` file

**Note:** Regular Gmail password won't work - you must use an App Password

### 4. How It Works

- When a user clicks "Interested", the backend automatically sends an email to the target user
- The email contains:
  - Interested user's profile information (name, age, gender, about, skills)
  - Link to check the profile and respond
  - Professional HTML email template

---

## Frontend Setup (EmailJS - Optional)

### 1. Install Dependencies

```bash
cd devtinder-web
npm install @emailjs/browser
```

### 2. Create EmailJS Account (Optional)

If you want to send emails from the frontend:

1. Go to [emailjs.com](https://www.emailjs.com)
2. Sign up for a free account
3. Create an Email Service
4. Create Email Templates
5. Get your:
   - Public Key
   - Service ID
   - Template IDs

### 3. Configure Environment Variables

Create a `.env.local` file in `devtinder-web` folder:

```
VITE_EMAILJS_PUBLIC_KEY=your-public-key
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_INTEREST_TEMPLATE_ID=your-template-id
VITE_EMAILJS_ACCEPTANCE_TEMPLATE_ID=your-acceptance-template-id
```

---

## Email Flow

### When User Clicks "Interested"

```
User A clicks "Interested" on User B's profile
      ↓
Frontend sends request to backend
      ↓
Backend creates ConnectionRequest document
      ↓
Backend fetches User A and User B data
      ↓
Backend sends email to User B via Gmail
      ↓
User B receives email notification with User A's profile
```

### Email Content

The email includes:

- User A's name, age, gender
- User A's about section
- User A's skills
- Direct link to check the profile
- Call-to-action button

---

## Updated Files

### Backend

- `src/utils/emailService.js` - Email sending service
- `src/routers/request.js` - Updated with email sending logic

### Frontend

- `src/utils/emailHelper.js` - EmailJS helper functions
- `src/components/UserCard.jsx` - Updated with email imports

---

## Troubleshooting

### Gmail Not Sending Emails

- Make sure you're using App Password, not regular Gmail password
- Check if 2-Step Verification is enabled
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env` file

### Emails Going to Spam

- Add email domain to Gmail trusted senders
- Use custom email templates with proper formatting
- Check Gmail's authentication settings (SPF, DKIM, DMARC)

### CORS Issues

- Frontend and backend CORS is already configured in `app.js`
- Allowed origins include localhost ports 5173, 5174, 5175

---

## Testing Email Functionality

1. Run backend: `npm run dev` (in devtinder folder)
2. Run frontend: `npm run dev` (in devtinder-web folder)
3. Login with test account
4. Find another user profile
5. Click "Interested"
6. Check the target user's email inbox
7. Email should arrive within 1-2 minutes

---

## Security Notes

- Never commit `.env` files to Git (already in `.gitignore`)
- Use environment variables for all sensitive data
- Gmail App Passwords are more secure than actual Gmail password
- Don't share public keys with anyone who might abuse the service

---

## Next Steps

- Customize email templates in `emailService.js`
- Add email validation and error handling
- Implement email preferences in user settings
- Add email unsubscribe functionality
