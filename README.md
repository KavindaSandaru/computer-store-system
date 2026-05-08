# Computer Store System

A full-stack e-commerce web application built using Next.js, Express.js, MongoDB, Docker, and Nginx.

This project demonstrates modern full-stack development and DevOps practices including:

* Frontend and backend separation
* REST API architecture
* MongoDB database integration
* JWT authentication
* Role-based authorization
* Shopping cart and checkout system
* Docker containerization
* Docker Compose orchestration
* Nginx reverse proxy setup

---

# Features

## User Features

* User registration
* User login
* JWT authentication
* Product browsing
* Product details page
* Shopping cart
* Checkout system
* Order history dashboard

---

## Admin Features

* Create products
* Read products
* Update products
* Delete products
* Protected admin APIs
* Role-based access control

---

## DevOps Features

* Dockerized frontend
* Dockerized backend
* Docker Compose multi-container setup
* MongoDB container
* Nginx reverse proxy
* Environment variable support

---

# Tech Stack

| Layer            | Technology     |
| ---------------- | -------------- |
| Frontend         | Next.js        |
| Styling          | Tailwind CSS   |
| Backend          | Express.js     |
| Database         | MongoDB        |
| ORM              | Mongoose       |
| Authentication   | JWT            |
| Password Hashing | bcryptjs       |
| Containers       | Docker         |
| Orchestration    | Docker Compose |
| Reverse Proxy    | Nginx          |

---

# Project Structure

```text
computer-store-system/
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
│
├── nginx/
│   └── default.conf
│
├── docker-compose.yml
├── .env
└── .gitignore
```

---

# Prerequisites

Before running this project, install:

## Required Software

* Node.js 20+
* npm
* Docker
* Docker Compose
* Git

---

# Installation Guide

## 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/computer-store-system.git
```

Enter project folder:

```bash
cd computer-store-system
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/computer_store?retryWrites=true&w=majority

JWT_SECRET=myverysecretkey
```

---

# Running Project Without Docker

## Backend Setup

Enter backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

## Frontend Setup

Open another terminal.

Enter frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Running Project With Docker

## Build and Start Containers

From project root:

```bash
docker compose up --build
```

---

## Stop Containers

```bash
docker compose down
```

---

## View Running Containers

```bash
docker ps
```

---

# Docker Architecture

```text
Browser
   ↓
Nginx Reverse Proxy
   ↓
Frontend Container
   ↓
Backend Container
   ↓
MongoDB
```

---

# Nginx Reverse Proxy

Nginx handles:

* frontend routing
* backend API routing
* centralized traffic handling

Example:

| Route | Destination |
| ----- | ----------- |
| /     | Frontend    |
| /api  | Backend     |

---

# Authentication System

## Register

Endpoint:

```text
POST /api/auth/register
```

Registers new users.

Passwords are securely hashed using bcrypt.

---

## Login

Endpoint:

```text
POST /api/auth/login
```

Returns JWT token.

---

# Protected Routes

Admin routes require:

```text
Authorization: Bearer TOKEN
```

Only admin users can:

* create products
* update products
* delete products

---

# Shopping Cart

Cart system uses:

* React Context API
* localStorage persistence

Features:

* add products
* remove products
* quantity management
* persistent cart after refresh

---

# Order System

Authenticated users can:

* place orders
* view order history
* view purchased items

Orders are stored in MongoDB.

---

# MongoDB Collections

The system automatically creates:

| Collection | Purpose         |
| ---------- | --------------- |
| users      | User accounts   |
| products   | Store products  |
| orders     | Customer orders |

---

# API Routes

## Product Routes

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| GET    | /api/products     | Get all products   |
| GET    | /api/products/:id | Get single product |
| POST   | /api/products     | Create product     |
| PUT    | /api/products/:id | Update product     |
| DELETE | /api/products/:id | Delete product     |

---

## Authentication Routes

| Method | Endpoint           | Description   |
| ------ | ------------------ | ------------- |
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login user    |

---

## Order Routes

| Method | Endpoint              | Description             |
| ------ | --------------------- | ----------------------- |
| POST   | /api/orders           | Create order            |
| GET    | /api/orders/my-orders | Get current user orders |

---

# Common Errors and Fixes

## 1. MongoDB Connection Error

### Error

```text
MongoServerError: bad auth
```

### Cause

Wrong MongoDB username/password.

### Fix

Check:

```env
MONGODB_URI
```

inside `.env`.

---

## 2. MongoDB Network Access Error

### Error

```text
IP address not whitelisted
```

### Fix

In MongoDB Atlas:

```text
Network Access → Add IP → 0.0.0.0/0
```

---

## 3. Port Already In Use

### Error

```text
EADDRINUSE
```

### Cause

Another process already using port.

### Fix

Stop running process.

Example:

```bash
sudo lsof -i :3000
```

or:

```bash
docker compose down
```

---

## 4. Docker Permission Denied

### Error

```text
permission denied while trying to connect to Docker daemon
```

### Fix

Run:

```bash
sudo usermod -aG docker $USER
```

Then logout and login again.

---

## 5. Next.js Cache Error

### Error

```text
Invalid magic number
```

### Cause

Corrupted `.next` cache.

### Fix

Delete:

```text
.next
```

Then reinstall dependencies.

---

## 6. JWT Invalid Token Error

### Error

```text
Invalid token
```

### Cause

Missing or expired JWT.

### Fix

Login again.

Check:

```text
localStorage
```

contains valid token.

---

## 7. Docker Build Failure

### Cause

Dependency or Dockerfile issue.

### Fix

Rebuild containers:

```bash
docker compose up --build
```

---

## 8. Frontend Cannot Reach Backend

### Cause

Wrong API URL.

### Fix

Use:

```text
/api
```

through Nginx.

NOT:

```text
http://localhost:5000
```

inside Docker environment.

---

# Useful Docker Commands

## Build Containers

```bash
docker compose build
```

---

## Start Containers

```bash
docker compose up
```

---

## Start Detached

```bash
docker compose up -d
```

---

## Stop Containers

```bash
docker compose down
```

---

## View Logs

```bash
docker compose logs
```

---

## Restart Containers

```bash
docker compose restart
```

---

# Security Notes

## Important

Never upload:

* `.env`
* passwords
* MongoDB credentials
* JWT secrets

Use `.gitignore`.

---

# Recommended Improvements

Future improvements:

* Stripe payment integration
* Image uploads
* Email notifications
* Product search
* Categories
* Inventory management
* Admin analytics dashboard
* HTTPS SSL
* GitHub Actions CI/CD
* Production deployment

---

# Learning Outcomes

This project demonstrates understanding of:

* full-stack development
* REST APIs
* MongoDB database design
* JWT authentication
* CRUD operations
* React state management
* Docker containerization
* Nginx reverse proxy architecture
* DevOps fundamentals

---

# Author

Developed by Kavinda Sandaru.

---

# License

This project is for educational and portfolio purposes.
