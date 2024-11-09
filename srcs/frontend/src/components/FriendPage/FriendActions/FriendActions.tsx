import React from 'react';
import classes from './FriendActions.module.css';
import challengeImage from '../../../../assets/challengeBlack.svg'
import snedMessageImage from '../../../../assets/messageBlack.svg'
import sendRequestImage from '../../../../assets/sendRequest.svg'
import Image from 'next/image';

interface FriendActionsProps {
    friend: {
        name: string;
        isFriend: boolean;
    };
    onClose: () => void;
}

const FriendActions: React.FC<FriendActionsProps> = ({ friend, onClose }) => {
    const handleAction = (action: string) => {
        console.log(`${action} action for ${friend.name}`);
        // Implement the actual action logic here
    };

    return (
        <div className={classes.overlay}>
            <div className={classes.modal}>
                {/* <h2 className={classes.title}>{friend.name}</h2> */}
                <div className={classes.actions}>
                    <div>
                        <button onClick={() => handleAction('Challenge')} className={classes.button}>Challenge</button>
                        <Image alt='image' src={challengeImage} width={60} height={60}/>
                    </div>
                    <div>
                        <button onClick={() => handleAction('Message')} className={classes.button}>Message</button>
                        <Image alt='image' src={snedMessageImage} width={60} height={100}/>
                    </div>
                    <div>
                        <button onClick={() => handleAction('Block')} className={classes.buttonDanger}>Block</button>
                        <Image alt='image' src={sendRequestImage} width={100} height={100}/>
                    </div>
                </div>
                {/* <button onClick={onClose} className={classes.closeButton}>Close</button> */}
            </div>
        </div>
    );
};

// Dummy data for testing
const dummyFriend = {
    name: "Ismail Barka",
    isFriend: true,
};

const dummyOnClose = () => {
    console.log("Modal closed");
};

// Usage
const App = () => (
    <FriendActions friend={dummyFriend} onClose={dummyOnClose} />
);

export default App;
