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
      <img
        src="/bg.jpg"
        alt="Typing game cover"
        loading="eager"
        style={{ aspectRatio: '1 / 1' }}
        className="mx-auto w-full max-w-xs sm:max-w-sm md:max-w-md aspect-square object-cover rounded-md mb-6"
      />
      <h1 className="text-3xl font-bold mb-6 text-[#11463E]">Typing Speed Game</h1>
      <p className="text-gray-600 mb-8">
        Test your typing speed and compete for a spot on the leaderboard!
      </p>
      <button
        onClick={onStart}
        className="bg-[#8553e0] text-white px-6 py-3 rounded-lg shadow hover:brightness-90 transition"
      >
        Start Game
      </button>
    </motion.div>
  );
}
