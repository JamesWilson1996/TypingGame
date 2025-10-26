import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StartScreen from "./components/StartScreen";
import TypingGame from "./components/TypingGame";
import Leaderboard from "./components/Leaderboard";
import AllResults from "./components/AllResults";
import { submitScore } from "./api";

export default function App() {
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [viewAll, setViewAll] = useState(false);

  const handleStart = () => setStarted(true);
  const handleFinish = (speed, acc) => {
      setWpm(speed);
      setAccuracy(acc);
    };
  const handleSubmit = async () => {
    if (!name) return alert("Please enter your name!");
    try {
      await submitScore(name, wpm, accuracy);
      setSubmitted(true);
    } catch (err) {
      alert(`Could not save score: ${err.message || err}`);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setWpm(null);
    setName("");
    setSubmitted(false);
    setViewAll(false);
  };

  const variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="w-full mx-auto border rounded shadow bg-white overflow-hidden
                    border-[#11463E]/40
                    max-w-3xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[96rem]
                    mt-6 sm:mt-10 px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 sm:py-6">
      <AnimatePresence mode="wait">
        {/* Start Screen */}
        {!started && !submitted && !viewAll && (
          <motion.div
            key="start"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <StartScreen onStart={handleStart} onViewLeaderboard={() => setSubmitted(true)} />
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
            <TypingGame onFinish={handleFinish} onBack={handleRestart} />
          </motion.div>
        )}

        {/* Results Screen */}
        {wpm && !submitted && !viewAll && (
          <motion.div
            key="result"
            className="text-center space-y-4 sm:space-y-6 md:space-y-8 text-lg sm:text-xl md:text-2xl"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
           <p className="text-xl sm:text-2xl md:text-3xl">
              Your speed:
              {" "}
              <b>
                <span className="text-[#11463E]">{wpm} WPM</span>
                {" "}·{" "}
                <span className="text-[#8553e0]">{accuracy}%</span>
              </b>
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
        {submitted && !viewAll && (
          <motion.div
            key="leaderboard"
            className="text-center text-lg sm:text-xl md:text-2xl space-y-4 sm:space-y-6"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <Leaderboard onViewAll={() => setViewAll(true)} />
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

        {/* All Results */}
        {viewAll && (
          <motion.div
            key="allresults"
            className="text-center"
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <AllResults onBack={() => setViewAll(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
