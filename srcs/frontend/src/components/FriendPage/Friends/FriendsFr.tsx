"use client"
import React, { useState } from 'react'
import classes from "./FriendsFr.module.css"
import TestImage from '../../../../assets/player.png'
import Image from 'next/image';

const buttons: string[] = ["Online", "Request", "Blocked"];
const OnlinePeople = [{
        name: "Ismail barka",
        msg: "this will be the place of the last message from this person",
        url: TestImage,

    },{
        name: "imrane barka",
        msg: "this will be the place of the last message from this person",
        url: TestImage,
    },{
        name: "anas barka",
        msg: "this will be the place of the last message from this person",
        url: TestImage,
    },{
        name: "Ismail barka",
        msg: "this will be the place of the last message from this person",
        url: TestImage,
    }]
const FriendsFr = () => {

    const Online =() =>{
        return(
            <div>
                {OnlinePeople.map((item, index) =>{
                    return  <div className={classes.Online} key={index}>
                                <Image src={item.url} alt="" width={70} height={70} className={classes.image}/>
                                <div className={classes.nameAndMsg}>
                                    <h3 className={classes.name}>{item.name}</h3>
                                    <p className={classes.message}>{item.msg}</p>
                            </div>
                </div>
                })}
                
            </div>
        )
    }
    const Request =() =>{
        return(
            <div>testRequest</div>
        )
    }
    const Blocked =() =>{
        return(
            <div>testBlocked</div>
        )
    }

    const [clicked, setClicked] = useState("Online");
    const handleClick = (name:string) =>{
        console.log('====================================');
        setClicked(name)
        console.log(name);
        console.log('====================================');
    }
    const handleData = (clicked:string) =>{
        if(clicked === "Online")
            return <Online/>
        else if(clicked === "Request")
            return <Request/>
        else if(clicked === "Blocked")
            return <Blocked/>
    }
  return (
    <div className={classes.Friends}>
        <div className={classes.buttons}>
            {buttons.map((item, index) =>{
                return(
                    <button key={index} onClick={() => handleClick(item)} className={ clicked === item ? classes.buttonClicked : classes.button}>{item}</button>
                )
            })}        
        </div>
        <div className={classes.data}>
            {handleData(clicked)}
        </div>
    </div>
  )
}

export default FriendsFr
