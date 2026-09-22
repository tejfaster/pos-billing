# POS Billing System

A modern, responsive Point of Sale (POS) billing application designed
for hardware and building-material businesses.

The project is being developed incrementally with a focus on practical
billing, product management, authentication, accessibility,
localization, responsive design, and a scalable full-stack architecture.

------------------------------------------------------------------------

## 🚧 Project Status

The project has moved from frontend-only development to a **full-stack
foundation**.

### Currently implemented

- Product search, selection, billing quantities and rates
- Automatic item price and bill total calculation
- Remove items and start a new bill
- Responsive billing interface
- Mobile navigation and collapsible desktop sidebar
- Light and dark mode
- Text-size accessibility controls
- English and Hindi localization with persisted preferences
- A4 print layout with localized labels and ₹ currency formatting
- Product list, search, add, edit and delete
- Product code / SKU, brand, category and unit selection
- User signup and login
- Server-side sessions with session restoration and logout
- User roles (`user` / `admin`) and account status (`active` /
  `disabled`)
- Protected authentication API routes
- Email-based password reset with OTP
- OTP expiration, attempt limits and resend cooldown
- Secure OTP hashing and one-time password-reset tokens
- Session invalidation after successful password reset
- SMTP email delivery using Nodemailer
- Frontend and backend authentication validation

### Current password reset flow

``` text
Login
  ↓
Forgot password?
  ↓
Enter email
  ↓
Send verification code
  ↓
Enter OTP
  ↓
Verify code
  ↓
Create new password
  ↓
Confirm password
  ↓
Password reset
  ↓
Login
```

------------------------------------------------------------------------

## ✨ Features

### 🧾 Billing

The billing screen supports product search by name, product code or
brand, adding products, decimal quantities, editable quantities and
rates, automatic price calculation, bill totals, item removal, new bills
and printing.

Calculation:

``` text
Price = Quantity × Rate
Total = Sum of all item prices
```

### 📦 Product Management

The product master currently supports:

- Product name
- Product code / SKU
- Brand
- Category
- Product search
- Add, edit and delete
- Product unit selection

Product names, brands and SKUs are user-entered business data and are
not automatically translated when the application language changes.

### 🔐 Authentication

Authentication is implemented as a dedicated frontend feature backed by
a Node.js / Express API and PostgreSQL.

``` text
React + Vite
    ↓
Authentication Service
    ↓
Express API
    ↓
Auth Controller / Services
    ↓
PostgreSQL
```

Frontend authentication files:

``` text
src/features/authentication/
├── components/
│   ├── AuthLayout.jsx
│   ├── LoginForm.jsx
│   ├── SignupForm.jsx
│   ├── VerifyOtpForm.jsx
│   └── ResetPasswordForm.jsx
├── services/authService.js
├── validation/authValidation.js
└── utils/authErrors.js
```

Authentication pages include:

``` text
src/pages/
├── Login.jsx
├── Signup.jsx
├── ForgotPassword.jsx
├── ChangePassword.jsx
└── Profile.jsx
```

Authentication state is managed by:

``` text
src/context/AuthContext.jsx
```

### 📧 Password Reset

Password reset uses email OTP rather than SMS.

``` text
User enters email
      ↓
Generate secure OTP
      ↓
Store OTP hash
      ↓
Send email
      ↓
Verify OTP
      ↓
Generate short-lived reset token
      ↓
Set new password
      ↓
Consume reset token
      ↓
Invalidate existing sessions
```

Security controls include:

- Cryptographically generated six-digit OTPs
- HMAC-SHA256 OTP hashes
- OTP expiration
- Maximum verification attempts
- Resend cooldown
- Generic reset-request response to reduce account enumeration
- Random password-reset tokens
- SHA-256 reset-token hashes
- Reset-token expiration and one-time use
- Argon2 password hashing
- Session invalidation after password reset

### 🌐 Language Support

The application supports English and Hindi. Language preference is
persisted locally.

``` text
src/i18n/en.js
src/i18n/hi.js
src/context/LanguageContext.jsx
```

### 🔤 Accessibility

Four text-size levels are available:

``` text
A−   A   A+   A++
```

The selected text size is persisted locally.

### 🌙 Theme

- Light mode
- Dark mode

Theme preference is persisted locally and uses CSS variables for
consistent theming.

### 📱 Responsive Design

The application is designed for mobile phones, tablets, laptops and
desktop screens, including a mobile navigation drawer and collapsible
desktop sidebar.

### 🖨️ Printing

The application has a dedicated A4 printable bill layout containing
date, customer/form field, serial number, item, quantity, rate, price
and total. Normal navigation and application UI are excluded from
printed output.

------------------------------------------------------------------------

## 🏗️ Project Architecture

