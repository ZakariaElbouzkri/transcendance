"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { schema } from "../../../schemas/validationSchema";
import InputField from '../../../components/InputField/InputField';
import classes from "./page.module.css";
import loginPlayer from '../../../../assets/loginPlayer.svg';

interface Errors {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
  confermPassword: string;
  non_field_errors: string;
}

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    confermPassword: "",
    // non_field_errors: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errors, setErrors] = useState<Errors>({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    confermPassword: '',
    non_field_errors: '',
  });

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setErrors({
      firstname: '',
      lastname: '',
      email: '',
      username: '',
      password: '',
      confermPassword: '',
      non_field_errors: '',
    });
    setIsLoading(true);

    const result = schema.safeParse(formData);
    if (!result.success) {
      const errorMsg = result.error.flatten().fieldErrors;
      setErrors({
        firstname: errorMsg.firstname?.[0] || '',
        lastname: errorMsg.lastname?.[0] || '',
        email: errorMsg.email?.[0] || '',
        username: errorMsg.username?.[0] || '',
        password: errorMsg.password?.[0] || '',
        confermPassword: errorMsg.confermPassword?.[0] || '',
        non_field_errors : errorMsg.non_field_errors?.[0] || ''
      });
      setIsLoading(false);
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/auth/sign-up/", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: formData.firstname,
        last_name: formData.lastname
      });
      setIsSuccess(true);
    } catch (err: any) {
      console.error("Error:", err.response?.data);
      setErrors(prev => ({
        ...prev,
        ...err.response?.data
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Sign Up</h1>
      <div className={classes.container2}>
        <div className={classes.leftSide}>
          {!isSuccess ? (
            <>
              <p className={classes.welcomeMsg}>Welcome to the Ping Pong World</p>
              <p className={classes.p}>Please create your account.</p>
              <form className={classes.form} onSubmit={handleSubmit}>
                {Object.entries(formData).map(([key, value]) => (
                  <InputField
                    key={key}
                    label={key.charAt(0).toUpperCase() + key.slice(1)}
                    type={key.includes('password') ? 'password' : 'text'}
                    id={key}
                    name={key}
                    value={value}
                    onChange={handleChange}
                    error={errors[key as keyof Errors]}
                  />
                ))}
                {errors.non_field_errors && <p className={classes.errorMsg}>Error: {errors.non_field_errors}</p>}
                <input 
                  type='submit' 
                  value={isLoading ? "Loading..." : "Submit"} 
                  className={classes.submitButton} 
                  disabled={isLoading}
                  style={{ backgroundColor: '#FF9B04' }}
                />
              </form>
              <div className={classes.message}>
                <p>If you already have an account <button className={classes.link} onClick={() => router.push("/auth/signin")}>Sign In</button></p>
              </div>
            </>
          ) : (
            <div className={classes.successMessage}>
              <p className={classes.welcomeMsg}>Sign Up Successful!</p>
              <p className={classes.p}>Your account has been created successfully.</p>
              <button 
                onClick={() => router.push("/auth/signin")} 
                className={classes.submitButton}
                style={{ backgroundColor: '#FF9B04', marginTop: '20px' }}
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
        <div className={classes.rightSide}>
          <Image className={classes.image} src={loginPlayer} alt="Login Player"  />
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;