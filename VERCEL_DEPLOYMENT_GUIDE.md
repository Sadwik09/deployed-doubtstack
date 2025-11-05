# Vercel Deployment Guide for DoubtStack

This guide explains how to deploy both the frontend and backend of DoubtStack on Vercel.

## Prerequisites

1. Vercel account (free at [vercel.com](https://vercel.com))
2. MongoDB Atlas account (for production database)
3. Git repository (GitHub, GitLab, or Bitbucket)

## Backend Deployment

### 1. Prepare Environment Variables

Create the following environment variables in Vercel dashboard:

- `NODE_ENV`: production
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: Strong random string for JWT signing
- `JWT_EXPIRE`: 7d
- `CLIENT_URL`: Your frontend URL (e.g., https://your-frontend.vercel.app)

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Set the root directory to `backend`
5. Set the build command to `npm run build` (if you have a build script) or leave empty
6. Set the output directory to `.` (current directory)
7. Add the environment variables from step 1
8. Deploy

### 3. Configure API Routes

The backend will be available at:
`https://your-backend-project.vercel.app/api/`

## Frontend Deployment

### 1. Prepare Environment Variables

Create the following environment variable in Vercel dashboard:

- `VITE_API_URL`: Your backend API URL (e.g., https://your-backend.vercel.app/api)

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Set the root directory to `frontend`
5. Set the build command to `npm run build`
6. Set the output directory to `dist`
7. Add the environment variable from step 1
8. Deploy

## Important Notes

### File Uploads

Vercel has limitations on file uploads in serverless functions:

- Maximum payload size: 5MB
- Function execution timeout: 10 seconds

For production file uploads, consider using:

- AWS S3 with pre-signed URLs
- Cloudinary
- Firebase Storage

### Real-time Features (Socket.io)

Vercel's serverless environment doesn't support long-running connections like Socket.io. For real-time features, consider:

- Using a separate WebSocket service (e.g., Pusher, Ably)
- Deploying the backend on a platform that supports WebSockets (Render, Heroku, etc.)

### Database

Make sure to:

1. Use MongoDB Atlas for production
2. Add Vercel's IP addresses to your MongoDB Atlas IP whitelist
3. Use a strong password for your database user

## Environment Variables Summary

### Backend (.env.production)

```env
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_strong_secret_here
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend.vercel.app
```

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend.vercel.app/api
```

## Troubleshooting

### CORS Issues

Make sure `CLIENT_URL` matches your frontend domain exactly.

### API 404 Errors

Ensure your API routes are correctly configured in `vercel.json`.

### Build Failures

Check that all dependencies are properly listed in `package.json`.

## Alternative Deployment Strategy

If you need real-time features or file uploads, consider:

1. Deploy frontend on Vercel
2. Deploy backend on Render/Heroku/Railway
3. Connect them using environment variables
