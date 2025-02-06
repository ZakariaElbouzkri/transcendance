// In EntreInfos.tsx

"use client";
import styles from "./EntreInfos.module.css";

// 1. Define the props interface:
interface EntreInfosProps {
  setPage: React.Dispatch<React.SetStateAction<string>>; 
}

// 2. Use that interface in the component signature
const EntreInfos1v1: React.FC<EntreInfosProps> = ({ setPage, setPlayers, players }) => {


  const handleNameChange = (number: number ,value: string) => {
    if(number === 1)
      setPlayers({player1: value, player2: players.player2});
    else
      setPlayers({player1: players.player1, player2: value});
  };

  return (
    <div className={styles.container}>
      <div className={styles.playerInputs}>
        <h2 className={styles.title}>Enter Player Names :</h2>
          <div  className={styles.playerInput}>
            <label className={styles.label}>Player 1:</label>
            <input
              className={styles.input}
              type="text"
              onChange={(e) => handleNameChange(1 ,e.target.value)}
              placeholder={`Player 1 Name`}
            />
          </div>
      </div>
      <div className={styles.playerInputs}>
        <h2 className={styles.title}>Enter Player Names :</h2>
          <div  className={styles.playerInput}>
            <label className={styles.label}>Player 2:</label>
            <input
              className={styles.input}
              type="text"
              onChange={(e) => handleNameChange(2 , e.target.value)}
              placeholder={`Player 2 Name`}
            />
          </div>
      </div>
      <div className={styles.startButtonContainer}>
        {(players.player1 !== "" && players.player2 !== "") && <button className={styles.startButton} onClick={() => setPage("startedGame")}>
          Start the game
        </button>}
      </div>
    </div>
  );
};

export default EntreInfos1v1;
