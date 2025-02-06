// In EntreInfos.tsx

"use client";
import React, { useEffect } from "react";
import styles from "./EntreInfos.module.css";
import { useUserContext } from "@/context/UserContext";

// 1. Define the props interface:
interface EntreInfosProps {
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

// 2. Use that interface in the component signature
const EntreInfos: React.FC<EntreInfosProps> = ({ setPage }) => {
  const { localTournementNames, setLocalTournementNames } = useUserContext();

  useEffect(() => {
    setLocalTournementNames(["", "", "", ""]);
  }, [setLocalTournementNames]);

  const handleNameChange = (index: number, value: string) => {
    const updatedNames = [...localTournementNames];
    updatedNames[index] = value;
    setLocalTournementNames(updatedNames);
  };

  return (
    <div className={styles.container}>
      <div className={styles.playerInputs}>
        <h2 className={styles.title}>Enter Player Names :</h2>
        {localTournementNames.map((name, index) => (
          <div key={index} className={styles.playerInput}>
            <label className={styles.label}>Player {index + 1}:</label>
            <input
              className={styles.input}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Player ${index + 1} Name`}
            />
          </div>
        ))}
      </div>
      <div className={styles.startButtonContainer}>
       {(localTournementNames[0] !== "" && localTournementNames[1] !== "" && localTournementNames[2] !== "" && localTournementNames[3] !== "") && <button className={styles.startButton} onClick={() => setPage("map")}>
          Start the game
        </button>}
      </div>
    </div>
  );
};

export default EntreInfos;
