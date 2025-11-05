# 📚 DOUBTSTACK API DOCUMENTATION

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "department": "CSE",
  "branch": "Computer Science",
  "semester": 5
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "64abc...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "CSE",
      "reputation": 0
    },
    "token": "eyJhbGc..."
  }
}
```

### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### Get Current User
```http
GET /auth/me
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": { /* user object */ }
  }
}
```

---

## ❓ Doubts Endpoints

### Get All Doubts
```http
GET /doubts?page=1&limit=10&subject=Data%20Structures&isResolved=false
```

**Query Parameters:**
- `page` (number) - Page number (default: 1)
- `limit` (number) - Items per page (default: 10)
- `subject` (string) - Filter by subject
- `department` (string) - Filter by department
- `tags` (string) - Comma-separated tags
- `isResolved` (boolean) - Filter resolved/open
- `isUrgent` (boolean) - Filter urgent
- `search` (string) - Text search
- `sort` (string) - Sort field (default: -createdAt)

**Response:**
```json
{
  "status": "success",
  "data": {
    "doubts": [
      {
        "_id": "64abc...",
        "title": "How to implement BST?",
        "description": "I need help with...",
        "author": {
          "name": "John Doe",
          "profilePhoto": "...",
          "role": "student"
        },
        "subject": "Data Structures",
        "department": "CSE",
        "tags": ["binary-tree", "data-structures"],
        "isResolved": false,
        "isUrgent": false,
        "views": 42,
        "answerCount": 3,
        "upvotes": [],
        "downvotes": [],
        "createdAt": "2025-10-21T10:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "pages": 5
    }
  }
}
```

### Get Doubt by ID
```http
GET /doubts/:id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "doubt": { /* full doubt object */ },
    "answers": [ /* array of answer objects */ ]
  }
}
```

### Create Doubt
```http
POST /doubts
```
**Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Form Data:**
- `title` (string, required) - Doubt title
- `description` (string, required) - Detailed description
- `subject` (string, required) - Subject name
- `tags` (array) - Tags array
- `isUrgent` (boolean) - Mark as urgent
- `attachments` (files) - Up to 5 files

**Response:**
```json
{
  "status": "success",
  "data": {
    "doubt": { /* created doubt object */ }
  }
}
```

### Update Doubt
```http
PUT /doubts/:id
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "tags": ["new-tag"],
  "isUrgent": true
}
```

### Delete Doubt
```http
DELETE /doubts/:id
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "message": "Doubt deleted successfully"
}
```

### Resolve Doubt
```http
PUT /doubts/:id/resolve
```
**Headers:** `Authorization: Bearer <token>` (must be doubt author)

**Response:**
```json
{
  "status": "success",
  "data": {
    "doubt": { /* updated doubt */ }
  }
}
```

### Vote on Doubt
```http
POST /doubts/:id/vote
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "voteType": "upvote"  // or "downvote"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "voteScore": 5,
    "upvotes": 7,
    "downvotes": 2
  }
}
```

### Follow Doubt
```http
POST /doubts/:id/follow
```
**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "status": "success",
  "data": {
    "isFollowing": true,
    "followerCount": 12
  }
}
```

---

## 💬 Answers Endpoints

### Create Answer
```http
POST /answers/doubts/:doubtId
```
**Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Form Data:**
- `content` (string, required) - Answer content
- `parentAnswerId` (string, optional) - For nested replies
- `attachments` (files) - Up to 3 files

**Response:**
```json
{
  "status": "success",
  "data": {
    "answer": {
      "_id": "64xyz...",
      "content": "Here's the solution...",
      "author": { /* author details */ },
      "doubt": "64abc...",
      "upvotes": [],
      "downvotes": [],
      "isAccepted": false,
      "createdAt": "2025-10-21T11:00:00.000Z"
    }
  }
}
```

### Update Answer
```http
PUT /answers/:id
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "content": "Updated answer content"
}
```

### Delete Answer
```http
DELETE /answers/:id
```
**Headers:** `Authorization: Bearer <token>`

### Vote on Answer
```http
POST /answers/:id/vote
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "voteType": "upvote"  // or "downvote"
}
```

### Accept Answer (Mark as Best)
```http
POST /answers/:id/accept
```
**Headers:** `Authorization: Bearer <token>` (must be doubt author)

**Response:**
```json
{
  "status": "success",
  "data": {
    "answer": { /* answer with isAccepted: true */ }
  }
}
```

### Verify Answer (Faculty Only)
```http
POST /answers/:id/verify
```
**Headers:** `Authorization: Bearer <token>` (must be faculty/admin)

**Response:**
```json
{
  "status": "success",
  "data": {
    "answer": { /* answer with isFacultyVerified: true */ }
  }
}
```

---

## 👤 Users Endpoints

