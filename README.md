# Enterprise Asset Tracking System — Phase 1

## 1. Project Overview
The **Enterprise Asset Tracking System** is a beginner-friendly academic MERN stack project designed for managing enterprise assets, employees, and departments through a single Admin Panel.

In **Phase 1**, the primary goal is to establish the basic project architecture and verify communication between the React frontend, Node.js + Express backend, and MongoDB database.

---

## 2. Technology Stack

### Frontend
- **React.js** (via Vite)
- **JavaScript (ES6+)**
- **Bootstrap 5** & **Bootstrap Icons**
- **Axios** (for API communication)
- **React Router DOM v6** (for routing)

### Backend
- **Node.js** & **Express.js**
- **MongoDB** & **Mongoose** (Object Data Modeling)
- **CORS** (Cross-Origin Resource Sharing)
- **dotenv** (Environment configuration)
- **Nodemon** (Development hot-reloading)

---

## 3. Phase 1 Objectives
1. Create project folder structure.
2. Create React frontend using Vite.
3. Create Node.js + Express backend.
4. Install required dependencies.
5. Create MongoDB connection using Mongoose.
6. Configure environment variables (`.env`).
7. Configure CORS on backend.
8. Configure Axios API client on frontend.
9. Configure React Router on frontend.
10. Create basic setup verification page.
11. Create backend test API (`GET /api/test`).
12. Connect frontend with backend.
13. Verify MongoDB connection (`enterprise_asset_tracking`).
14. Verify frontend production build (`npm run build`).

---

## 4. Folder Structure

```
enterprise-asset-tracking/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   └── SetupPage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 5. MongoDB Setup
Ensure local MongoDB is running on your machine:
- Default URL: `mongodb://127.0.0.1:27017`
- Database Name: `enterprise_asset_tracking`

---

## 6. Backend Setup & Run Instructions

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run development server
npm run dev
```

Expected terminal output:
```
Server running on port 5000
MongoDB Connected Successfully
```

---

## 7. Frontend Setup & Run Instructions

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 8. Test API Endpoint

- **URL:** `http://localhost:5000/api/test`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Enterprise Asset Tracking API is working"
  }
  ```

---

## 9. Expected Result
When opening the frontend page, you should see a clean Bootstrap UI showing:
- **Backend Status:** Connected ✅
- **MongoDB:** Connected ✅
- **API Message:** Enterprise Asset Tracking API is working
