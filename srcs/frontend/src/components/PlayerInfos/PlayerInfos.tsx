"use client"

import type React from "react"
import Image from "next/image"
import styles from "./playerInfos.module.css"
import CopyToClipboard from "../CopyToClipboard/CopyToClipboard"
import { useUserContext } from "@/context/UserContext"

const truncateText = (text: string | undefined, maxLength: number) => {
  if (!text) return "Loading..."
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text
}

const InfoItem: React.FC<{ title: string; value: string | undefined }> = ({ title, value }) => (
  <div className={styles.info}>
    <h2 className={styles.title}>{title}:</h2>
    <div className={styles.infoAndCopy}>
      <h2 className={styles.value}>{truncateText(value, 20)}</h2>
      <CopyToClipboard textToCopy={value || ""} width={18} height={18} />
    </div>
  </div>
)

const PlayerInfos: React.FC<{ user: string }> = ({ user }) => {
  const { userData, userDataSearch } = useUserContext()
  const data = user === "search" ? userDataSearch : userData

  const defaultAvatarUrl = "https://res.cloudinary.com/doufu6atn/image/upload/v1726742774/nxdrt0md7buyeghyjyvj.png"

  return (
    <div className={styles.playerinfos}>
      <div className={styles.imageContainer}>
        <div className={styles.imageWrapper}>
          <Image
            className={styles.image}
            src={data.avatar_url || defaultAvatarUrl}
            alt="Avatar"
            width={100}
            height={100}
          />
          {data.is_online && (
            <div className={`${styles.statusDot} ${data.is_online ? styles.online : styles.offline}`} />
          )}
        </div>
        <div className={styles.nameUnderImage}>{truncateText(`${data.first_name} ${data.last_name}`, 20)}</div>
      </div>
      <div className={styles.infosContainer}>
        <InfoItem title="Username" value={data.username} />
        <InfoItem title="ID" value={data.id?.toString()} />
      </div>
    </div>
  )
}

export default PlayerInfos