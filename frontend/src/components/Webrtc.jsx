import React, { useEffect, useRef, useState } from 'react'
import { motion } from "framer-motion";
import { connect, io } from "socket.io-client";
import Peer from "peerjs";
import { BsFillMicMuteFill } from "react-icons/bs";
import { FaMicrophone } from "react-icons/fa6";
import { IoVideocam } from "react-icons/io5";
import { IoVideocamOff } from "react-icons/io5";

const Webrtc = ({ videoGrid, webrtcVisibility , myStream , screenWidthRef }) => {


    const [micStatus, setMicStatus] = useState(true);
    const [webcamStatus, setWebcamStatus] = useState(true);



    const micStatusChange = (e) => {
        if (myStream.current) {
            const audioTrack = myStream.current.getAudioTracks()[0];
            audioTrack.enabled = !audioTrack.enabled;
            setMicStatus(audioTrack.enabled);
        }
        else {
            console.log(myStream)
        }

    }
    const webcamStatusChange = (e) => {

        if (myStream.current) {
            const videoTrack = myStream.current.getVideoTracks()[0];
            videoTrack.enabled = !videoTrack.enabled;
            setWebcamStatus(videoTrack.enabled);
        }
        else {
            console.log(myStream)
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