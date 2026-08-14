# ShopSphere Backend

Backend API for **ShopSphere**, an e-commerce application built with Node.js, Express, TypeScript, MongoDB, and PostgreSQL.

The current backend implements authentication, role-based authorization, product management, shopping cart functionality, and the initial order workflow.

---

## 🚀 Tech Stack

* **Node.js**
* **Express.js**
* **TypeScript**
* **MongoDB**
* **Mongoose**
* **PostgreSQL**
* **JWT**
* **bcrypt**
* **Zod**
* **Helmet**
* **CORS**
* **Morgan**

---

## 📁 Project Structure

```text
src/
├── common/
│   ├── constants/
│   ├── errors/
│   ├── middlewares/
│   └── utils/
│
├── modules/
│   ├── auth/
│   ├── product/
│   ├── cart/
│   ├── order/
│   └── health/
│
└── server.ts
```

Each feature follows a modular structure:

```text
module/
├── model.ts
├── types.ts
├── validation.ts
├── repository.ts
├── service.ts
├── controller.ts
└── routes.ts
```

The general request flow is:

```text
Request
   ↓
Route
   ↓
Authentication / Authorization
   ↓
Validation
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Database
```

---

# 🔐 Authentication Module

The authentication module uses **JWT-based authentication**.

### Features

* User signup
* User login
* Password hashing using bcrypt
* JWT generation
* JWT authentication middleware
* Current user authentication
* Role-based authorization

### Roles

```ts
USER
VENDOR
ADMIN
```

### Authentication Flow

```text
Signup
  ↓
Hash Password
  ↓
Store User in PostgreSQL

Login
  ↓
Validate Credentials
  ↓
Generate JWT
  ↓
Client sends JWT
  ↓
Authentication Middleware
  ↓
AuthenticatedRequest
```

The authenticated user information is available through:

```ts
req.user
```

---

# 📦 Product Module

Products are stored in **MongoDB**.

### Features

* Create product
* Get all products
* Get product by ID
* Get vendor's products
* Update product
* Delete product
* Search products
* Pagination
* Role-based access

### Product Permissions

| Operation         | USER | VENDOR | ADMIN |
| ----------------- | ---: | -----: | ----: |
| View products     |    ✅ |      ✅ |     ✅ |
| Create product    |    ❌ |      ✅ |     ✅ |
| View own products |    ❌ |      ✅ |     ✅ |
| Update product    |    ❌ |      ✅ |     ✅ |
| Delete product    |    ❌ |      ✅ |     ✅ |

---

# 🛒 Cart Module

Cart data is stored in **MongoDB**.

A cart belongs to a user and contains product references with quantities.

```text
Cart
├── userId
└── items[]
    ├── productId
    └── quantity
```

### Features

* Add product to cart
* Increase quantity when product already exists
* Get current user's cart
* Update item quantity
* Remove cart item
* Clear cart
* Calculate subtotal
* Calculate grand total

### Cart Response

The cart response includes product information:

```json
{
  "items": [
    {
      "productId": "product-id",
      "name": "Product Name",
      "description": "Product description",
      "category": "Electronics",
      "price": 1000,
      "quantity": 2,
      "subtotal": 2000
    }
  ],
  "grandTotal": 2000
}
```

### Deleted Product Handling

A product can be deleted after it has been added to a cart.

The cart service handles this by checking which referenced products still exist and removing stale product references when the cart is processed.

This prevents deleted products from appearing in the active cart response.

---

# 📋 Order Module

The Order module is currently implemented as an MVP.

Orders are stored in **MongoDB**.

An order stores a snapshot of product information at the time the order is created.

```text
Order
├── userId
├── items[]
│   ├── productId
│   ├── productName
│   ├── price
│   ├── quantity
│   └── subtotal
├── grandTotal
├── shippingAddress
├── orderStatus
├── paymentStatus
├── createdAt
└── updatedAt
```

### Why Product Snapshot?

The order stores:

```text
productName
price
quantity
subtotal
```

instead of relying only on the current Product document.

This means an old order can retain its original price even if the product is later updated or deleted.

### Order Status

```text
PENDING
   ↓
CONFIRMED
   ↓
SHIPPED
   ↓
DELIVERED
```

Orders can also be:

```text
CANCELLED
```

### Payment Status

```text
PENDING
SUCCESS
FAILED
```

Payment gateway integration is not implemented yet.

---

# 🔄 Order Creation Flow

```text
POST /orders
      ↓
Get User Cart
      ↓
Check Cart
      ↓
Get Product IDs
      ↓
Fetch Products
      ↓
Create Product Snapshot
      ↓
Calculate Grand Total
      ↓
Create Order
      ↓
Clear Cart
      ↓
Return Order
```

