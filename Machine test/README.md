# React Assessment App

A responsive single-page assessment application developed using React, Vite, and Tailwind CSS. Users can take a timed assessment, navigate between questions, save their progress, and review their results.

## Features

- Start screen displaying the number of questions and time limit
- Ten questions loaded from a local JSON file
- Previous and Next question navigation
- Answer selection and progress tracking
- 10-minute countdown timer
- Automatic submission when the timer expires
- Progress persistence using browser localStorage
- Score and percentage calculation
- Review of selected answers and correct answers
- Restart assessment functionality
- Responsive design for mobile, tablet, and desktop screens

## Technologies Used

- React.js
- JavaScript (ES6+)
- Vite
- Tailwind CSS
- React Hooks: useReducer and useEffect
- JSON
- Browser localStorage

## Prerequisites

Install Node.js and npm before running the application.

Check your installation:

```bash
node -v
npm -v
```

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Amitsahu123789/react-assessment-app.git
```

### 2. Navigate to the Project Folder

```bash
cd react-assessment-app
```

If your React application is inside the `Machine test` subfolder, run:

```bash
cd "Machine test"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Application

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually:

http://localhost:5173

## Production Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Important Implementation Details

### 1. State Management with useReducer

The application uses React's `useReducer` hook to manage the assessment state, including the current question,
