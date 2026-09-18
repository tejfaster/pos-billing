# POS Billing System

A modern, responsive Point of Sale (POS) billing application designed for hardware and building-material businesses.

The project is being developed incrementally with a focus on simple billing, product management, accessibility, localization, responsive design, and a scalable frontend architecture.

---

## 🚧 Project Status

The project is currently in the **frontend development phase**.

### Currently implemented

- Product search
- Product selection
- Add products to bill
- Duplicate product quantity handling
- Decimal quantities
- Editable quantity
- Editable rate
- Automatic price calculation
- Automatic bill total
- Remove items
- Start a new bill
- Scrollable selected-item area
- Responsive layout
- Mobile navigation
- Collapsible desktop sidebar
- Light mode
- Dark mode
- Text-size accessibility controls
- English language
- Hindi language
- Persistent language preference
- Persistent theme preference
- Persistent text-size preference
- A4 print layout
- Customer / Form area on printed bill
- Printed quantity
- Printed rate
- Printed price
- Printed total
- Currency formatting with ₹ in printed amounts

### Product management

- Product list
- Product search
- Add product
- Edit product
- Delete product
- Product name
- Product code / SKU
- Brand
- Category
- Product information form
- Product unit selection interface

---

# ✨ Features

## 🧾 Billing

The current billing screen allows users to:

- Search for products
- Search by product name, product code, or brand
- Add products to the bill
- Increase/decrease quantity
- Enter decimal quantities
- Edit quantity directly
- Enter custom rates
- Automatically calculate item prices
- Automatically calculate the bill total
- Remove products
- Start a new bill
- Scroll through selected items independently
- Print the item list

Example:

```text
Product             Qty       Rate       Price

PPC Cement          1.6        23        36.80
White Cement          1         7         7.00
River Sand            1        87        87.00

                                      Total: 130.80
```

---

# 📦 Product Management

The product management screen provides the foundation for maintaining the product master.

Users can:

- View products
- Search products
- Add products
- Edit products
- Delete products
- Select categories
- Enter product codes / SKUs
- Enter brands
- Manage product information
- Manage the existing product-unit selection interface

The current product structure intentionally keeps core product information simple:

```text
Product
├── Name
├── Code / SKU
├── Brand
└── Category
```

Product names, brands, and SKUs are user-entered business data and are not automatically translated when the application language changes.

---

# 🌐 Language Support

The application currently supports:

```text
English
Hindi
```

Users can switch between English and Hindi directly from the application header.

The selected language is stored locally and remains available after refreshing the application.

Language support covers:

- Navigation
- Billing
- Product management
- Search
- Forms
- Buttons
- Empty states
- Confirmation messages
- Accessibility controls
- Print layout

Translation files:

```text
src/i18n/en.js
src/i18n/hi.js
```

Language state:

```text
src/context/LanguageContext.jsx
```

---

# 🔤 Text Size Accessibility

The application provides four text-size options.

### English

```text
A−   A   A+   A++
```

### Hindi

```text
अ−   अ   अ+   अ++
```

Available levels:

```text
Small
Default
Large
Extra Large
```

The selected text size is stored locally so the preference remains available after refreshing the application.

---

# 🌙 Theme

The application supports:

- Light mode
- Dark mode

Theme preference is persisted locally.

The application uses CSS variables for its main theme colors so the interface can switch consistently between themes.

---

# 📱 Responsive Design

The application is designed to work across:

- Mobile phones
- Tablets
- Laptops
- Desktop screens

The layout includes:

- Responsive sidebar
- Mobile navigation drawer
- Collapsible desktop sidebar
- Responsive billing interface
- Responsive product management interface
- Scrollable billing item area

---

# 🖨️ Printing

The application has a dedicated printable bill layout.

The normal application interface is hidden during printing.

The printed layout contains:

- Date
- Customer / Form field
- Serial number
- Item
- Quantity
- Rate
- Price
- Total

Example:

```text
Date: 19/9/2026     Customer / Form: ___________________________

┌──────┬──────────────────────────────┬─────┬────────┬────────┐
│ S.No │ Item                         │ Qty │  Rate  │ Price  │
├──────┼──────────────────────────────┼─────┼────────┼────────┤
│  1   │ PPC Cement                   │  2  │ ₹12.00 │ ₹24.00 │
│  2   │ White Cement                 │  3  │ ₹123.00│ ₹369.00│
└──────┴──────────────────────────────┴─────┴────────┴────────┘

                                      Total: ₹393.00
```