``` text
pos-billing/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   │   ├── migrations/
│   │   │   └── seedAdmin.js
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── services/
│   ├── .env
│   ├── package.json
│   └── README.md
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── context/
│   ├── data/
│   ├── i18n/
│   ├── features/
│   │   ├── billing/
│   │   ├── products/
│   │   └── authentication/
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

### Backend authentication structure

``` text
backend/src/
├── config/database.js
├── controllers/authController.js
├── db/
│   ├── migrations/
│   │   ├── 001_create_users.sql
│   │   ├── 002_create_sessions.sql
│   │   ├── 003_create_email_otp_challenges.sql
│   │   └── 004_create_password_reset_tokens.sql
│   └── seedAdmin.js
├── middleware/authMiddleware.js
├── routes/authRoutes.js
└── services/
    ├── authService.js
    ├── sessionService.js
    ├── emailService.js
    └── otpService.js
```

### Database tables currently used by authentication

``` text
users
sessions
email_otp_challenges
password_reset_tokens
```

------------------------------------------------------------------------

## 🔄 Data Flows

### Billing

``` text
Product Data
    ↓
Item Search
    ↓
Add Product
    ↓
Billing State
    ↓
Item List
    ↓
Quantity + Rate
    ↓
Price Calculation
    ↓
Total Calculation
    ↓
Print
```

Billing state is managed through
`src/features/billing/hooks/useBilling.js`.

### Authentication

``` text
React UI
  ↓
authService.js
  ↓
Express API
  ↓
Auth Controller
  ↓
Auth / Session / OTP Services
  ↓
