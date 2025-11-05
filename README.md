# 🚀 DoubtStack - College Q&A Platform

A comprehensive Q&A platform designed specifically for college students and faculty to collaborate, solve doubts, and build a knowledge community.

# Deployment
https://doubtstack-frontend.vercel.app/

## 📋 Features

### Core MVP Features
- ✅ **User Authentication** - Email/password login with role-based access (Student/Faculty/Admin)
- ✅ **Post Doubts** - Create questions with title, description, tags, subjects, and attachments
- ✅ **Answer System** - Threaded discussions with upvote/downvote and resolution marking
- ✅ **Tags & Filters** - Smart filtering by department, subject, topic, and status
- ✅ **Profile System** - User profiles with stats, reputation, and gamified XP
- ✅ **Leaderboard** - Weekly/monthly top contributors with badges

### Advanced Features (V2)
- 📚 Study Groups & Communities
- 🏛️ Department Boards
- 🔔 Real-time Notifications
- 💬 Private Messaging
- 🛡️ Moderation Tools
- 📊 Analytics Dashboard

### AI Features (Future)
- 🤖 AI Answer Suggestions
- 🏷️ Auto Tagging with NLP
- 🔍 Plagiarism Detection
- 📝 Question Summarizer
- 🎤 Voice-to-Text Input

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js + Vite |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT |
| **Real-time** | Socket.io |
| **AI Features** | OpenAI API |
| **Hosting** | Vercel (frontend), Render (backend) |

## 📁 Project Structure

```
doubtstack/
├── backend/              # Node.js + Express API
│   ├── config/          # Configuration files
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
│
├── frontend/            # React + Vite app
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── services/    # API services
│   │   ├── utils/       # Helper functions
│   │   └── App.jsx      # Main app component
│   └── public/          # Static assets
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Qoder-DoubtStack
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env)**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/doubtstack
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Doubts
- `GET /api/doubts` - Get all doubts (with filters)
- `POST /api/doubts` - Create new doubt
- `GET /api/doubts/:id` - Get doubt by ID
- `PUT /api/doubts/:id` - Update doubt
- `DELETE /api/doubts/:id` - Delete doubt
- `PUT /api/doubts/:id/resolve` - Mark doubt as resolved

### Answers
- `POST /api/doubts/:id/answers` - Add answer
- `PUT /api/answers/:id` - Update answer
- `DELETE /api/answers/:id` - Delete answer
- `POST /api/answers/:id/vote` - Upvote/downvote answer

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update profile
- `GET /api/users/leaderboard` - Get leaderboard

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ for college students

---

**Version:** 1.0.0 (MVP)  
**Last Updated:** 2025-10-21
