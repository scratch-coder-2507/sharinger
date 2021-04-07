import { Avatar, IconButton } from "@material-ui/core";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth, db } from "../firebase";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useCollection } from "react-firebase-hooks/firestore";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import { useRef, useState } from "react";
import firebase from "firebase";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react"

function ChatScreen({chat, messages}) {

    const [input, setInput] = useState("");
    const [user] = useAuthState(auth);
    const router = useRouter();
    const endOfMessagesRef = useRef(null);

    const [messagesSnapshot] = useCollection(
        db.collection("chats").
        doc(router.query.id).
        collection("messages").
        orderBy("timestamp","asc")
    );

    const [recipientSnapshot] = useCollection(
        db.collection("users")
        .where("email", "==", getRecipientEmail(chat.users, user))
    );

    const showMessages = () => {
        if(messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message 
                key={message.id} 
                user={message.data().user} 
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime(),
                }}
                 />
            ));
        } else {
            return JSON.parse(messages).map((message) => (
                <Message 
                key={message.id} 
                user={message.user} 
                message={message} />
            ));
        }
    };

    const ScrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    const sendMessage = (e) => {
        e.preventDefault();

        db.collection("users").doc(user.uid).set(
        {
            lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        },
        {merge: true}
        );

        db.collection("chats").doc(router.query.id).collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL,
        });

        setInput('');
        ScrollToBottom();
    };

    const recipientEmail = getRecipientEmail(chat.users, user);
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient?.photoURL} />
                ) : (
                    <Avatar>{recipientEmail[0]}</Avatar>
                )}
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {recipientSnapshot ? (
                        <p>Last active: {' '}
                        {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()}/>
                        ) : (
                            "Unavailable"
                        )}
                        </p>
                    ): (
                        <p>Loading Last active...</p>
                    )}
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon style={{ color: '#E3E3E3' }}/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon style={{ color: '#E3E3E3' }} />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessagesRef}/>
            </MessageContainer>
            
            <InputContainer>
                <IconButton>
                    <InsertEmoticonIcon style={{ color: '#E3E3E3' }}/>
                </IconButton>
                <Input placeholder="Send message" value={input} onChange={(e) => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send message</button>
                <IconButton>
                    <MicIcon style={{ color: '#E3E3E3' }}/>
                </IconButton>
            </InputContainer>

        </Container>
    )
}

export default ChatScreen;

const Container = styled.div`
    background-color: #242525;
`;

const Input = styled.input`
    flex: 1;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: #A5A5A5;
    border-radius: 5vw;
`;

const Header = styled.div`
    position: sticky;
    background-color: #434343 ;
    color: white;
    z-index: 100;
    top: 0;
    display: flex;
    height: 80px;
    padding: 11px;
    align-items: center;
    border-bottom: 1px solid #717171;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;
    color: white;

    > h3 {
        margin-bottom: 14px;
    }

    > p {
        font-size: 14px;
        color: #B1B5B4 ;
    }
`;

const HeaderIcons = styled.div`
    color: white;
`;

const MessageContainer = styled.div`
    padding: 30px;
    min-height: 90vh;
    background-color: #0c313d;
`;

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: #434343 ;

`;