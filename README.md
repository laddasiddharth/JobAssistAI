# AI Job Application Tracker

A full-stack application to track job applications using a Kanban board, featuring AI-powered job description parsing and resume bullet point suggestions.

## Features
- JWT Authentication
- Kanban Board (Drag and Drop)
- AI Job Parsing (OpenAI GPT-4o)
- Resume Suggestions

## Tech Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Query, dnd-kit
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose
- **Integrations**: OpenAI API

## Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Instance (Local or Atlas)
- OpenAI API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the required environment variables (see below).
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Env Variables

### Backend (`backend/.env`)
- `PORT` (default: 5000)
- `MONGO_URI`
- `JWT_SECRET`
- `OPENAI_API_KEY`

### Frontend (`frontend/.env`)
- `VITE_API_BASE_URL` (default: http://localhost:5000/api)
