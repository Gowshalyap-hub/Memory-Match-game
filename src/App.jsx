
import { useState, useEffect } from "react";

const emojis = [
  "🍎", "🍌", "🍇", "🍉",
  "🍓", "🍒", "🥝", "🍍"
];

const createCards = () =>
  [...emojis, ...emojis]
    .map((emoji, index) => ({
      id: index,
      emoji,
      matched: false,
    }))
    .sort(() => Math.random() - 0.5);

export default function App() {
  const [cards, setCards] = useState(createCards);
  const [flipped, setFlipped] = useState([]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Timer
  useEffect(() => {
    if (!started || gameOver) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, gameOver]);

  // Check matching cards
  useEffect(() => {
    if (flipped.length !== 2) return;

    const [first, second] = flipped;

    if (cards[first].emoji === cards[second].emoji) {
      const updatedCards = cards.map((card, index) =>
        index === first || index === second
          ? { ...card, matched: true }
          : card
      );

      setCards(updatedCards);
      setFlipped([]);

      if (updatedCards.every((card) => card.matched)) {
        setGameOver(true);
      }
    } else {
      const timeout = setTimeout(() => {
        setFlipped([]);
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [flipped, cards]);

  // Flip card
  const handleCardClick = (index) => {
    if (
      flipped.length === 2 ||
      flipped.includes(index) ||
      cards[index].matched ||
      gameOver
    ) {
      return;
    }

    setStarted(true);
    setMoves((prev) => prev + 1);
    setFlipped((prev) => [...prev, index]);
  };

  // Restart game
  const restartGame = () => {
    setCards(createCards());
    setFlipped([]);
    setMoves(0);
    setSeconds(0);
    setStarted(false);
    setGameOver(false);
  };

  // Format timer
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      secs
    ).padStart(2, "0")}`;
  };

  const matchedPairs = cards.filter((card) => card.matched).length / 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-green-950 to-slate-950 flex items-center justify-center p-4">

      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3">
            🧠 Memory Match
          </h1>

          <p className="text-purple-200">
            Flip the cards and find all matching pairs!
          </p>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-3 gap-3 mb-8">

          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-purple-200 text-sm">Moves</p>
            <h2 className="text-2xl font-bold text-white">
              {moves}
            </h2>
          </div>

          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-purple-200 text-sm">Time</p>
            <h2 className="text-2xl font-bold text-white">
              {formatTime(seconds)}
            </h2>
          </div>

          <div className="bg-white/10 rounded-xl p-3 text-center">
            <p className="text-purple-200 text-sm">Pairs</p>
            <h2 className="text-2xl font-bold text-white">
              {matchedPairs}/8
            </h2>
          </div>

        </div>

        {/* Game Cards */}
        <div className="grid grid-cols-4 gap-3 sm:gap-4">

          {cards.map((card, index) => {
            const isFlipped =
              flipped.includes(index) || card.matched;

            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={card.matched || gameOver}
                className={`aspect-square rounded-2xl text-3xl sm:text-5xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg
                  ${
                    isFlipped
                      ? "bg-white rotate-0"
                      : "bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500"
                  }
                  ${
                    card.matched
                      ? "opacity-60 cursor-default"
                      : "cursor-pointer"
                  }`}
              >
                {isFlipped ? card.emoji : "❓"}
              </button>
            );
          })}

        </div>

        {/* Game Status */}
        {gameOver && (
          <div className="mt-7 text-center bg-green-500/20 border border-green-400 rounded-2xl p-5">
            <h2 className="text-3xl font-bold text-green-300 mb-2">
              🎉 You Won!
            </h2>

            <p className="text-white">
              Completed in {moves} moves and {formatTime(seconds)}!
            </p>
          </div>
        )}

        {/* Restart Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={restartGame}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer"
          >
            🔄 Restart Game
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-purple-300 text-sm mt-6">
          Find all 8 matching pairs to win!
        </p>

      </div>
    </div>
  );
}
