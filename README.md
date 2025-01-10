# Complain Management System

This project is a full-stack Complain Management System that allows users to submit tickets and admins to manage and reply to them. The system includes both a backend API

---

## Backend Documentation

### **Technologies Used**
- Node.js
- Express.js
- Prisma (ORM)
- MySQL (Database)
- JWT for authentication

### **Setup Instructions**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/imsaikatsen/complaint-management-backend.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   DATABASE_URL=mysql://root:@localhost:3306/complaint_management
   DATABASE_USERNAME= root
   DATABASE_PASSWORD=
   For Admin Login : isAdmin = 1 
   JWT_SECRET=3f5273fefcfe35701a79f744c35e5bd3c32adc0a889a6f080d83bfd17646f6bb3431d81717a2ec8abc76d408207e9b74d161e617b1bc3559e43c584995a175ac
   PORT=5000
   ```

4. **Set up the database**:
   Run the following commands to migrate your database schema:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```

### **API Endpoints**

| Method | Endpoint        | Description                     |
|--------|-----------------|---------------------------------|
| POST   | `/register`     | Register a new user             |
| POST   | `/login`        | Login a user and generate token |
| POST   | `/tickets`      | Create a new ticket             |
| GET    | `/tickets`      | Get all tickets for a user      |
| GET    | `/tickets/:id`  | Get a single ticket by ID       |
| PUT    | `/tickets/:id`  | Update ticket status or reply   |

### **Key Files**
- `index.js`: Entry point for the backend server.
- `routes/`: Contains route definitions for users and tickets.
- `controllers/`: Business logic for handling requests.
- `prisma/`: Prisma schema and client configuration.


## Additional Notes
- Ensure that both the backend and client are running simultaneously.
- Use a tool like Postman to test API endpoints during development.
- Feel free to customize the project for your use case.

---

### **Author**
Developed by Saikat Sen

