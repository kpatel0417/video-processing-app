# Video Processing App

## Overview
This is a simple video processing application built with **Next.js** for the frontend and **Node.js/Express.js** with **FFmpeg** for the backend. The app allows users to upload two video files, process them using FFmpeg, and view the processed output.

## Features
- Upload two video files from your device.
- Process videos using FFmpeg.
- View the processed video output.
- Responsive and visually appealing UI with Tailwind CSS.

## Technologies Used
### Frontend:
- **Next.js** (React Framework)
- **Tailwind CSS** for styling

### Backend:
- **Node.js** with **Express.js**
- **Multer** for handling file uploads
- **FFmpeg** (via **fluent-ffmpeg**) for video processing
- **CORS** for handling cross-origin requests

## Installation & Setup
### Prerequisites:
- **Node.js** installed
- **FFmpeg** installed on your system

### Steps:
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/video-processing-app.git
   cd video-processing-app
   ```

2. **Install dependencies for both frontend and backend:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```
   The server will run on `http://localhost:5001`

4. **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`

## Usage
1. Open `http://localhost:3000` in your browser.
2. Select two video files and click **Process Videos**.
3. Wait for processing to complete.
4. View the processed video preview.

## Project Structure
```
/video-processing-app
│── backend
│   ├── uploads/           # Stores uploaded videos
│   ├── server.js          # Express backend
│   ├── .env               # Environment variables (if needed)
│   └── package.json       # Backend dependencies
│
│── frontend
│   ├── pages/
│   ├── components/
│   ├── styles/
│   ├── public/
│   ├── next.config.js
│   ├── package.json       # Frontend dependencies
│   └── README.md
```

## Dependencies
### Backend:
- `express`
- `cors`
- `multer`
- `fluent-ffmpeg`
- `dotenv`
- `axios`

### Frontend:
- `next`
- `react`
- `tailwindcss`


