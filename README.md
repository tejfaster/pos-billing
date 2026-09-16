# POS Billing System

A modern, responsive Point of Sale (POS) billing application designed for hardware and building-material businesses.

The application is being developed with a focus on simple billing, flexible product measurements, packaging/size variations, inventory management, customer management, and scalable architecture.

---

## 🚧 Project Status

The project is currently in the **frontend billing phase**.

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
- Light mode
- Dark mode
- Text-size accessibility controls
- A4 print layout
- Customer / Form area on printed bill
- Printed quantity
- Printed rate
- Printed price
- Printed total

### Currently being designed

The next major architectural improvement is the product and measurement system:

```text
Product
   ↓
Selling Options / Variants
   ↓
Units
   ↓
Unit Conversion
   ↓
Billing
   ↓
Inventory
```

---

# ✨ Features

## 🧾 Billing

The current billing screen allows users to:

- Search for products
- Search by product name or product code
- Add products to the bill
- Increase/decrease quantity
- Enter decimal quantities
- Enter custom rates
- Automatically calculate item prices
- Automatically calculate the bill total
- Remove products
- Start a new bill

Example:

```text
Product             Qty       Rate       Price

PPC Cement          1.6        23        36.80
White Cement          1         7         7.00
River Sand            1        87        87.00

                                      Total: 130.80
```

---

# 📏 Flexible Units & Product Packaging

A major requirement of this POS is supporting real-world hardware and building-material measurements.

A product should not necessarily be treated as a completely separate product for every package size.

For example:

```text
OPC 53 Grade Cement
│
├── 50 kg Bag
├── 25 kg Bag
├── 10 kg Bag
├── 1 kg Bag
└── Loose / kg
```

All of these belong to the same product.

---

## Base Unit

Each product will eventually have a base measurement unit.

For example:

```text
Cement
Base Unit: kg
```

Possible selling options:

```text
50 kg Bag
25 kg Bag
10 kg Bag
1 kg Bag
kg
gm
```

Conversions can then be represented as:

```text
1 gm       = 0.001 kg
1 kg       = 1 kg
1 bag 1kg  = 1 kg
1 bag 10kg = 10 kg
1 bag 25kg = 25 kg
1 bag 50kg = 50 kg
```

---

## Different Products, Different Units

The system should support different units depending on the product.

### Cement

```text
kg
gm
bag
```

### Steel

```text
kg
ton
bundle
```

### Electrical Wire

```text
meter
feet
roll
bundle
```

### Tiles

```text
piece
box
carton
```

### PVC Pipe

```text
meter
piece
bundle
```

### Paint

```text
liter
ml
bucket
can
```

### Screws

```text
piece
packet
box
carton
```

The final unit system will allow products to define which selling units they support.

---

# 📦 Product & Selling Options

The planned product structure separates the actual product from its selling options.

For example:

```text
Product
└── OPC 53 Grade Cement

Selling Options
├── 50 kg Bag
├── 25 kg Bag
├── 10 kg Bag
├── 1 kg Bag
└── Loose / kg
```

Each selling option can eventually have:

- Selling unit
- Package size
- Conversion to base unit
- Default rate
- Selling price
- Inventory relationship

Example:

```text
OPC 53 Grade Cement

50 kg Bag
Unit: bag
Conversion: 50 kg
Rate: ₹450

25 kg Bag
Unit: bag
Conversion: 25 kg
Rate: ₹240

10 kg Bag
Unit: bag
Conversion: 10 kg
Rate: ₹100

Loose
Unit: kg
Conversion: 1 kg
Rate: ₹11
```

---

# 📊 Inventory Concept

The future inventory system will use the base unit to calculate stock.

For example:

```text
Inventory:
Cement = 1000 kg
```

If a customer purchases:

```text
2 × 25 kg bags
```

The inventory calculation becomes:

```text
1000 kg
- 50 kg
-------
950 kg
```

If another customer purchases:

```text
3 kg
```

Then:

```text
950 kg
- 3 kg
------
947 kg
```

This allows the system to support both packaged and measured sales.

---

# 🖥️ Current UI

The current billing interface contains:

