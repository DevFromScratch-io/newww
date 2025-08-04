# 🧠 MindLoom — Your Daily Mental Fitness Companion

**MindLoom** is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to help users build emotional resilience through daily habits, reflection, and AI-guided journaling.

## ✨ Key Features
- ✅ User Authentication (JWT-secured)
- 📈 Mood Tracking & Visual Timeline
- 💬 Conversational AI Coach (Powered by Gemini 1.5 Flash)
- 📦 Guided Habit Packs with Daily Tasks
- 🔥 Streak Tracking & Motivation System
- 🎧 Ambient Sound Player (tone.js)
- 🌬️ Breathing Widget for Calm
- 📊 Progress Dashboard & Journal Archive

## 🛠️ Tech Stack
- **Frontend**: React 18, Tailwind CSS, Vite, Framer Motion  
- **Backend**: Node.js, Express.js, MongoDB Atlas, Mongoose  
- **AI**: Google Gemini 1.5 Flash API  
- **Charting**: Recharts

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DevFromScratch-io/newww.git
   cd newww
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   cd ..
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment template
   cp .env.example backend/.env
   ```
   
   Edit `backend/.env` and add your actual values:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (generate with: `openssl rand -base64 64`)
   - `GEMINI_API_KEY`: Your Google Gemini API key

4. **Seed the Database (Optional)**
   ```bash
   cd backend
   npm run data:import
   ```

5. **Start the Application**
   
   **Option A: Development Mode (Recommended)**
   ```bash
   # Terminal 1: Start Backend
   cd backend
   npm start
   
   # Terminal 2: Start Frontend
   cd frontend
   npm run dev
   ```
   
   **Option B: Using root package.json**
   ```bash
   # Start both frontend and backend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret for JWT tokens | `your-secret-key` |
| `GEMINI_API_KEY` | Google Gemini API key | `AI...` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

## 📂 Project Structure

```
mindloom/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   └── api/          # API service functions
│   └── public/
├── backend/           # Node.js backend application
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Express middleware
│   │   └── utils/        # Utility functions
│   └── data/            # Seed data
└── README.md
```

## 🧪 Available Scripts

### Root Scripts
- `npm run dev` - Start both frontend and backend
- `npm install` - Install all dependencies

### Frontend Scripts (from `/frontend`)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend Scripts (from `/backend`)
- `npm start` - Start server with nodemon
- `npm run data:import` - Import seed data
- `npm run data:destroy` - Clear database
