# 📘 PageTurner - Technical Handover Documentation

## 🛠️ Technology Stack
This project is a **MERN Stack** application (MongoDB, Express, React, Node.js) deployed on **Vercel**.

### **Frontend (Client-Side)**
*   **Path**: `/Frontend/web-project/frontend`
*   **Framework**: **React.js** (v18)
*   **Routing**: `react-router-dom` - Handles navigation without page reloads.
*   **Notifications**: `react-hot-toast` - The colorful popups (toasts) you see on success/error.
*   **State Management**: **React Context API** (`src/context/`) - Manages global data like User Login (`AuthContext`), Cart (`CartContext`), and Orders (`OrderContext`).
*   **Icons**: `react-icons` (FontAwesome & Material Design).

### **Backend (Server-Side)**
*   **Path**: `/Backend/PageTurner-Backend`
*   **Runtime**: **Node.js** with **Express.js** framework.
*   **Database**: **MongoDB Atlas** (Cloud Database). Mongoose is used as the ODM (Object Data Modeler).
*   **Authentication**:
    *   **JWT (JSON Web Tokens)**: For secure, stateless sessions.
    *   **Passport.js**: For Google OAuth handling.
    *   **BcryptJS**: For hashing passwords securely.
*   **Security**: `helmet` (Http headers), `cors` (Allow frontend access), `express-rate-limit` (Prevent spam).
*   **File Handling**: `multer` + Base64 Encoding (Custom implemented for Vercel persistence).

---

## 🔐 Deep Dive: How Authentication Works (JWT)

**JWT (JSON Web Token)** is the "ID Card" of this website.

1.  **Login**: When you log in, the server checks your email/password.
2.  **Token Generation**: If correct, the server creates a **Token**. This is a long encrypted string containing your User ID and Role (Admin/Customer).
    *   *Code Location*: `Backend/routes/authRoute.js` -> `generateToken` function.
3.  **Storage**: The Frontend receives this token and saves it in the browser's **Local Storage**.
    *   *Inspect It*: Right-click > Inspect > Application > Local Storage. You'll see a key named `user`.
4.  **Access (Authorization)**: Every time you click "Checkout" or "Admin Dashboard", the Frontend sends this Token in the **Header** of the request (`Authorization: Bearer <token>`).
5.  **Verification**: The Backend middleware (`Backend/middleware/auth.js`) intercepts the request, decodes the token, and says "Pass" or "Block".

---

## 📂 Code Map: Where is everything?

| Feature | Code Location | File Description |
| :--- | :--- | :--- |
| **Admin Dashboard** | `Frontend/.../pages/AdminDashboard.js` | The massive file controlling the Admin UI, Edit Books, Add Books, Orders side panel. |
| **Login Logic** | `Frontend/.../pages/Login.js` | The login form. |
| **Google Auth** | `Backend/config/passport.js` | Where Google talks to our server. |
| **Database Models** | `Backend/models/` | Defines what a "Book" (`book.js`) or "User" (`user.js`) looks like. |
| **API Keys** | `Backend/.env` | **Secret!** Holds Mongo URI, JWT Secret, Google Credentials. |
| **Styles/Colors** | `Frontend/.../index.css` | Global styles (though much styling is inline in JS files). |
| **Checkout Logic** | `Frontend/.../pages/Checkout.js` | Handles address form and order placement. |

---

## ⚙️ How to Change Things (Configuration)

### 1. **Changing Admin Credentials**
The Admin account isn't hardcoded in a simple text file for security. It's in the Database.
*   **Method A (The "Hack" - One time)**:
    In `Backend/routes/authRoute.js`, there is a route `/setup-admin`. You can uncomment or use it to create a new admin if the database is wiped.
*   **Method B (Database - Recommended)**:
    Log in to **MongoDB Atlas**. Go to `users` collection. Find your user row. Change the `role` field from `"customer"` to `"admin"`.

### 2. **Understanding Bcrypt (Passwords)**
If you look at the database, passwords look like `$2a$10$XyZ...`. This is **Bcrypt**.
*   **Can I read them?** No. It is a "One-Way Hash".
*   **How does login work?** When you type `password123`, the server hashes it instantly and checks if the *new hash* matches the *stored hash*.
*   *Code Location*: `Backend/routes/authRoute.js` inside `/login` route (`bcrypt.compare`).

### 3. **Modifying the "About" / Text**
*   **Home Page Text**: Go to `Frontend/src/pages/Home.js`. Search for the text you want to change (e.g., "Welcome to PageTurner") and edit it inside the `return (...)` block.

---

## 🕵️‍♂️ How to Use "Inspect Element" (Debugging)

Since you are the "Final Boss" now, you need to know how to see under the hood.

1.  **Right-Click > Inspect** anywhere on the page.
2.  **Console Tab**: Shows errors in Red. If a button doesn't work, look here first.
3.  **Network Tab**:
    *   Click "Fetch/XHR" filter.
    *   Refresh or click a button. You will see requests (e.g., `login`, `books`).
    *   Click a request to see the **Payload** (what you sent) and **Response** (what the server said). *This was how we debugged the "Ghost Book" issue!*
4.  **Application Tab**: Look at **Local Storage**. If `user` is missing here, you aren't logged in.

---

## 🚀 Deployment Info
*   **Frontend & Backend Combined**: We serve both from Vercel.
*   **Vercel Config**: `vercel.json` tells Vercel to route API requests to the backend code and everything else to React.
*   **Image Handling**: We upgraded to **Base64 Storage**. Images are stored as text code inside MongoDB. This bypasses Vercel's "Read-Only" file system limitation.

**Repository Branch**: `main` (This is the production branch).