The print layout is designed for A4 paper.

Printed labels follow the currently selected application language.

The application header, navigation controls, sidebar, and other normal UI elements are excluded from the printable output.

---

# 🧮 Calculation Logic

For each billing item:

```text
Price = Quantity × Rate
```

Example:

```text
Quantity = 1.5
Rate = ₹23

Price = 1.5 × 23
      = ₹34.50
```

The bill total is:

```text
Total = Sum of all item prices
```

The total remains blank until every selected item has a valid rate.

---

# 📏 Units

The application contains a separate reusable unit master:

```text
src/data/units.js
```

Unit definitions are maintained separately from the core product information.

The current application does not store unit conversion calculations in the core product master.

Future inventory and selling workflows may introduce additional business rules around units and quantities after the required business model is finalized.

---

# 🏗️ Project Architecture

The application follows a feature-oriented structure.

```text
src/
├── assets/
│
├── components/
│   ├── common/
│   │   └── AccessibilityControls.jsx
│   │
│   └── layout/
│       ├── Header.jsx
│       ├── MainLayout.jsx
│       └── Sidebar.jsx
│
├── context/
│   ├── ThemeContext.jsx
│   ├── ProductContext.jsx
│   └── LanguageContext.jsx
│
├── data/
│   ├── categories.js
│   ├── units.js
│   └── products.js
│
├── i18n/
│   ├── en.js
│   └── hi.js
│
├── features/
│   ├── billing/
│   │   ├── components/
│   │   │   ├── ItemSearch.jsx
│   │   │   ├── ItemList.jsx
│   │   │   ├── ItemRow.jsx
│   │   │   └── BillPrint.jsx
│   │   │
│   │   └── hooks/
│   │       └── useBilling.js
│   │
│   └── products/
│       └── components/
│           ├── ProductList.jsx
│           ├── ProductForm.jsx
│           └── ProductUnitList.jsx
│
├── pages/
│   ├── Billing.jsx
│   └── Products.jsx
│
├── App.jsx
├── index.css
└── main.jsx
```

---

# 🧩 Architecture Principles

The project is structured so that features can grow without putting everything into one large component.

## Pages

Pages compose complete screens:

```text
pages/
├── Billing.jsx
└── Products.jsx
```

## Features

Feature-specific functionality lives inside its feature folder:

```text
features/
├── billing/
└── products/
```

## Components

Reusable UI components are separated from page-level logic:

```text
components/
├── common/
└── layout/
```

## Context

Shared application state is handled through React Context:

```text
context/
├── ThemeContext.jsx
├── ProductContext.jsx
└── LanguageContext.jsx
```

## Data

Static and temporary master data currently lives under:

```text
data/
├── products.js
├── categories.js
└── units.js
```

This will eventually be replaced or supplemented by backend/database data.

---

# 🔄 Billing Data Flow

The current billing flow is:

```text
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

The billing state is managed through:

```text
src/features/billing/hooks/useBilling.js
```

---

# 🛣️ Development Roadmap

## Phase 1 — Billing Foundation

- [x] Product search
- [x] Product selection
- [x] Add items
- [x] Remove items
- [x] Quantity controls
- [x] Decimal quantities
- [x] Editable quantity
- [x] Editable rate
- [x] Price calculation
- [x] Total calculation
- [x] New Bill
- [x] Responsive layout
- [x] Internal item scrolling
- [x] Print layout

## Phase 2 — UI, Accessibility & Localization

- [x] Light mode
- [x] Dark mode
- [x] Text-size controls
- [x] Responsive design
- [x] Mobile navigation
- [x] Collapsible sidebar
- [x] English language
- [x] Hindi language
- [x] Persistent language preference
- [x] Persistent theme preference
- [x] Persistent text-size preference
- [x] Localized print layout
- [x] Print-only layout cleanup

## Phase 3 — Product Management

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

## Phase 4 — Billing Improvements

- [ ] Customer / Form field in billing UI
- [ ] Bill number
- [ ] Faster keyboard workflow
- [ ] Improved product selection
- [ ] Better bill validation
- [ ] Bill draft handling
- [ ] Saved bills

## Phase 5 — Customer Management

- [ ] Customer list
- [ ] Add customer
- [ ] Edit customer
- [ ] Search customers
- [ ] Customer history
- [ ] Customer-wise bills

## Phase 6 — Bill History

- [ ] Save bills
- [ ] Bill history
- [ ] View bill
- [ ] Reprint bill
- [ ] Search bills
- [ ] Filter by date
- [ ] Filter by customer
- [ ] Bill details

## Phase 7 — Inventory

- [ ] Stock management
- [ ] Stock in
- [ ] Stock out
- [ ] Stock history
- [ ] Low-stock alerts
- [ ] Inventory calculations
- [ ] Loose quantity handling
- [ ] Package handling

## Phase 8 — Payments & Credit

- [ ] Cash payments
- [ ] UPI
- [ ] Card
- [ ] Bank transfer
- [ ] Credit sales
- [ ] Paid amount
- [ ] Outstanding amount
- [ ] Payment history

## Phase 9 — Reports

- [ ] Daily sales
- [ ] Monthly sales
- [ ] Product sales
- [ ] Customer sales
- [ ] Payment reports
- [ ] Outstanding reports
- [ ] Inventory reports
- [ ] Stock movement reports

## Phase 10 — Backend

The frontend will eventually connect to a backend API.

Planned high-level architecture:

```text
React Frontend
      ↓
