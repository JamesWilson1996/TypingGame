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

  // Accuracy will be derived from typed characters vs expected
  // Track total characters from correctly completed words (including spaces)
  const [completedCorrectChars, setCompletedCorrectChars] = useState(0);
  const [completionTime, setCompletionTime] = useState(null);

  const containerRef = useRef(null);
  const typingTimer = useRef(null);
  const countdownRef = useRef(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const resetTest = () => {
    clearInterval(countdownRef.current);
    clearTimeout(typingTimer.current);
    setInput("");
    setStartTime(null);
    setFinished(false);
    setIsTyping(false);
    setAccuracy(100);
    setSampleText(generateRandomText(200));
    setWpm(0);
    setCompletedCorrectChars(0);
    setCompletionTime(null);
    setTimeLeft(TEST_DURATION_SECONDS);
    // refocus the typing area
    setTimeout(() => containerRef.current?.focus(), 0);
  };

  const handleKeyDown = (e) => {
    if (finished) return;

    // Reset the test with Tab
    if (e.key === "Tab") {
      e.preventDefault();
      resetTest();
      return;
    }

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
      // Add to input
      setInput((prev) => (prev + nextChar).slice(0, sampleText.length));
      // If a word boundary is reached and the word is fully correct, record completion
      if (nextChar === " " && expectedChar === " ") {
        const newLen = Math.min(input.length + 1, sampleText.length);
        const lastSpaceIdx = input.lastIndexOf(" ");
        const wordStart = lastSpaceIdx + 1;
        const typedWord = input.slice(wordStart); // current word without the trailing space
        const expectedWord = sampleText.slice(wordStart, wordStart + typedWord.length);
        const isWordCorrect = typedWord.length > 0 && typedWord === expectedWord;
        if (isWordCorrect) {
          // Add the correctly completed word length plus the space
          setCompletedCorrectChars((prev) => prev + typedWord.length + 1);
          setCompletionTime(Date.now());
        }
      }
    } else if (e.key === "Backspace") {
      // Allow backspace to delete characters visually
      setInput((prev) => prev.slice(0, -1));
    }

    e.preventDefault();
  };

  // Compute accuracy + WPM continuously
  useEffect(() => {
    // Per-letter accuracy based on current input vs sample
    if (input.length === 0) {
      setAccuracy(100);
    } else {
      let correct = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] === sampleText[i]) correct++;
      }
      setAccuracy(Math.round((correct / input.length) * 100));
    }

    // Live WPM updates only when a word is completed correctly
    if (startTime && completionTime && completedCorrectChars > 0) {
      const minutes = (completionTime - startTime) / 1000 / 60;
      const words = completedCorrectChars / 5;
      const liveWpm = minutes > 0 ? Math.round(words / minutes) : 0;
      setWpm(liveWpm);
    } else if (!startTime || completedCorrectChars === 0) {
      setWpm(0);
    }
  }, [input, sampleText, startTime, completedCorrectChars, completionTime]);

  useEffect(() => {
    return () => {
      clearInterval(countdownRef.current);
      clearTimeout(typingTimer.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0 && !finished) {
      setFinished(true);
      // Final WPM based on correctly completed words only
      let finalWpm = 0;
      if (startTime && completionTime && completedCorrectChars > 0) {
        const minutes = (completionTime - startTime) / 1000 / 60;
        const words = completedCorrectChars / 5;
        finalWpm = minutes > 0 ? Math.round(words / minutes) : 0;
      }
      // Per-letter final accuracy
      let correct = 0;
      for (let i = 0; i < input.length; i++) {
        if (input[i] === sampleText[i]) correct++;
      }
      const finalAccuracy = input.length > 0 ? Math.round((correct / input.length) * 100) : 0;
      onFinish(finalWpm, finalAccuracy);
    }
  }, [timeLeft, finished, startTime, completionTime, completedCorrectChars, input, sampleText, onFinish]);

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
              className={`absolute left-0 top-0 h-full w-[2px] bg-[#8553e0] ${
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
      {/* Live Stats (top-right) */}
      {!finished && (
        <div className="mb-4 flex justify-start">
          <div className="flex items-center gap-6 text-right text-lg sm:text-xl md:text-2xl font-semibold text-gray-700">
            <p>
              Time: <span className="text-[#11463E]">{String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}</span>
            </p>
            <p>
              Accuracy: <span className="text-[#8553e0]">{accuracy}%</span>
            </p>
            <p>
              WPM: <span className="text-[#8553e0]">{wpm}</span>
            </p>
          </div>
        </div>
      )}

      {/* Typing Area */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="w-full max-w-full font-mono border-2 border-gray-200 rounded-lg bg-gray-50 cursor-text text-left select-none
                   text-base sm:text-lg md:text-xl lg:text-2xl
                   p-4 sm:p-6 md:p-8 outline-none focus:outline-none
                   focus:ring-2 focus:ring-[#8553e0] focus:border-[#8553e0]
                   hover:border-[#11463E]
                   min-h-[30vh] sm:min-h-[38vh] md:min-h-[45vh] lg:min-h-[52vh]
                   max-h-[70vh] overflow-y-auto"
      >
        {renderText()}
      </div>
    </div>
  );
}
