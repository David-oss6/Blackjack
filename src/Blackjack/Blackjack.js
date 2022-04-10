import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style/main.css";

export default function Blackjack() {
  const [decks, setDecks] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [ace, setAce] = useState(0);
  const [plantar, setPlantar] = useState(false);

  const [iaCards, setIaCards] = useState([]);
  const [iaScore, setIaScore] = useState(0);
  const [iaAce, setIaAce] = useState(0);

  const [finish, setFinish] = useState({
    playing: true,
    winner: null,
  });

  async function getCards() {
    let list = [];
    let count = 0;
    while (count < 6) {
      await axios("https://deckofcardsapi.com/api/deck/new/shuffle").then(
        (res) => list.push(res.data.deck_id)
      );
      count++;
    }
    setDecks(list);
  }
  useEffect(() => {
    getCards();
  }, []);

  //TRAS DRAWCARD() ENVIAMOS EL VALOR (RES) Y X (PARA DEFINIR SI E VALOR ES DEL JUGADOR O LA IA)

  // PLAYER FUNCTIONS ************************************
  const handlePlayerScore = (res) => {
    let newCard = 0;
    if (res === "QUEEN") {
      newCard = 10;
    } else if (res === "KING") {
      newCard = 10;
    } else if (res === "JACK") {
      newCard = 10;
    } else if (res === "ACE") {
      ace += 1;
      setAce(ace + 1);
      if (playerScore >= 10) {
        newCard = 1;
      } else {
        newCard = 11;
      }
    } else {
      newCard = res;
    }
    newCard = parseInt(newCard);
    setPlayerScore(playerScore + newCard);
  };

  const handleIaScore = (res) => {
    let newCard;
    if (res === "QUEEN") {
      newCard = 10;
    } else if (res === "KING") {
      newCard = 10;
    } else if (res === "JACK") {
      newCard = 10;
    } else if (res === "ACE") {
      iaAce += 1;
      setIaAce(iaAce + 1);
      if (iaScore >= 10) {
        newCard = 1;
      } else {
        newCard = 11;
      }
    } else {
      newCard = res;
    }
    newCard = parseInt(newCard);
    setIaScore(iaScore + newCard);
  };
  useEffect(() => {
    if (playerScore > 21 && ace === 0) {
      setFinish({
        playing: false,
        winner: "IA",
      });
    } else if (playerScore > 21 && ace > 0) {
      setPlayerScore(playerScore - 10);
      setAce(ace - 1);
    } else if (playerScore === 21) {
      setFinish({
        playing: false,
        winner: "Player",
      });
    } else if (iaScore > 21) {
      setFinish({
        playing: false,
        winner: "Player",
      });
    } else {
      if (plantar && playerScore > iaScore) {
        iaDrawCard();
      } else if (plantar && iaScore > playerScore && iaScore < 22) {
        setFinish({
          playing: false,
          winner: "IA",
        });
      }
    }
  }, [playerScore, iaScore]);

  const playerDrawCard = async () => {
    if (finish.playing) {
      try {
        let res = await axios(
          `https://deckofcardsapi.com/api/deck/${
            decks[Math.floor(Math.random() * 6)]
          }/draw/?count=1`
        );
        res = await res.data.cards[0];

        handlePlayerScore(res.value);
        setPlayerCards([...playerCards, res]);
      } catch (error) {
        console.log("errorr", playerCards);
      }
    }
  };

  const iaDrawCard = async () => {
    try {
      let res = await axios(
        `https://deckofcardsapi.com/api/deck/${
          decks[Math.floor(Math.random() * 6)]
        }/draw/?count=1`
      );
      res = await res.data.cards[0];
      setIaCards([...iaCards, res]);
      handleIaScore(res.value);
    } catch (error) {
      console.log("errorr", iaCards);
    }
  };

  const stand = () => {
    setPlantar(true);
    iaDrawCard();
  };

  const handleReset = () => {
    setPlayerCards([]);
    setPlayerScore(0);
    setIaCards([]);
    setIaScore(0);
    setPlantar(false);
    setFinish({
      playing: true,
      winner: null,
    });
  };

  return (
    <div className="game">
      <h1>Blackjack</h1>
      <button onClick={() => playerDrawCard()}>Draw Card</button>
      <button onClick={() => stand()}>Stand</button>
      <button onClick={() => handleReset()}>Reset</button>
      <div className="stage">
        <div className="player_cards">
          {playerCards &&
            playerCards.map((card, index) => (
              <img
                key={index}
                className={`player_card${index}`}
                src={card.image}
                alt="card"
                title={card.code}
              />
            ))}
        </div>
        <div className="ia_cards">
          {iaCards &&
            iaCards.map((card, index) => (
              <img
                className={`player_card${index}`}
                key={index}
                src={card.image}
                alt="card"
                title={card.code}
              />
            ))}
        </div>
      </div>

      {playerScore > 0 && <h3>{playerScore}</h3>}
      {iaScore > 0 && <h3>{iaScore}</h3>}
      {finish.playing ? "" : <p>{finish.winner} wins</p>}
    </div>
  );
}
