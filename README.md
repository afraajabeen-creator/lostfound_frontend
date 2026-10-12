# 📱 Campus Lost and Found Management System - Frontend

Modern, responsive React single-page application (SPA) built with **Vite**, **React 18**, **React Router v6**, **Axios**, and clean **CSS Design System**.

---

## 🚀 Quick Start (Running on Your Laptop)

### Step 1: Install Dependencies
Open Command Prompt (`cmd`) or terminal inside this folder:
```cmd
npm.cmd install
```
*(or `npm install`)*

### Step 2: Environment Configuration (Optional)
By default, the application connects to the local Spring Boot backend at `http://localhost:8080`.
If you need to customize the backend URL, create a `.env` file from `.env.example`:
```env
VITE_API_URL=http://localhost:8080
```

### Step 3: Run the Development Server
```cmd
npm.cmd run dev
```
*(or `npm run dev`)*

The frontend runs locally on:
👉 **`http://localhost:5173`**

---

## 🎨 Features & Pages Overview

### 1. Authentication
- **Login (`/login`)**: Supports both Students and Administrators. Stores the JWT token in `localStorage` and automatically attaches `Authorization: Bearer <token>` to all Axios HTTP calls.
- **Register (`/register`)**: New students can register with their name, email, password, and phone number.

### 2. Student Portal
- **Feed & Search (`/student`)**: Browse all active listings on campus. Filter in real-time by:
  - Type (LOST or FOUND)
  - Category (Electronics, ID Card, Books, Keys, Clothing, Bags, Others)
  - Location
  - Date Range
  - Keyword search
- **Report Item Modal**: Upload item details with optional photo upload.
- **My Reported Items (`/student/my-items`)**: Manage reports and view system-generated **Possible Matches** with calculated similarity scores!
- **Submit Claim Modal**: Submit ownership proof for any found item.
- **Track Claims (`/student/claims`)**: Track real-time status (`PENDING`, `VERIFIED`, `REJECTED`, `RECOVERED`).
  - 🔐 **Confidential Handover OTP**: Once approved by Admin, the student's unique 6-digit OTP code is revealed on this page with instructions for physical retrieval!
- **Notifications (`/student/notifications`)**: Live alerts for match suggestions, claim verification, and item recovery.

### 3. Administrator Portal
- **Admin Dashboard (`/admin`)**: Overall metrics (Total Items, Open Claims, Recovered Items, Users).
- **Audit Reports (`/admin/items`)**: Oversee all listings and remove inappropriate posts.
- **Claim Verification (`/admin/claims`)**:
  - Review claimant proof details.
  - Approve claim (automatically generates the 6-digit handover OTP).
  - Reject claim (requires mandatory explanation reason).
  - **Verify Pickup OTP**: Enter the student's 6-digit OTP at the campus desk to finalize item recovery.
- **Manage Users (`/admin/users`)**: List all users, view activity, and toggle block/unblock status.

---

## 🧪 Testing Credentials

To test with the pre-seeded accounts:
- **Admin Account**: `admin@campus.com` / `Admin@123`
- **Student Account**: Register any new account on the register page (or use `rahul@campus.com` / `Student@123` if created).
