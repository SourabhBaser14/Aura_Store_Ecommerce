# 🛍️ AuraStore — Transactional E-Commerce Engine

A production-ready full-stack e-commerce web application featuring ACID-compliant inventory transactions, PostgreSQL row-level locking, and an editorial Scandinavian luxury UI.

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, Lucide Icons, Vanilla CSS Design System
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (with `pg` connection pool)
- **Tooling:** Postman, Vite, Git

## ⚡ Key Features
- **ACID Transaction Pipeline:** Implements `SELECT ... FOR UPDATE` row-level locks on product stock to eliminate race conditions and double-spending during concurrent checkout requests.
- **Dynamic Relational Schemas:** Relational tables with foreign key constraints across users, products, orders, and order items.
- **Centralized Error Boundaries:** Custom Express error-handling middleware preventing unhandled promise rejections and returning standardized API payloads.
- **Interactive UI:** Smooth sliding drawer cart, responsive grid layouts, and live mock payment gateway authorization.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v14+)

### 1. Database Setup
Run the SQL migration script against your local or hosted PostgreSQL instance:
```sql
psql -U postgres -d postgres -f server/db/schema.sql
```

### 2. Environment Variables
Create a `server/.env` file:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecommerce
```

### 3. Running Locally
```bash
# Terminal 1: Backend
cd server
npm install
npm run dev

# Terminal 2: Frontend
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
