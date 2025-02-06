"use client"
import axios, { type AxiosError } from "axios"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { InputField } from "@/components/InputField"

import styles from "./page.module.css"
import imageee from "../../../../assets/syberPlayer.png"
import googleIcon from "../../../../assets/googleSigninLogoBlack.svg"
import githubIcon from "../../../../assets/githubSignInLogo.svg"
import FTIcon from "../../../../assets/FTSignUnImage1.svg"
import Api from "@/lib/api"

// If you want single-string errors for each field:
type ServerErrorData = {
  first_name?: string
  last_name?: string
  email?: string
  username?: string
  password?: string
  non_field_errors?: string
}

type FormData = {
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
}

export default function SignUpPage() {
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
  })

  const [errors, setErrors] = useState<ServerErrorData>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    if (formData.first_name.trim() === "" || formData.last_name.trim() === "") {
      setErrors({ non_field_errors: "First name and last name cannot be blank" })
      setIsLoading(false)
      return
    }

    // Submit to backend
    try {
      await Api.post("/auth/sign-up/", {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
      })
      setIsSuccess(true)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ServerErrorData>
        if (axiosError.response?.data) {
          setErrors(axiosError.response.data)
        } else {
          setErrors({ non_field_errors: "An unknown error occurred" })
        }
      } else {
        setErrors({ non_field_errors: "An unknown error occurred" })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (index: number) => {
    setIsLoading(true)
    try {
      const res = await Api.get("/auth/social/providers/")
      router.push(res.data.providers[index].provider_url)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error:", error.response)
      } else {
        console.error("Error:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.pageContainer}>
      <Header forWhat="Sign Up" />
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formContent}>
            <div className={!isSuccess ? styles.formSection : styles.formSectionSuccess}>
              {!isSuccess ? (
                <>
                  <h2 className={styles.subtitle}>Welcome to the Ping Pong World</h2>
                  <p className={styles.description}>Please create your account.</p>
                  <form onSubmit={handleSubmit} className={styles.form}>
                    <InputField
                      label="First_name"
                      name="first_name"
                      id="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      error={errors.first_name}
                    />
                    <InputField
                      label="Last_name"
                      name="last_name"
                      id="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      error={errors.last_name}
                    />
                    <InputField
                      label="Email"
                      name="email"
                      id="email"
                      type="text"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                    />
                    <InputField
                      label="Username"
                      name="username"
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      error={errors.username}
                    />
                    <InputField
                      label="Password"
                      name="password"
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                    />

                    {errors.non_field_errors && <p className={styles.errorText}>{errors.non_field_errors}</p>}

                    <div className={styles.submitContainer}>
                      <div className={styles.submitButtonContainer}>
                        <button type="submit" disabled={isLoading} className={styles.submitButton}>
                          {isLoading ? "Loading..." : "Sign Up"}
                        </button>
                      </div>
                    </div>
                  </form>
                  <div className={styles.socialButtonsContainer}>
                    <button onClick={() => handleSignUp(1)} className={styles.socialButton}>
                      <Image
                        src={googleIcon || "/placeholder.svg"}
                        alt="Sign up with Google"
                        width={40}
                        height={40}
                        className={styles.socialButtonImage}
                      />
                    </button>
                    <button onClick={() => handleSignUp(2)} className={styles.socialButton}>
                      <Image
                        src={githubIcon || "/placeholder.svg"}
                        alt="Sign up with GitHub"
                        width={40}
                        height={40}
                        className={styles.socialButtonImage}
                      />
                    </button>
                    <button onClick={() => handleSignUp(0)} className={styles.socialButton}>
                      <Image
                        src={FTIcon || "/placeholder.svg"}
                        alt="Sign up with 42"
                        width={40}
                        height={40}
                        className={styles.socialButtonImage}
                      />
                    </button>
                  </div>
                  <p className={styles.signInText}>
                    Already have an account?{" "}
                    <button onClick={() => router.push("/auth/signin")} className={styles.signInLink}>
                      Sign In
                    </button>
                  </p>
                </>
              ) : (
                <div className={styles.successMessage}>
                  <h2 className={styles.subtitle}>Sign Up Successful!</h2>
                  <p className={styles.description}>Please check your email to validate registration.</p>
                  <div className={styles.submitButtonContainer}>
                    <button onClick={() => router.push("/auth/signin")} className={styles.submitButton}>
                      Go to Login
                    </button>
                  </div>
                </div>
              )}
            </div>
            {!isSuccess && (
              <div className={styles.imageSection}>
                <div className={styles.containerImage}>
                  <div className={styles.ImageContainer}>
                    <Image
                      src={imageee || "/placeholder.svg"}
                      alt="Login Player"
                      width={500}
                      height={500}
                      className={styles.image}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

