"use client"
import React, { useState, useEffect } from 'react'
import classes from "./friends.module.css"
import TestImage from '../../../assets/player.png'
import Image from 'next/image';
import axios from 'axios';

const buttons: string[] = ["Online", "Request", "Blocked"];
const OnlinePeople = [
    {
        name: "Ismail Barka",
        msg: "This will be the place of the last message from this person",
        url: TestImage,
    },
    {
        name: "Imrane Barka",
        msg: "This will be the place of the last message from this person",
        url: TestImage,
    },
    {
        name: "Anas Barka",
        msg: "This will be the place of the last message from this person",
        url: TestImage,
    },
    {
        name: "Ismail Barka",
        msg: "This will be the place of the last message from this person",
        url: TestImage,
    }
];

type RequestType = {
    id: number;
    user1: {
        id: number;
        username: string;
        avatar_url: string | null;
    };
    state: string;
    created_at: string;
};
type BlockType = {
    id: number;
    user2: {
        id: number;
        username: string;
        avatar_url: string | null;
    };
    state: string;
    created_at: string;
};

const Friends = () => {
    const [requests, setRequests] = useState<RequestType[]>([]);
    const [blocked, setBlocked] = useState<BlockType[]>([]);
    const [clicked, setClicked] = useState("Online");

    useEffect(() => {
        if (clicked === "Request") {
            fetchRequests();
            fetchBlocked();
        }
    }, [clicked]);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/users/me/relationships/friend_requests/`);
            setRequests(res.data);
        } catch (err) {
            console.log("Error in fetching user data", err);
        }
    };
    const fetchBlocked = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/users/me/relationships/block_list/`);
            setBlocked(res.data);
        } catch (err) {
            console.log("Error in fetching user data", err);
        }
    };

    const Online = () => (
        <div>
            {OnlinePeople.map((item, index) => (
                <div className={classes.Online} key={index}>
                    <Image src={item.url} alt={item.name} width={50} height={50} className={classes.image} />
                    <div className={classes.nameAndMsg}>
                        <h3 className={classes.name}>{item.name}</h3>
                        <p className={classes.message}>{item.msg}</p>
                        <div className={classes.actionButtons}>
                            <button className={`${classes.actionButton} ${classes.challengeButton}`}>Challenge</button>
                            <button className={`${classes.actionButton} ${classes.messageButton}`}>Message</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const handleAcceptRequest = async (id) =>{

        console.log("id" ,id);
        
        try {
            await axios.post(`http://localhost:8000/api/users/me/relationships/${id}/accept_request/`);
            setRequests(requests.filter(item => item.id !== id));
            console.log("User unblocked successfully");
        } catch (error) {
            console.error("Error unblocking user", error);
        }

    }

    const Request = () => (
        <div>
            {requests.map((item) => (
                <div className={classes.Online} key={item.id}>
                    <Image src={item.user1.avatar_url || TestImage} alt={item.user1.username} width={50} height={50} className={classes.image} />
                    <div className={classes.nameAndMsg}>
                        <h3 className={classes.name}>{item.user1.username}</h3>
                        <p className={classes.message}>Friend request from {item.user1.username}</p>
                        <button className={`${classes.actionButton} ${classes.acceptButton}`} onClick={() =>handleAcceptRequest(item.user1.id)}>Accept</button>
                    </div>
                </div>
            ))}
        </div>
    );


    const handleUnblock = async (id: number) => {
        console.log("id" ,id);
        
        try {
            await axios.post(`http://localhost:8000/api/users/me/relationships/${id}/remove_relationship/`);
            setBlocked(blocked.filter(item => item.id !== id));
            console.log("User unblocked successfully");
        } catch (error) {
            console.error("Error unblocking user", error);
        }
    };
    

    const Blocked = () => (
        <div>
            {blocked.map((item) => (
                <div className={classes.Online} key={item.id}>
                    <Image src={item.user2.avatar_url || TestImage} alt={item.user2.username} width={50} height={50} className={classes.image} />
                    <div className={classes.nameAndMsg}>
                        <h3 className={classes.name}>{item.user2.username}</h3>
                        <p className={classes.message}>Blocked user</p>
                        <button className={`${classes.actionButton} ${classes.unblockButton}`}  onClick={() => handleUnblock(item.user2.id)}>Unblock</button>
                    </div>
                </div>
            ))}
        </div>
    );

    const handleClick = (name: string) => {
        setClicked(name);
    };

    const handleData = () => {
        if (clicked === "Online") return <Online />;
        else if (clicked === "Request") return <Request />;
        else if (clicked === "Blocked") return <Blocked />;
    };

    return (
        <div className={classes.Friends}>
            <div className={classes.buttons}>
                {buttons.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => handleClick(item)}
                        className={clicked === item ? classes.buttonClicked : classes.button}
                    >
                        {item}
                    </button>
                ))}
            </div>
            <div className={classes.data}>
                {handleData()}
            </div>
        </div>
    );
};

export default Friends;