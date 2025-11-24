# Mini Travel Agency Management System

A full-stack web application that allows travel agency staff to manage their clientele and flight bookings.

## Features

- **Authentication**: Staff registration and login with JWT tokens
- **Customer Management**: Create and view customer profiles
- **Flight Bookings**: Create and track flight bookings for customers
- **Analytics**: View total revenue per customer
- **Search**: Filter customers by name or email
- **Responsive Design**: Works seamlessly on mobile and desktop

## Tech Stack

### Frontend
- React.js with TypeScript
- Ant Design UI Library
- React Router for navigation
- Axios for API calls

### Backend
- Node.js with Express.js
- TypeScript
- JWT for authentication
- MySQL database

## Database Schema

```
staff
├── id (INT, PRIMARY KEY, AUTO_INCREMENT)
├── email (VARCHAR(255), UNIQUE)
├── password (VARCHAR(255))
├── full_name (VARCHAR(255))
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

customers
├── id (INT, PRIMARY KEY, AUTO_INCREMENT)
├── first_name (VARCHAR(100))
├── last_name (VARCHAR(100))
├── email (VARCHAR(255), UNIQUE)
├── phone_number (VARCHAR(20))
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

orders
├── id (INT, PRIMARY KEY, AUTO_INCREMENT)
├── customer_id (INT, FOREIGN KEY → customers.id)
├── departure_city (VARCHAR(100))
├── destination_city (VARCHAR(100))
├── travel_date (DATE)
├── flight_price (DECIMAL(10, 2))
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## Quick Start Guide

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd travel-agency-system
```

### Step 2: Database Setup

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Create database and tables
CREATE DATABASE travel_agency;
USE travel_agency;
source backend/database.sql;
exit;
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your local MySQL server
3. Create a new database named `travel_agency`
4. Open and execute the `backend/database.sql` file

### Step 3: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env
```

**Edit the `.env` file with your configuration:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=travel_agency
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
PORT=5000
```

**Important:** Replace `your_mysql_password` with your actual MySQL password!

```bash
# Start the backend server
npm run dev
```

Backend will be running at `http://localhost:5000`

### Step 4: Frontend Setup

Open a **new terminal window** (keep the backend running) and run:

```bash
# Navigate to frontend directory from project root
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit the frontend `.env` file:**
```env
REACT_APP_API_URL=http://localhost:5000
```

```bash
# Start the React development server
npm start
```

Frontend will automatically open at `http://localhost:3000`

### Step 5: Test the Application

1. **Register a new staff account** at `http://localhost:3000/register`
2. **Login** with your credentials
3. **Add customers** from the dashboard
4. **Book flights** for your customers
5. **View analytics** and customer revenue

## Running the Application

### Start Everything (3 Commands)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

**That's it!** Your application is now running.

### Stopping the Application
- Press `Ctrl+C` in each terminal window to stop the servers

## Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Verify tables exist
USE travel_agency;
SHOW TABLES;
```

### Port Already in Use
If port 5000 or 3000 is already in use:
- **Backend:** Change `PORT=5000` in `backend/.env` to another port (e.g., `PORT=5001`)
- **Frontend:** The app will automatically prompt to use a different port

### Module Not Found Errors
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new staff
- `POST /api/auth/login` - Login staff

### Customers
- `GET /api/customers` - Get all customers (supports ?search=query)
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/customer/:customerId` - Get orders by customer
- `GET /api/orders/customer/:customerId/revenue` - Get total revenue for customer
- `POST /api/orders` - Create new order

## Deployment

See `FREE_HOSTING_GUIDE.txt` for detailed deployment instructions.

### Quick Deployment Steps:

1. **Database**: Deploy MySQL on PlanetScale or Aiven
2. **Backend**: Deploy on Render
3. **Frontend**: Deploy on Vercel

## Project Structure

```
travel-agency-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── customerController.ts
│   │   │   └── orderController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── customerRoutes.ts
│   │   │   └── orderRoutes.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── database.sql
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddCustomerModal.tsx
│   │   │   ├── BookFlightModal.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── CustomerDetails.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Features Implemented

### Core Features
- ✅ User authentication (Register/Login)
- ✅ JWT token-based security
- ✅ Customer management (Create/View)
- ✅ Flight booking system
- ✅ Customer-Order relationship (One-to-Many)

### Bonus Features
- ✅ Analytics (Total revenue per customer)
- ✅ Search functionality
- ✅ Responsive design
- ✅ Loading states
- ✅ Form validation
- ✅ Error handling

## License

MIT