```text
Create Bill

Search item name or code...

Selected Items

┌─────────────────────────────────────────────┐
│ #   Item              Qty    Rate    Price  │
├─────────────────────────────────────────────┤
│ 1   OPC Cement         2      12      ₹24   │
│ 2   TMT Bar            3      43     ₹129   │
│ 3   Grinder            1      21      ₹21   │
└─────────────────────────────────────────────┘

Total                                  ₹174

              Print Item List
```

The selected-items area has its own scroll so that adding many products does not cause the entire application page to scroll.

---

# 🌙 Theme & Accessibility

The application currently supports:

## Light Mode

```text
Light theme
```

## Dark Mode

```text
Dark theme
```

## Text Size

Users can select:

```text
A−
A
A+
A++
```

The selected text size is stored locally so the preference remains available after refreshing the application.

---

# 🖨️ Printing

The application has a dedicated printable bill layout.

The normal application interface is hidden during printing.

The printed layout contains:

```text
Date: 16/09/2026     Customer / Form: __________________________

┌──────┬──────────────────────────────┬─────┬──────┬────────┐
│ S.No │ Item                         │ Qty │ Rate │ Price  │
├──────┼──────────────────────────────┼─────┼──────┼────────┤
│  1   │ OPC 53 Grade Cement          │  2  │  12  │  24.00 │
│  2   │ TMT Bar 12mm Fe500           │  3  │  43  │ 129.00 │
│  3   │ Angle Grinder 4 inch         │  1  │  21  │  21.00 │
└──────┴──────────────────────────────┴─────┴──────┴────────┘

                                      Total: ₹174.00
```

The print layout is designed for A4 paper.

---

# 🏗️ Project Architecture

The application follows a feature-oriented structure.

```text
src/
│
├── assets/
│
├── components/
│   ├── common/
│   │   └── AccessibilityControls.jsx
│   │
│   └── layout/
│       ├── Header.jsx
│       └── MainLayout.jsx
│
├── context/
│   └── ThemeContext.jsx
│
├── data/
│   └── products.js
│
├── features/
│   └── billing/
│       ├── components/
│       │   ├── BillPrint.jsx
│       │   ├── ItemList.jsx
│       │   ├── ItemRow.jsx
│       │   └── ItemSearch.jsx
│       │
│       └── hooks/
│           └── useBilling.js
│
├── hooks/
│
├── pages/
│   └── Billing.jsx
│
├── utils/
│
├── App.jsx
├── index.css
└── main.jsx
```

---

# 🧩 Architecture Principles

The project is structured so that features can grow without putting everything into one large component.

### Pages

Pages are responsible for composing complete screens.

```text
pages/
└── Billing.jsx
```

### Features

Feature-specific functionality lives inside its feature folder.

```text
features/
└── billing/
```

### Components

Reusable UI components live under:

```text
components/
```

### Context

Global application state such as theme and accessibility preferences lives under:

```text
context/
```

### Data

Temporary/static product data currently lives under:

```text
data/
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
features/billing/hooks/useBilling.js
```

---

# 🧮 Calculation Logic

For each item:

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

The total is calculated as:

```text
Total = Sum of all item prices
```

The total remains blank until every selected item has a valid rate.

This prevents incomplete bills from displaying a misleading total.

---

# 🛣️ Development Roadmap

## Phase 1 — Billing Foundation

- [x] Product search
- [x] Product selection
- [x] Add items
- [x] Remove items
- [x] Quantity controls
- [x] Decimal quantities
- [x] Editable rate
- [x] Price calculation
- [x] Total calculation
- [x] New Bill
- [x] Responsive layout
- [x] Internal item scrolling

---

## Phase 2 — UI & Accessibility

- [x] Light mode
- [x] Dark mode
- [x] Text-size controls
- [x] Responsive design
- [x] Compact billing layout
- [x] Print-friendly layout

---

## Phase 3 — Product & Measurement System

- [ ] Product model redesign
- [ ] Product variants / selling options
- [ ] Unit system
- [ ] Base units
- [ ] Unit conversion
- [ ] Package sizes
- [ ] Product-specific units
- [ ] Selling-option-specific rates

