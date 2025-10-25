import { motion } from "framer-motion";

export default function StartScreen({ onStart }) {
  return (
    <motion.div
      key="start"
      className="text-center p-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">Typing Speed Game</h1>
      <p className="text-gray-600 mb-8">
        Test your typing speed and compete for a spot on the leaderboard!
      </p>
      <button
        onClick={onStart}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
      >
        Start Game
      </button>
    </motion.div>
  );
}