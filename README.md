# POS Billing System

A modern, responsive Point of Sale (POS) billing application designed for hardware and building-material businesses.

The frontend is built with React, Vite, and Tailwind CSS, with a separate Node.js / Express / PostgreSQL backend.

---

## 🚧 Project Status

The project is currently under active development.

The current frontend provides a working foundation for:

- Billing
- Product search and selection
- Product management
- Category management
- Unit selection
- Quantity and rate management
- Automatic price and total calculation
- A4 bill printing
- Authentication UI
- English and Hindi localization
- Light and dark themes
- Accessibility controls
- Responsive layouts

The backend is maintained in a separate repository.

---

## ✨ Features

### 🧾 Billing

The billing screen supports:

- Fast product search
- Product selection
- English/transliteration product names
- Hindi product names
- Quantity controls
- Decimal quantities
- Manual rate entry
- Independent unit selection
- Automatic final-price calculation
- Automatic bill-total calculation
- Remove items
- New bill
- Responsive billing table
- A4 printing

### Billing Structure

Each billing item contains:

```text
Product
   ↓
Quantity
   ↓
Unit
   ↓
Rate
   ↓
Final Price
```

Calculation:

```text
Final Price = Quantity × Rate
Total = Sum of all valid item prices
```

A product's unit is selected at the billing-item level rather than being required as a permanent product attribute.

---

## 📦 Product Management

The product management interface supports:

- Product list
- Product search
- Add product
- Edit product
- Delete product
- English/transliteration name
- Hindi name
- Brand
- Category
- Product status

### Product Names

The application uses two product-name fields:

```text
English Name
Hindi Name
```

Examples:

```text
Hathodi
Aari (18 inch)
Cement (50 kg)
```

Product size is kept inside the product name. There is no separate product-size field in the current design.

---

## 📏 Units

Units are maintained separately from products.

Examples include:

```text
Piece
Kilogram
Gram
Bag
Litre
Bundle
Packet
Carton
```

The unit is selected when creating a billing line.

---

## 🔎 Product Search

The billing product search supports searching through:

- English/transliterated product names
- Hindi product names
- Brand
- English category
- Hindi category

The search interface supports:

- Mouse selection
- Keyboard navigation
- Arrow Up / Down
- Enter to select
- Escape to close
- Matching-text highlighting
- Hiding products already selected in the current bill

---

## 🌐 Language Support

The application currently supports:

- English
- Hindi

Language preference is persisted locally.

Billing and printing labels are localized according to the selected language.

---

## ♿ Accessibility

The application includes text-size controls:

```text
A−
A
A+
A++
```

The selected text size is persisted locally.

---

## 🌙 Theme

The application supports:

- Light mode
- Dark mode

Theme preference is persisted locally.

---

## 📱 Responsive Design

The frontend is designed for:

- Mobile phones
- Tablets
- Laptops
- Desktop screens

It includes responsive billing layouts, mobile navigation, a collapsible desktop sidebar, and scrollable billing content.

---

## 🖨️ Printing

The billing system provides a dedicated A4 print layout containing:

```text
Date
Customer / Form
Serial Number
Product
Quantity
Unit
Rate
Final Price
Total
```

The normal application interface is hidden during printing.

Printing supports English/Hindi labels, Indian number formatting, ₹ currency formatting, selected billing units, individual item prices, and the final bill total.

---

## 🔐 Authentication

Authentication is handled through the separate backend API.

The frontend includes:

- Signup
- Login
- Logout
- Session restoration
- Change password
- Forgot password
- OTP verification
- Password reset
- Profile

Authentication state is managed through:

```text
src/context/AuthContext.jsx
```

The frontend communicates with the backend using authenticated session cookies.

---

## 🏗️ Architecture

```text
pos-billing/
│
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── CategoryContext.jsx
│   │   ├── LanguageContext.jsx
│   │   ├── ProductContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── UnitContext.jsx
│   ├── data/
│   ├── features/
│   │   ├── authentication/
│   │   ├── billing/
│   │   └── products/
│   ├── i18n/
│   │   ├── en.js
│   │   └── hi.js
│   ├── pages/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.local
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## 🧾 Billing Architecture

```text
src/features/billing/

├── components/
│   ├── BillPrint.jsx
│   ├── ItemList.jsx
│   ├── ItemRow.jsx
│   └── ItemSearch.jsx
│
└── hooks/
    └── useBilling.js
