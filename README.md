# RARE Wellness v2.3 — *Sanctuary*

> A luxury wellness ecosystem for the high-performance individual. Combining artisanal ritual with skin intelligence.

![RARE Showcase](https://images.unsplash.com/photo-1590439471364-192aa70c0b53?w=1600&q=90)

## 🌙 The Sanctuary Vision
RARE is a ultra-premium wellness platform designed for an immersive, ritualistic shopping and spa-booking experience. Version 2.3 "Sanctuary" introduces a fully localized commerce engine, enhanced skin diagnostics via Mishti, and a production-hardened React architecture.

---

## ✨ Key Features (v2.3 Sanctuary)
- **🌍 Regional Localization**: Fully localized for the Indian market with **INR (₹)** pricing across the entire ecosystem.
- **🎨 Premium Design System**: A warmer, Figma-aligned color palette (Cream, Linen, Gold, Rose, Dark) for an authentic luxury feel.
- **🕒 Precision Booking**: Scheduling grid with 10 AM - 5 PM time slots and mandatory selection validation.
- **📱 Hybrid Authentication**: Dual-method login supporting traditional Email/Password and modern Mobile/OTP (6-digit) verification.
- **💎 VIP Membership**: Integrated tiered membership levels (Classic, VIP, Elite) to drive user engagement.
- **🧬 Mishti AI Integration**: Personalization hooks that match products and services to your unique skin profile.
- **⚡ Performance First**: Zero-regression build pipeline with strict TypeScript enforcement.

---

## 🛠️ Technology Stack
| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript (Strict), Vite 6, React Router 7 |
| **Styling** | Tailwind CSS 4, Framer Motion, Lucide Icons |
| **State** | TanStack Query v5, React Context (Persisted) |
| **Commerce** | Stripe Elements, @stripe/react-stripe-js |
| **Data Viz** | Recharts (Dashboard, Radar analysis) |
| **Components** | Radix UI (Primitives), MUI v6 (Icons), Sonner (Toasts) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18.x or higher
- npm or yarn

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/abhigit-003/RARE-2.3.git

# Navigate to the project root
cd rare-app-2

# Install dependencies
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```
> [!IMPORTANT]
> Change the placeholder key in `src/pages/CheckoutPage.tsx` to use this environment variable for production deployments.

### 4. Development
```bash
npm run dev
```

### 5. Build & Production
```bash
# Perform a strict type-check and build
npm run build

# Preview the production build
npm run preview
```

---

## 📂 Project Structure
- `src/api`: Mock API simulation and data models.
- `src/components/shop`: Commerce-specific UI components.
- `src/components/ui`: Custom premium design system primitives.
- `src/hooks`: Global state hooks for Auth, Cart, and Products.
- `src/pages`: Feature-complete templates for the Sanctuary, Shop, and Dashboard.
- `src/types`: Centralized TypeScript definitions for domain entities.

---

## 🛡️ License
Proprietary — All rights reserved to RARE Wellness Collective.

---

*“Transformation is the only constant.”*
