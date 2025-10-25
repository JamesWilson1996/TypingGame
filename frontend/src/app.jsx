import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StartScreen from "./components/StartScreen";
import TypingGame from "./components/TypingGame";
import Leaderboard from "./components/Leaderboard";
import { submitScore } from "./api";

export default function App() {
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleStart = () => setStarted(true);
  const handleFinish = (speed, acc) => {
      setWpm(speed);
      setAccuracy(acc);
    };
  const handleSubmit = async () => {
    if (!name) return alert("Please enter your name!");
    await submitScore(name, wpm);
    setSubmitted(true);
  };

  const handleRestart = () => {
    setStarted(false);
    setWpm(null);
    setName("");
    setSubmitted(false);
  };

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded shadow bg-white overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Start Screen */}
        {!started && (
          <motion.div
            key="start"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <StartScreen onStart={handleStart} />
          </motion.div>
        )}

        {/* Typing Game */}
        {started && !wpm && (
          <motion.div
            key="game"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <TypingGame onFinish={handleFinish} />
          </motion.div>
        )}

        {/* Results Screen */}
        {wpm && !submitted && (
          <motion.div
            key="result"
            className="text-center space-y-4"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
           <p className="text-lg">
              Your speed: <b>{wpm} WPM</b>
            </p>
            <p className="text-lg text-blue-600">
              Accuracy: <b>{accuracy}%</b>
            </p>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 rounded"
            />
            <div className="flex justify-center gap-3">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Score
              </button>
              <button
                onClick={handleRestart}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Restart
              </button>
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        {submitted && (
          <motion.div
            key="leaderboard"
            className="text-center"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <Leaderboard />
            <button
              onClick={handleRestart}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}