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
    <div className="w-full mx-auto border rounded shadow bg-white overflow-hidden
                    border-[#11463E]/40
                    max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl
                    mt-6 sm:mt-10 px-4 sm:px-6 md:px-8 py-4 sm:py-6">
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
            className="text-center space-y-4 sm:space-y-6 md:space-y-8 text-lg sm:text-xl md:text-2xl"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
           <p className="text-xl sm:text-2xl md:text-3xl text-[#11463E]">
              Your speed: <b>{wpm} WPM</b>
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl text-[#8553e0]">
              Accuracy: <b>{accuracy}%</b>
            </p>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded w-full sm:w-2/3 md:w-1/2 max-w-md
                         p-3 sm:p-4 text-base sm:text-lg md:text-xl"
            />
            <div className="flex justify-center gap-3 sm:gap-4 md:gap-6">
              <button
                onClick={handleSubmit}
                className="bg-[#8553e0] text-white rounded hover:brightness-90
                           px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5
                           text-base sm:text-lg"
              >
                Save Score
              </button>
              <button
                onClick={handleRestart}
                className="bg-[#11463E] text-white rounded hover:brightness-90
                           px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5
                           text-base sm:text-lg"
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
            className="text-center text-lg sm:text-xl md:text-2xl space-y-4 sm:space-y-6"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <Leaderboard />
            <button
              onClick={handleRestart}
              className="mt-4 bg-[#8553e0] text-white rounded hover:brightness-90
                         px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5
                         text-base sm:text-lg"
            >
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
