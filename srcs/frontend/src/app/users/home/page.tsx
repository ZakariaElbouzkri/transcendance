"use client"
import React, { useEffect } from 'react'
import classes from "./page.module.css"
import PlayerInfos from '../../../components/PlayerInfos/PlayerInfos'
import WeeklyAttendance from '../../../components/weeklyAttendance/WeeklyAttendance'
import Rate from '../../../components/Rate/Rate'
import ProgressBar from '../../../components/ProgressBar/ProgressBar'
import Friends from '../../../components/Friends/Friends'
import { Achievements } from '../../../components/Achievements/Achievements'
import { useUserContext } from '@/context/UserContext'
import axios from 'axios'

const Home = () => {
  const { updateUserData, updateCurrentPage } = useUserContext();

  useEffect(() => {
    updateCurrentPage("home");
  }, [updateCurrentPage]);

  return (
    <div className={classes.home}>
      <div className={classes.container}>
        <div className={`${classes.box} ${classes.box1}`}>
          <PlayerInfos user="current"/>
        </div>
        <div className={`${classes.box} ${classes.box2}`}>
          <WeeklyAttendance user="current"/>
        </div>
        <div className={`${classes.box} ${classes.box3}`}>
          <Rate/>
        </div>
        <div className={classes.line}>
          <ProgressBar/>
        </div>
        <div className={`${classes.box} ${classes.box4}`}>
          <Friends/>
        </div>
        <div className={`${classes.box} ${classes.box5}`}>
          <Achievements/>
        </div>
        <div className={`${classes.box} ${classes.box6}`}>
          {/* Content for box6 */}
        </div>
      </div>
    </div>
  )
}

export default Home

