# AutoTrust Pro - Car Dealer Management System 🚗

A professional inventory management and tax reporting system for used car dealers in Sri Lanka.

![PWA Icon](./public/icon-512.png)

## Features ✨

### 📋 Inventory Management
- **Add Vehicles**: Record distinct details (Make, Model, Year, Reg #, Purchase Price).
- **Track Status**: Manage 'Available' and 'Sold' inventory.
- **Search & Filter**: Real-time filtering by status, make, model, or registration.

### 💰 Financials
- **Expense Tracking**: Add repairs and costs to calculate total vehicle cost.
- **Profit Calculation**: Automaticaly calculates profit/loss upon sale.
- **Dashboard**: View key metrics (Total Inventory Value, Monthly Profit).

### 📱 Modern Experience
- **PWA Support**: Installable on mobile/desktop with offline support.
- **Dark/Light Mode**: Toggle based on preference.
- **CSV Export**: Backup your data to Excel with one click.

## Tech Stack 🛠️

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Supabase) with Prisma ORM
- **UI**: Tailwind CSS, shadcn/ui
- **Testing**: Vitest, Playwright

## Getting Started 🚀

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/autotrust-pro.git
    cd autotrust-pro
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up Environment**:
    Rename `.env.example` to `.env` and add your database URL:
    ```env
    DATABASE_URL="postgresql://user:password@host:port/postgres"
    ```

4.  **Run Database Migrations**:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Start the Server**:
    ```bash
    npm run dev
    ```

## Deployment (Vercel) ☁️

1.  Push code to GitHub.
2.  Import project in Vercel.
3.  Add `DATABASE_URL` environment variable.
4.  Deploy!

## License
Private / Proprietary
