# School Payment Management System

This is an extension of the primary coaching application for managing billing and payments.

## Project Structure

- Backend: Express.js with Sequelize ORM
- Frontend: React with Vite, Redux for state management

## Setup

### Backend

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on `dev.env`:

```bash
cp dev.env .env
```

3. Update the database credentials in `.env`

4. Start the server:

```bash
npm run server
```

### Frontend

1. Navigate to client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## Features

- Payment management (CRUD operations)
- User authentication
- Dashboard

## API Endpoints

- `POST /api/payment` - Create payment
- `GET /api/payment` - Get all payments
- `GET /api/payment/:id` - Get payment details
- `PATCH /api/payment/:id` - Update payment
- `DELETE /api/payment/:id` - Delete payment
