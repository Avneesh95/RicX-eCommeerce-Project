# RicX — Multi-Seller E-Commerce Platform

RicX is a full-stack MERN e-commerce platform with a multi-seller marketplace model (à la Amazon/Flipkart), role-based dashboards for admins, super admins, and sellers, and both online (Razorpay) and Cash-on-Delivery checkout.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [One-Time Setup Scripts](#one-time-setup-scripts)
- [API Overview](#api-overview)
- [Order & Payment Flow](#order--payment-flow)
- [Known Limitations](#known-limitations)

---

## Features

**Storefront**
- Product browsing with search, category filters, price range, and minimum-rating filters
- Product recommendations ("You May Also Like")
- Product reviews & ratings
- Wishlist and cart
- Dark mode
- Fully responsive layout

**Accounts & Auth**
- Email/password login with OTP email verification (via EmailJS)
- JWT-based authentication
- User profile management with avatar upload and multiple saved addresses

**Marketplace (Sellers)**
- Sellers apply → admin/super admin approves or rejects
- Seller dashboard: manage own products, bulk upload, orders, earnings, store profile
- "Sold by [Seller]" attribution on every product, linking to a public seller storefront page
- Seller ratings & reviews (separate from product reviews)
- Per-seller commission tracking and an earnings ledger (gross sales, delivered vs. pending, commission taken, net earnings)
- Orders automatically split by seller — each seller only sees and manages their own items, even within an order that spans multiple sellers

**Checkout & Payments**
- Pay online via Razorpay, or Cash on Delivery
- Abandoned Razorpay checkouts automatically restore stock and clean up the unpaid order
- Order tracking with a visual status timeline
- Invoice download (PDF)
- Order cancellation (before shipping)

**Admin**
- Dashboard with revenue/order/user stats and quick actions
- Product management (create, edit, delete, bulk upload via Excel with a downloadable template)
- Order management
- User management
- Coupon management, with a "hero coupon" spotlight
- Seller application approvals (approve / reject / suspend)
- Sales analytics: revenue and order trends, category breakdown, low-stock alerts

**Super Admin**
- Everything Admin can do, plus:
- Hero banner / promotional offer management (controls the homepage poster)
- Full seller and admin oversight

---

## Tech Stack

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Framer Motion (animations)
- Lucide React (icons)
- Recharts (analytics charts)
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`) for auth
- `bcrypt` / `bcryptjs` for password hashing
- Cloudinary for image uploads
- EmailJS (REST API) for OTP and transactional email
- Razorpay for online payments
- Multer for file uploads
- `xlsx` for bulk product upload/sample template generation
- PDFKit for invoice generation
- Helmet + CORS for security

---

## Role-Based Access Control (RBAC)

RicX has **four roles**, stored on the `User` model's `role` field:

```
"user" | "seller" | "admin" | "superAdmin"
```

Every new signup defaults to `user`. Roles change through specific flows only — there is no self-service way to become an admin or super admin.

### Role Summary

| Role | How you get it | What you can do |
|---|---|---|
| **user** | Default on signup | Browse, buy, review products, wishlist, manage own profile/addresses, apply to become a seller |
| **seller** | User applies → admin/super admin approves | Everything a `user` can do, **plus**: manage own products (add/edit/delete/bulk upload), view & fulfill own orders (per-item status), view own earnings, manage store profile, respond to reviews via storefront visibility |
| **admin** | Set manually in the database (no self-service or UI path) | Manage all products/orders/users/coupons, approve/reject/suspend seller applications, view analytics |
| **superAdmin** | Set manually in the database | Everything `admin` can do, **plus**: manage the homepage hero banner/offers, full platform oversight |

### Enforcement

RBAC is enforced **server-side** via Express middleware (`backend/src/middleware/authMiddleware.js`), not just hidden in the UI:

| Middleware | Allows |
|---|---|
| `isAuthenticated` | Any logged-in user (any role) |
| `isAdmin` | `admin` or `superAdmin` |
| `isSuperAdmin` | `superAdmin` only |
| `isSeller` | `seller` only |
| `isAdminOrSeller` | `admin`, `superAdmin`, or `seller` |

Ownership is checked in addition to role where relevant — for example, a `seller` can only edit, delete, or bulk-upload **their own** products, and can only view/update items **they sold** within an order, even if that order also contains another seller's items. This is enforced in the controller logic (`productController.js`, `sellerOrderController.js`), not just by role.

### Frontend Route Guarding

- `/admin/*` — requires `admin` or `superAdmin` (checked in `AdminLayout.jsx`); certain pages inside (Hero Banner) additionally self-check for `superAdmin` and redirect otherwise
- `/seller/*` — requires `seller` (checked in `SellerLayout.jsx`); unapproved users are redirected to `/become-seller`
- Public routes (storefront, product pages, seller public profiles) require no role

Frontend guards are a UX convenience only — the real enforcement is the backend middleware above, since a determined user could otherwise call the API directly.

---

## Project Structure

```
NEW PRO/
├── backend/
│   ├── server.js                 # Express app entry point, route mounting, CORS, DB connect
│   ├── scripts/
│   │   └── migrateDefaultSeller.js   # One-time: assigns pre-marketplace products to a platform seller
│   └── src/
│       ├── config/                # cloudinary, db, mailServices (EmailJS), razorpay
│       ├── model/                 # Mongoose schemas
│       ├── middleware/            # authMiddleware (RBAC), upload (multer)
│       ├── controllers/           # Business logic per resource
│       └── routes/                # Express routers per resource
│
└── frontend/
    ├── vite.config.js
    └── src/
        ├── api/                   # Axios wrapper + one file per resource
        ├── components/            # Shared storefront components
        ├── context/               # ThemeContext (dark mode)
        ├── pages/                 # Storefront + account pages
        ├── admin/                 # Admin & super admin dashboard (own layout/sidebar/navbar)
        └── seller/                # Seller dashboard (own layout/sidebar/navbar)
```

---

## Getting Started

### Prerequisites
- Node.js 18+ (native `fetch` is used for EmailJS calls)
- A MongoDB database (Atlas or local)
- Accounts/API keys for: Cloudinary, EmailJS, Razorpay

### Installation

```bash
# Backend
cd backend
npm install
cp .env.example .env   # then fill in real values, see below

# Frontend
cd ../frontend
npm install
```

### Running locally

```bash
# Terminal 1 — backend (default port 4000)
cd backend
npm run dev

# Terminal 2 — frontend (default port 5173)
cd frontend
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# EmailJS — requires "Allow EmailJS API for non-browser applications"
# enabled in EmailJS Dashboard → Account → Security
EMAILJS_SERVICE_ID=your_emailjs_service_id
EMAILJS_TEMPLATE_ID=your_emailjs_template_id
EMAILJS_PUBLIC_KEY=your_emailjs_public_key
EMAILJS_PRIVATE_KEY=your_emailjs_private_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Your EmailJS template needs three variables: `{{to_email}}`, `{{subject}}`, `{{message}}` (or update `backend/src/config/mailServices.js` to match your own template's variable names).

### Frontend (`frontend/.env`) — optional

```env
# Only needed if your backend isn't on the default localhost:4000
VITE_API_URL=http://localhost:4000/api
```

---

## One-Time Setup Scripts

### Assign existing products to a platform seller

Since every product now belongs to a seller, run this once after first deploying the marketplace feature:

```bash
cd backend
node scripts/migrateDefaultSeller.js
```

This creates a "RicX Official" platform seller (0% commission) and assigns any product with no `seller` to it. Safe to re-run.

### Creating your first admin / super admin

There's no signup flow for admin or super admin — promote a user manually in MongoDB:

```js
db.users.updateOne(
  { email: "you@example.com" },
  { $set: { role: "superAdmin" } } // or "admin"
)
```

---

## API Overview

All routes are mounted under `/api`:

| Base path | Covers |
|---|---|
| `/api/auth` | Signup, login, OTP verification, password reset |
| `/api/products` | Browsing, filtering, single product, related products, create/update/delete (admin & seller), bulk upload + sample template, seller's own product list |
| `/api/cart` | Cart CRUD |
| `/api/wishlist` | Wishlist CRUD |
| `/api/order` | Cart checkout, buy-now, order history, order details, cancel |
| `/api/payment` | Razorpay order creation, payment verification, abandoned-checkout cancellation |
| `/api/invoice` | PDF invoice generation/download |
| `/api/reviews` | Product reviews & ratings |
| `/api/coupon` | Coupon CRUD, hero coupon spotlight |
| `/api/offer` | Hero banner / promotional offers (super admin managed) |
| `/api/seller` | Seller application, approval workflow, seller's own orders/earnings/profile, public seller storefront + reviews |
| `/api/admin` | Admin dashboard stats, user management, analytics |
| `/api/super-admin` | Super admin dashboard, admin/user oversight |

---

## Order & Payment Flow

1. **Cart or Buy Now** → customer fills shipping details and picks a payment method
2. **Cash on Delivery** → order is created with `status: "confirmed"`, `paymentMethod: "COD"`; nothing further needed until delivery
3. **Razorpay** → order is created with `status: "pending"`; a Razorpay order is created and the checkout modal opens
   - **Success** → payment signature is verified server-side, order becomes `paymentStatus: "paid"`, `status: "confirmed"`
   - **Popup closed / abandoned** → the frontend calls the cancel endpoint, which restores product stock and deletes the unpaid order
4. Each order item carries its own `seller` and `itemStatus` — sellers update only their own items' fulfillment status; if every item in an order reaches the same status, the order's top-level status reflects that automatically
5. Orders can be cancelled by the customer any time before `shipped`/`delivered`, regardless of payment method

---

## Known Limitations

- **Seller payouts are a ledger, not real transfers.** The Earnings page shows gross sales, commission, and net earnings, but no money actually moves to sellers automatically — that would require Razorpay Route (or similar) marketplace payment splitting, which isn't implemented.
- **Category filters sample from the first 100 products** rather than querying a dedicated categories list — fine for small-to-medium catalogs, but worth revisiting at scale.
- **Bulk upload duplicate-checking** is scoped per seller (two sellers can list a product with the same name), but within one seller's own catalog, re-uploading a name that already exists will skip it rather than update it.
#   R i c X - e C o m m e e r c e - P r o j e c t  
 