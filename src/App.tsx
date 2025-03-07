import { Key, useEffect, useState } from "react";

const BASE_URL = "https://flagcdn.com/";

function App() {
  const [amountOfFlags, setAmountOfFlags] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [correctGuessCount, setCorrectGuessCount] = useState(0);
  const [imgSrc, setImgSrc] = useState("ua");
  const [userGuess, setUserGuess] = useState("");

  useEffect(() => {
    fetchFlag();
  }, []);

  const randomFlag = (obj) => {
    let randomCCA2 = Object.keys(obj)[Math.floor(Math.random() * obj.length)]; // gives abbreviation of json rendered flag (ua, fr, br etc..)
    setCorrectAnswer(obj[randomCCA2]["name"]["common"]); // set correct answer to common name of randomly selected flag

    setImgSrc(`${BASE_URL}${obj[randomCCA2]["cca2"].toLowerCase()}.svg`);
    setAmountOfFlags(obj.length);
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
      const res = await fetch(`https://restcountries.com/v3.1/region/europe`);
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
