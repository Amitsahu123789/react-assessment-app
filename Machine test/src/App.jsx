
import { useEffect, useReducer } from "react";
import questionsData from "./data/questions.json";

const TIME_LIMIT = 600;
const STORAGE_KEY = "react-assessment-progress";

function createInitialState() {
  const initialState = {
    questions: questionsData,
    currentQuestion: 0,
    answers: {},
    timeLeft: TIME_LIMIT,
    status: "start"
  };

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return initialState;

    const parsed = JSON.parse(saved);
    const validStatuses = ["start", "in_progress", "submitted"];

    if (
      !validStatuses.includes(parsed.status) ||
      !Number.isInteger(parsed.currentQuestion) ||
      !Number.isFinite(parsed.timeLeft) ||
      !parsed.answers ||
      typeof parsed.answers !== "object" ||
      Array.isArray(parsed.answers)
    ) {
      return initialState;
    }

    const answers = {};

    questionsData.forEach((question) => {
      const answer = parsed.answers[question.id];

      if (
        typeof answer === "string" &&
        question.options.includes(answer)
      ) {
        answers[question.id] = answer;
      }
    });

    const timeLeft = Math.max(
      0,
      Math.min(TIME_LIMIT, Math.floor(parsed.timeLeft))
    );

    return {
      ...initialState,
      currentQuestion: Math.max(
        0,
        Math.min(parsed.currentQuestion, questionsData.length - 1)
      ),
      answers,
      timeLeft,
      status:
        parsed.status === "in_progress" && timeLeft === 0
          ? "submitted"
          : parsed.status
    };
  } catch {
    return initialState;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "START":
      if (state.status !== "start") return state;

      return { ...state, status: "in_progress" };

    case "SELECT_ANSWER":
      if (state.status !== "in_progress") return state;

      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionId]: action.answer
        }
      };

    case "NEXT":
      if (state.status !== "in_progress") return state;

      return {
        ...state,
        currentQuestion: Math.min(
          state.currentQuestion + 1,
          state.questions.length - 1
        )
      };

    case "PREVIOUS":
      if (state.status !== "in_progress") return state;

      return {
        ...state,
        currentQuestion: Math.max(state.currentQuestion - 1, 0)
      };

    case "GO_TO_QUESTION":
      if (state.status !== "in_progress") return state;

      return {
        ...state,
        currentQuestion: Math.max(
          0,
          Math.min(action.index, state.questions.length - 1)
        )
      };

    case "TICK":
      if (state.status !== "in_progress") return state;

      if (state.timeLeft <= 1) {
        return {
          ...state,
          timeLeft: 0,
          status: "submitted"
        };
      }

      return {
        ...state,
        timeLeft: state.timeLeft - 1
      };

    case "SUBMIT":
      if (state.status !== "in_progress") return state;

      return { ...state, status: "submitted" };

    case "RESTART":
      return {
        questions: questionsData,
        currentQuestion: 0,
        answers: {},
        timeLeft: TIME_LIMIT,
        status: "start"
      };

    default:
      return state;
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function App() {
  const [state, dispatch] = useReducer(
    reducer,
    undefined,
    createInitialState
  );

  const { questions, currentQuestion, answers, timeLeft, status } = state;
  const question = questions[currentQuestion];

  // Save current progress whenever assessment state changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Keep the assessment usable if storage is unavailable.
    }
  }, [state]);

  // Countdown runs only during an active assessment.
  useEffect(() => {
    if (status !== "in_progress") return undefined;

    const timerId = setInterval(() => {
      dispatch({ type: "TICK" });
    }, 1000);

    return () => clearInterval(timerId);
  }, [status]);

  const score = questions.filter(
    (item) => answers[item.id] === item.correctAnswer
  ).length;

  const percentage = questions.length
    ? Math.round((score / questions.length) * 100)
    : 0;

  const answeredCount = questions.filter(
    (item) => answers[item.id] !== undefined
  ).length;

  const progress = questions.length
    ? ((currentQuestion + 1) / questions.length) * 100
    : 0;

  const pageClass =
    "min-h-screen w-full overflow-x-clip bg-slate-100 px-3 py-5 sm:px-6 sm:py-8 lg:px-8";

  const cardClass =
    "mx-auto w-full min-w-0 max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:p-6 lg:p-8";

  const primaryButton =
    "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto";

  const secondaryButton =
    "inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-center font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto";

  // START SCREEN
  if (status === "start") {
    return (
      <main className={`${pageClass} flex items-center justify-center`}>
        <section className="mx-auto w-full min-w-0 max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-lg sm:p-8 lg:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">
            📝
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Online Assessment
          </p>

          <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            React Assessment
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Test your JavaScript and React knowledge. Answer the questions
            before the timer runs out.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0 rounded-xl border border-indigo-100 bg-indigo-50 p-5">
              <p className="text-sm font-medium text-indigo-700">
                Total Questions
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {questions.length}
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Multiple-choice questions
              </p>
            </div>

            <div className="min-w-0 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
              <p className="text-sm font-medium text-emerald-700">
                Time Limit
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                10 min
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Countdown begins when you start
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-900">
              Before you begin
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-slate-600">
              <li>Navigate between questions using Previous and Next.</li>
              <li>Your answers are saved in this browser.</li>
              <li>The test submits automatically when time expires.</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: "START" })}
            className={`${primaryButton} mt-8`}
          >
            Start Assessment →
          </button>
        </section>
      </main>
    );
  }

  // RESULTS AND ANSWER REVIEW
  if (status === "submitted") {
    return (
      <main className={pageClass}>
        <section className={cardClass}>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-3xl">
              {percentage >= 70 ? "🎉" : "📘"}
            </div>

            <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Assessment Results
            </p>

            <h1 className="mt-2 break-words text-2xl font-bold text-slate-900 sm:text-3xl">
              Assessment Completed
            </h1>

            <p className="mt-3 text-slate-600">
              {percentage >= 70
                ? "Great work! Keep building your skills."
                : "Keep practising. Every attempt helps you improve."}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-600">Your Score</p>
              <p className="mt-2 text-3xl font-bold text-indigo-700">
                {score}/{questions.length}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-600">Percentage</p>
              <p className="mt-2 text-3xl font-bold text-emerald-700">
                {percentage}%
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
              <p className="text-sm text-slate-600">Answered</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {answeredCount}/{questions.length}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="font-medium text-slate-700">
                Overall performance
              </span>
              <span className="font-bold text-indigo-700">
                {percentage}%
              </span>
            </div>

            <div
              className="h-3 overflow-hidden rounded-full bg-slate-200"
              role="progressbar"
              aria-label="Assessment score"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percentage}
            >
              <div
                className="h-full rounded-full bg-indigo-600 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: "RESTART" })}
            className={`${primaryButton} mt-8`}
          >
            Restart Assessment
          </button>
        </section>

        <section className={`${cardClass} mt-6`}>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Answer Review
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-900">
            Review Your Answers
          </h2>

          <p className="mt-2 leading-6 text-slate-600">
            Compare your responses with the correct answers.
          </p>

          <div className="mt-6 space-y-5">
            {questions.map((item, index) => {
              const selectedAnswer = answers[item.id];
              const isCorrect = selectedAnswer === item.correctAnswer;
              const wasAnswered = selectedAnswer !== undefined;

              return (
                <article
                  key={item.id}
                  className={`min-w-0 rounded-xl border p-4 sm:p-5 ${
                    isCorrect
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-rose-200 bg-rose-50/40"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h3 className="min-w-0 flex-1 break-words font-semibold leading-7 text-slate-900">
                      <span className="mr-2 text-indigo-700">
                        Q{index + 1}.
                      </span>
                      {item.question}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
                        isCorrect
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {isCorrect ? "Correct" : "Incorrect"}
                    </span>
                  </div>

                  <p className="mt-4 break-words text-sm leading-6 text-slate-700">
                    <span className="font-semibold">Your answer: </span>
                    {wasAnswered ? (
                      selectedAnswer
                    ) : (
                      <span className="italic text-slate-500">
                        Not answered
                      </span>
                    )}
                  </p>

                  <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                    <span className="font-semibold">Correct answer: </span>
                    <span className="font-medium text-emerald-800">
                      {item.correctAnswer}
                    </span>
                  </p>
                </article>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => dispatch({ type: "RESTART" })}
            className={`${primaryButton} mt-8`}
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  // ACTIVE ASSESSMENT SCREEN
  return (
    <main className={pageClass}>
      <section className={cardClass}>
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
              Online Assessment
            </p>
            <h1 className="mt-1 break-words text-xl font-bold text-slate-900 sm:text-2xl">
              React Knowledge Test
            </h1>
          </div>

          <div
            className={`w-fit shrink-0 rounded-xl px-4 py-3 font-mono text-lg font-bold ${
              timeLeft <= 60
                ? "bg-rose-100 text-rose-700"
                : "bg-indigo-50 text-indigo-700"
            }`}
            role="timer"
            aria-label={`Time remaining: ${formatTime(timeLeft)}`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="font-semibold text-slate-700">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-slate-500">
              {answeredCount} of {questions.length} answered
            </span>
          </div>

          <div
            className="h-2.5 overflow-hidden rounded-full bg-slate-200"
            role="progressbar"
            aria-label="Question progress"
            aria-valuemin={0}
            aria-valuemax={questions.length}
            aria-valuenow={currentQuestion + 1}
          >
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-8 min-w-0">
          <h2 className="break-words text-lg font-semibold leading-8 text-slate-900 sm:text-xl">
            {question.question}
          </h2>

          <div className="mt-5 space-y-3">
            {question.options.map((option, index) => {
              const isSelected = answers[question.id] === option;

              return (
                <label
                  key={`${question.id}-${option}`}
                  className={`flex min-w-0 cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-200"
                      : "border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={isSelected}
                    onChange={() =>
                      dispatch({
                        type: "SELECT_ANSWER",
                        questionId: question.id,
                        answer: option
                      })
                    }
                    className="mt-1 h-4 w-4 shrink-0 accent-indigo-600"
                  />

                  <span className="flex min-w-0 flex-1 gap-3">
                    <span className="shrink-0 font-semibold text-slate-500">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="min-w-0 break-words text-slate-700">
                      {option}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => dispatch({ type: "PREVIOUS" })}
            disabled={currentQuestion === 0}
            className={secondaryButton}
          >
            ← Previous
          </button>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
            {currentQuestion < questions.length - 1 && (
              <button
                type="button"
                onClick={() => dispatch({ type: "NEXT" })}
                className={primaryButton}
              >
                Next →
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to submit your assessment?"
                  )
                ) {
                  dispatch({ type: "SUBMIT" });
                }
              }}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 sm:w-auto"
            >
              Submit Assessment
            </button>
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          Your progress is saved automatically in this browser.
        </p>
      </section>
    </main>
  );
}

export default App;
