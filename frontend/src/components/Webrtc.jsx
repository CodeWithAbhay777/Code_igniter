import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";
import { connect, io } from "socket.io-client";
import Peer from "peerjs";
import { BsFillMicMuteFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa6";
import { IoVideocam } from "react-icons/io5";
import { IoVideocamOff } from "react-icons/io5";

const Webrtc = ({ videoGrid, webrtcVisibility , myStream , screenWidthRef }) => {

// const Webrtc = ({ screenWidthRef, socket, webrtcVisibility, roomId, username, newUser, userExit }) => {
    const [micStatus, setMicStatus] = useState(true);
    const [webcamStatus, setWebcamStatus] = useState(true);
    // const videoGrid = useRef();
    // const myPeer = useRef();
    // const myVideo = useRef();
    // const myStream = useRef();
    // const peers = useRef({});

    // useEffect(() => {

    //     if (!socket ) {
    //         console.log("Socket, Peer, or Stream not initialized.");
    //         return;
    //     }

    //     myPeer.current = new Peer(undefined, {
    //         host: "0.peerjs.com",
    //         secure: true,
    //         port: 443,
    //     });

    //     myVideo.current = document.createElement('video');
    //     myVideo.current.style.height = "11rem";
    //     myVideo.current.style.width = "18rem";
    //     myVideo.current.style.borderRadius = "8px";
    //     myVideo.current.style.objectFit = "cover";
    //     myVideo.current.style.margin = "0.5rem";
    //     myVideo.current.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    //     myVideo.current.muted = true;

    //     const initializeStream = async () => {
    //         try {
    //             const stream = await navigator.mediaDevices.getUserMedia({
    //                 video: true,
    //                 audio: true,
    //             });

    //             if (!stream) {
    //                 console.error("Stream initialization failed");
                    
    //             }

    //             myStream.current = stream;
    //             addVideoStream(myVideo.current, stream);

    //             myPeer.current.on("call", (call) => {
    //                 console.log("Receiving call from peer");
    //                 // call.answer(stream);
    //                 call.answer(myStream.current);
    //                 const video = document.createElement("video");
    //                 call.on("stream", (userVideoStream) => {
    //                     console.log("Receiving remote stream");
    //                     addVideoStream(video, userVideoStream);
    //                 });

    //                 call.on("close", () => {
    //                     console.log("Call closed");
    //                     video.remove();
    //                 });

    //                 // call.on("error", (err) => {
    //                 //     console.error("Error during call:", err);
    //                 // });

    //             });

    //             // socket.on("user-connected", (userId) => {
    //             //     console.log(`${userId} connected`);
    //             //     connectToNewUser(userId, myStream.current);
    //             // });

    //             // socket.on("user-disconnected", (userId) => {
    //             //     if (peers.current[userId]) peers.current[userId].close();
    //             // });



    //         } catch (error) {
    //             console.error("Error initializing stream:", error);
    //             alert(error);
    //         }
    //     }

    //     initializeStream();

    //     if (newUser && newUser !== myPeer.current.id) {
    //         console.log(`New user detected: ${newUser}`);
    //         connectToNewUser(newUser, myStream.current);
    //     }

    //     if (userExit) {
    //         if (peers.current[userExit]) {
    //             peers.current[userExit].close();
    //         }
    //         delete peers.current[userExit];
    //     }
    //     // myPeer.current.on("open", (id) => {
    //     //     // socket.emit("join-room", roomId, id);
    //     // });

    //     return () => {
    //         if (myPeer.current) myPeer.current.disconnect();
    //         myPeer.current = null;
    //         socket.off("user-connected");
    //         socket.off("user-disconnected");
    //     }

    // }, [socket, newUser, userExit]);



    // useEffect(() => {
    //     if (peers.current[userExit]) peers.current[userExit].close();
    // }, [userExit])


    // const connectToNewUser = (userId, stream) => {

    //     if (peers.current[userId]) return;

    //     console.log(`Connecting to: ${userId}`);

    //     const call = myPeer.current.call(userId, stream);

    //     if (!call) {
    //         console.error(`Call failed to ${userId}`);
    //         return;
    //     }

    //     const video = document.createElement("video");
    //     video.style.height = "11rem";
    //     video.style.width = "18rem";
    //     video.style.borderRadius = "8px";
    //     video.style.objectFit = "cover";
    //     video.style.margin = "0.5rem";
    //     video.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    //     call.on("stream", (userVideoStream) => {
    //         console.log(`Receiving stream from ${userId}`);
    //         // const video = document.createElement("video");
    //         addVideoStream(video, userVideoStream);
    //     });
    //     call.on("close", () => {
    //         video.remove();
    //     });
    //     peers.current[userId] = call;
    // }

    // const addVideoStream = (video, stream) => {

    //     const existingVideo = Array.from(videoGrid.current.children).find(
    //         (v) => v.srcObject === stream
    //     );
    //     if (existingVideo) return;

    //     video.srcObject = stream;
    //     video.addEventListener("loadedmetadata", () => {
    //         video.play();
    //     })
    //     // if (webrtcVisibility && videoGrid.current) {
    //     //     videoGrid.current.append(video);
    //     // }
    //     videoGrid.current.append(video);

    // }


    const micStatusChange = (e) => {
        if (myStream) {
            const audioTrack = myStream.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setMicStatus(audioTrack.enabled);
        }

    }
    const webcamStatusChange = (e) => {

        if (myStream) {
            const videoTrack = myStream.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setWebcamStatus(videoTrack.enabled);
        }

    }
    return (
        <motion.div drag whileDrag={{ scale: 1.2 }} dragConstraints={screenWidthRef} className={`absolute right-0 bottom-0 h-[25rem] w-[42em] p-4 bg-black text-white overflow-y-auto rounded-md scrollbar-thin scrollbar-webkit ${!webrtcVisibility ? 'invisible' : 'visible'}`}>
            <div ref={videoGrid} className='flex h-full w-full flex-wrap items-center justify-center'></div>
            <div className='fixed bottom-[1rem] right-[1rem] h-[4rem] w-[8rem] bg-gray-800 rounded-md opacity-50 hover:opacity-100 flex items-center justify-evenly text-2xl'>

                {micStatus ? <FaMicrophone onClick={micStatusChange} /> : <BsFillMicMuteFill onClick={micStatusChange} />}
                {webcamStatus ? <IoVideocam onClick={webcamStatusChange} /> : <IoVideocamOff onClick={webcamStatusChange} />}

            </div>
        </motion.div>
    )
}

export default Webrtc