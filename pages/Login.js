import { Button } from "@material-ui/core";
import Head from "next/head";
import styled from 'styled-components';
import { auth, provider } from "../firebase";
function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    }
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo src="https://i.ibb.co/wsQ7vCc/imageedit-2-2402869849.png"/>
                <Button style={{color: '#60DBD5' }} onClick={signIn} variant="outlined">Sign in with Google</Button>
            </LoginContainer>
        </Container>
    )
}

export default Login;

const Container = styled.div`
    background-color: #0c313d;
    display: grid;
    place-items: center;
    height: 100vh;
`;

const LoginContainer = styled.div`
    padding: 100px;
    background-color: #2A313D;
    display: flex;
    flex-direction: column;
    border-radius: 5vh;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

const Logo = styled.img`
    height: 300px;
    width: 360px;
`;

