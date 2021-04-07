import {Button, Avatar, IconButton} from "@material-ui/core"
import styled from 'styled-components';
import ChatIcon from '@material-ui/icons/Chat'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search'
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "../components/Chat"
function Sidebar() {

const [user] = useAuthState(auth);

const userChatRef = db.collection("chats").where('users', 'array-contains', user.email);
const [chatsSnapshot] = useCollection(userChatRef);

const createChat = () => {
    const input = prompt(
        "Please enter an email address for the user you wish to chat with"
    );

    if(!input) return null;

    if(
        EmailValidator.validate(input) && 
        !chatAlreadyExists(input) && 
        input !== user.email
        ){
        
        //We add the chat into the DB "chats" collection if it doesn't already exist and is valid
        db.collection("chats").add({
            users: [user.email, input],
        });
    }
};

const chatAlreadyExists = (recipientEmail) => {
    !!chatsSnapshot?.docs.find(
        chat => 
        chat.data().users.find(
            user => user === recipientEmail)?.length > 0);
}

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()}/>
                <IconsContainer>
                    <IconButton>
                        <ChatIcon style={{ color: '#E3E3E3' }}/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon style={{ color: '#E3E3E3' }}/>
                    </IconButton>
                    
                </IconsContainer>
            </Header>
            <Search>
                <IconButton>
                    <SearchIcon style={{ color: '#E3E3E3' }}/>
                </IconButton>
                <SearchInput placeholder="Search in chats"/>
            </Search>
            <SidebarButton style={{ color: '#E3E3E3' }} onClick={createChat}>
                Start a new chat
            </SidebarButton>

            {/* List of chats */}
            {chatsSnapshot?.docs.map((chat) => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    )
}

export default Sidebar;

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid #717171;
    background-color: #3D3D3D;
    height: 100vh;
    min-width: 280px;
    max-width: 330px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const SidebarButton = styled(Button)`
    width: 100%;
    &&& {
        border-top: 1px solid #717171;
        border-bottom: 1px solid #717171;
    }
    
`;

const Search = styled.div`
    display:flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SearchInput = styled.input`
    padding-left: 20px;
    height: 40px;
    border-radius: 20px;
    background-color: #A5A5A5;
    outline-width: 0;
    border: none;
    flex: 1;
`;

const Header = styled.div`
    display: flex;
    position:sticky;
    top: 0;
    z-index: 1;
    justify-content:space-between;
    align-items:center;
    padding: 15px;
    height: 80px;
    border-bottom:1px solid #717171;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;