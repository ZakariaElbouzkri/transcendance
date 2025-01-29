"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUserContext } from "@/context/UserContext";
import PlayerInfos from "@/components/PlayerInfos/PlayerInfos";
import WeeklyAttendance from "@/components/weeklyAttendance/WeeklyAttendance";
import Rate from "@/components/Rate/Rate";
import classes from "./page.module.css";
import FriendsFR from "@/components/FriendsFR/FriendsFR";
import Image from "next/image";
import userNotFoundImage from '../../../../../assets/userNotFound.svg'
import { MatchHistoryFr } from "@/components/MatchHistoryFr/MatchHistoryFr";
import ProgressBarFr from "@/components/ProgressBarFr/ProgressBarFr";
import { AchievementsFr } from "@/components/AchievementsFr/AchievementsFr";
import axios from "axios";

const SearchProfile = () => {
  const { updateSearchedUserData, updateCurrentPage, searchedUserData, updateUserDataSearch, userDataSearch } = useUserContext();
  const { id } = useParams();

  // Convert id to number safely
  const numericId = typeof id === "string" ? parseInt(id, 10) : Array.isArray(id) ? parseInt(id[0], 10) : NaN;

  const [isLoading, setIsLoading] = useState(true);
  const [userExist, setUserExist] = useState(false);

  useEffect(() => {
    updateCurrentPage("");

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/users/${numericId}/`, {
          withCredentials: true,
        });
        console.log("Fetched Data:", res.data);

        updateSearchedUserData(res.data);
        updateUserDataSearch(res.data);
        setUserExist(false); // User exists
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error("Error fetching user data:", err.response?.data?.detail);
          setUserExist(true); // User doesn't exist
        } else {
          console.error("Unknown error:", err);
          setUserExist(true);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (!isNaN(numericId)) {
      fetchData();
    } else {
      console.error("Invalid user ID");
      setUserExist(true);
      setIsLoading(false);
    }
  }, [numericId, updateCurrentPage, updateSearchedUserData, updateUserDataSearch, userDataSearch.is_online, searchedUserData.is_online]);

  return (
    <div className={classes.home}>
      {isLoading ? (
        <div>Loading...</div>
      ) : !userExist ? (
        <div className={classes.container}>
          <div className={classes.box1}>
            <PlayerInfos user="search" />
          </div>
          <div className={classes.box2}>
            <WeeklyAttendance user="search" />
          </div>
          <div className={classes.box3}>
            <Rate user="search" />
          </div>
          <div className={classes.line}>
            <ProgressBarFr ratingFr={searchedUserData.rating} />
          </div>
          <div className={classes.box4}>
            <FriendsFR id={numericId} />
          </div>
          <div className={classes.box5}>
            <AchievementsFr
              wins={searchedUserData.wins}
              loses={searchedUserData.loses}
              rating={searchedUserData.rating}
            />
          </div>
          <div className={classes.box6}>
            <MatchHistoryFr id={numericId} />
          </div>
        </div>
      ) : (
        <div className={classes.notFoundContainer}>
          <Image
            width={100}
            height={100}
            src={userNotFoundImage}
            alt="user not found"
            className={classes.userNotFoundImage}
          />
          <p className={classes.notFoundMessage}>This user does not exist.</p>
          <button
            className={classes.homeButton}
            onClick={() => (window.location.href = "/users/home")}
          >
            Go to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchProfile;
