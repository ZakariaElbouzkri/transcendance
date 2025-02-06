'use client';

import * as React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/context/UserContext';
import ChangeUsername from '@/components/Settings/ChangeUsername/ChangeUsername';
import ChangeFirstname from '@/components/Settings/ChangeFirstname/ChangeFirstname';
import ChangeLastname from '@/components/Settings/ChangeLastname/ChangeLastname';
import ChangePassword from '@/components/Settings/ChangePassword/ChangePassword';
import ChangeTFA from '@/components/Settings/ChangeTFA/ChangeTFA';
import ImageUpload from '@/components/Settings/ChangeImage/ImageUpload';
import styles from './Settings.module.css';
import Api from '@/lib/api';

const Settings: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState("");
  const router = useRouter();
  const { userData, updateUserData, updateCurrentPage } = useUserContext();

  React.useEffect(() => {
    updateCurrentPage("settings");
    const fetchData = async () => {

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
      try {
        const res = await Api.get("/users/me/", { withCredentials: true });
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
        });
      } catch (err) {
        console.log("Error in fetching user data", err);
      }
    };

    fetchData();
  }, []);

  const renderEditField = (label: string, value: string, onClick: () => void) => (
    <div className={styles.editContainer} >
      <label className={styles.label}>{label}:</label>
      <div className={styles.inputWrapper}>
        <input
          disabled={true}
          className={styles.input}
          value={value}
        />
      </div>
      <button className={styles.editButton} onClick={onClick}>Edit</button>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.settingsContainer}>
        <div className={styles.settings}>
          <h1 className={styles.editProfileTitle}>Edit your profile</h1>
          
          <div className={styles.editContainer} >
            <label className={styles.label}>Avatar:</label>
            <div className={styles.avatarWrapper}>
              <Image 
                alt='Avatar' 
                src={userData.avatar_url || process.env.NEXT_PUBLIC_DEFAULT_AVATAR} 
                width={100} 
                height={100} 
                className={styles.avatar}
              />
            </div>
            <button className={styles.editButton} onClick={() => setCurrentPage("avatar")}>Edit</button>
          </div>

          {renderEditField("Username", userData.username, () => setCurrentPage("username"))}
          {renderEditField("Password", "******", () => setCurrentPage("password"))}
          {renderEditField("First Name", userData.first_name, () => setCurrentPage("firstname"))}
          {renderEditField("Last Name", userData.last_name, () => setCurrentPage("lastname"))}
          {renderEditField("TFA", `2FA now is ${userData.two_fa_enabled ? "ON" : "OFF"}`, () => setCurrentPage("TFA"))}

          {currentPage === "avatar" && <ImageUpload setCurrentPage={setCurrentPage}/>}
          {currentPage === "username" && <ChangeUsername setCurrentPage={setCurrentPage} />}
          {currentPage === "password" && <ChangePassword setCurrentPage={setCurrentPage} />}
          {currentPage === "firstname" && <ChangeFirstname setCurrentPage={setCurrentPage} />}
          {currentPage === "lastname" && <ChangeLastname setCurrentPage={setCurrentPage} />}
          {currentPage === "TFA" && <ChangeTFA setCurrentPage={setCurrentPage} />}
        </div>
      </div>
    </div>
  );
};

export default Settings;

