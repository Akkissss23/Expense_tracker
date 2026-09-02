# MERN Expense Tracker

A full-stack expense tracking application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- 🔐 **User Authentication**: JWT-based authentication with bcrypt password hashing
- 💰 **Transaction Management**: Add, view, filter, and delete income/expense transactions
- 📊 **Data Visualization**: Interactive charts showing expense breakdown by category and monthly trends
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS
- 🔄 **State Management**: Redux Toolkit for efficient global state management
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Backend
- **Node.js** & **Express**: RESTful API with MVC architecture
- **MongoDB** & **Mongoose**: Database with schema validation
- **JWT**: Secure authentication tokens
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Modern UI library
- **Redux Toolkit**: State management
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization
- **Axios**: HTTP client with interceptors

## Project Structure

```
expense-tracker/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── middleware/      # JWT authentication
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── api/         # Axios configuration
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   └── store/       # Redux store & slices
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
MONGO_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
```

4. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Transactions
- `GET /api/transactions` - Get all transactions (protected)
- `POST /api/transactions` - Create transaction (protected)
- `PUT /api/transactions/:id` - Update transaction (protected)
- `DELETE /api/transactions/:id` - Delete transaction (protected)
- `GET /api/transactions/analytics/overview` - Get analytics data (protected)

## Key Features Explained

### Authentication Middleware
The `auth.js` middleware verifies JWT tokens and attaches user information to requests, protecting routes from unauthorized access.

### Aggregation Pipeline
The transaction controller uses MongoDB aggregation pipelines to:
- Group expenses by category
- Calculate monthly income vs expenses
- Generate overall statistics

### Redux State Management
- **authSlice**: Manages user authentication state
- **transactionSlice**: Handles transaction data and analytics

### Axios Interceptor
Automatically attaches JWT tokens to all API requests and handles token expiration.

## Development Notes

- The backend uses the MVC pattern for clean code organization
- Protected routes redirect unauthenticated users to login
- Transactions can be filtered by type, category, and date range
- Charts update automatically when transactions are added/deleted

