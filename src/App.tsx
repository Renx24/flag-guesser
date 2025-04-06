import { useEffect, useState } from "react";
import GithubSVG from "./components/GithubSVG.tsx";

const BASE_URL = "https://flagcdn.com/";

function App() {
  const [amountOfFlags, setAmountOfFlags] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [correctGuessCount, setCorrectGuessCount] = useState(0);
  const [imgSrc, setImgSrc] = useState("");
  const [userGuess, setUserGuess] = useState("");
  const [seenFlags, setSeenFlags] = useState(new Set());
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1); // Tracks dropdown selection
  const [boxShadowColor, setBoxShadowColor] = useState<string>("");

  useEffect(() => {
    fetchFlag();
  }, []);

  const randomFlag = (obj: Record<string, string>) => {
    let keys = Object.keys(obj);
    let availableFlags = keys.filter((key) => !seenFlags.has(key));

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
    setSeenFlags((prev) => new Set([...prev, newFlag]));
  };

  const handleGuess = () => {
    setGuessCount((prev) => prev + 1);

    if (userGuess.toLowerCase().trim() === correctAnswer.toLowerCase()) {
      setCorrectGuessCount((prev) => prev + 1);
      setBoxShadowColor("0px 10px 30px green");
    } else {
      setBoxShadowColor("0px 10px 30px red");
    }

    setIsAnswerRevealed(true);
    setFilteredCountries([]); // Hide dropdown after guessing
  };

  const handleNextFlag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isAnswerRevealed) {
      setIsAnswerRevealed(false);
      setUserGuess("");
      setBoxShadowColor("");
      setFilteredCountries([]); // Clear dropdown
      fetchFlag();
    }
  };

  const fetchFlag = async () => {
    try {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();

      const countryFlags: Record<string, string> = {};
      const countryNames: string[] = [];

      data.forEach((country: any) => {
        if (country.independent) {
          let flagCode = country.cca2.toLowerCase();
          countryFlags[flagCode] = country.name.common;
          countryNames.push(country.name.common);
        }
      });

      setAllCountries(countryNames.sort());
      setAmountOfFlags(Object.keys(countryFlags).length);
      randomFlag(countryFlags);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserGuess(input);
    setSelectedIndex(-1); // Reset selection when user types

    if (input.length > 0) {
      const matches = allCountries
        .filter((country) =>
          country.toLowerCase().includes(input.toLowerCase())
        )
        .slice(0, 5);

      setFilteredCountries(matches);
    } else {
      setFilteredCountries([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault(); // Prevent cursor from moving
      setSelectedIndex((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter") {
      if (selectedIndex >= 0) {
        setUserGuess(filteredCountries[selectedIndex]);
        setSelectedIndex(-1);
        setFilteredCountries([]);
      } else if (!isAnswerRevealed) {
        handleGuess();
      } else {
        handleNextFlag(e);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUserGuess(suggestion);
    setFilteredCountries([]);
  };

  return (
    <div className="main">
      <div className="count-div">
        <div className="count total">
          {guessCount}/{amountOfFlags}
        </div>
        <div className="count correct">{correctGuessCount}</div>
        <div className="count incorrect">{guessCount - correctGuessCount}</div>
      </div>
      <img
        height="320"
        id="flag-img"
        src={imgSrc}
        alt="Flag"
        style={{
          boxShadow: boxShadowColor,
          transition: "box-shadow 0.2s ease-in-out",
        }}
      />
      <p style={{ visibility: isAnswerRevealed ? "visible" : "hidden" }}>
        Correct answer: {correctAnswer}
      </p>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={userGuess}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        {filteredCountries.length > 0 && (
          <ul>
            {filteredCountries.map((country, index) => (
              <li
                key={index}
                onClick={() => handleSuggestionClick(country)}
                style={{
                  backgroundColor:
                    selectedIndex === index ? "#f0f0f0" : "white",
                }}
              >
                {country}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button onClick={handleGuess} disabled={isAnswerRevealed}>
        GUESS
      </button>
      <footer className="github-links">
        <a href="https://github.com/Renx24/flag-guesser" target="_blank">
          Project repo
        </a>
        <a href="https://github.com/Renx24" target="_blank">
          <GithubSVG />
          Renx24
        </a>
      </footer>
    </div>
  );
}

export default App;
