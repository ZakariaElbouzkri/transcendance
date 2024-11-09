"use client";

import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import classes from './page.module.css';
import axios from 'axios';
import { useUserContext } from '@/context/UserContext';

const Logout: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { currentPage, updateCurrentPage } = useUserContext();


  useEffect(() => {
    updateCurrentPage("logout");

  }, []);

  const handleNo = () => {
    router.push('/users/home');
  };

  const deleteAllCookies = () => {
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  };

  const handleYes = async () => {
    setIsLoading(true);
    try {
      // Delete all cookies
      deleteAllCookies();

      // Call the sign-out API
      await axios.post("http://localhost:8000/api/auth/sign-out/");

      router.push('/auth/signin');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <p className={classes.question}>Are you sure you want to logout?</p>
      <div className={classes.btnContainer}>
        <button 
          className={`${classes.btn} ${classes.yesBtn}`} 
          onClick={handleYes}
          disabled={isLoading}
        >
          {isLoading ? 'Logging out...' : 'Yes'}
        </button>
        <button 
          className={`${classes.btn} ${classes.noBtn}`} 
          onClick={handleNo}
          disabled={isLoading}
        >
          No
        </button>
      </div>
    </div>
  );
};

export default Logout;
