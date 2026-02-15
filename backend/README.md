# Care Connect Backend

Backend server for the Care Connect babysitter matching platform.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate
```

## Database Setup

1. Make sure PostgreSQL is running
2. Update `.env` file with your database credentials:

```env
DATABASE_URL=postgresql://postgres:12345@localhost:5432/babysitter_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
PORT=3001
```

3. Run migrations:

```bash
npm run prisma:migrate
```

## Running the Server

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:3001/api

## Project Structure

```
src/
├── auth/           # Authentication (OTP, JWT)
├── users/          # User management
├── parents/        # Parent profiles
├── babysitters/    # Babysitter profiles
├── guardians/      # Guardian management
├── city/           # Cities and locations
├── community-styles/ # Community styles
├── prisma/         # Prisma service
└── main.ts         # Application entry point
```

## Available Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token

### Parents
- `POST /api/parents/register` - Register new parent
- `GET /api/parents` - Get all parents
- `GET /api/parents/:id` - Get parent by ID
- `GET /api/parents/user/:userId` - Get parent by user ID
- `PATCH /api/parents/:id` - Update parent profile
- `DELETE /api/parents/:id` - Delete parent

### Babysitters
- `POST /api/babysitters/register` - Register new babysitter
- `GET /api/babysitters` - Get all babysitters
- `GET /api/babysitters/:id` - Get babysitter by ID
- `GET /api/babysitters/user/:userId` - Get babysitter by user ID
- `PATCH /api/babysitters/:id` - Update babysitter profile
- `DELETE /api/babysitters/:id` - Delete babysitter

### Cities
- `GET /api/city` - Get all cities
- `POST /api/city` - Create new city

### Community Styles
- `GET /api/community-styles` - Get all community styles
- `POST /api/community-styles` - Create new community style

## Troubleshooting

### Database Connection Issues
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env file
- Verify database exists: `psql -U postgres -c "CREATE DATABASE babysitter_db;"`

### Prisma Issues
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Regenerate Prisma Client: `npm run prisma:generate`
- Reset database: `npx prisma migrate reset`

### Port Already in Use
- Change PORT in .env file
- Or kill process using port 3001: `npx kill-port 3001`

## Next Steps

1. ✅ Database schema created
2. ✅ Basic authentication implemented
3. ✅ Parent and Babysitter registration
4. 🔄 Implement job requests
5. 🔄 Implement matching algorithm
6. 🔄 Implement booking system
7. 🔄 Add SMS integration for OTP
8. 🔄 Add telephony integration (IVR)

## Support

For issues or questions, please check the documentation in the `docs/` folder.
