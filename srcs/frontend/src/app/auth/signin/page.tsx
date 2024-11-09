"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import InputField from '../../../components/InputField/InputField';
import classes from "./page.module.css";
import loginPlayer from '../../../../assets/loginPlayer.svg';
import OtpForLogin from '../../../components/OtpForLogin/OtpForLogin';

interface Errors {
  details: string;
  username: string;
  password: string;
  otp: string;
}

const SignInPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    details: '',
    username: '',
    password: '',
    otp: '',
  });

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, details: '', [name]: '' }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrors({
      details: '',
      username: '',
      password: '',
      otp: '',
    });
    setIsLoading(true);
    
    try {
      await axios.post("http://localhost:8000/api/auth/sign-in/", formData,{withCredentials: true});

      router.push("/users/home");
    } catch (err: any) {
      console.log("there is some errors");
      console.error("Error:", err.response);
      setErrors({
        details: "Username or password is not correct",
        username: err.response?.data?.username?.[0] || "",
        password: err.response?.data?.password?.[0] || "",
        otp: err.response?.data?.otp_code?.[0] || "",
      });
      setIsLoading(false);
    } finally {
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Login</h1>
      <div className={classes.container2}>
        <div className={classes.leftSide}>
          <p className={classes.welcomeMsg}>Welcome to the Ping Pong World</p>
          <p className={classes.p}>Welcome back! Please login to your account.</p>
          <form className={classes.form} onSubmit={handleSubmit}>
            <InputField
              label="Username"
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />
            <InputField
              label="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            {errors.otp && <OtpForLogin setErrors={setErrors} errors={errors} username={formData.username} password={formData.password}/>}
            {errors.details && <p className={classes.error}>{errors.details}</p>}
            <input type='submit' value={isLoading ? "Loading..." : "Sign In"} className={classes.submitButton} disabled={isLoading}/>
          </form>
          <div className={classes.message}>
            <p>If you don't have an account <button className={classes.link} onClick={() => router.push("/auth/signup")}>Sign Up</button></p>
          </div>
        </div>
        <div className={classes.rightSide}>
          <Image className={classes.image} src={loginPlayer} alt="Login Player" />
        </div>
      </div>
    </div>
  );
};

export default SignInPage;