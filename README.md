# 🍬 Sweet Shop Management System

A full-stack web application for managing a sweet shop's inventory, similar to food delivery platforms like Zomato and Swiggy. Built with modern technologies and following best practices including Test-Driven Development (TDD).

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Setup Instructions](#-setup-instructions)
- [📚 API Documentation](#-api-documentation)
- [📸 Screenshots](#-screenshots)
- [🤖 My AI Usage](#-my-ai-usage)
- [🧪 Testing](#-testing)
- [🔮 Future Enhancements](#-future-enhancements)

---

## 🎯 Project Overview

The Sweet Shop Management System is a comprehensive web application that allows users to browse, search, and purchase Indian sweets, while providing administrators with tools to manage inventory, add new products, and handle restocking operations.

### Key Highlights:
- **Full-stack application** with separate backend and frontend
- **Role-based access control** (User and Admin roles)
- **Real-time inventory management**
- **Responsive design** for all devices
- **Test-Driven Development** with 46+ test cases
- **RESTful API** architecture

---

## ✨ Features

### For Users:
- 👤 User registration and authentication
- 🔍 Browse all available sweets
- 🔎 Search sweets by name, category, and price range
- 🛒 Purchase sweets with real-time inventory updates
- 📱 Responsive design for mobile and desktop

### For Admins:
- ➕ Add new sweets to the inventory
- ✏️ Edit existing sweet details
- 🗑️ Delete sweets from inventory
- 📦 Restock sweets with quantity management
- 👑 All user features plus admin privileges

---

## 🛠️ Technology Stack

### Backend:
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Testing:** Jest + Supertest
- **Architecture:** MVC Pattern

### Frontend:
- **Framework:** React 18
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React

### Development Tools:
- **Version Control:** Git
- **Code Quality:** ESLint, TypeScript strict mode
- **Testing:** Jest for backend unit and integration tests
- **API Testing:** Supertest + MongoDB Memory Server

---

## 📁 Project Structure

```
Sweet Shop Management System/
├── Backend/
│   ├── src/
│   │   ├── __tests__/          # Test files (TDD approach)
│   │   │   ├── models/
│   │   │   ├── auth.test.ts
│   │   │   └── sweet.test.ts
│   │   ├── controllers/        # Business logic
│   │   │   ├── authController.ts
│   │   │   └── sweetController.ts
│   │   ├── db/                 # Database connection
│   │   │   └── connection.ts
│   │   ├── middlewares/        # Custom middleware
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   └── Sweet.ts
│   │   ├── routes/             # API routes
│   │   │   ├── authRoutes.ts
│   │   │   └── sweetRoutes.ts
│   │   ├── utils/              # Helper functions
│   │   │   ├── asyncHandler.ts
│   │   │   ├── jwt.ts
│   │   │   └── response.ts
│   │   ├── app.ts              # Express app setup
│   │   └── index.ts            # Entry point
│   ├── .env                    # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
└── frontend/
    ├── src/
    │   ├── components/         # Reusable components
    │   │   ├── Navbar.tsx
    │   │   ├── ProtectedRoute.tsx
    │   │   ├── SweetCard.tsx
    │   │   └── SweetModal.tsx
    │   ├── context/            # React Context
    │   │   └── AuthContext.tsx
    │   ├── pages/              # Page components
    │   │   ├── Dashboard.tsx
    │   │   ├── Login.tsx
    │   │   └── Register.tsx
    │   ├── services/           # API services
    │   │   ├── api.ts
    │   │   ├── authService.ts
    │   │   └── sweetService.ts
    │   ├── types/              # TypeScript interfaces
    │   │   └── index.ts
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── .env
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## 🚀 Setup Instructions

### Prerequisites:
- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas account)
- npm or yarn package manager
- Git

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd "Sweet Shop Management System"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration:
# PORT=5000
# NODE_ENV=development
# MONGODB_URI=mongodb://localhost:27017/sweet-shop
# JWT_SECRET=your-super-secret-jwt-key
# JWT_EXPIRE=7d

# Run tests (optional but recommended)
npm test

# Start development server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 4. Access the Application

1. Open your browser and go to `http://localhost:5173`
2. Register a new user account
3. Login with your credentials
4. Start exploring sweets!

### 5. Create Admin User (Optional)

To create an admin user, you can either:

**Option A: Via API (Postman/curl)**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin"
  }'
```

**Option B: Directly in MongoDB**
```javascript
// Connect to your MongoDB
use sweet-shop

// Update existing user to admin
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Sweet Management Endpoints

All sweet endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token>
```

#### Get All Sweets
```http
GET /sweets?page=1&limit=10
```

#### Search Sweets
```http
GET /sweets/search?name=Gulab&category=Gulab Jamun&minPrice=100&maxPrice=500
```

#### Add Sweet (Admin Only)
```http
POST /sweets
Content-Type: application/json

{
  "name": "Gulab Jamun",
  "category": "Gulab Jamun",
  "price": 250,
  "quantity": 100,
  "description": "Delicious sweet balls in sugar syrup"
}
```

#### Update Sweet (Protected)
```http
PUT /sweets/:id
Content-Type: application/json

{
  "price": 300,
  "quantity": 150
}
```

#### Delete Sweet (Admin Only)
```http
DELETE /sweets/:id
```

#### Purchase Sweet
```http
POST /sweets/:id/purchase
Content-Type: application/json

{
  "quantity": 5
}
```

#### Restock Sweet (Admin Only)
```http
POST /sweets/:id/restock
Content-Type: application/json

{
  "quantity": 50
}
```

---

## 📸 Screenshots

### Login Page
![Login Page](screenshots/login.png)
*Clean and modern login interface with form validation*

### Register Page
![Register Page](screenshots/register.png)
*User registration with real-time validation*

### Dashboard - User View
![Dashboard User](screenshots/dashboard-user.png)
*Browse and purchase sweets with search and filter functionality*

### Dashboard - Admin View
![Dashboard Admin](screenshots/dashboard-admin.png)
*Admin interface with add, edit, delete, and restock capabilities*

### Sweet Purchase
![Purchase Modal](screenshots/purchase.png)
*Purchase sweets with quantity selection*

### Add/Edit Sweet Modal
![Add Sweet Modal](screenshots/add-sweet.png)
*Modal form for adding or editing sweet details*

### Search & Filter
![Search Results](screenshots/search.png)
*Advanced search by name, category, and price range*

---

## 🤖 My AI Usage

### AI Tools Used

I extensively used **Claude (Anthropic)** throughout the development of this project.

### How I Used AI

#### 1. Project Architecture & Planning (30% of time)
- **Initial Setup:** I used Claude to help design the project structure following MVC architecture. I described my requirements for a sweet shop management system, and Claude suggested:
  - Proper folder organization for both backend and frontend
  - Separation of concerns (models, controllers, routes, middleware)
  - Best practices for TypeScript configuration
  - Test-driven development approach

- **Technology Stack Selection:** I asked Claude to recommend modern tools for building a full-stack application, which led to choosing:
  - Node.js + Express + TypeScript for backend
  - React + Vite + TypeScript for frontend
  - MongoDB for database
  - Tailwind CSS for styling

#### 2. Backend Development (40% of time)
- **TDD Implementation:** Claude helped me understand and implement Test-Driven Development:
  - Writing tests before implementation
  - Setting up Jest with TypeScript
  - Creating comprehensive test suites (46 tests total)
  - Using MongoDB Memory Server for isolated testing

- **Code Generation:** I used Claude to generate boilerplate code for:
  - Mongoose schemas with validation
  - Controller functions with proper error handling
  - Middleware for authentication and authorization
  - JWT token generation and verification
  - API response standardization

- **Problem Solving:** When I encountered errors (like TypeScript strict mode issues or Jest configuration problems), I would copy the error message to Claude and get immediate solutions with explanations.

Example:
```
Error: "unused parameter 'req'" 
Claude suggested: "Prefix with underscore: _req"
This taught me TypeScript conventions!
```

#### 3. Frontend Development (25% of time)
- **Component Design:** Claude helped me create reusable React components:
  - SweetCard component with conditional rendering for user/admin views
  - Modal forms with proper state management
  - Protected routes with role-based access control
  - Responsive navigation bar

- **State Management:** I asked Claude about best practices for managing authentication state, which led to implementing Context API instead of prop drilling.

- **Tailwind CSS:** Claude provided utility class combinations for:
  - Modern card designs with hover effects
  - Form styling with focus states
  - Responsive grid layouts
  - Loading spinners and transitions

#### 4. Debugging & Optimization (5% of time)
- **Error Resolution:** Whenever tests failed or the app crashed, I would share the error with Claude to get targeted solutions.
- **Code Review:** I asked Claude to review my code for potential improvements, security issues, or best practice violations.

### Specific Examples

**Example 1: API Interceptor Setup**
```
Me: "How do I automatically add JWT tokens to all API requests?"
Claude: Suggested using Axios interceptors and provided the exact code
```

**Example 2: Test Coverage**
```
Me: "I need comprehensive tests for the auth system"
Claude: Generated 10 test cases covering registration, login, validation errors, etc.
```

**Example 3: TypeScript Types**
```
Me: "I'm getting type errors with my API responses"
Claude: Created proper TypeScript interfaces for all API responses and data models
```

### Reflection on AI Impact

#### Positive Impacts:
1. **Accelerated Development:** What might have taken 2-3 weeks took only a few days because Claude helped me avoid common pitfalls and provided working solutions quickly.

2. **Learning Enhancement:** Instead of just copying code, Claude explained WHY things work a certain way. For example:
   - Why use bcrypt for password hashing
   - Why JWT tokens are better than sessions for APIs
   - How middleware order matters in Express
   - Benefits of TDD approach

3. **Code Quality:** Claude consistently suggested best practices:
   - Proper error handling with try-catch
   - Input validation
   - Security measures (helmet, rate limiting, CORS)
   - Clean code organization

4. **Confidence Building:** Having an AI assistant made me more confident to try new technologies and patterns I hadn't used before (like TDD and TypeScript strict mode).

#### Challenges & Limitations:
1. **Context Understanding:** Sometimes Claude would suggest solutions that didn't fit my exact project structure, requiring me to adapt the code.

2. **Dependency Versions:** Occasionally, Claude would suggest packages or syntax that were outdated or deprecated, requiring me to verify against official documentation.

3. **Over-reliance Risk:** I had to consciously ensure I understood the code Claude generated rather than blindly copying it.

#### Key Learnings:
- **AI is a powerful tool, not a replacement:** I still needed to understand the architecture, make design decisions, and debug issues.
- **Asking the right questions matters:** The quality of AI responses depended on how well I described my problems.
- **Iterative process:** I would often ask Claude to refine or improve initial solutions.
- **Verification is crucial:** I always tested and reviewed AI-generated code before integrating it.

### Workflow Integration

My typical development cycle with AI:
1. **Plan:** Discuss feature requirements with Claude
2. **Generate:** Get initial code structure
3. **Understand:** Read through and comprehend the code
4. **Customize:** Modify to fit my specific needs
5. **Test:** Run tests and verify functionality
6. **Refine:** Ask Claude for improvements if needed
7. **Document:** Use Claude to help write clear comments and documentation

### Conclusion

Using AI (Claude) transformed my development experience from struggling with setup and syntax to focusing on understanding concepts and building features. It served as a mentor, code reviewer, and debugging partner all in one. However, the project's success ultimately depended on my ability to guide the AI, understand its suggestions, and make informed decisions about implementation.

**Personal Growth:** This project taught me that AI is most effective when used as a collaborative tool that enhances human capability rather than replaces it. I emerged with both a working application AND deep understanding of the technologies involved.

---

## 🧪 Testing

### Backend Tests

The backend includes comprehensive test coverage using Jest and Supertest:

```bash
cd Backend
npm test
```

**Test Statistics:**
- Total Test Suites: 3
- Total Tests: 46
- Coverage: ~50-60% (focused on critical paths)

**Test Categories:**
1. **User Model Tests (12 tests)**
   - User creation and validation
   - Password hashing
   - Role assignment
   - Email validation

2. **Authentication API Tests (10 tests)**
   - User registration (success and failure cases)
   - User login (valid and invalid credentials)
   - Token generation
   - Error handling

3. **Sweet Management Tests (24 tests)**
   - CRUD operations
   - Search and filter functionality
   - Purchase operations
   - Restock operations (admin only)
   - Authorization checks

### Frontend Testing

Currently, the frontend uses manual testing. Future enhancement would include:
- Jest + React Testing Library
- Component unit tests
- Integration tests
- E2E tests with Cypress

---

## 🔮 Future Enhancements

### Short-term:
- [ ] Add image upload functionality for sweets
- [ ] Implement user profile management
- [ ] Add order history tracking
- [ ] Email notifications for purchases
- [ ] Password reset functionality

### Medium-term:
- [ ] Payment gateway integration
- [ ] Cart functionality for multiple purchases
- [ ] Customer reviews and ratings
- [ ] Admin dashboard with analytics
- [ ] Export reports (CSV, PDF)

### Long-term:
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced inventory forecasting
- [ ] Integration with delivery services
- [ ] Real-time notifications (WebSocket)

---

## 👨‍💻 Developer

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 📄 License

This project is created for educational purposes as part of a college assignment.

---

## 🙏 Acknowledgments

- **Claude (Anthropic)** - AI assistant for development guidance
- **MongoDB** - Database solution
- **Express.js** - Backend framework
- **React** - Frontend library
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library

---

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Setup Instructions](#setup-instructions)
2. Review the [API Documentation](#api-documentation)
3. Open an issue on GitHub
4. Contact the developer

---

**Made with ❤️ and AI assistance**
