import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Sample questions
const questions = [
  {
    word: "Ebullient",
    options: [
      { text: "Cheerful and full of energy", correct: true },
      { text: "Socially awkward", correct: false },
      { text: "Highly intelligent", correct: false },
      { text: "Physically strong", correct: false },
    ],
    explanation:
      "Ebullient describes someone overflowing with enthusiasm or excitement.",
  },
  {
    word: "Obfuscate",
    options: [
      { text: "To make clear", correct: false },
      { text: "To confuse or obscure", correct: true },
      { text: "To legally certify", correct: false },
      { text: "To physically strengthen", correct: false },
    ],
    explanation:
      "Obfuscate means to deliberately make something unclear or difficult to understand.",
  },
  {
    word: "Perspicacious",
    options: [
      { text: "Highly perceptive", correct: true },
      { text: "Overly critical", correct: false },
      { text: "Physically agile", correct: false },
      { text: "Artistically talented", correct: false },
    ],
    explanation:
      "Perspicacious describes someone having keen mental perception and understanding.",
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [progress, setProgress] = useState(0);

  // If not configured elsewhere, call toast.configure() here or in App.js
  // toast.configure();

  useEffect(() => {
    // Update progress (0 to 100)
    setProgress(((currentQuestion + 1) / questions.length) * 100);
  }, [currentQuestion]);

  const handleAnswer = (correct) => {
    if (correct) {
      setScore((prev) => prev + 1);
      toast.success("Correct! 🎉", { autoClose: 1500 });
    } else {
      toast.error("Incorrect 😞", { autoClose: 1500 });
    }
    setIsCorrect(correct);

    // Move to next question after a short delay
    setTimeout(() => {
      const nextQ = currentQuestion + 1;
      if (nextQ < questions.length) {
        setCurrentQuestion(nextQ);
        setIsCorrect(null);
      } else {
        setShowScore(true);
      }
    }, 1800);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setIsCorrect(null);
  };

  // Navigate back (browser history)
  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="quiz-container">
      <button className="back-button" onClick={goBack} aria-label="Go back">
        &larr; Back
      </button>

      <div className="quiz-box">
        {/* Reduce title size for mobile */}
        <h2 className="quiz-title">Vocabulary Quiz</h2>
        
        {/* Make instructions more concise */}
        <p className="quiz-instructions">
          Choose the correct definition
        </p>

        {/* Progress section */}
        <div className="progress-container">
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="progress-text">
            {currentQuestion + 1} / {questions.length}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showScore ? (
            // Final Score Screen
            <motion.div
              key="score"
              className="score-screen"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -25 }}
            >
              <h2>Your Score: {score}/{questions.length}</h2>
              <p>
                {score === questions.length
                  ? "Perfect Score! 🎯"
                  : "Keep Practicing! 💪"}
              </p>
              <button onClick={resetQuiz} className="restart-button">
                Try Again
              </button>
            </motion.div>
          ) : (
            // Question/Option Screen
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header row */}
              <div className="quiz-header">
                <span className="question-number">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="score-tracker">Score: {score}</span>
              </div>

              {/* The word being quizzed */}
              <h1 className="quiz-word">
                {questions[currentQuestion].word}
              </h1>

              {/* Options */}
              <div className="quiz-options">
                {questions[currentQuestion].options.map((option, index) => {
                  let btnClass = "quiz-option";
                  if (isCorrect !== null) {
                    if (option.correct) {
                      btnClass += " correct";
                    } else if (!option.correct && isCorrect === false) {
                      btnClass += " incorrect";
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswer(option.correct)}
                      disabled={isCorrect !== null}
                      className={btnClass}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {option.text}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation box (appears after user chooses) */}
              {isCorrect !== null && (
                <motion.div
                  className="analysis-box"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ marginTop: "1.5rem" }}
                >
                  <p>
                    <strong>Explanation:</strong>{" "}
                    {questions[currentQuestion].explanation}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
