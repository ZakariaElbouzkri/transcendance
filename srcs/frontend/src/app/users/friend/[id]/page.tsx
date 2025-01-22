"use client"
import React, { useContext, useEffect, useState } from 'react'
import classes from "./page.module.css"
import PlayerInfos from '../../../../components/PlayerInfos/PlayerInfos'
import WeeklyAttendance from '../../../../components/weeklyAttendance/WeeklyAttendance'
import Rate from '../../../../components/Rate/Rate'
import ProgressBar from '../../../../components/ProgressBar/ProgressBar'
import Friends from '../../../../components/Friends/Friends'
import { Achievements } from '../../../../components/Achievements/Achievements'
import { useRouter } from 'next/navigation'
import { UserContext, useUserContext } from '@/context/UserContext'
import axios from 'axios'
import PlayerInfosFr from '@/components/FriendPage/PlayerInfos/PlayerInfosFr'
// import WeeklyAttendanceFr from '@/components/FriendPage/WeeklyAttendance/WeeklyAttendanceFr'
import RateFr from '@/components/FriendPage/Rate/RateFr'
import ProgressBarFr from '@/components/FriendPage/ProgressBar/ProgressBarFr'
import FriendsFr from '@/components/FriendPage/Friends/FriendsFr'
import { AchievementsFr } from '@/components/FriendPage/Achievements/AchievementsFr'
import FriendActions from '@/components/FriendPage/FriendActions/FriendActions'
// import loadMyData from '@/Components/LoadMyData'
const FriendPage = ({ params }) => {
  const { id } = params;
  const {updateUserData, updateCurrentPage,updateSearchedUserData } = useUserContext();

  const router = useRouter();
  useEffect(() => {
    updateCurrentPage("Friend");
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${id}/`);
        // console.log(res.data.first_name);
        updateSearchedUserData({
          avatar_url: res.data.avatar_url,
          first_name: res.data.first_name,
          id: res.data.id,
          is_online: res.data.is_online,
          last_name: res.data.last_name,
          loses: res.data.loses,
          rank: res.data.rank,
          rating: res.data.rating,
          username: res.data.username,
          wins: res.data.wins,
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
        <div className={classes.box1}><PlayerInfosFr/></div>
        {/* <div className={classes.box2}><WeeklyAttendanceFr/></div> */}
        <div className={classes.box3}><RateFr/></div>
        <div className={classes.line}><ProgressBarFr/></div>
        <div className={classes.box4}><FriendActions/></div>
        <div className={classes.box5}><AchievementsFr/></div>
        <div className={classes.box6}>lin6</div>
      </div>
    </div>)
}

export default FriendPage
