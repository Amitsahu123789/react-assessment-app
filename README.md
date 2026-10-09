# React Assessment App

A responsive, single-page assessment application built using React, Vite, and Tailwind CSS. Users can answer questions, navigate between questions, track their remaining time, and review their results.

## Features

- Start screen displaying the number of questions and time limit
- Questions loaded from a local JSON file
- Previous and Next question navigation
- Answer selection and progress tracking
- 10-minute countdown timer
- Automatic submission when the timer expires
- Progress saving and restoration using localStorage
- Score and percentage calculation
- Review of selected answers and correct answers
- Restart assessment functionality
- Responsive interface for mobile, tablet, and desktop

## Technologies Used

- React
- JavaScript (ES6+)
- Vite
- Tailwind CSS
- React Hooks: useReducer and useEffect
- JSON
- Browser localStorage

## Prerequisites

Install Node.js and npm.

Verify your installation:

```bash
node -v
npm -v
```

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Amitsahu123789/react-assessment-app.git
   ```

2. Navigate into the project folder:

   ```bash
   cd Machine test
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## Production Build

Build the application:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```text
assessment-app/
├── public/
├── src/
│   ├── data/
│   │   └── questions.json
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

The exact files may vary depending on the final implementation.

## Important Implementation Details

### State Management

The application uses React's `useReducer` hook to manage assessment state, including the current question, selected answers, remaining time, and assessment status.

Actions such as `START`, `SELECT_ANSWER`, `NEXT`, `PREVIOUS`, `TICK`, `SUBMIT`, and `RESTART` describe state transitions.

### Question Data

Assessment questions are stored in `src/data/questions.json`. Each question includes an ID, question text, available options, and the correct answer.

### Timer

The countdown timer uses `useEffect` and `setInterval`. It updates the remaining time and automatically submits the assessment when the timer reaches zero. The interval is cleaned up when it is no longer needed.

### Progress Persistence

The application uses `localStorage` to save assessment progress and restore it after
