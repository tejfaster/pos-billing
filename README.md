# POS Billing System



A modern, responsive Point of Sale (POS) billing application designed for hardware and building-material businesses.



The frontend is built with React, Vite, and Tailwind CSS, with a separate Node.js / Express / PostgreSQL backend.



The application is designed to support offline POS billing using a Progressive Web App (PWA) and IndexedDB for local catalogue and bill storage.



Production: https://pos-billing.tejfaster55.workers.dev



---



## 🚧 Project Status



The project is currently under active development. The core flow is in production: login, catalogue synchronization, offline billing, local bill history and A4 printing. The current work focuses on verifying PWA installation and offline startup on real devices, and on hardening the offline catalogue synchronization.



The current frontend provides a working foundation for:



- Billing

- Product search and selection

- Product management

- Category management

- Unit selection

- Quantity and rate management

- Automatic price and total calculation

- A4 bill printing

- Local bill storage

- Local bill history

- Daily bill numbering

- Offline catalogue storage

- Offline billing

- Catalogue synchronization

- Manual catalogue synchronization

- Automatic catalogue synchronization

- Change-triggered catalogue synchronization

- PWA installation

- English and Hindi localization

- Light and dark themes

- Accessibility controls

- Responsive layouts



Still to verify on real devices:



- PWA installation and update behavior on supported browsers

- Offline startup after a successful online load

- Catalogue create / update / deactivate retry and recovery



