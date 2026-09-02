# MERN Expense Tracker - Folder Structure

```
expense-tracker/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection configuration
│   │
│   ├── controllers/
│   │   ├── authController.js        # Authentication logic (register, login)
│   │   └── transactionController.js # Transaction CRUD + Aggregation
│   │
│   ├── middleware/
│   │   └── auth.js                  # JWT verification middleware
│   │
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Transaction.js           # Transaction schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js            # Auth endpoints
│   │   └── transactionRoutes.js     # Transaction endpoints
│   │
│   ├── .env                         # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                    # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    │
    ├── src/
    │   ├── api/
    │   │   └── axios.js             # Axios instance with interceptor
    │   │
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx   # Route protection wrapper
    │   │   ├── TransactionForm.jsx  # Add transaction form
    │   │   ├── TransactionList.jsx  # Filterable transaction list
    │   │   ├── Charts/
    │   │   │   ├── PieChart.jsx     # Category breakdown
    │   │   │   └── BarChart.jsx     # Monthly spending
    │   │   └── Navbar.jsx           # Navigation bar
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx            # Login page
    │   │   ├── Register.jsx         # Registration page
    │   │   └── Dashboard.jsx        # Main dashboard
    │   │
    │   ├── store/
    │   │   ├── store.js             # Redux store configuration
    │   │   └── slices/
    │   │       ├── authSlice.js     # Auth state management
    │   │       └── transactionSlice.js # Transaction state
    │   │
    │   ├── App.jsx                  # Main app component
    │   ├── main.jsx                 # Entry point
    │   └── index.css                # Tailwind directives
    │
    ├── .gitignore
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Key Architecture Decisions

### Backend (MVC Pattern)
- **Models**: Mongoose schemas for data structure
- **Views**: JSON responses (RESTful API)
- **Controllers**: Business logic for auth and transactions
- **Middleware**: JWT authentication guard
- **Routes**: API endpoint definitions

### Frontend (Component-Based)
- **State Management**: Redux Toolkit for global state
- **Routing**: React Router with protected routes
- **Styling**: Tailwind CSS for responsive design
- **Data Visualization**: Recharts for analytics
- **API Layer**: Axios with interceptors for auth headers
