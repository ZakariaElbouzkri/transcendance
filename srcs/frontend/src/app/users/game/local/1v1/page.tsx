"use client"
import { useState } from "react"
import styles from "./EntreInfos.module.css"
import MapLocal from "@/components/tournement/localTournement/MapLocal/MapLocal"
import EntreInfos1v1 from "@/components/tournement/localTournement/EntreInfos1v1/EntreInfos1v1"
import GameComponent1v1 from "@/app/users/gameArenaLocal1v1/page"

const OneVsOne = () => {
  const [players, setPlayers] = useState({player1 : "", player2: ""});
  const [page, setPage] = useState<string>("chosePlayers")

  return (
    <div className={styles.container}>
      {page === "chosePlayers" && <EntreInfos1v1 setPage={setPage} setPlayers={setPlayers} players={players }/>}
      {page === "map" && <MapLocal setPage={setPage} />}
      {page === "startedGame" && (
          <GameComponent1v1 setPage={setPage} player1={players.player1} player2={players.player2} />
      )}
    </div>
  )
}

export default OneVsOne