Example:

```text
Product
   ↓
Selling Option
   ↓
Unit
   ↓
Conversion
   ↓
Rate
```

---

## Phase 4 — Billing Improvements

- [ ] Customer / Form field in UI
- [ ] Bill number
- [ ] Sticky item-table header
- [ ] Faster keyboard workflow
- [ ] Improved product selection
- [ ] Better bill validation
- [ ] Bill draft handling

---

## Phase 5 — Product Management

- [ ] Product list
- [ ] Add product
- [ ] Edit product
- [ ] Delete product
- [ ] Categories
- [ ] Product codes
- [ ] Units
- [ ] Selling options
- [ ] Default rates
- [ ] Package sizes

---

## Phase 6 — Customer Management

- [ ] Customer list
- [ ] Add customer
- [ ] Edit customer
- [ ] Search customers
- [ ] Customer history
- [ ] Customer-wise bills

---

## Phase 7 — Bill History

- [ ] Save bills
- [ ] Bill history
- [ ] View bill
- [ ] Reprint bill
- [ ] Search bills
- [ ] Filter by date
- [ ] Filter by customer
- [ ] Bill details

---

## Phase 8 — Inventory

- [ ] Stock management
- [ ] Stock in
- [ ] Stock out
- [ ] Base-unit inventory
- [ ] Package conversion
- [ ] Loose quantity handling
- [ ] Low-stock alerts
- [ ] Stock history

---

## Phase 9 — Payments & Credit

- [ ] Cash payments
- [ ] UPI
- [ ] Card
- [ ] Bank transfer
- [ ] Credit sales
- [ ] Paid amount
- [ ] Outstanding amount
- [ ] Payment history

---

## Phase 10 — Reports

- [ ] Daily sales
- [ ] Monthly sales
- [ ] Product sales
- [ ] Customer sales
- [ ] Payment reports
- [ ] Outstanding reports
- [ ] Inventory reports
- [ ] Stock movement reports

---

## Phase 11 — Backend

The frontend will eventually connect to a backend API.

Planned architecture:

```text
React Frontend
      ↓
Backend API
      ↓
Business Logic
      ↓
PostgreSQL
```

The exact backend framework and API architecture will be decided when the frontend data model is stable.

---

# 🗄️ Planned Data Model

The future system will likely contain entities such as:

```text
Product
Category
Unit
SellingOption
Customer
Bill
BillItem
Inventory
StockMovement
Payment
User
```

Relationships will eventually resemble:

```text
Product
  │
  ├── Category
  │
  └── Selling Options
         │
         ├── Unit
         ├── Package Size
         ├── Conversion
         └── Rate
```

And:

```text
Customer
   │
   └── Bills
          │
          └── Bill Items
                 │
                 └── Products / Selling Options
```

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

## Planned Backend

- REST API or equivalent API architecture
- PostgreSQL

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

### Product data

```text
src/data/products.js
```

### Theme and text-size settings

```text
src/context/ThemeContext.jsx
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

The goal is to build a practical POS system for hardware and building-material businesses where products can be sold in different:

- Measurements
- Units
- Package sizes
- Quantities
- Selling formats

The system should support situations such as:

```text
1 × 25 kg Bag
```

or:

```text
1 kg Loose
```

or:

```text
500 gm
```

while still treating them as the appropriate selling form of the same underlying product.

The long-term goal is a scalable system covering:

```text
Billing
   ↓
Products
   ↓
Units & Conversions
   ↓
Inventory
   ↓
Customers
   ↓
Purchasing
   ↓
Payments
   ↓
Reports
   ↓
Database
```

---

# 📌 Development Approach

The project is being developed incrementally.

The approach is:

1. Stabilize the billing experience.
2. Define the correct product and unit data model.
3. Build product management.
4. Build customer and bill management.
5. Add inventory.
6. Add payments and credit.
7. Add reports.
8. Connect the application to a backend and database.
9. Add authentication and permissions.
10. Prepare the system for production use.

The architecture should remain modular so new features can be added without rebuilding the existing billing functionality.

---

# 📄 License

This project is currently under development.
