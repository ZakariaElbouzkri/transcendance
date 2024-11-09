import React from 'react';
import classes from './AchievementsFr.module.css';
import achieImage from '../../../../assets/achie.svg';
import Image from 'next/image';

const achievements = Array(14).fill({
  title: 'Achievement Name',
  desc: 'Achievement Description',
  imgUrl: achieImage,
});

export const AchievementsFr = () => {
  return (
    <div className={classes.achievements}>
      <h1 className={classes.title}>Achievements</h1>
      <div className={classes.achievementsContainer}>
        {achievements.map((item, index) => (
          <div className={classes.achievementItem} key={index}>
            <Image src={item.imgUrl} alt={item.title} width={70} height={70} className={classes.image} />
            <div className={classes.details}>
              <h3 className={classes.name}>{item.title}</h3>
              <p className={classes.description}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
