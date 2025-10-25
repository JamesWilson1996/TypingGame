import { useState, useEffect, useRef } from "react";
import { generateRandomText } from "../utils/generateText";

export default function TypingGame({ onFinish }) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [sampleText, setSampleText] = useState(generateRandomText());
  
  const [wpm, setWpm] = useState(0);

  // ✅ Track total keystrokes
  const [totalTyped, setTotalTyped] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const containerRef = useRef(null);
  const typingTimer = useRef(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (finished) return;

    if (!startTime) setStartTime(Date.now());
    setIsTyping(true);

    // Reset idle timer
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTyping(false), 600);

    if (e.key.length === 1) {
      const nextChar = e.key;
      const expectedChar = sampleText[input.length];

      // Update total keystrokes
      setTotalTyped((prev) => prev + 1);

      // Count if correct
      if (nextChar === expectedChar) {
        setTotalCorrect((prev) => prev + 1);
      }

      // Add to input
      setInput((prev) => (prev + nextChar).slice(0, sampleText.length));
    } else if (e.key === "Backspace") {
      // Allow backspace to delete characters visually
      setInput((prev) => prev.slice(0, -1));
    }

    e.preventDefault();
  };

  // Compute accuracy + WPM continuously
  useEffect(() => {
    const acc =
      totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 100;
    setAccuracy(acc);

    if (startTime) {
      const now = Date.now();
      const timeElapsed = (now - startTime) / 1000 / 60; // minutes
      const wordsTyped = input.length / 5;
      const liveWpm =
        timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0;
      setWpm(liveWpm);
    }
  }, [totalTyped, totalCorrect, input, startTime]);

  // Finish detection
  useEffect(() => {
    if (input === sampleText) {
      const endTime = Date.now();
      const timeTaken = (endTime - startTime) / 1000 / 60;
      const words = sampleText.split(" ").length;
      const finalWpm = Math.round(words / timeTaken);
      setFinished(true);
      onFinish(finalWpm, accuracy);
    }
  }, [input, startTime, accuracy, onFinish]);

  const renderText = () => {
    const chars = sampleText.split("");
    const typed = input.split("");

    return chars.map((char, i) => {
      let color = "text-gray-400";
      if (i < typed.length) {
        color = typed[i] === char ? "text-green-600" : "text-red-500";
      }

      const isCursor = i === typed.length && !finished;
      return (
        <span key={i} className={`${color} relative`}>
          {char}
          {isCursor && (
            <span
              className={`absolute left-0 top-0 h-full w-[2px] bg-black ${
                isTyping ? "" : "animate-blink"
              }`}
            />
          )}
        </span>
      );
    });
  };

  return (
    <div className="text-center p-6">
      {/* Typing Area */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="text-lg font-mono border rounded p-6 bg-gray-50 cursor-text text-left select-none"
      >
        {renderText()}
      </div>

      {/* Live Stats */}
      {!finished && (
        <div className="mt-4 text-gray-700 text-md font-semibold flex justify-center gap-6">
          <p>
            Accuracy: <span className="text-blue-600">{accuracy}%</span>
          </p>
          <p>
            WPM: <span className="text-purple-600">{wpm}</span>
          </p>
        </div>
      )}
    </div>
  );
}
