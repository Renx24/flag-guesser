import { useEffect, useState } from "react";

const BASE_URL = "https://flagcdn.com/";

function App() {
  const [amountOfFlags, setAmountOfFlags] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [correctGuessCount, setCorrectGuessCount] = useState(0);
  const [imgSrc, setImgSrc] = useState("https://flagcdn.com/w320/ua.svg");
  const [userGuess, setUserGuess] = useState("");

  useEffect(() => {
    fetchFlag();
  }, []);

  const randomFlag = (obj) => {
    let keys = Object.keys(obj);
    let newFlag = Object.keys(obj)[Math.floor(Math.random() * keys.length)];
    setCorrectAnswer(obj[newFlag]);

    setImgSrc(`${BASE_URL}${newFlag}.svg`);
    setAmountOfFlags(keys.length);
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
      const res = await fetch(`https://flagcdn.com/en/codes.json`);
      const data = await res.json();
      randomFlag(data);
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
