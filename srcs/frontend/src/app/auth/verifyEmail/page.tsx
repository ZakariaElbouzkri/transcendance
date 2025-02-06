"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import styles from "./verifyEmail.module.css"
import Api from "@/lib/api"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showResend, setShowResend] = useState(false)
  const [email, setEmail] = useState("")
  const [resendMessage, setResendMessage] = useState("")
  const [resendError, setResendError] = useState("")
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    const uid = searchParams.get("uid")
    const token = searchParams.get("token")

    if (uid && token) {
      const verifyEmail = async () => {
        setIsLoading(true)
        try {
          const response = await Api.get("/auth/email/verify/", {
            params: { uid, token },
          })

          if (response.status === 200) {
            setMessage(response.data.message || "Email verified successfully!")
            setIsVerified(true)
            setShowResend(false)
          }
        } catch (error) {
          let errorMsg = "Email verification failed."

          if (error.response) {
            const data = error.response.data
            errorMsg = data.detail || data.token?.[0] || data.uid?.[0] || "Email verification failed."

            if (errorMsg === "Link is invalid or expired") {
              setShowResend(true)
            }
          } else {
            errorMsg = "An error occurred during verification."
          }
          setError(errorMsg)
        } finally {
          setIsLoading(false)
        }
      }

      verifyEmail()
    }
  }, [searchParams])

  const handleResendEmail = async () => {
    setResendMessage("")
    setResendError("")

    if (!email) {
      setResendError("Please enter your email.")
      return
    }
    try {
      const response = await Api.post("/auth/email/resend_verify_email/", { email })

      if (response.status === 201) {
        setResendMessage(response.data.message || "A new verification email has been sent.")
        setResendSuccess(true)
        setError("")
        setShowResend(false)
      }
    } catch (error) {
      setResendSuccess(false)
      if (error.response?.data?.email) {
        setResendError(error.response.data.email[0])
      } else {
        setResendError(error.response?.data?.detail || "Failed to send verification email.")
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {resendSuccess ? "Verification Email Sent Successfully!" : "Email Verification"}
        </h1>

        {isLoading && <p className={styles.loadingMessage}>Verifying your email...</p>}
        {message && <p className={`${styles.message} ${styles.successMessage}`}>{message}</p>}
        {error && !resendSuccess && <p className={`${styles.message} ${styles.errorMessage}`}>{error}</p>}

        {isVerified && (
          <button onClick={() => router.push("/auth/signin")} className={styles.button}>
            Go to Login Page
          </button>
        )}

        {showResend && !resendSuccess && (
          <div className={styles.resendForm}>
            <p className={styles.resendMessage}>
              Your verification link has expired. Enter your email to receive a new link.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              disabled={resendSuccess}
            />
            <button
              onClick={handleResendEmail}
              className={`${styles.resendButton} ${resendSuccess ? styles.resendButtonDisabled : ""}`}
              disabled={resendSuccess}
            >
              {resendSuccess ? "Email Resent Successfully" : "Resend Verification Email"}
            </button>
            {resendMessage && <p className={`${styles.message} ${styles.successMessage}`}>{resendMessage}</p>}
            {resendError && <p className={`${styles.message} ${styles.errorMessage}`}>{resendError}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}

