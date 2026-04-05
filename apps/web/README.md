# Launchr 🚀

A self-hosted deployment platform — deploy your apps with one click, just like Vercel.

## Live Demo
[https://launchr.railway.app](https://launchr.railway.app)

## Features
- GitHub OAuth login
- One-click deployments
- Real-time build logs via WebSockets
- Automatic framework detection (React, Vite, Node)
- Public URLs via ngrok
- Deployment history with rollback logs

## Tech Stack
- **Frontend**: Next.js 16, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB, Mongoose
- **Queue**: Redis, BullMQ
- **Realtime**: Socket.io
- **Auth**: GitHub OAuth, JWT
- **Infra**: Docker, ngrok

## Architecture