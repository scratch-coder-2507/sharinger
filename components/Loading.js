import {Circle} from "better-react-spinkit";
function Loading() {
    return (
        <center style={{display:"grid", placeItems:"center", height:"100vh", backgroundColor:"#2A313D"}}>
            <div>
                <img 
                src="https://i.ibb.co/wsQ7vCc/imageedit-2-2402869849.png" 
                style={{marginBottom: 18}}
                height={300}
                alt=""/>
                <Circle color="#01F8A2" size={70}/>
            </div>
        </center>
    )
}

export default Loading;