```

Billing state is managed by `useBilling.js`.

Each billing item has the structure:

```javascript
{
  product,
  qty,
  unit,
  rate
}
```

---

## 📦 Product Architecture

Product data is managed through:

```text
src/context/ProductContext.jsx
```

The product context communicates with the backend API for:

- Fetching products
- Adding products
- Updating products
- Deleting products
- Searching products
- Filtering products

Product data includes:

```text
id
nameEn
nameHi
categoryId
categoryNameEn
categoryNameHi
brand
status
createdAt
updatedAt
```

---

## 🗂️ Category Architecture

Categories are managed through:

```text
src/context/CategoryContext.jsx
```

Categories are used by product management and product search.

---

## 📏 Unit Architecture

Units are managed through:

```text
src/context/UnitContext.jsx
```

Billing items store the selected unit separately:

```text
Billing Item
├── Product
├── Quantity
├── Unit
└── Rate
```

---

## 🔗 Backend

The frontend uses a separate backend repository.

Backend repository:

```text
pos-backend
```

GitHub:

https://github.com/tejfaster/pos-backend

The backend provides APIs for:

- Authentication
- Sessions
- Products
- Categories
- Units
- Password reset
- OTP verification

---

## 🛠️ Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript
- JSX
- React Context
- React Hooks

### Backend

The backend is maintained separately and uses:

- Node.js
- Express
- PostgreSQL

---

## 🚀 Getting Started

### Requirements

- Node.js
- npm
- Running backend API
- PostgreSQL through the backend

### Clone

```bash
git clone https://github.com/tejfaster/pos-billing.git
cd pos-billing
```

### Install

```bash
npm install
```

### Environment

Create `.env.local`:

```env
VITE_API_URL=http://localhost:5001/api
```

Do not commit `.env.local`.

### Development

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

### Production Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

---

## 🔄 Frontend Data Flow

### Billing

```text
Backend Product API
        ↓
ProductContext
        ↓
ItemSearch
        ↓
Select Product
        ↓
useBilling
        ↓
ItemList
        ↓
Quantity / Unit / Rate
        ↓
Final Price
        ↓
Total
        ↓
BillPrint
```

### Product Management

```text
Product Management UI
        ↓
ProductContext
        ↓
Product API
        ↓
Express Backend
        ↓
PostgreSQL
```

### Authentication

```text
React Authentication UI
        ↓
AuthContext
        ↓
Authentication Service
        ↓
Express API
        ↓
Session Authentication
```

---

## 🛣️ Development Roadmap

### Phase 1 — Billing Foundation

- [x] Product search
- [x] Product selection
- [x] Add and remove items
- [x] Quantity controls
- [x] Decimal quantities
- [x] Editable quantity
- [x] Editable rate
- [x] Unit selection
- [x] Price calculation
- [x] Total calculation
- [x] New Bill
- [x] Responsive billing layout
- [x] A4 print layout

### Phase 2 — UI, Accessibility & Localization

- [x] Light mode
- [x] Dark mode
- [x] Text-size controls
- [x] Responsive design
- [x] Mobile navigation
- [x] Collapsible sidebar
- [x] English
- [x] Hindi
- [x] Persistent preferences
- [x] Localized printing

### Phase 3 — Product Management

- [x] Product list
- [x] Product search
- [x] Add product
- [x] Edit product
- [x] Delete product
- [x] Category management
- [x] Brand field
- [x] English product name
- [x] Hindi product name

### Phase 4 — Authentication

- [x] Signup
- [x] Login
- [x] Session restoration
- [x] Logout
- [x] Change password
- [x] Forgot password
- [x] OTP verification
- [x] Password reset
- [x] Protected routes
- [x] Authentication state management

### Phase 5 — Billing Improvements

- [ ] Customer / Form field
- [ ] Bill number
- [ ] Bill validation
- [ ] Improved keyboard workflow
- [ ] Bill draft handling
- [ ] Saved bills

### Phase 6 — Customer Management

- [ ] Customer list
- [ ] Add customer
- [ ] Edit customer
- [ ] Search customers
- [ ] Customer history
- [ ] Customer-wise bills

### Phase 7 — Bill Management

- [ ] Save bills
- [ ] Bill history
- [ ] View bill
- [ ] Reprint bill
- [ ] Search bills
- [ ] Filter bills
- [ ] Bill details

### Phase 8 — Inventory

- [ ] Stock management
- [ ] Stock in / stock out
- [ ] Stock history
- [ ] Low-stock alerts
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

---

## 🔒 Security

Never commit sensitive credentials.

Do not commit:

```text
.env
.env.local
database credentials
SMTP credentials
session secrets
API secrets
```

Authentication is handled by the backend using server-side sessions.

---

## 🌱 Git Workflow

Recommended workflow:

```text
main
  ↓
dev
  ↓
feature/*
  ↓
dev
  ↓
main
```

Example:

```bash
git checkout dev
git checkout -b feature/billing-improvements
```

After completing the feature:

```bash
git add .
git commit -m "feat: improve billing workflow"
git checkout dev
git merge feature/billing-improvements
```

Stable changes can later be merged into `main`.

---

## 📌 Project Goal

The goal is to build a practical POS system specifically suited to hardware and building-material businesses.

The long-term system is intended to cover:

```text
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
```

The system is being developed incrementally so that each major feature can be implemented, tested, and stabilized before expanding the application.

---

## 📄 License

This project is currently under development.