---

# 🌐 API Endpoints

Base URL:

```text
/api/v1
```

## Health

```http
GET /api/v1/health
```

---

## Authentication

```http
POST /api/v1/auth/signup
POST /api/v1/auth/login
GET  /api/v1/auth/me
```

---

## Products

```http
POST   /api/v1/products
GET    /api/v1/products
GET    /api/v1/products/my-products
GET    /api/v1/products/:id
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id
```

---

## Cart

```http
POST   /api/v1/carts
GET    /api/v1/carts
PATCH  /api/v1/carts/:productId
DELETE /api/v1/carts/:productId
DELETE /api/v1/carts
```

> Exact parameter naming should follow the currently implemented Cart routes.

---

## Orders

```http
POST  /api/v1/orders
GET   /api/v1/orders
GET   /api/v1/orders/:id
PATCH /api/v1/orders/:id/status
```

---

# 🗄️ Database Architecture

ShopSphere currently uses two databases.

### PostgreSQL

Used for:

```text
Users
Authentication-related user data
```

User IDs are stored as strings when referenced from MongoDB modules.

### MongoDB

Used for:

```text
Products
Carts
Orders
```

Product IDs and other MongoDB document references use MongoDB `ObjectId`.

---

# 🔒 Middleware

The backend includes reusable middleware for:

### Authentication

```ts
authenticate
```

Verifies the JWT and attaches the authenticated user to:

```ts
req.user
```

### Authorization

```ts
authorize(...)
```

Restricts endpoints based on roles.

Example:

```ts
authorize(ROLES.VENDOR, ROLES.ADMIN)
```

### Request Validation

```ts
validateRequest(...)
```

Uses Zod schemas to validate request data before reaching the controller.

---

# ⚠️ Error Handling

The project uses a common `AppError` class for application-level errors.

Example:

```ts
throw new AppError(
  404,
  "Product not found",
);
```

Controllers use:

```ts
asyncHandler(...)
```

to handle asynchronous errors consistently.

---

# 📤 API Response

Responses are standardized using:

```ts
sendResponse(...)
```

Example:

```json
{
  "success": true,
  "message": "Product fetched successfully",
  "data": {}
}
```

Error responses follow the common error-handling structure.

---

# 🛠️ Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file containing the required database, JWT, and application configuration.

Example:

```env
PORT=5000

JWT_SECRET=your_secret

MONGO_URI=your_mongodb_connection_string

DATABASE_URL=your_postgresql_connection_string
```

Use the actual environment variable names defined by the application.

---

# ▶️ Running the Project

### Development

```bash
npm run dev
```

This runs the TypeScript application using `ts-node-dev` and automatically reloads when source files change.

### Build

```bash
npm run build
```

This compiles TypeScript into the `dist` directory.

### Production

```bash
npm run start
```

This runs:

```text
dist/server.js
```

If source code was changed, build before starting:

```bash
npm run build
npm run start
```

---

# 🧪 API Testing

The APIs can be tested using **Postman**.

Recommended testing flow:

```text
Signup
  ↓
Login
  ↓
Copy JWT
  ↓
Create Product
  ↓
Add Product to Cart
  ↓
Get Cart
  ↓
Update Cart
  ↓
Place Order
  ↓
Verify Cart Cleared
  ↓
Get Orders
  ↓
Update Order Status
```

---

# 📌 Current Backend Status

| Module         | Status |
| -------------- | ------ |
| Health         | ✅      |
| Authentication | ✅      |
| Authorization  | ✅      |
| Products       | ✅      |
| Cart           | ✅      |
| Orders         | ✅ MVP  |
| Payments       | ⏳      |
| Wishlist       | ⏳      |
| Reviews        | ⏳      |
| Frontend       | ⏳      |

---

# 🚧 Future Enhancements

The following improvements are intentionally postponed until the MVP is complete:

* Replace remaining `any` types with proper TypeScript types
* Improve vendor-level order authorization
* Add proper shipping address types
* Add MongoDB transactions for order creation and cart clearing
* Add inventory/stock management
* Add payment gateway integration
* Improve cart/product synchronization
* Add wishlist
* Add product reviews and ratings
* Add order pagination
* Add order history/timeline
* Add automated tests
* Add Docker configuration
* Add CI/CD
* Add caching where appropriate

---

# 🎯 Project Goal

ShopSphere is being built as a full-stack e-commerce application to practice and demonstrate:

* Node.js
* TypeScript
* Express.js
* REST API design
* Authentication
* Authorization
* MongoDB
* PostgreSQL
* Mongoose
* Zod validation
* Modular backend architecture
* E-commerce business logic
* Frontend/backend integration

The next major phase is building the **frontend** and connecting it to the completed backend APIs.
