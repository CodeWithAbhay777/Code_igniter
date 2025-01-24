import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import Webrtc from '../components/Webrtc';
import Whiteboard from '../components/Whiteboard';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { languageSupport } from '../util/language_support';
import { executeCode } from '../util/piston_API';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { BiLoaderAlt } from "react-icons/bi";
import { starterCode } from '../util/starterCode';
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaShareNodes } from "react-icons/fa6";
import Peer from "peerjs";



import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { IoMdInformationCircle } from "react-icons/io";
import { IoExit } from "react-icons/io5";
import { IoMdChatbubbles } from "react-icons/io";
import { AiFillThunderbolt } from "react-icons/ai";
import Chatbox from '../components/Chatbox';
import '../App.css'


const Room = () => {



  // const [socket] = useState(() => io("http://localhost:3000"));
  const socket = useMemo(() => io("http://localhost:3000"), [])
  const [languageValue, setLanguageValue] = useState(languageSupport[0].language);
  const [inputValue, setInputValue] = useState(starterCode[languageValue]);
  const [resetBtnClr, setRestBtnClr] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newUser, setNewUser] = useState("");
  const [userExit, setUserExit] = useState("");
  const [output, setOutput] = useState([`Click "Run" to see the output here`])
  const [btnLoad, setBtnLoad] = useState(false);
  const [webrtcVisibility, setWebrtcVisibility] = useState(true);
  const [whiteBoardVisibility, setWhiteBoardVisibility] = useState(false);
  const [chatBoxVisibility, setChatBoxVisibility] = useState(false);
  const { roomId } = useParams();
  const location = useLocation();
  const editorRef = useRef();

  const screenWidthRef = useRef(null);
  const isError = useRef(false);

  const username = location.state?.username;
  

  //webrtc_work
  const videoGrid = useRef();
  const myPeer = useRef();
  const myVideo = useRef();
  const myStream = useRef();
  const peers = useRef({});





  useEffect(() => {
    setInputValue(starterCode[languageValue])
  }, [languageValue])


  //webrtc_setup_useEffect
  useEffect(() => {

    myPeer.current = new Peer(undefined, {
      host: '0.peerjs.com',
      secure: true,
      port: 443,
    });

    
    myVideo.current = document.createElement('video');
    myVideo.current.muted = true; 
    
    const initWebRTC = async () => {
      


      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        myStream.current = stream;

        
        addVideoStream(myVideo.current, stream);

        
        myPeer.current.on('call', (call) => {
          call.answer(stream); 
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => addVideoStream(video, userVideoStream));
        });
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast.error('Could not access camera/microphone!');
      }
    };

    initWebRTC();
  }, []);


  //socket useEffect work
  useEffect(() => {
    
    


    socket.emit("join-room", roomId, username);

    socket.on("user-connected", (userId) => {

      toast.info(`${userId} joined the room.`);
      
      console.log(`New user connected - UserID: ${userId}`);
      connectToNewUser(userId, myStream.current);
      
    });

    

    socket.on("new-input-value", (inputValue, languageValue, username) => {
      setIsUpdating(true);
      setLanguageValue(languageValue);
      setInputValue(inputValue);
    })

    socket.on("user-disconnected", (userId) => {
      console.log(`User disconnected: ${userId}`);
      toast.info(`${userId} left the room.`);
      if (peers.current[userId]) peers.current[userId].close();
    })

    myPeer.current.on('open', (id) => {
      socket.emit('join-room', roomId, id); 
    });

    return () => {
      socket.disconnect();
      socket.off();
      if (myPeer.current) myPeer.current.destroy();
      
    }


  }, [username, roomId])

  useEffect(() => {

    if (!isUpdating) {
      socket.emit("change-input", inputValue, username, languageValue);
    }

    setIsUpdating(false);

  }, [inputValue, languageValue]);


  const connectToNewUser = (userId, stream) => {
    const call = myPeer.current.call(userId, stream); 
    const video = document.createElement('video');

    call.on('stream', (userVideoStream) => addVideoStream(video, userVideoStream)); 
    call.on('close', () => video.remove()); 
    peers.current[userId] = call; 
  };


  const addVideoStream = (video, stream) => {
   
    const existingVideo = Array.from(videoGrid.current.children).find((v) => v.srcObject === stream);
    if (existingVideo) return;

    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => video.play());
    videoGrid.current.append(video);
  };


  const focusing = (e) => {
    editorRef.current = e;
    e.focus();
  }

  const videoWindowVisibility = (e) => {
    setWebrtcVisibility((prev) => !prev);
  }

  const onChangeFunction = (e) => {
    setInputValue(e);

  }

  const chatBoxIconClicked = (e) => {
    setChatBoxVisibility((prev) => !prev)
  }

  const getOutput = async (e) => {

    if (inputValue === "") return;

    setBtnLoad(true);
    try {

      const data = await executeCode(languageValue, inputValue);
      isError.current = data.run.stderr === "" ? false : true;
      data.run.output.split('\n');
      setOutput([...data.run.output.split('\n'), "-------code-execution-completed-------"]);


    } catch (error) {
      console.log(error)
      toast.error("Something went wrong!");

    }
    finally {
      setBtnLoad(false)
      setRestBtnClr(true)
    }

  }


  return (
    <div id="wrapper-grid">
      <div ref={screenWidthRef} id='room-whole-wrapper' className=' relative h-full w-full flex flex-wrap lg:overflow-hidden md:overflow-hidden justify-center items-end'>


        <div id="code-editor-area" className='h-full w-full lg:w-1/2 md:w-1/2 sm:w-full p-4 flex flex-col'>

          <select name="languages" id="languages" value={languageValue}
            onChange={(val) => {
              setLanguageValue(val.target.value)

            }
            }
            className='bg-gray-800 h-[2.5rem] w-[12rem] rounded-md text-white p-1 hover:bg-gray-900 cursor-pointer'>
            {languageSupport.map((val, i) => {
              return <option key={i} value={val.language} >{val.language}&nbsp;&nbsp;&nbsp;{val.version}</option>
            })}
          </select>

          <div id='editing-area' className='w-full min-h-[90%] bg-gray-900 flex-grow my-2 p-[7px] rounded'>
            <Editor
              height="100%"
              theme="vs-dark"
              onMount={focusing}
              language={languageValue}
              value={inputValue}
              onChange={onChangeFunction}
            />;
          </div>

        </div>

        <div id="output-area" className=' h-full w-full lg:w-1/2 md:w-1/2 sm:w-full p-2 flex flex-col'>

          <div id='btns-area' className=' h-[3rem] w-full p-2 flex justify-between items-center my-1'>
            <button className='h-[2.5rem] w-[10rem] bg-gray-800 rounded-md text-white hover:bg-gray-900 cursor-pointer' onClick={getOutput}>
              {btnLoad ? <BiLoaderAlt className='text-xl m-auto animate-spin' /> : "Run"}
            </button>
            <button
              onClick={() => {
                setOutput([`Click "Run" to see the output here`]);
                setRestBtnClr(false);
              }
              }
              className='h-[2.5rem] w-[10rem] bg-gray-800 rounded-md text-white hover:bg-gray-900 cursor-pointer' >Clear</button>
          </div>

          <div id="output-display-block" className={`bg-gray-900 h-[90%] w-full rounded p-4 overflow-auto ${isError.current ? `text-red-500 border border-red-500` : `text-gray-300 border border-green-300`} ${!resetBtnClr ? `border-0 text-gray-300` : null} `}>
            {output.map((val, i) => {
              return <p key={i}>{val}</p>
            })}

          </div>




        </div>

        //toolbar
        <motion.div drag whileDrag={{ scale: 1.2 }} dragConstraints={screenWidthRef} id="nav" className='fixed left-0 bottom-0 z-10 bg-black text-white flex text-4xl items-center justify-evenly h-[6rem] w-full lg:w-[25rem] lg:bottom-0 md:w-[21rem] md:left:0 md:bottom-0 sm:w-[24rem] sm:bottom-0 sm:right-0 rounded-lg shadow-[0px_0px_20px_rgba(0,0,0,1)] cursor-pointer'>

          <FaChalkboardTeacher onClick={() => { setWhiteBoardVisibility((prev) => !prev) }} className='hover:text-gray-300' />

          <FaShareNodes className='hover:text-gray-300' />

          <AiFillThunderbolt />

          <IoMdChatbubbles onClick={chatBoxIconClicked} className={`${chatBoxVisibility ? `text-gray-400` : `text-white`} hover:text-gray-300`} />

          {
            webrtcVisibility ? <IoEyeSharp className='hover:text-gray-300' onClick={videoWindowVisibility} /> : <FaEyeSlash className='text-gray-400 hover:text-gray-300' onClick={videoWindowVisibility} />
          }

          <IoMdInformationCircle className='hover:text-gray-300' />

          <IoExit className='text-red-500 hover:text-red-700' />

        </motion.div>

        //webrtc
        {/* <Webrtc screenWidthRef={screenWidthRef} socket={socket} webrtcVisibility={webrtcVisibility} roomId={roomId} username={username} newUser={newUser} userExit={userExit} /> */}

        <Webrtc webrtcVisibility = {webrtcVisibility} videoGrid = {videoGrid} myStream = {myStream.current} screenWidthRef={screenWidthRef}/>

        <Chatbox chatBoxVisibility={chatBoxVisibility} socket={socket} username={username} />

        <Whiteboard whiteBoardVisibility={whiteBoardVisibility} roomId={roomId} />



      </div>
      <>
        <ToastContainer />
      </>

    </div>
  )
}

export default Room