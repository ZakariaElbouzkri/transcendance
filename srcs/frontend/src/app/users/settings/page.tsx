"use client";
import * as React from 'react';
import classes from './Settings.module.css';
import ChangeUsername from '../../../components/Settings/ChangeUsername/ChangeUsername';
import ChangeFirstname from '../../../components/Settings/ChangeFirstname/ChangeFirstname';
import ChangeLastname from '../../../components/Settings/ChangeLastname/ChangeLastname';
import ChangePassword from '../../../components/Settings/ChangePassword/ChangePassword';
import avatare from '../../../../assets/player.png'
// import { UserContext } from "@/app/context/UserContext";
import axios from 'axios';
import Image from 'next/image';
import ChangeTFA from '../../../components/Settings/ChangeTFA/ChangeTFA';
// import loadMyData from '@/Components/LoadMyData';
import { useRouter } from 'next/navigation';
import ImageUpload from '../../../components/Settings/ChangeImage/ImageUpload';
import { UserContext, useUserContext } from '@/context/UserContext';

const Settings: React.FC = () => {

  const [currentPage, setCurrentPage] = React.useState("");
  const router = useRouter();
  const { userData } = useUserContext();
  const { updateCurrentPage } = useUserContext();

  React.useEffect(() => {
    updateCurrentPage("settings");

  }, []);

  return (
    <div className={classes.container}>
      <div className={classes.Settings}>
        <h1 className={classes.editProfileTitle}>Edit your profile</h1>
        <div className={classes.editContainer} onClick={() => setCurrentPage("avatar")}>
          <label className={classes.label} htmlFor="Avatar">Avatar:</label>
          <div className={classes.imageProvisoir} >
            <Image alt='Avatar' src={userData.avatar_url ? userData.avatar_url : "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png"} width={100} height={100} className={classes.image}></Image>
          </div>
          <button className={classes.editButton}>Edit</button>
        </div>
        <div className={classes.editContainer} onClick={() => setCurrentPage("username")}>
          {/* Username Input with Label */}
          <label className={classes.label} htmlFor="usernameInput">Username:</label>
          <input
            id="usernameInput"
            disabled={true}
            className={classes.inputProvisoir}
            value={userData.username}
          />
          <button className={classes.editButton}>Edit</button>
        </div>

        <div className={classes.editContainer} onClick={() => setCurrentPage("password")}>
          {/* Password Input with Label */}
          <label className={classes.label} htmlFor="passwordInput">Password:</label>
          <input
            id="passwordInput"
            disabled={true}
            className={classes.inputProvisoir}
            value="******"
          />
          <button className={classes.editButton}>Edit</button>
        </div>

        <div className={classes.editContainer} onClick={() => setCurrentPage("firstname")}>
          <label className={classes.label} htmlFor="firstnameInput">First Name:</label>
          <input
            id="firstnameInput"
            disabled={true}
            className={classes.inputProvisoir}
            value={userData.first_name}
          />
          <button className={classes.editButton}>Edit</button>
        </div>
        <div className={classes.editContainer} onClick={() => setCurrentPage("TFA")}>
          <label className={classes.label} htmlFor="TFA">TFA:</label>
          <input
            id="TFA"
            disabled={true}
            className={classes.inputProvisoir}
            value={`2FA now is ${userData.two_fa_enabled ? "ON" : "OFF"}`}
          />
          <button className={classes.editButton}>Edit</button>
        </div>

        <div className={classes.editContainer} onClick={() => setCurrentPage("lastname")}>
          {/* Last Name Input with Label */}
          <label className={classes.label} htmlFor="lastnameInput">Last Name:</label>
          <input
            id="lastnameInput"
            disabled={true}
            className={classes.inputProvisoir}
            value={userData.last_name}
          />
          <button className={classes.editButton}>Edit</button>
        </div>
        {currentPage === "avatar" && <ImageUpload setCurrentPage={setCurrentPage}/>}
        {currentPage === "username" && <ChangeUsername setCurrentPage={setCurrentPage} />}
        {currentPage === "password" && <ChangePassword setCurrentPage={setCurrentPage} />}
        {currentPage === "firstname" && <ChangeFirstname setCurrentPage={setCurrentPage} />}
        {currentPage === "lastname" && <ChangeLastname setCurrentPage={setCurrentPage} />}
        {currentPage === "TFA" && <ChangeTFA setCurrentPage={setCurrentPage} />}
      </div>
    </div>
  );
};

export default Settings;
