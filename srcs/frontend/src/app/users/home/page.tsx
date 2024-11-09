"use client"
import React, { useContext, useEffect, useState } from 'react'
import classes from "./page.module.css"
import PlayerInfos from '../../../components/PlayerInfos/PlayerInfos'
import WeeklyAttendance from '../../../components/weeklyAttendance/WeeklyAttendance'
import Rate from '../../../components/Rate/Rate'
import ProgressBar from '../../../components/ProgressBar/ProgressBar'
import Friends from '../../../components/Friends/Friends'
import { Achievements } from '../../../components/Achievements/Achievements'
import { useRouter } from 'next/navigation'
import { UserContext, useUserContext } from '@/context/UserContext'
import axios from 'axios'
// import loadMyData from '@/Components/LoadMyData'
const Home = () => {
  const {updateUserData, updateCurrentPage } = useUserContext();

  const router = useRouter();
  useEffect(() => {
    updateCurrentPage("home");
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/users/me/");
        // console.log(res.data.avatar_url);
        updateUserData({
          id: res.data.id,
          otp_uri: res.data.otp_uri,
          last_login: res.data.last_login,
          is_superuser: res.data.is_superuser,
          username: res.data.username,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email: res.data.email,
          is_staff: res.data.is_staff,
          is_active: res.data.is_active,
          date_joined: res.data.date_joined,
          two_fa_enabled: res.data.two_fa_enabled,
          is_online: res.data.is_online,
          avatar_url: res.data.avatar_url,
          wins: res.data.wins,
          loses: res.data.loses,
          rating: res.data.rating,
          rank: res.data.rank,
        })

      } catch (err: any) {
        console.log("Error in fetching user data", err);
      } finally {
      }
    };

    fetchData();
  }, []);
  return (
    <div className={classes.home}>
      <div className={classes.container}>
        <div className={classes.box1}><PlayerInfos/></div>
        <div className={classes.box2}><WeeklyAttendance/></div>
        <div className={classes.box3}><Rate/></div>
        <div className={classes.line}><ProgressBar/></div>
        <div className={classes.box4}><Friends/></div>
        <div className={classes.box5}><Achievements/></div>
        <div className={classes.box6}>lin6</div>
      </div>
    </div>)
}

export default Home
