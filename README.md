# Transportation Management System

[GitHub Repository](https://github.com/sanjitsarkar/tms-app)

A full-stack Transportation Management System built with React, TypeScript, TailwindCSS, and GraphQL.

## 🚀 Live Demo

- **Frontend**: [Live URL will be added after deployment]
- **Backend GraphQL Playground**: [Live URL will be added after deployment]

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@tms.com | admin123 |
| Employee | employee@tms.com | employee123 |

## ✨ Features

### Frontend
- 🎨 Beautiful dark theme with glassmorphism effects
- 📱 Responsive design for all devices
- 🍔 Hamburger menu with collapsible sub-menus
- 📊 Grid view with 10 sortable columns
- 🗃️ Tile view with action menus
- 🔍 Search and filter functionality
- 📄 Pagination support
- 🔐 Role-based access control (Admin/Employee)

### Backend
- 🚀 GraphQL API with Apollo Server
- 🔒 JWT Authentication
- 👥 Role-based authorization
- 📦 CRUD operations for shipments
- 🔍 Filtering, sorting, and pagination
- ⚡ Performance optimizations with compression

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- TailwindCSS
- Redux Toolkit
- Apollo Client
- Framer Motion
- React Router

### Backend
- Node.js
- Express
- Apollo Server (GraphQL)
- TypeScript
- JWT Authentication

## 🏃‍♂️ Running Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Backend Setup
```bash
cd server
npm install
npm run dev
```
Server runs at: http://localhost:4000/graphql

### Frontend Setup
```bash
cd client
npm install
npm run dev
```
App runs at: http://localhost:3000

## 📁 Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store & slices
│   │   ├── graphql/       # Apollo client & queries
│   │   └── types/         # TypeScript types
│   └── ...
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── schema/        # GraphQL schema & resolvers
│   │   ├── data/          # Mock data stores
│   │   ├── middleware/    # Auth middleware
│   │   └── types/         # TypeScript types
│   └── ...
└── README.md
```

## 🔐 Role-Based Access Control

| Feature | Admin | Employee |
|---------|-------|----------|
| View shipments | ✅ | ✅ |
| View details | ✅ | ✅ |
| Add shipment | ✅ | ❌ |
| Edit shipment | ✅ | ❌ |
| Delete shipment | ✅ | ❌ |
| Flag shipment | ✅ | ✅ |

## 📝 GraphQL API

### Queries
- `shipments(filter, pagination, sort)` - List shipments with filters
- `shipment(id)` - Get single shipment
- `shipmentStats` - Get shipment statistics
- `me` - Get current user

### Mutations
- `login(email, password)` - User login
- `createShipment(input)` - Create new shipment (Admin only)
- `updateShipment(id, input)` - Update shipment (Admin only)
- `deleteShipment(id)` - Delete shipment (Admin only)
- `toggleShipmentFlag(id)` - Toggle shipment flag

## 📄 License

MIT License
