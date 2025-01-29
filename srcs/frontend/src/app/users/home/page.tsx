"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import classes from "./page.module.css"
import PlayerInfos from "../../../components/PlayerInfos/PlayerInfos"
import WeeklyAttendance from "../../../components/weeklyAttendance/WeeklyAttendance"
import Rate from "../../../components/Rate/Rate"
import ProgressBar from "../../../components/ProgressBar/ProgressBar"
import Friends from "../../../components/Friends/Friends"
import { Achievements } from "../../../components/Achievements/Achievements"
import { useUserContext } from "@/context/UserContext"
import axios from "axios"
import { MatchHistory } from "@/components/MatchHistory/MatchHistory"



const Home = () => {
  const {updateCurrentPage } = useUserContext();
  const router = useRouter()

  useEffect(() => {
    updateCurrentPage("home")
    const checkToken = async () => {
      try {
        // Use the test_auth endpoint to verify authentication
        await axios.get("http://localhost:8000/api/auth/test_auth/",{withCredentials: true})
      } catch (err) {
        console.log("Token validation error:", err);
        router.push("/auth/signin");
      } finally{
      }
    }
    checkToken();
  }, [updateCurrentPage, router])

  return (
    <div className={classes.home}>
      <div className={classes.container}>
        <div className={`${classes.box} ${classes.box1}`}>
          <PlayerInfos user="current" />
        </div>
        <div className={`${classes.box} ${classes.box2}`}>
          <WeeklyAttendance user="current" />
        </div>
        <div className={`${classes.box} ${classes.box3}`}>
          <Rate user="current"/>
        </div>
        <div className={classes.line}>
          <ProgressBar />
        </div>
        <div className={`${classes.box} ${classes.box4}`}>
          <Friends />
        </div>
        <div className={`${classes.box} ${classes.box5}`}>
          <Achievements />
        </div>
        <div className={`${classes.box} ${classes.box6}`}><MatchHistory /></div>
      </div>
    </div>
  )
}

export default Home

