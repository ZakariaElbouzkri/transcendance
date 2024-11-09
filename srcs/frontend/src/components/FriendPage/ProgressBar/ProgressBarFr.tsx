"use client"
import React from 'react'
import classes from './ProgressBarFr.module.css'
import { Container } from 'react-bootstrap';
import { useUserContext } from '@/context/UserContext';

const percentage:string = "15%";


const getLastTwoDigits = (number) => {
  // Convert the number to a string
  const numberStr = number.toString();

  // Get the last two characters
  const lastTwoDigits = numberStr.slice(-2);

  // Return the last two digits as a number or string based on your needs
  return lastTwoDigits; // returns a string
};
const getLastThreeDigits = (number) => {
  // Convert the number to a string
  const numberStr = number.toString();

  // Check if the number is 0 and return "0" if true
  if (number === 0) return "0";

  // Return the second-to-last character if the number has two or more digits
  return numberStr.length >= 2 ? numberStr.slice(-3, -2) : numberStr; 
};

const ProgressBarFr = () => {

  const { userData } = useUserContext();


  return (
    <div className={classes.container}>
        <div className={classes.progressBar} style={{width: `${getLastTwoDigits(999)}%`}}></div>
        
        <div className={classes.textContainer}>
            <p className={classes.level}>level {getLastThreeDigits(999)} - {getLastTwoDigits(678)}%</p>
        </div>
    </div>
  )
}

export default ProgressBarFr
