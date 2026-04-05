# 🚀 Full Stack Project (Next.js + Express + Prisma + Redis)

## 📌 Overview

This is a **full-stack web application** built with a modern tech stack:

- **Frontend**: Next.js + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: MySQL (via Prisma ORM)
- **Caching & Performance**: Redis
- **Authentication**: JWT (Access + Refresh Tokens)

The project is structured into two main folders:

```
/frontend   → Next.js application
/backend    → Express + Prisma API
```

---

# 🛠️ Tech Stack

## 🔹 Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- MySQL
- Redis (for caching & performance)
- JWT Authentication
- bcryptjs (password hashing)
- express-rate-limit (API protection)

## 🔹 Frontend

- Next.js (App Router)
- React
- Tailwind CSS
- Axios (API calls)
- React Hot Toast (notifications)

---

# ⚙️ Backend Setup

## 📁 Step 1: Navigate to backend

```bash
cd backend
```

## 📦 Step 2: Install dependencies

```bash
npm install
```

## 🔐 Step 3: Create `.env` file

Create a `.env` file inside `/backend` and add:

```env
DATABASE_URL="mysql://root:userpassword@localhost:3306/testdb"
PORT=5000
ACCESS_TOKEN_SECRET=your_access_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
REDIS_URL=redis://localhost:6379
```

---

## 🗄️ Step 4: Setup Database (Prisma)

```bash
npx prisma generate
npx prisma migrate dev
```

---

## ▶️ Step 5: Run Backend

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

---

# ⚙️ Frontend Setup

## 📁 Step 1: Navigate to frontend

```bash
cd frontend
```

## 📦 Step 2: Install dependencies

```bash
npm install
```

## ▶️ Step 3: Run Frontend

```bash
npm run dev
```

App will run on:

```
http://localhost:3000
```

---

# 🔐 Authentication Flow

- User registers/login
- Passwords are hashed using **bcrypt**
- JWT tokens are generated:
  - Access Token (short-lived)
  - Refresh Token (long-lived)

- Tokens are verified for protected routes

---

# ⚡ Performance Optimization (Redis)

Redis is used to:

- Cache frequently accessed API responses
- Reduce database load
- Improve response time
- Handle session/token-related data efficiently

### Example Use Cases:

- API response caching
- Rate limiting support
- Token/session storage

---

# 🛡️ Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Rate limiting using express-rate-limit
- Environment variables for secrets
- CORS handling

---

# 📂 Project Structure

```
project-root/
│
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── package.json
│
└── README.md
```

---

# 🧪 Scripts

# 🚀 How to Run Full Project

### 1️⃣ Start Backend

```bash
cd backend
npm run dev
```

### 2️⃣ Start Frontend

```bash
cd frontend
npm run dev
```

---

# 🌟 Features

- Full authentication system (JWT)
- Secure password storage
- API rate limiting
- Redis caching for performance
- Clean scalable architecture
- Modern UI with Tailwind CSS
- Smooth animations with Framer Motion

---

# ⚠️ Notes

- Make sure **MySQL** is running
- Make sure **Redis** is running locally
- Update `.env` values accordingly

# 👨‍💻 Author

MOHIT SINGH RANA
