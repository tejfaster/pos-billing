# POS Billing --- Hardware & Building Materials

A responsive web-based billing application for hardware and
building-material businesses.

The application is being built with **React, Vite, and Tailwind CSS**
with the goal of working across phones, tablets, laptops, desktops, and
different screen sizes.

> **Project status:** Early development / architecture restructuring\
> The current version is a working prototype. The project is being
> reorganized before adding larger features.

------------------------------------------------------------------------

## Table of Contents

-   [Project Overview](#project-overview)
-   [Current Workflow](#current-workflow)
-   [Planned Workflow](#planned-workflow)
-   [Technology Stack](#technology-stack)
-   [Project Structure](#project-structure)
-   [How the Current Application
    Works](#how-the-current-application-works)
-   [Billing Data Flow](#billing-data-flow)
-   [Printing](#printing)
-   [Responsive Design](#responsive-design)
-   [Dark Mode](#dark-mode)
-   [Development Roadmap](#development-roadmap)
-   [Getting Started](#getting-started)
-   [Development Principles](#development-principles)

------------------------------------------------------------------------

## Project Overview

This project is a POS/billing application designed for a hardware and
building-material shop.

The first workflow focuses on creating a simple item list:

1.  Search for a hardware item.
2.  Select the item from a searchable dropdown.
3.  Add it to the billing list.
4.  Adjust quantity if required.
5.  Remove items when necessary.
6.  Print the list.
7.  Manually write the rate on the printed document.

The application is intentionally being kept simple at this stage.
Automatic GST, amount calculations, and total calculations are not part
of the new billing-list workflow.

------------------------------------------------------------------------

## Current Workflow

The current prototype contains:

-   Product search
-   Product code search
-   Category filtering
-   Keyboard navigation in the search dropdown
-   Adding products to a selected-item list
-   Quantity increase/decrease
-   Removing items
-   Browser printing
-   A print-only layout

The prototype currently keeps most of this functionality inside
`src/App.jsx`.

The product catalog currently contains categories such as:

-   Cement
-   Steel & Rebar
-   Bricks & Blocks
-   Sand & Aggregate
-   Plumbing
-   Electrical
-   Paint
-   Tools
-   Fasteners

The product records currently contain:

``` text
id
name
code
category
unit
```

------------------------------------------------------------------------

## Planned Workflow

The UI is being simplified from a tile/card-based product interface to a
searchable-dropdown workflow.

### Screen

``` text
┌──────────────────────────────────────────┐
│ Sharma Hardware & Building Materials     │
│                                  Date    │
├──────────────────────────────────────────┤
│ 🔍 Search item...                        │
│                                          │
│ Search results                            │
│ ┌──────────────────────────────────────┐ │
│ │ OPC 53 Grade Cement                  │ │
│ │ CEM-053 · Cement · bag (50kg)        │ │
│ ├──────────────────────────────────────┤ │
│ │ PPC Cement                           │ │
│ │ CEM-PPC · Cement · bag (50kg)        │ │
│ └──────────────────────────────────────┘ │
├──────────────────────────────────────────┤
│ Item List                                │
│                                          │
│ 1. OPC 53 Grade Cement              Qty 2│
│ 2. TMT Bar 10mm Fe500               Qty 5│
│ 3. PVC Pipe 1 inch                  Qty 3│
│                                          │
├──────────────────────────────────────────┤
│               PRINT LIST                 │
└──────────────────────────────────────────┘
```

### Printed list

The printed document is intended to contain the selected items and
quantities, with space for manually writing the rate.

``` text
SHARMA HARDWARE & BUILDING MATERIALS

Date: __________________

---------------------------------------------------------
S.No    Item                              Qty     Rate
---------------------------------------------------------
1       OPC 53 Grade Cement               2       _______

2       TMT Bar 10mm Fe500                5       _______

3       PVC Pipe 1 inch                   3       _______

---------------------------------------------------------
```

There will be:

-   No product tiles
-   No GST field
-   No automatic total
-   No automatic amount calculation

------------------------------------------------------------------------

## Technology Stack

### Frontend

-   React
-   Vite
-   Tailwind CSS
-   JavaScript / JSX

### Browser APIs

-   `window.print()` for printing
-   DOM events for keyboard and mouse interaction

### Planned application capabilities

The architecture is being prepared for future modules such as:

-   Billing
-   Products
-   Inventory
-   Customers
-   Suppliers
-   Bill history
-   Reports
-   Settings
-   Theme management
-   Data persistence
-   Backup/export

------------------------------------------------------------------------

# Project Structure

The project is being reorganized into a feature-oriented structure.

``` text
pos-billing/
│
├── public/
│
├── src/
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── common/
│   │   └── layout/
│   │
│   ├── features/
│   │   └── billing/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── utils/
│   │
│   ├── data/
│   │
│   ├── hooks/
│   │
│   ├── pages/
│   │
│   ├── utils/
│   │
│   ├── context/
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── package.json
├── package-lock.json
├── vite.config.js
├── index.html
└── README.md
```

------------------------------------------------------------------------

## Folder Responsibilities

### `src/assets/`

Stores static frontend assets.

Examples:

``` text
assets/
├── logo.svg
├── images/
└── icons/
```

------------------------------------------------------------------------

### `src/components/common/`

Reusable UI components that can be used by multiple features.

Examples:

``` text
Button
Input
Dropdown
Modal
LoadingSpinner
```

These components should not contain billing-specific business logic.

------------------------------------------------------------------------

### `src/components/layout/`

Application-level layout components.

Examples:

``` text
Header
Sidebar
MobileNavigation
PageContainer
```

These components control the overall application shell.

------------------------------------------------------------------------

### `src/features/billing/`

Contains everything specifically related to billing.

``` text
features/
└── billing/
    ├── components/
    │   ├── ItemSearch.jsx
    │   ├── ItemList.jsx
    │   ├── ItemRow.jsx
    │   └── PrintList.jsx
    │
    ├── hooks/
    │   └── useBilling.js
    │
    └── utils/
        └── printBillingList.js
```

This separation is important because billing will eventually become one
of several major application features.

------------------------------------------------------------------------

### `src/data/`

Static or initial application data.

The product catalog will be moved here:

``` text
src/data/products.js
```

Example:

``` js
export const PRODUCTS = [
  {
    id: 1,
    name: "OPC 53 Grade Cement",
    code: "CEM-053",
    cat: "Cement",
    unit: "bag (50kg)"
  }
];
```

As the application grows, this data can later be replaced or
supplemented by a backend/database.

------------------------------------------------------------------------

### `src/hooks/`

General-purpose React hooks shared across multiple features.

Examples:

``` text
useLocalStorage.js
useMediaQuery.js
useDebounce.js
```

Feature-specific hooks should remain inside their feature folder.

For example:

``` text
features/billing/hooks/useBilling.js
```

------------------------------------------------------------------------

### `src/pages/`

Application-level pages/screens.

Initial planned pages:

``` text
Billing.jsx
Products.jsx
Customers.jsx
Bills.jsx
Settings.jsx
```

A page should compose components and features rather than contain all
business logic itself.

------------------------------------------------------------------------

### `src/utils/`

General utilities that are not specific to one feature.

Examples:

``` text
formatDate.js
storage.js
formatCurrency.js
```

Billing-only utilities belong in:

``` text
features/billing/utils/
```

------------------------------------------------------------------------

### `src/context/`

Global React context/state.

This will be useful for things such as:

``` text
Theme
Application settings
User/session information
```

For example:

``` text
ThemeContext.jsx
```

can eventually manage:

``` text
Light
Dark
System
```

------------------------------------------------------------------------

## How the Current Application Works

The current prototype has a main component called `HardwareItemList`.

It maintains:

``` js
const [category, setCategory] = useState("All");
const [items, setItems] = useState([]);
```

### Product search

`ProductSearch` maintains its own search state:

``` text
query
open
activeIndex
```

The search filters products by:

-   Product name
-   Product code
-   Selected category

The dropdown also supports keyboard navigation:

``` text
Arrow Down → next item
Arrow Up   → previous item
Enter      → select item
Escape     → close dropdown
```

------------------------------------------------------------------------

## Adding Items

When an item is selected:

``` text
ProductSearch
      │
      ▼
    onAdd()
      │
      ▼
HardwareItemList
      │
      ▼
items state
```

If the product is already present, the current implementation increases
its quantity.

Otherwise, a new item is added with:

``` js
qty: 1
```

------------------------------------------------------------------------

## Quantity Management

Each selected item currently supports:

``` text
−   quantity   +
```

When quantity reaches zero, the item is removed from the list.

There is also an explicit `Remove` action.

The new architecture will keep this behavior inside the billing feature
rather than the main `App.jsx`.

------------------------------------------------------------------------

# Billing Data Flow

The intended architecture is:

``` text
                 Product Data
                      │
                      ▼
              ┌───────────────┐
              │ Item Search   │
              └───────┬───────┘
                      │
                 Select item
                      │
                      ▼
              ┌───────────────┐
              │ Billing State │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │  Item List    │
              └───────┬───────┘
                      │
             ┌────────┴────────┐
             ▼                 ▼
        Change Qty          Remove
             │                 │
             └────────┬────────┘
                      ▼
              ┌───────────────┐
              │ Print List    │
              └───────────────┘
```

The goal is to keep state management separate from presentation.

------------------------------------------------------------------------

# Printing

The current prototype uses the browser's printing API:

``` js
window.print();
```

The application has separate screen and print views.

CSS controls which elements are visible when printing:

``` css
@media print {
  .no-print {
    display: none !important;
  }

  .print-only {
    display: block !important;
  }
}
```

The planned implementation will move printing-related logic and styles
out of the main application component.

------------------------------------------------------------------------

# Responsive Design

The application is intended to work on:

``` text
📱 Phone
   ↓
📱 Tablet
   ↓
💻 Laptop
   ↓
🖥️ Desktop
   ↓
🖥️ Large monitor
```

The application should not depend on a fixed desktop width.

Responsive design principles:

-   Mobile-first layouts
-   Flexible widths
-   Responsive spacing
-   Touch-friendly controls
-   Keyboard accessibility where appropriate
-   Avoid unnecessary horizontal scrolling
-   Adaptive navigation
-   Responsive typography
-   Print-specific layout

The current prototype uses a narrow maximum-width container. This will
be replaced with a responsive application shell during restructuring.

------------------------------------------------------------------------

# Dark Mode

Dark mode is planned as a first-class application feature.

Instead of hard-coding light-theme colors throughout components, the
application will use semantic theme variables.

Conceptually:

``` text
Light Theme
    │
    ├── background
    ├── surface
    ├── foreground
    ├── border
    └── muted

Dark Theme
    │
    ├── background
    ├── surface
    ├── foreground
    ├── border
    └── muted
```

This allows components to use semantic colors instead of knowing the
exact color values of a particular theme.

Planned theme modes:

``` text
Light
Dark
System
```

------------------------------------------------------------------------

# Development Roadmap

## Phase 1 --- Architecture

-   [x] Create initial Vite + React project
-   [x] Build working billing prototype
-   [ ] Restructure `src`
-   [ ] Separate product data
-   [ ] Create billing page
-   [ ] Extract billing components
-   [ ] Separate state management
-   [ ] Create reusable UI components

## Phase 2 --- Responsive UI

-   [ ] Mobile layout
-   [ ] Tablet layout
-   [ ] Desktop layout
-   [ ] Responsive navigation
-   [ ] Touch-friendly controls
-   [ ] Accessibility improvements

## Phase 3 --- Billing

-   [ ] Searchable item dropdown
-   [ ] Selected item list
-   [ ] Quantity management
-   [ ] Item removal
-   [ ] Clean print layout
-   [ ] Manual rate fields/spaces
-   [ ] Remove GST calculation
-   [ ] Remove automatic total calculation

## Phase 4 --- Theme

-   [ ] Theme variables
-   [ ] Light mode
-   [ ] Dark mode
-   [ ] System theme detection
-   [ ] Theme preference persistence

## Phase 5 --- Product Management

-   [ ] Product list
-   [ ] Add product
-   [ ] Edit product
-   [ ] Delete product
-   [ ] Categories
-   [ ] Product search
-   [ ] Units

## Phase 6 --- Inventory

-   [ ] Stock management
-   [ ] Purchases
-   [ ] Stock adjustments
-   [ ] Suppliers
-   [ ] Inventory history

## Phase 7 --- Customers & Bills

-   [ ] Customer management
-   [ ] Bill history
-   [ ] Bill details
-   [ ] Search bills
-   [ ] Reprint bills

## Phase 8 --- Reports

-   [ ] Sales reports
-   [ ] Purchase reports
-   [ ] Inventory reports
-   [ ] Date filtering
-   [ ] Export

## Phase 9 --- Persistence / Backend

The application can initially use browser/local storage for simple data.

Later, the architecture can support:

``` text
React
  │
  ▼
API
  │
  ▼
Backend
  │
  ▼
Database
```

The frontend should not need to be completely rewritten when persistent
storage is introduced.

------------------------------------------------------------------------

# Getting Started

## Install dependencies

``` bash
npm install
```

## Start development server

``` bash
npm run dev
```

Vite will provide a local development URL in the terminal.

## Build for production

``` bash
npm run build
```

## Preview production build

``` bash
npm run preview
```

------------------------------------------------------------------------

# Development Principles

### 1. Keep `App.jsx` small

`App.jsx` should primarily define the application's top-level structure.

Avoid putting large business logic, product catalogs, or
feature-specific UI directly inside it.

------------------------------------------------------------------------

### 2. Keep features isolated

Billing-related code belongs inside:

``` text
features/billing/
```

Future inventory code belongs inside:

``` text
features/inventory/
```

Future product-management code belongs inside:

``` text
features/products/
```

This makes the application easier to maintain as it grows.

------------------------------------------------------------------------

### 3. Prefer reusable components

If a component can reasonably be used by multiple features, place it
under:

``` text
components/common/
```

Do not duplicate the same UI logic across multiple pages.

------------------------------------------------------------------------

### 4. Separate UI from business logic

Prefer:

``` text
UI component
     │
     ▼
Hook / state
     │
     ▼
Utility / service
```

rather than putting everything inside one component.

------------------------------------------------------------------------

### 5. Design responsive behavior from the beginning

Do not build a desktop-only application and try to fix mobile later.

Every major UI component should be considered for:

``` text
Mobile
Tablet
Desktop
```

------------------------------------------------------------------------

### 6. Design for future data sources

The first product catalog can be local/static.

The architecture should still allow it to eventually come from:

``` text
Local data
    ↓
LocalStorage
    ↓
API
    ↓
Database
```

without coupling the UI directly to one data source.

------------------------------------------------------------------------

### 7. Keep printing separate from screen UI

A printed bill/list has different requirements from an interactive
screen.

The print layout should be independently controlled.

------------------------------------------------------------------------

## Current Architecture Goal

The long-term goal is:

``` text
                    POS BILLING APP
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
     Billing            Products          Inventory
        │                  │                  │
     Customers          Suppliers           Reports
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                     Shared Components
                           │
                     Theme / Settings
                           │
                    Data / Persistence
```

The application will start small and grow module-by-module without
making the core codebase difficult to maintain.

------------------------------------------------------------------------

## License

License information will be added when the project is finalized for
public distribution.
