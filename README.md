# Flipearn - Social Profile Marketplace

A secure online marketplace where people can **buy and sell social media accounts** (Instagram, YouTube, TikTok, Twitter, Facebook, and more).

---

## What is Flipearn?

Flipearn is a full-stack web application that connects **sellers** who want to sell their social media accounts with **buyers** who want to purchase them. Think of it like an "OLX" or "Amazon" but specifically for social media profiles.

**Simple Example:**
- A seller lists their Instagram account (10K followers, travel niche) for $2,500
- A buyer finds it, chats with the seller, and purchases it
- The seller gets paid, the buyer gets the account credentials

---

## How It Works

1. **Seller** creates an account and lists their social media profile with details (followers, engagement rate, price, screenshots)
2. **Buyer** browses the marketplace, filters listings, and finds what they want
3. **Buyer** chats with the seller to negotiate or ask questions
4. **Buyer** purchases the account using secure payment (Razorpay)
5. **Admin** verifies the seller's credentials to make sure everything is legit
6. **Buyer** receives the account credentials (username/password) after verification
7. **Seller** receives the payment in their wallet and can withdraw it

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI library for building the interface |
| Vite | Fast build tool and dev server |
| Tailwind CSS v4 | Styling (utility-first CSS) |
| Redux Toolkit | State management (listings, chat, plans) |
| React Router DOM v7 | Page routing and navigation |
| Axios | HTTP requests to backend API |
| Lucide React | Icons (arrows, users, search, etc.) |
| React Hot Toast | Toast notifications (success/error messages) |
| date-fns | Date formatting |
| Razorpay | Payment gateway integration |

### Backend

| Technology | Purpose |
|---|---|
| Express.js v5 | Web server and API routes |
| PostgreSQL | Database to store all data |
| Prisma ORM | Database queries and schema management |
| JWT + bcryptjs | Authentication and password hashing |
| Razorpay | Payment processing |
| Multer + ImageKit | File/image upload handling |
| Nodemailer | Sending emails |

---

## Project Structure

```
fe/
├── Backend/
│   ├── configs/          # Database, email, payment, image upload configs
│   ├── controllers/      # Business logic (auth, listing, chat, admin, plan)
│   ├── middlewares/       # Authentication middleware
│   ├── prisma/           # Database schema and migrations
│   ├── routes/           # API route definitions
│   ├── server.js         # Main server entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/          # Redux store and slices
│   │   │   ├── store.js
│   │   │   └── features/ # listingSlice, chatSlice, planSlice
│   │   ├── assets/       # Images, logos, icons
│   │   ├── components/   # Reusable UI components
│   │   │   ├── admin/    # Admin-specific components
│   │   │   ├── ChatBox.jsx, Navbar.jsx, Hero.jsx, etc.
│   │   ├── configs/      # Axios configuration
│   │   ├── context/      # AuthContext (user login state)
│   │   ├── pages/        # All page components
│   │   │   ├── Admin/    # Admin panel pages
│   │   │   └── (user pages)
│   │   ├── App.jsx       # Main app with all routes
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   └── package.json
│
├── plan.txt
└── README.md
```

---

## Features

### For Buyers

- Browse marketplace with **10+ social media platforms** (Instagram, YouTube, TikTok, etc.)
- **Advanced filters** - by platform, niche, price, followers, verified status
- **Search** listings by title, username, description, niche
- **View listing details** with screenshots, metrics, seller info
- **Chat** with sellers in real-time
- **Purchase** accounts securely via Razorpay
- **View purchased credentials** in My Orders

### For Sellers

- **Create listings** with a step-by-step wizard (4 steps)
- **Upload screenshots** of analytics as proof
- **Manage listings** (edit, delete, activate/deactivate)
- **Submit credentials** for admin verification
- **Track earnings** (earned, withdrawn, available balance)
- **Withdraw earnings** to bank account

### For Admin

- **Dashboard** with total listings, revenue, users stats
- **Verify credentials** submitted by sellers
- **Manage credential changes** after account transfer
- **View all listings** on the platform
- **Monitor transactions**
- **Process withdrawal requests**

---

## Pages & Routes

