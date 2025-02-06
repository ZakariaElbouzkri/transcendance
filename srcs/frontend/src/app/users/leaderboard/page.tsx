"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import classes from './page.module.css';
import { useUserContext } from '@/context/UserContext';
import { useRouter } from 'next/navigation';
import Api from '@/lib/api';

interface Player {
  id: number;
  username: string;
  avatar_url: string;
  is_online: boolean;
  wins: number;
  loses: number;
  rating: number;
}

interface LeaderboardResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Player[];
}

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { updateCurrentPage } = useUserContext();
  const router = useRouter();

  useEffect(() => {
    updateCurrentPage("leaderboard");
    const checkToken = async () => {
      try {
        // Use the test_auth endpoint to verify authentication
        await Api.get("/auth/test_auth/",{withCredentials: true})
      } catch (err) {
        console.log("Token validation error:", err);
        router.push("/auth/signin");
      } finally{
      }
    }
    checkToken();
    fetchLeaderboard();
  }, [currentPage]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await Api.get<LeaderboardResponse>(`/users/leaderboard/?page=${currentPage}`, { withCredentials: true });
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (leaderboardData?.previous) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (leaderboardData?.next) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleClickOnPlayer = (id: number) => {
    router.push(`/users/search/${id}`);
  }

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Leaderboard</h1>
      {isLoading ? (
        <p className={classes.loading}>Loading leaderboard...</p>
      ) : (
        <>
          <div className={classes.leaderboardContainer}>
            <div className={classes.leaderboardHeader}>
              <span className={classes.player}>Player</span>
              <span className={classes.wl}>W/L</span>
              <span className={classes.rating}>Rating</span>
            </div>
            {leaderboardData?.results.map((player) => (
              <div key={player.id} className={classes.playerRow} onClick={() => handleClickOnPlayer(player.id)}>
                <div className={classes.player}>
                  <div className={classes.avatarContainer}>
                    <Image src={ player.avatar_url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR} alt={player.username} width={40} height={40} className={classes.avatar} />
                    {player.is_online && <div className={classes.onlineIndicator}></div>}
                  </div>
                  <span className={classes.username}>{player.username}</span>
                </div>
                <span className={classes.wl}>{player.wins}/{player.loses}</span>
                <span className={classes.rating}>{player.rating}</span>
              </div>
            ))}
          </div>
          <div className={classes.pagination}>
            <button
              className={`${classes.paginationButton} ${!leaderboardData?.previous ? classes.disabled : ''}`}
              onClick={handlePreviousPage}
              disabled={!leaderboardData?.previous}
            >
              Previous
            </button>
            <span className={classes.pageInfo}>
              Page {currentPage} of {Math.ceil((leaderboardData?.count || 0) / 30)}
            </span>
            <button
              className={`${classes.paginationButton} ${!leaderboardData?.next ? classes.disabled : ''}`}
              onClick={handleNextPage}
              disabled={!leaderboardData?.next}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
