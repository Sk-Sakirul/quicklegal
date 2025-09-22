# ⚖️ QuickLegal - Online Legal Consultation Platform

## 📝 Introduction
QuickLegal is a **full-stack legal consultation platform** designed to connect users with advocates in real-time.  
It offers a **smooth booking and payment experience** for clients and a **powerful admin dashboard** for monitoring statistics, advocates, and popular case trends.

Clients can browse advocates, check availability, and book consultations with secure payments.  
Advocates can manage their bookings, and admins have access to detailed analytics and system control.

---

## 📂 Project Type
**Fullstack (Frontend + Backend)**

---

## 📁 Directory Structure
```
QuickLegal/
├── server/ # Express.js + MongoDB backend with REST APIs
└── client/ # React + Redux Toolkit frontend with booking & admin dashboard
```


---

## 🚀 Features

### 👤 User Features
- 🔍 **Find Advocates** – Browse advocates by specialization.
- 📅 **Book Consultations** – Check availability and schedule appointments.
- 💳 **Secure Payments** – Integrated with **Stripe** for safe online payments.
- 🔐 **Authentication** – Register, login, and manage personal accounts.
- 📜 **Booking History** – View all past and upcoming bookings.

### ⚖️ Advocate Features
- 📊 **Booking Dashboard** – View all client bookings in real-time.
- ✅ **Manage Availability** – Accept or decline client bookings.
- 💼 **Profile Management** – Manage specialization and hourly rate.

### ⚙️ Admin Features
- 📊 **Booking Statistics** – Weekly bookings & total revenue.
- 👨‍⚖️ **Advocate Statistics** – Track advocate performance and confirmed bookings.
- 📈 **Popular Case Types** – Insights into trending legal case categories.
- 👥 **User Management** – View all registered users.
- 🔐 **Role-Based Access** – Separate routes and permissions for **user**, **advocate**, and **admin**.

### 📱 Other Features
- Responsive design (desktop + mobile).
- Role-based route protection.
- Scalable MERN architecture.

---

## 🛠 Tech Stack
**Frontend:** React.js, Redux Toolkit, React Router, Tailwind CSS  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JWT (JSON Web Tokens) + Role Middleware  
**Payments:** Stripe Integration  
**Deployment:**  
- Frontend → Vercel  
- Backend → Render  
- Database → MongoDB Atlas  

---

## ⚡ Installation & Getting Started

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Sk-Sakirul/quicklegal.git

cd quicklegal
```

### 2️⃣ Backend Setup
```
cd server
npm install
npm run dev
```

### 3️⃣ Frontend Setup
```
cd client
npm install
npm run dev
```

## ⚙️ Example .env Files
### 📌 Backend (/server/.env)
```
PORT=3000
MONGO_URI=mongodb+srv://<your_mongo_connection>
JWT_SECRET_KEY=your_jwt_secret_key

STRIPE_SECRET_KEY=your_stripe_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

BASE_URL=http://localhost:5173
```

### 📌 Frontend (/client/.env)
```
VITE_BASE_URL=http://localhost:3000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 🎯 Design Decisions
- MERN Stack for full control over frontend & backend.

- Redux Toolkit for scalable state management.

- Role-based Auth ensures secure separation of users, advocates, and admins.

- Stripe selected for secure payments.

- Scalable Backend with Express + MongoDB to handle bookings, cases, and payments.

- Cloudinary for storing advocate profile images/documents.

## 🚀 Deployment
- Frontend: Vercel (CI/CD with GitHub integration)

- Backend: Render (auto deploy from branch)

- Database: MongoDB Atlas

## ✨ Future Enhancements
📞 Live video consultation integration (WebRTC).

📅 Calendar sync with Google Calendar.

📑 Document sharing between clients & advocates.

📲 Mobile App version with React Native.