### User Pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with hero section, latest listings, plans, CTA |
| `/sign-in` | Sign In | User login page |
| `/sign-up` | Sign Up | User registration page |
| `/marketplace` | Marketplace | Browse all listings with filters |
| `/listing/:id` | Listing Details | View full details of a listing |
| `/create-listing` | Create Listing | 4-step wizard to create a new listing |
| `/edit-listing/:id` | Edit Listing | Edit an existing listing |
| `/my-listings` | My Listings | Dashboard showing user's own listings + earnings |
| `/messages` | Messages | List of all chat conversations |
| `/my-orders` | My Orders | List of purchased accounts + credentials |
| `/loading/:nextUrl` | Loading | Loading spinner page |

### Admin Pages

| Route | Page | Description |
|---|---|---|
| `/admin` | Dashboard | Stats overview (listings, revenue, users) |
| `/admin/verify-credentials` | Verify Credentials | Review and verify seller-submitted credentials |
| `/admin/change-credentials` | Change Credentials | Manage credential changes post-purchase |
| `/admin/list-listings` | All Listings | View and manage all listings |
| `/admin/transactions` | Transactions | View all transactions |
| `/admin/withdrawal` | Withdrawals | Process seller withdrawal requests |

---

## Database Models (Simplified)

| Model | What it stores |
|---|---|
| **User** | User account (name, email, password, plan type, earnings) |
| **Listing** | Social media account for sale (platform, followers, price, metrics, images) |
| **Chat** | Conversation between a buyer and seller about a listing |
| **Message** | Individual messages inside a chat |
| **Credential** | Login credentials of a listed account (username, password) |
| **Transaction** | Purchase record (who bought what, how much, when) |
| **Withdrawal** | Seller's withdrawal request (amount, bank details, status) |
| **Plan** | Subscription plan info (Free/Basic/Premium, payment details) |

---

## Subscription Plans

| Plan | Price | Listings | Features |
|---|---|---|---|
| **Free** | ₹0 | 5 | Basic analytics, Community support |
| **Basic** | ₹299/month | 25 | Advanced analytics, Priority support, Featured listing |
| **Premium** | ₹999/month | Unlimited | Premium analytics, 24/7 support, Verified badge, No commission |

---

## API Routes (Backend)

### Auth Routes (`/api/auth`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Create new account |
| POST | `/login` | Login |
| POST | `/logout` | Logout |
| GET | `/me` | Get current user |

### Listing Routes (`/api/listing`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/public` | Get all public listings |
| GET | `/user` | Get logged-in user's listings |
| GET | `/:id` | Get single listing by ID |
| POST | `/` | Create new listing (with images) |
| PUT | `/:id` | Update listing |
| DELETE | `/:id` | Delete listing |
| PUT | `/:id/status` | Toggle active/inactive |
| PUT | `/featured/:id` | Mark as featured |
| GET | `/purchase-account/:id` | Purchase a listing |
| GET | `/user-orders` | Get user's purchased orders |

### Chat Routes (`/api/chat`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create or get existing chat |
| POST | `/send-message` | Send a message |
| GET | `/user` | Get all user's chats |

### Plan Routes (`/api/plan`)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create-order` | Create Razorpay order |
| POST | `/verify-payment` | Verify payment |
| GET | `/current` | Get current plan |
| POST | `/downgrade` | Downgrade to Free |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/isAdmin` | Check if user is admin |
| GET | `/dashboard` | Get dashboard stats |
| GET | `/unverified-listings` | Listings needing credential verification |
| POST | `/verify-credential/:id` | Verify a credential |
| GET | `/withdraw-requests` | Get all withdrawal requests |

---

## How to Run

### Frontend

```bash
cd fe/frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

### Backend

```bash
cd fe/Backend
npm install
npx prisma migrate dev   # Set up database
npm run server           # Start with nodemon
```

Runs on `http://localhost:3000`

### Environment Variables

**Backend `.env`:**

```
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

**Frontend `.env`:**

```
VITE_API_URL=http://localhost:3000
VITE_CURRENCY=₹
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

---

## Future Improvements

- Real-time chat using WebSockets (currently polls every 3 seconds)
- Email notifications for purchase confirmations
- Rating and review system for sellers
- Account valuation tool
- Multi-language support
- Mobile app (React Native)

---

> **Built with care for secure, hassle-free social media account trading.**