### Get User Profile
```http
GET /users/:id
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "64abc...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "CSE",
      "branch": "Computer Science",
      "semester": 5,
      "bio": "...",
      "profilePhoto": "...",
      "reputation": 150,
      "stats": {
        "questionsAsked": 10,
        "answersGiven": 25,
        "bestAnswers": 5,
        "helpfulVotes": 40
      },
      "badges": [
        {
          "name": "Faculty Verified",
          "icon": "✓"
        }
      ]
    }
  }
}
```

### Update User Profile
```http
PUT /users/:id
```
**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Smith",
  "bio": "Computer Science student",
  "profilePhoto": "https://...",
  "semester": 6
}
```

### Get User's Doubts
```http
GET /users/:id/doubts?page=1&limit=10
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "doubts": [ /* array of doubts */ ],
    "pagination": { /* pagination info */ }
  }
}
```

### Get User's Answers
```http
GET /users/:id/answers?page=1&limit=10
```

---

## 🏆 Leaderboard Endpoints

### Get Leaderboard
```http
GET /leaderboard?period=all&limit=20
```

**Query Parameters:**
- `period` - "all", "weekly", "monthly"
- `limit` - Number of users to return (default: 20)

**Response:**
```json
{
  "status": "success",
  "data": {
    "topUsers": [ /* users sorted by reputation */ ],
    "topContributors": [ /* users by total activity */ ],
    "topAnswerers": [ /* users by answer count */ ],
    "facultyVerified": [ /* faculty verified users */ ]
  }
}
```

### Get Platform Statistics
```http
GET /leaderboard/stats
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "totalUsers": 250,
    "totalDoubts": 500,
    "resolvedDoubts": 350,
    "totalAnswers": 1200,
    "resolutionRate": "70.00%",
    "popularTags": [
      { "_id": "javascript", "count": 45 },
      { "_id": "arrays", "count": 32 }
    ],
    "activeDepartments": [
      { "_id": "CSE", "count": 200 },
      { "_id": "ECE", "count": 150 }
    ]
  }
}
```

---

## 🏷️ Tags Endpoints

### Get All Tags
```http
GET /tags?search=java&category=subject&limit=50
```

**Query Parameters:**
- `search` (string) - Search tags
- `category` (string) - Filter by category
- `limit` (number) - Max results (default: 50)

**Response:**
```json
{
  "status": "success",
  "data": {
    "tags": [
      {
        "_id": "64...",
        "name": "javascript",
        "description": "JavaScript programming",
        "category": "technology",
        "usageCount": 45
      }
    ]
  }
}
```

### Get Tag Suggestions (Autocomplete)
```http
GET /tags/suggest?query=java
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "suggestions": [
      { "name": "javascript", "category": "technology", "usageCount": 45 },
      { "name": "java", "category": "technology", "usageCount": 30 }
    ]
  }
}
```

---

## 🔒 Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

**Example Error:**
```json
{
  "status": "error",
  "message": "Invalid credentials"
}
```

---

## 📊 Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role: "student" | "faculty" | "admin",
  profilePhoto: String,
  branch: String,
  department: String (required),
  semester: Number (1-8),
  bio: String,
  reputation: Number (default: 0),
  stats: {
    questionsAsked: Number,
    answersGiven: Number,
    bestAnswers: Number,
    helpfulVotes: Number
  },
  badges: Array,
  isVerified: Boolean,
  isActive: Boolean
}
```

### Doubt Model
```javascript
{
  title: String (required),
  description: String (required),
  author: ObjectId (User),
  tags: Array<String>,
  subject: String (required),
  department: String (required),
  attachments: Array<{fileName, fileUrl, fileType}>,
  isUrgent: Boolean,
  isResolved: Boolean,
  resolvedAt: Date,
  acceptedAnswer: ObjectId (Answer),
  views: Number,
  upvotes: Array<ObjectId>,
  downvotes: Array<ObjectId>,
  followers: Array<ObjectId>,
  answerCount: Number
}
```

### Answer Model
```javascript
{
  content: String (required),
  author: ObjectId (User),
  doubt: ObjectId (Doubt),
  parentAnswer: ObjectId (Answer),
  upvotes: Array<ObjectId>,
  downvotes: Array<ObjectId>,
  isAccepted: Boolean,
  isFacultyVerified: Boolean,
  verifiedBy: ObjectId (User),
  attachments: Array,
  editHistory: Array,
  isEdited: Boolean
}
```

---

## 🎯 Rate Limiting

Currently no rate limiting is implemented, but for production deployment consider:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

---

## 🔄 Webhooks (Future)

Future versions will support webhooks for:
- New answer notifications
- Doubt resolution notifications
- Reputation milestones

---

**Last Updated:** 2025-10-21  
**API Version:** 1.0.0