See [Known Limitations](#-known-limitations) and the [Development Roadmap](#️-development-roadmap).



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

- Offline billing

- Local bill storage

- Local bill history

- Daily bill numbering



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

- Delete product (soft delete through the product `status`)

- English/transliteration name

- Hindi name

- Brand

- Category

- Product status



Product management needs an internet connection. Create, edit and delete go straight to the backend API. After each successful change a catalogue sync updates IndexedDB, so billing search sees the change.



A product cannot be saved with a category or unit that still has a temporary `local-` ID (created offline and not yet synced). The user is asked to try again after the sync finishes.



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



Units are local-first. A new or changed unit is saved in IndexedDB, queued, and sent to the backend by the next sync.



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



Product search operates from locally synchronized catalogue data.



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



## 📱 PWA & Offline Support



The POS application is designed as a Progressive Web App (PWA).



The PWA allows the application to be installed on a supported device and launched in an app-style window.



### Installation



The application provides an **Install POS** option inside:



```text

Settings

  ↓

Sync & Offline

  ↓

Install POS

```



After installation, the application can use its locally cached application shell without requiring Cloudflare to deliver the application again during normal offline use.



### Updates



The service worker (Workbox `generateSW`) uses `autoUpdate`, `skipWaiting` and `clientsClaim`, so a new deployment replaces the cached application shell automatically. `/api/*` is excluded from the navigation fallback (`navigateFallbackDenylist`), so API calls are never answered with `index.html`.



If a device keeps running an old version, clear the site data for the site or reinstall the PWA once.



### Offline Storage



IndexedDB is used for local application data.



The local offline database contains:



```text

Products

Categories

Units

Bills

Bill Counters

Sync Metadata

Pending Operations

Pending Sales

```



### Offline Billing



Billing does not require the backend for normal bill creation.



The offline billing flow is:



```text

IndexedDB

    ↓

Product Search

    ↓

Billing

    ↓

Bill Number

    ↓

Save Bill Locally

    ↓

Print

    ↓

Local Bill History

```



Bills are stored locally on the device.



Bills are not stored in the backend database. They remain in the browser's IndexedDB for that device/browser origin and are not automatically shared across devices. Clearing site data or losing access to the device may remove those records, so plan a backup/export process before relying on them as the only business record.



### Bill Numbering



Bill numbers are generated locally.



The bill counter is maintained per user and resets for a new business date. The business date is the **local** date of the device, so the counter resets at local midnight.



The counter is read and updated in a single IndexedDB transaction, so two rapid saves cannot receive the same number.



The generated bill number contains:



```text

Bill Prefix

+

Daily Sequence Number

```



Example:



```text

ABC-000001

ABC-000002

ABC-000003

```



Two devices signed in as the same user keep separate counters and can produce the same bill number (see [Known Limitations](#-known-limitations)).



---



## 🔄 Catalogue Synchronization



The backend remains the master source for:



- Products

- Categories

- Units



The frontend maintains a local copy in IndexedDB for offline operation.



The synchronization flow is:



```text

PostgreSQL

    ↓

Express Backend

    ↓

Sync API

    ↓

Frontend

    ↓

IndexedDB

    ↓

POS Application

```



### When a Sync Runs



| Trigger | Where |
|---|---|
| After login, when online | `App.jsx` |
| After any product, category or unit change | `syncSoon()` in the contexts |
| Manual: Settings → Sync & Offline → Sync Now | `syncService.js` |
| Scheduled: 10:00, 14:00 and 19:00 local time, while the app is open | `syncScheduler.js` |



### How a Sync Works



1. Upload queued category and unit operations in dependency order (creates, then updates, then deactivations). Temporary `local-…` IDs are mapped to server IDs.

2. Download the catalogue from `/api/sync`.

3. Merge it into IndexedDB in one transaction. Records that still have unsynced queued work are kept.

4. Fire a `catalogue:synced` event. The product, category and unit contexts reload from IndexedDB.



Rules:



- Only one sync runs at a time. A caller that arrives during a running sync shares its result.

- Every request times out after 30 seconds.

- A scheduled slot is marked done only after a successful sync. After a failure, the scheduler waits 5 minutes before trying again.

- Categories and units are local-first (saved locally, queued, then synced). Products are online-only.



### Manual Sync



A manual catalogue synchronization option is available inside:



```text

Settings

  ↓

Sync & Offline

  ↓

Sync Now

```



Manual synchronization requires an internet connection.



The synchronization result records:



- Sync timestamp

- Number of categories

- Number of units

- Number of products



### Automatic Sync



The application includes an automatic catalogue synchronization scheduler. It runs at 10:00, 14:00 and 19:00 local time. If the application was closed at one of those times, the latest missed slot runs the next time the app is open. Actual execution depends on the scheduler, browser lifecycle, network availability, and authentication state; browser timers cannot guarantee a run while the app is closed or suspended.



The scheduler checks the configured synchronization times while the application is running and synchronizes the latest catalogue data directly with the backend. It starts only after the user is authenticated.



Automatic synchronization only concerns catalogue data.



Bills remain local to the device.



### Online / Offline Status



The current connection status is displayed inside:



```text

Settings

  ↓

Sync & Offline

  ↓

Connection Status

```



The application automatically reacts to browser online/offline events.



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



The frontend communicates with the backend using authenticated session cookies. Authentication uses server-side sessions with an HttpOnly cookie; there is no JWT in the frontend.



Authentication is required for the application catalogue synchronization process.



### Why the Worker Proxy Exists



The frontend (`workers.dev`) and the backend (`onrender.com`) are different sites. A session cookie set by the backend would be a third-party cookie, and browsers block those (InPrivate windows, Safari, and Chrome with third-party cookies off). Login would appear to work, but every later request would return 401.



A Cloudflare Worker (`worker.js`) forwards `/api/*` to the backend. The browser only talks to one origin, so the cookie is first-party.



### Behavior in `authService.js` and `AuthContext.jsx`



- Every request has a timeout (30 seconds; `/auth/me` uses 5 seconds) and failures map to error codes: `NETWORK_ERROR`, `UNAUTHORIZED` (401), `FORBIDDEN`, `SERVER_ERROR` (5xx) and `UNKNOWN_ERROR`.

- After login the app calls `/auth/me` once. If it returns 401, login fails with `COOKIE_BLOCKED`, so a blocked cookie is visible instead of showing an empty app.

- Only `UNAUTHORIZED` ends a session. Network errors, timeouts and Render cold starts keep the cached user, so the app still opens offline.

- When the browser comes back online, the session is re-validated.

- The cached user in `localStorage` is for the UI only. The backend must enforce roles on every protected route.



---



## 🏗️ Architecture



```text

Browser (PWA + IndexedDB)

        │  same-origin requests to /api/*

        ▼

Cloudflare Worker (worker.js)

        │  serves the Vite build, proxies /api/* to the backend

        ▼

Express backend on Render  ──►  PostgreSQL

```



```text

pos-billing/



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

│   │   │   ├── components/

│   │   │   └── services/

│   │   │       └── authService.js

│   │   ├── billing/

│   │   └── products/

│   ├── i18n/

│   │   ├── en.js

│   │   └── hi.js

│   ├── offline/

│   │   ├── db.js

│   │   ├── offlineStorage.js

│   │   ├── billStorage.js

│   │   ├── billNumber.js

│   │   ├── syncManager.js

│   │   ├── syncService.js

│   │   └── syncScheduler.js

│   ├── pages/

│   ├── App.jsx

│   ├── index.css

│   └── main.jsx

│

├── public/

│

├── worker.js

├── wrangler.jsonc

├── vite.config.js

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



Billing state is maintained locally in the frontend.



Completed bills are stored in IndexedDB.



---



## 📦 Product Architecture



Product data is managed through:



```text

src/context/ProductContext.jsx

```



The product context uses locally synchronized catalogue data for normal product browsing and billing.



Product management operations communicate with the backend when an internet connection is available. After each successful create, update or delete, `syncSoon()` runs so IndexedDB matches the backend, and the context reloads when the `catalogue:synced` event fires.



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



Categories are synchronized from the backend and stored locally for offline product browsing and billing.



Categories are used by product management and product search.



Category changes are local-first: the record is saved in IndexedDB with a temporary `local-` ID, queued as a pending operation, and uploaded by the next sync. `syncSoon()` runs right after each change.



---



## 📏 Unit Architecture



Units are managed through:



```text

src/context/UnitContext.jsx

```



Units are synchronized from the backend and stored locally.



Unit changes use the same local-first queue as categories.



Billing items store the selected unit separately:



```text

Billing Item

├── Product

├── Quantity

├── Unit

└── Rate

```



---



## 💾 Offline Architecture



The application uses IndexedDB through the `idb` package.



The local database (`pos-offline`, version 2) contains separate stores for catalogue and billing data.



```text

IndexedDB

│

├── products

├── categories

├── units

├── bills

├── billCounters

├── syncMetadata

├── pendingOperations

└── pendingSales

```



### Catalogue



```text

Backend

   ↓

Sync API

   ↓

IndexedDB

   ↓

ProductContext

CategoryContext

UnitContext

   ↓

POS

```



### Billing



```text

Local Catalogue

      ↓

Billing

      ↓

Local Bill Number

      ↓

IndexedDB

      ↓

Bill History

      ↓

Print

```



Bills do not need to be uploaded to the backend.



---



## 🔗 Backend



The frontend uses a separate backend repository.



Backend repository:



```text

pos-backend

```



GitHub:



```text

https://github.com/tejfaster/pos-backend

```



The backend provides APIs for:



- Authentication

- Sessions

- Products

- Categories

- Units

- Password reset

- OTP verification

- Catalogue synchronization



The backend database uses PostgreSQL.

The backend runs on Render at `https://pos-backend-ffx8.onrender.com`. The frontend does not call that address directly in production. It calls the relative path `/api`, and the Cloudflare Worker forwards it to the backend. This repository contains the frontend; backend and database changes are managed separately and are outside the scope of frontend-only deployment work.



---



## ☁️ Deployment (Cloudflare Workers)



`wrangler.jsonc`:



```jsonc

{

  "name": "pos-billing",

  "main": "worker.js",

  "assets": {

    "directory": "./dist",

    "binding": "ASSETS",

    "run_worker_first": ["/api/*"]

  }

}

```



`worker.js` forwards `/api` and `/api/*` to the backend and serves everything else from `dist`.



Production deploys from the `main` branch (Cloudflare Workers Builds):



| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| `VITE_API_URL` build variable | unset or `/api`, never the backend URL |



A `VITE_API_URL` build variable set to the backend URL overrides the `/api` default and sends the browser straight to the backend. Cookies are then blocked and login fails.



### Manual Deploy



```bash

VITE_API_URL=/api npm run build

grep -rln "localhost:5001\|onrender.com" dist/ || echo "clean"

npx wrangler deploy

```



Deploy only if the check prints `clean`.



### Preview Builds



Branch preview builds can fail because Cloudflare builds previews under a different Worker name than the one in `wrangler.jsonc`. This does not affect production. The simplest option is to turn **Preview builds** off in Settings → Builds.



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

- IndexedDB

- idb

- Vite PWA (Workbox)



### Hosting



- Cloudflare Workers (static assets and API proxy)

- Render (backend)



### Backend



The backend is maintained separately and uses:



- Node.js

- Express

- PostgreSQL



---



## 🚀 Getting Started



### Requirements



- Node.js 20.19 or newer (required by Vite 8)

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

VITE_API_URL=/api

```



Do not commit `.env.local`.



The Vite dev server proxies `/api` to the backend (see `vite.config.js`), so development uses the same relative URL as production. To use a backend running on your machine, change the proxy target in `vite.config.js` to `http://localhost:5001`.



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



### Testing the Production Build Locally



```bash

VITE_API_URL=/api npm run build

npx wrangler dev

```



Open `http://localhost:8787` in a new InPrivate window, log in, and check the Network tab:



- The login request goes to `localhost:8787/api/auth/login`

- `Set-Cookie` shows no warning

- `/api/auth/me` returns 200, then `/api/sync` returns 200



If login fails here, the backend's CORS settings may need to allow `http://localhost:8787`.



---



## 🔄 Frontend Data Flow



### Catalogue Synchronization



```text

PostgreSQL

      ↓

Express Backend

      ↓

Sync API

      ↓

Frontend Sync Manager

      ↓

IndexedDB

      ↓

ProductContext

CategoryContext

UnitContext

```



### Billing



```text

IndexedDB Catalogue

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

Local Bill Storage

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

        ↓

syncSoon()

        ↓

IndexedDB

```



### Category and Unit Management



```text

Category / Unit UI

        ↓

Context (saves locally, queues the operation)

        ↓

IndexedDB + pendingOperations

        ↓

syncSoon()

        ↓

Sync Manager uploads the queue

        ↓

Express Backend → PostgreSQL

```



### Authentication



```text

React Authentication UI

        ↓

AuthContext

        ↓

Authentication Service

        ↓

/api/* on the same origin

        ↓

Cloudflare Worker proxy

        ↓

Express API

        ↓

Session Authentication

```



---



## 🧯 Troubleshooting



| Symptom | Likely cause | Fix |
|---|---|---|
| Login works but products are empty | Session cookie blocked, or the first sync failed | Check that the login request goes to your own domain's `/api/...`; use Sync Now |
| Network tab shows requests to `onrender.com` | The build has an absolute backend URL | Remove `VITE_API_URL` from the Cloudflare build variables and rebuild |
| `COOKIE_BLOCKED` on login | The browser blocked a third-party cookie | Make sure the app is served through the Worker proxy |
| A phone still shows an old version | Old service worker | Clear the site data or reinstall the PWA |
| A fresh device shows "No products found" | Catalogue not synced yet | Wait for the first sync, or use Sync Now |
| First request after idle takes about 15 seconds | Render free-tier cold start | Wait; billing itself works offline |
| A new product cannot be saved right after a new category | The category still has a temporary ID | Try again after the sync finishes |
| Cloudflare preview build fails on the Worker name | Preview builds use a different Worker name | Turn off Preview builds |



---



## ⚠️ Known Limitations



- Bills live only in one browser's IndexedDB. There is no automatic backup or cross-device sharing.

- Bill numbers can collide across devices that share one login.

- Product management needs a connection. Category and unit changes are queued.

- A failing queued operation is retried on every sync, with no retry limit.

- There are no automated tests yet.

- The backend runs on a free tier with cold starts.



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

- [x] First-party session cookie through the Worker proxy

- [x] Cookie-blocked detection on login



### Phase 5 — Offline & PWA



- [x] IndexedDB database

- [x] Local product storage

- [x] Local category storage

- [x] Local unit storage

- [x] Local bill storage

- [x] Local bill history

- [x] Local bill numbering

- [x] Daily bill counter reset

- [x] Atomic bill counter (no duplicate numbers on rapid saves)

- [x] Offline billing foundation

- [x] Catalogue sync API

- [x] Manual catalogue synchronization

- [x] Automatic catalogue synchronization

- [x] Change-triggered catalogue synchronization

- [x] Request timeout and single-flight sync

- [x] Online / Offline status

- [x] PWA installation support

- [x] Offline application shell

- [ ] Verify PWA installation and update behavior on supported production browsers

- [ ] Verify offline startup after a successful online load

- [ ] Verify catalogue create/update/deactivate retry and recovery flows before production release

- [ ] Bill export and backup (JSON / CSV)

- [ ] Unique bill numbers across devices

- [ ] Retry limit and a "needs attention" count for stuck sync operations

- [ ] Visible sync status (syncing, offline, failed with retry)

- [ ] Automated tests for authentication, sync and bill numbering



### Phase 6 — Customer Management



- [ ] Customer list

- [ ] Add customer

- [ ] Edit customer

- [ ] Search customers

- [ ] Customer history

- [ ] Customer-wise bills



### Phase 7 — Bill Management



- [x] Save bills locally

- [x] Bill history locally

- [x] View bill

- [x] Reprint bill

- [ ] Search bills

- [ ] Filter bills

- [x] Bill details



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

Remember that all `VITE_*` variables are bundled into client-side code and must not contain secrets.



Do not commit:



```text

.env

.env.local

database credentials

SMTP credentials

session secrets

API secrets

```



Authentication is handled by the backend using server-side sessions with an HttpOnly cookie. The cached user in `localStorage` is used only for the UI and must never be trusted for authorization.



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

git checkout -b feature/offline-storage

```



After completing the feature:



```bash

git add .

git commit -m "feat: add offline POS support"



git checkout dev

git merge feature/offline-storage

```



Stable changes can later be merged into `main`.



Production deployments use the `main` branch.



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