PostgreSQL
```

Authenticated requests use the server-side session cookie and backend
authentication middleware.

------------------------------------------------------------------------

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript / JSX
- React Context and hooks

### Backend

- Node.js
- Express
- JavaScript / ES Modules
- `pg`
- Argon2
- Nodemailer
- CORS
- cookie-parser
- dotenv

### Database

- PostgreSQL

### Current frontend data

- Local/static JavaScript data for the current product master
- Browser local storage for user interface preferences

------------------------------------------------------------------------

## 🚀 Getting Started

The repository contains separate frontend and backend applications.

### Frontend

From the project root:

``` bash
npm install
```

Create `.env.local`:

``` env
VITE_API_URL=http://localhost:5001/api
```

Start the frontend:

``` bash
npm run dev
```

Frontend:

``` text
http://localhost:5173
```

Production build:

``` bash
npm run build
```

Preview:

``` bash
npm run preview
```

### Backend

``` bash
cd backend
npm install
```

Create `backend/.env` with the PostgreSQL, session, admin and SMTP
settings required by the backend. Keep real credentials out of Git.

The backend normally runs on:

``` text
http://localhost:5001
```

Apply the SQL migrations in:

``` text
backend/src/db/migrations/
```

The current authentication migrations create the four authentication
tables listed above. The backend also contains `seedAdmin.js` for
creating the initial administrator from environment variables.

------------------------------------------------------------------------

## 🔗 Authentication API

Current authentication endpoints:

``` text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
POST /api/auth/change-password
POST /api/auth/password-reset/request
POST /api/auth/password-reset/verify
POST /api/auth/password-reset/confirm
```

------------------------------------------------------------------------

## 🛣️ Development Roadmap

### Phase 1 — Billing Foundation

- [x] Product search
- [x] Product selection
- [x] Add / remove items
- [x] Quantity controls and decimal quantities
- [x] Editable quantity and rate
- [x] Price and total calculation
- [x] New Bill
- [x] Responsive layout
- [x] Print layout

### Phase 2 — UI, Accessibility & Localization

- [x] Light mode
- [x] Dark mode
- [x] Text-size controls
- [x] Responsive design
- [x] Mobile navigation
- [x] Collapsible sidebar
- [x] English and Hindi
- [x] Persistent language, theme and text-size preferences
- [x] Localized print layout

### Phase 3 — Product Management

- [x] Product list
- [x] Product search
- [x] Add product
- [x] Edit product
- [x] Delete product
- [x] Categories
- [x] Product codes / SKUs
- [x] Brand field
- [x] Product information form
- [x] Product unit selection interface

### Phase 4 — Authentication & User Management

- [x] Signup
- [x] Login
- [x] Server-side sessions
- [x] Session restoration
- [x] Logout
- [x] User roles
- [x] Account status
- [x] Protected backend routes
- [x] Password change backend support
- [x] Forgot-password request
- [x] Email OTP verification
- [x] Password reset
- [x] OTP expiration and attempt limits
- [x] OTP resend cooldown
- [x] Reset-token expiration and one-time use
- [x] Session invalidation after password reset
- [x] Frontend authentication integration

### Phase 5 — Billing Improvements

- [ ] Customer / Form field in billing UI
- [ ] Bill number
- [ ] Faster keyboard workflow
- [ ] Improved product selection
- [ ] Better bill validation
- [ ] Bill draft handling
- [ ] Saved bills

### Phase 6 — Customer Management

- [ ] Customer list
- [ ] Add customer
- [ ] Edit customer
- [ ] Search customers
- [ ] Customer history
- [ ] Customer-wise bills

### Phase 7 — Bill History

- [ ] Save bills
- [ ] Bill history
- [ ] View bill
- [ ] Reprint bill
- [ ] Search bills
- [ ] Filter by date
- [ ] Filter by customer
- [ ] Bill details

### Phase 8 — Inventory

- [ ] Stock management
- [ ] Stock in / stock out
- [ ] Stock history
- [ ] Low-stock alerts
- [ ] Inventory calculations
- [ ] Loose quantity handling
- [ ] Package handling

### Phase 9 — Payments & Credit

- [ ] Cash payments
- [ ] UPI
- [ ] Card
- [ ] Bank transfer
- [ ] Credit sales
- [ ] Paid amount
- [ ] Outstanding amount
- [ ] Payment history

### Phase 10 — Reports

- [ ] Daily sales
- [ ] Monthly sales
- [ ] Product sales
- [ ] Customer sales
- [ ] Payment reports
- [ ] Outstanding reports
- [ ] Inventory reports
- [ ] Stock movement reports

### Phase 11 — Backend Business Features

- [ ] Product API
- [ ] Category API
- [ ] Unit API
- [ ] Customer API
- [ ] Bill API
- [ ] Bill-item persistence
- [ ] Inventory API
- [ ] Payment API
- [ ] Business-data database model
- [ ] Role-based authorization across business features

------------------------------------------------------------------------

## 🗄️ Planned Business Data Model

The future system is expected to contain entities such as:

``` text
User
Product
Category
Unit
Customer
Bill
BillItem
Inventory
StockMovement
Payment
```

The final business data model will be designed around the actual
workflows required by hardware and building-material businesses.

------------------------------------------------------------------------

## 📁 Important Files

### Frontend

``` text
src/main.jsx
src/App.jsx
src/context/AuthContext.jsx
src/context/LanguageContext.jsx
src/pages/Billing.jsx
src/pages/Products.jsx
src/pages/Login.jsx
src/pages/Signup.jsx
src/pages/ForgotPassword.jsx
src/pages/ChangePassword.jsx
src/pages/Profile.jsx
src/features/authentication/services/authService.js
src/features/authentication/components/VerifyOtpForm.jsx
src/features/authentication/components/ResetPasswordForm.jsx
src/features/billing/hooks/useBilling.js
src/index.css
```

### Backend

``` text
backend/src/app.js
backend/src/config/database.js
backend/src/controllers/authController.js
backend/src/middleware/authMiddleware.js
backend/src/routes/authRoutes.js
backend/src/services/authService.js
backend/src/services/sessionService.js
backend/src/services/otpService.js
backend/src/services/emailService.js
backend/src/db/seedAdmin.js
```

------------------------------------------------------------------------

## 🔒 Security Notes

- Never commit `.env` or `.env.local`.
- Never commit SMTP passwords, app passwords or database credentials.
- Never commit `cookies.txt`.
- Passwords are hashed with Argon2 on the backend.
- Session tokens are stored as hashes in PostgreSQL.
- Plaintext OTP values are not stored in PostgreSQL.
- Password-reset tokens are stored as hashes.
- Password-reset tokens expire and can only be used once.
- Existing sessions are invalidated after a successful password reset.
- Password-reset requests use a generic response to reduce account
  enumeration.

------------------------------------------------------------------------

## 🎯 Project Goal

The goal is to build a practical POS system for hardware and
building-material businesses.

The long-term system is intended to cover:

``` text
Products
   ↓
Billing
   ↓
Customers
   ↓
Bills
   ↓
Purchasing
   ↓
Inventory
   ↓
Payments
   ↓
Reports
   ↓
Database
   ↓
Authentication & Permissions
```

The application is being developed incrementally so each major feature
can be built, tested and stabilized before expanding the system further.

------------------------------------------------------------------------

## 📌 Development Approach

The current approach is:

1.  Build and stabilize the billing experience.
2.  Build product management.
3.  Add accessibility and localization.
4.  Build authentication and user management.
5.  Connect persistent business data to the backend and database.
6.  Build customer and bill management.
7.  Add inventory.
8.  Add purchasing and suppliers.
9.  Add payments and credit.
10. Add reports.
11. Prepare the system for production use.

The architecture should remain modular so new features can be added
without rebuilding the existing billing functionality.

------------------------------------------------------------------------

## 📄 License

This project is currently under development.