Backend API
      ↓
Business Logic
      ↓
Database
```

The exact backend framework, database architecture, and API structure will be decided after the frontend data model and business rules are stable.

---

# 🗄️ Planned Data Model

The future system is expected to contain entities such as:

```text
Product
Category
Unit
Customer
Bill
BillItem
Inventory
StockMovement
Payment
User
```

Additional entities may be introduced as business requirements become clearer.

The final data model will be designed around the actual workflows required by hardware and building-material businesses.

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- Tailwind CSS
- JavaScript / JSX

## Current State Management

- React hooks
- React Context

## Current Data

- Local/static JavaScript data
- Browser local storage for user preferences

## Planned Backend

- Backend API
- Database
- Persistent business data
- Authentication
- User management
- Roles and permissions

The final backend technology will be selected after the frontend data model and business rules are finalized.

---

# 🚀 Getting Started

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

## Build for production

```bash
npm run build
```

## Preview production build

```bash
npm run preview
```

---

# 📁 Important Files

### Application entry

```text
src/main.jsx
```

### Main application

```text
src/App.jsx
```

### Billing page

```text
src/pages/Billing.jsx
```

### Product management page

```text
src/pages/Products.jsx
```

### Billing state

```text
src/features/billing/hooks/useBilling.js
```

### Product search

```text
src/features/billing/components/ItemSearch.jsx
```

### Billing item list

```text
src/features/billing/components/ItemList.jsx
```

### Individual billing row

```text
src/features/billing/components/ItemRow.jsx
```

### Printable bill

```text
src/features/billing/components/BillPrint.jsx
```

### Product list

```text
src/features/products/components/ProductList.jsx
```

### Product form

```text
src/features/products/components/ProductForm.jsx
```

### Product units

```text
src/features/products/components/ProductUnitList.jsx
```

### Product data

```text
src/data/products.js
```

### Categories

```text
src/data/categories.js
```

### Units

```text
src/data/units.js
```

### Theme and text-size settings

```text
src/context/ThemeContext.jsx
```

### Product state

```text
src/context/ProductContext.jsx
```

### Language state

```text
src/context/LanguageContext.jsx
```

### English translations

```text
src/i18n/en.js
```

### Hindi translations

```text
src/i18n/hi.js
```

### Accessibility controls

```text
src/components/common/AccessibilityControls.jsx
```

### Global styles and print styles

```text
src/index.css
```

---

# 🎯 Project Goal

The goal is to build a practical POS system for hardware and building-material businesses.

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
   ↓
Database
   ↓
Authentication & Permissions
```

The application is being developed incrementally so that each major feature can be built, tested, and stabilized before expanding the system further.

---

# 📌 Development Approach

The project is being developed incrementally.

The current approach is:

1. Build and stabilize the billing experience.
2. Build product management.
3. Add accessibility and localization.
4. Build customer and bill management.
5. Add inventory.
6. Add purchasing and suppliers.
7. Add payments and credit.
8. Add reports.
9. Connect the application to a backend and database.
10. Add authentication and permissions.
11. Prepare the system for production use.

The architecture should remain modular so new features can be added without rebuilding the existing billing functionality.

---

# 📄 License

This project is currently under development.
