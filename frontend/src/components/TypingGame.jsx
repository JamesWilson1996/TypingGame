import { useState, useEffect, useRef } from "react";
import { generateRandomText } from "../utils/generateText";

export default function TypingGame({ onFinish }) {
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [finished, setFinished] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [sampleText, setSampleText] = useState(generateRandomText(200));
  
  const [wpm, setWpm] = useState(0);

  const TEST_DURATION_SECONDS = 30;
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SECONDS);

  // ✅ Track total keystrokes
  const [totalTyped, setTotalTyped] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);

  const containerRef = useRef(null);
  const typingTimer = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (finished) return;

    if (!startTime) {
      const now = Date.now();
      setStartTime(now);
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
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

  useEffect(() => {
    return () => {
      clearInterval(countdownRef.current);
      clearTimeout(typingTimer.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !finished) {
      setFinished(true);
      const wordsTyped = input.length / 5;
      const finalWpm = Math.round(wordsTyped / (TEST_DURATION_SECONDS / 60));
      const finalAccuracy = totalTyped > 0 ? Math.round((totalCorrect / totalTyped) * 100) : 100;
      onFinish(finalWpm, finalAccuracy);
    }
  }, [timeLeft, finished, input.length, totalTyped, totalCorrect, onFinish]);

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
        className="w-full max-w-full font-mono border border-gray-200 rounded-lg bg-gray-50 cursor-text text-left select-none
                   text-base sm:text-lg md:text-xl lg:text-2xl
                   p-4 sm:p-6 md:p-8
                   min-h-[30vh] sm:min-h-[38vh] md:min-h-[45vh] lg:min-h-[52vh]
                   max-h-[70vh] overflow-y-auto"
      >
        {renderText()}
      </div>

      {/* Live Stats */}
      {!finished && (
        <div className="mt-4 text-gray-700 text-md font-semibold flex justify-center gap-6">
          <p>
            Time: <span className="text-red-600">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
          </p>
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
