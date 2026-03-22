💰 SmartSpend – AI-Powered Money Manager
MoneyManager is a full-stack personal finance management application built with React + Spring Boot + MySQL. Track expenses, manage budgets, generate reports, and more with a professional UI.

Live Link: 

✨ Features
Feature

Status

✅ Transaction Management

CRUD + Advanced Filters (Date, Category, Amount, Type)

✅ Smart Budget System

Monthly limits, auto-spent calculation, alerts

✅ Professional Dashboard

Income/Expense charts, balance overview

✅ Reports & Analytics

Monthly reports, category breakdown, pie charts

✅ Admin Panel

User management (Admin only)

✅ Responsive Design

Fixed navbar/sidebar, mobile-friendly

✅ JWT Authentication

Secure login/register

✅ **Role-Based Access

User/Admin roles

🏗️ Tech Stack
Frontend:
├── React 18 + React Router
├── Bootstrap 5
├── Recharts (Charts)
├── Axios (API calls)

Backend:
├── Spring Boot 3.0
├── Spring Security (JWT)
├── Spring Data JPA
├── MySQL 8.0
└── Maven

Database:
└── MySQL (transactions, budgets, users)

Screenshots :
Register/login : <img width="720" height="752" alt="image" src="https://github.com/user-attachments/assets/9057d8eb-0fe9-4365-af33-9e506bcc78cc" />



🚀 Quick Start
Prerequisites
Java 17+
MySQL 8.0+
Maven 3.8+

Backend Setup
# Clone project
git clone <your-repo-url>
cd backend

# Configure database (application.properties)
spring.datasource.url=jdbc:mysql://localhost:3307/smartspend
spring.datasource.username=root
spring.datasource.password=yourpassword

# Run backend
mvn clean install
mvn spring-boot:run

Frontend Setup
cd frontend

# Install dependencies
npm install

# Run frontend
npm start

App will be available at:

Backend: http://localhost:8080
Frontend: http://localhost:3000

 Database Schema
 -- Users Table
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('USER', 'ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE transactions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type ENUM('INCOME', 'EXPENSE') NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  user_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Budgets Table
CREATE TABLE budgets (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  limit_amount DECIMAL(10,2) NOT NULL,
  spent_amount DECIMAL(10,2) DEFAULT 0,
  month INT NOT NULL,
  year INT NOT NULL,
  user_id BIGINT NOT NULL,
  alert_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

API Endpoints
| Method | Endpoint                    | Description        | Auth     |
| ------ | --------------------------- | ------------------ | -------- |
| POST   | /api/auth/login             | User login         | No       |
| POST   | /api/auth/register          | User registration  | No      |
| POST   | /api/transactions           | Create transaction | yes     |
| GET    | /api/transactions           | Get transactions   | yes     |
| GET    | /api/transactions/dashboard | Dashboard stats    | yes     |
| POST   | /api/budgets                | Create budget      | yes     |
| GET    | /api/budgets                | Get budgets        | yes     |
| GET    | /api/budgets/alerts         | Budget alerts      | yes     |
| GET    | /api/admin/users            | Get all users      | 🔒 Admin |

📂 Project Structure
MoneyManager/
├── backend/
│   ├── src/main/java/com/khushi/
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── TransactionController.java
│   │   │   ├── BudgetController.java
│   │   │   └── AdminController.java
│   │   ├── service/
│   │   ├── repositories/
│   │   └── entity/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TransactionFilters.jsx
│   │   │   └── Charts.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── Reports.jsx
│   │   │   └── AdminPanel.jsx
│   │   └── services/
│   └── package.json
└── README.md

 Environment Variables
Backend (application.properties)
spring.datasource.url=jdbc:mysql://localhost:3307/smartspend
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
jwt.secret=your-jwt-secret-key
server.port=8080

Frontend (.env)
REACT_APP_API_URL=http://localhost:8080/api

📈 Demo Credentials
Email: admin@example.com
Password: admin123
Role: ADMIN

Email: user@example.com
Password: user123
Role: USER

 Contributing
Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

 Authors
Your Name - Full Stack Developer
Contributors - Open Source Community

 Acknowledgments
Spring Boot - Backend framework
React - Frontend framework
Bootstrap - UI components
Recharts - Beautiful charts
MySQL - Reliable database

⭐ Star this repo if it helped you! ⭐


















