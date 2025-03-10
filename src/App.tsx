import { useEffect, useState } from "react";

const BASE_URL = "https://flagcdn.com/";

function App() {
  const [amountOfFlags, setAmountOfFlags] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [correctGuessCount, setCorrectGuessCount] = useState(0);
  const [imgSrc, setImgSrc] = useState("ua");
  const [userGuess, setUserGuess] = useState("");
  const [seenFlags, setSeenFlags] = useState(new Set());

  useEffect(() => {
    fetchFlag();
  }, []);

  const randomFlag = (obj) => {
    let keys = Object.keys(obj);
    let availableFlags = keys.filter((key) => !seenFlags.has(key)); // Get only unseen flags

    if (availableFlags.length === 0) {
      alert(
        `Game Over! You've guessed all the flags. Correct guesses: ${correctGuessCount}/${guessCount}`
      );
      return;
    }

    let newFlag =
      availableFlags[Math.floor(Math.random() * availableFlags.length)];

    setImgSrc(`${BASE_URL}${newFlag}.svg`);
    setCorrectAnswer(obj[newFlag]);
    setSeenFlags((prev) => new Set([...prev, newFlag])); // Add flag to seen list
  };

  const handleGuess = () => {
    setGuessCount((prev) => prev + 1);

    if (userGuess.toLowerCase().trim() === correctAnswer.toLowerCase())
      setCorrectGuessCount((prev) => prev + 1);

    setIsAnswerRevealed(true);
  };

  const handleNextFlag = (e) => {
    if (e.key === "Enter" && isAnswerRevealed) {
      setIsAnswerRevealed(false);
      setUserGuess("");
      fetchFlag();
    }
  };

  const fetchFlag = async () => {
    try {
      const res = await fetch("https://restcountries.com/v3.1/all"); // Fetch country data
      const data = await res.json();

      // Convert data into a flag-code-to-name mapping (only independent countries)
      const countryFlags = {};
      data.forEach((country) => {
        if (country.independent) {
          let flagCode = country.cca2.toLowerCase(); // Get country code (e.g., "us", "fr")
          countryFlags[flagCode] = country.name.common; // Store name
        }
      });

      setAmountOfFlags(Object.keys(countryFlags).length);
      randomFlag(countryFlags);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main">
      <p>
        Guesses: {guessCount}/{amountOfFlags}
      </p>
      <p>
        Correct guesses: {correctGuessCount}/{guessCount}
      </p>
      <img height="320" id="flag-img" src={imgSrc} alt="Flag" />
      <p style={{ visibility: isAnswerRevealed ? "visible" : "hidden" }}>
        Correct answer: {correctAnswer}
      </p>
      <input
        type="text"
        value={userGuess}
        onChange={(e) => setUserGuess(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (!isAnswerRevealed) {
              handleGuess();
            } else {
              handleNextFlag(e);
            }
          }
        }}
      />
      <button onClick={handleGuess} disabled={isAnswerRevealed}>
        GUESS
      </button>
    </div>
  );
}

export default App;
