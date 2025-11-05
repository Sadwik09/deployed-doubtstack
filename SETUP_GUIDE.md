# 🚀 DOUBTSTACK - SETUP & RUN GUIDE

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community)
- **Git** (for cloning the repository)

## Project Structure

```
Qoder-DoubtStack/
├── backend/              # Node.js + Express API
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication & validation
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded files (created automatically)
│   ├── .env            # Environment variables
│   ├── package.json
│   └── server.js        # Entry point
│
├── frontend/            # React + Vite app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API services
│   │   ├── store/       # State management
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Installation Steps

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Configure Backend Environment

Create a `.env` file in the `backend` directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/doubtstack
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

**Important:** 
- If using MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection string
- Change `JWT_SECRET` to a strong random string in production

### 3. Create Uploads Directory

```bash
# From backend directory
mkdir uploads
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 5. Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows (if installed as service)
net start MongoDB

# Mac/Linux
mongod
```

**Option B: MongoDB Atlas**
- No need to start anything locally
- Just use your Atlas connection string in `.env`

## Running the Application

### Method 1: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Method 2: Production Build

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Serve via Backend:**
```bash
cd backend
npm start
```

## Testing the Application

### 1. Create Test Accounts

**Register as Student:**
- Go to `http://localhost:5173/register`
- Fill in the form:
  - Name: John Doe
  - Email: john@example.com
  - Password: password123
  - Role: Student
  - Department: CSE
  - Branch: Computer Science
  - Semester: 5

**Register as Faculty:**
- Email: prof@example.com
- Role: Faculty
- Department: CSE

### 2. Test Core Features

1. **Login** with created account
2. **Post a Doubt** from Dashboard
3. **Browse Doubts** and filter by subject/department
4. **Answer a Doubt** 
5. **Vote** on doubts and answers
6. **Mark as Resolved** (as doubt owner)
7. **Check Leaderboard**
8. **View Profile**

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Doubts
- `GET /api/doubts` - Get all doubts (with filters)
- `POST /api/doubts` - Create doubt
- `GET /api/doubts/:id` - Get doubt details
- `PUT /api/doubts/:id` - Update doubt
- `DELETE /api/doubts/:id` - Delete doubt
- `PUT /api/doubts/:id/resolve` - Mark as resolved
- `POST /api/doubts/:id/vote` - Vote on doubt

### Answers
- `POST /api/answers/doubts/:doubtId` - Create answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `POST /api/answers/:id/vote` - Vote on answer
- `POST /api/answers/:id/accept` - Accept answer
- `POST /api/answers/:id/verify` - Verify answer (faculty)

### Users & Leaderboard
- `GET /api/users/:id` - Get user profile
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/leaderboard/stats` - Platform statistics

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Check your `MONGODB_URI` is correct
- Ensure MongoDB is running
- For Atlas, verify IP whitelist

**Error: "ECONNREFUSED"**
- MongoDB server is not running
- Start MongoDB service

### Port Already in Use

**Error: "Port 5000 is already in use"**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### CORS Issues

- Ensure `CLIENT_URL` in backend `.env` matches your frontend URL
- Clear browser cache
- Check CORS middleware configuration in `server.js`

### File Upload Issues

- Verify `uploads` directory exists in backend
- Check file size limits in `.env`
- Ensure proper permissions on uploads directory

## Production Deployment

### Backend (Render/Railway/Heroku)

1. Create account on hosting platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Build the app: `npm run build`
2. Connect repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Database (MongoDB Atlas)

1. Create cluster
2. Set up database user
3. Whitelist IPs
4. Get connection string
5. Update `MONGODB_URI`

## Features Implemented

### ✅ MVP Features
- User Authentication (JWT)
- Role-based Access (Student/Faculty/Admin)
- Post Doubts with Attachments
- Answer System with Threading
- Voting (Upvote/Downvote)
- Mark as Resolved
- Tags & Filters
- Profile System with Stats
- Reputation System
- Leaderboard

### 🚧 Future Enhancements (V2)
- Real-time Notifications (Socket.io)
- Study Groups
- Department Boards
- Private Messaging
- Search Auto-suggest
- Email Notifications
- Moderation Tools
- Analytics Dashboard

### 🤖 AI Features (Planned)
- AI Answer Suggestions
- Auto-tagging with NLP
- Plagiarism Detection
- Voice-to-Text Input

## Tech Stack

- **Frontend:** React 18, Vite, Zustand, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT
- **File Upload:** Multer
- **Styling:** Custom CSS
- **Icons:** React Icons

## Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Check MongoDB connection
- Verify environment variables

## License

MIT License - Feel free to use this project for learning purposes.

---

**Happy Coding! 🚀**
