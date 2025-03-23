import React, { useEffect, useMemo, useRef, useState, useContext } from 'react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import Webrtc from '../components/Webrtc';
import {useDebounceEffect} from '../util/debounce.js';
import Whiteboard from '../components/Whiteboard';
import Codebase from '../components/codebase';
import SaveModal from '../components/SaveModal.jsx';
import { io } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { languageSupport } from '../util/language_support';
import { executeCode } from '../util/piston_API';
import { isTokenExpired } from '../util/isTokenExpired.js';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { BiLoaderAlt } from "react-icons/bi";
import { starterCode } from '../util/starterCode';
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { BsStars } from "react-icons/bs";
import { FaShareNodes } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { FaSave } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";

import Peer from "peerjs";

import { socket } from '../util/socket.js';

import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { IoMdInformationCircle } from "react-icons/io";
import { IoExit } from "react-icons/io5";
import { IoMdChatbubbles } from "react-icons/io";

import Chatbox from '../components/Chatbox';
import '../App.css'
import ChatAI from '../components/ChatAI';


const Room = () => {




  const navigate = useNavigate();
  const [languageValue, setLanguageValue] = useState(languageSupport[0].language);
  const [inputValue, setInputValue] = useState(starterCode[languageValue]);
  const [resetBtnClr, setRestBtnClr] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newUser, setNewUser] = useState("");
  const [userExit, setUserExit] = useState("");
  const [output, setOutput] = useState([`Click "Run" to see the output here`])
  const [accessCodeForTask, setAccessCodeForTask] = useState('');
  const [btnLoad, setBtnLoad] = useState(false);
  
  const [webrtcVisibility, setWebrtcVisibility] = useState(true);
  const [whiteBoardVisibility, setWhiteBoardVisibility] = useState(false);
  const [chatBoxVisibility, setChatBoxVisibility] = useState(false);
  const [codebaseVisibility , setCodebaseVisibility] = useState(false);
  const [saveCodeVisibility , setSaveCodeVisibility] = useState(false);
  const [assistantChatBoxVisibility, setAssistantChatBoxVisibility] = useState(false);
  const [accessabilityTask, setAccessabilityTask] = useState({ acc_taskCode: null, acc_taskError: null, acc_call: false });


  //trail
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);


  const { roomId } = useParams();
  const location = useLocation();
  const editorRef = useRef();

  const screenWidthRef = useRef(null);
  const isError = useRef(false);

  const [username, setUsername] = useState(
    location.state?.username || new URLSearchParams(location.search).get('username')
  );






  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:3000/api/v1/auth/google?roomId=${roomId}&username=${username}`;
  };






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

        
        addVideoStream(createVideoElement(true), stream);


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

    myPeer.current.on('open', (id) => {
      socket.emit('join-room', roomId, { id, username });
    });

    myPeer.current.on('call', (call) => {
      call.answer(myStream.current);
      const video = createVideoElement();
      call.on('stream', (userVideoStream) => addVideoStream(video, userVideoStream));
    });

    return () => {
      socket.disconnect();
      if (myPeer.current) myPeer.current.destroy();
    };
  }, [roomId, username]);



  useDebounceEffect(()=>{

    sessionStorage.setItem("camsWindowState" , JSON.stringify(webrtcVisibility));

  },[webrtcVisibility],2000);

  useDebounceEffect(() => {

    sessionStorage.setItem("inputValueState" , JSON.stringify(inputValue));
    sessionStorage.setItem("languageValueState" , JSON.stringify(languageValue));

  },[inputValue , languageValue] , 2000);


  //socket useEffect work
  useEffect(() => {


    console.log("i RAN")
    //trail code for sessionStorage
    
    const camsWindowState = sessionStorage.getItem("camsWindowState");
    const inputValueState = sessionStorage.getItem("inputValueState");
    const languageValueState = sessionStorage.getItem("languageValueState");
    
    if (camsWindowState) setWebrtcVisibility(JSON.parse(camsWindowState));
    if (inputValueState) setInputValue(JSON.parse(inputValueState));
    if (languageValueState) setLanguageValue(JSON.parse(languageValueState));


    const tokenAlreadyExist = localStorage.getItem("authToken");
    let urlUsername = null;



    if (!tokenAlreadyExist) {
      //In case of sign in
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      urlUsername = params.get('username');

      if (token) {
        localStorage.setItem('authToken', token);

        navigate(`/room/${roomId}`, {
          state: { username: urlUsername },
          replace: true
        });

        setIsLoggedIn(true);
        toast.success("Signin successfully");
      } else {
        setIsLoggedIn(false);
      }
    }
    else {
      //case when user already logged in

      if (isTokenExpired(tokenAlreadyExist)) {
        setIsLoggedIn(false);
        localStorage.removeItem("authToken");
      }
      else {
        setIsLoggedIn(true);

        console.log("W-E-L-C-O-M-E");
      }



    }




    if (!location.state?.username && !urlUsername) {
      navigate(`/ready`, { state: { roomId } });
    }



    socket.on("user-connected", ({ id, username }) => {

      toast.info(`${username} joined the room.`);

      console.log(`${username} connected with Peer ID: ${id}`);

      connectToNewUser(id, myStream.current);

    });



    socket.on("new-input-value", (inputValue, languageValue, username) => {
      setIsUpdating(true);
      setLanguageValue(languageValue);
      setInputValue(inputValue);
      console.log(`${username} is typing...`);
    })

    socket.on("user-disconnected", ({ id, username }) => {
      console.log(`User disconnected: ${username}`);
      toast.info(`${username} left the room.`);
      if (peers.current[id]) peers.current[id].close();
    })


    return () => {
      socket.off('user-connected');
      socket.off('user-disconnected');


    }


  }, [])

  useEffect(() => {

      if (!isUpdating) {
      socket.emit("change-input", inputValue, username, languageValue);
      }

    setIsUpdating(false);

  }, [inputValue, languageValue]);


  const connectToNewUser = (userId, stream, username) => {
    const call = myPeer.current.call(userId, stream);
    const video = createVideoElement();

    call.on('stream', (userVideoStream) => addVideoStream(video, userVideoStream));
    call.on('close', () => video.remove());
    peers.current[userId] = call;
  };

  const createVideoElement = (muted = false) => {


    const video = document.createElement('video');

    video.muted = muted;
    video.style.height = '10rem';
    video.style.width = '17rem';
    video.style.borderRadius = '8px';
    video.style.objectFit = 'cover';
    video.style.margin = '0.5rem';


    return video;
  };


  const addVideoStream = (video, stream) => {

    if (Array.from(videoGrid.current.children).some((v) => v.srcObject === stream)) {
      return;
    }

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
      if (data.run.signal) {
        if (data.run.signal === 'SIGKILL') {
          toast.error('Load exeeded: please decrease the values')
        }
      }
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

  const settingDataForAccessabilityCall = () => {
    setAccessabilityTask({
      acc_taskCode: inputValue,
      acc_taskError: output,
      acc_call: true
    });

    setAssistantChatBoxVisibility((prev) => {
      return true;
    });
  }

  const logoutUser = () => {

    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    toast.success("Logout successfully");
    console.log("G-o-o-d-B-y-e");
  }


  return (
    <div id="wrapper-grid">
      <div ref={screenWidthRef} id='room-whole-wrapper' className=' relative h-full w-full flex flex-wrap lg:overflow-hidden md:overflow-hidden justify-center items-end'>


        {saveCodeVisibility && <SaveModal codeSaveinfo = {{languageValue , inputValue}} closeModal = {() => setSaveCodeVisibility(false)}/>}


        <div id="code-editor-area" className='h-full w-full lg:w-1/2 md:w-1/2 sm:w-full p-4 flex flex-col'>


          <div className='h-[3rem] w-full p-1 flex justify-between items-center'>

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

            {
              isLoggedIn ?
                <div className='h-full w-[18rem] flex justify-around items-center'>
                  <button className='h-[2.5rem] w-[8rem] bg-gray-800 rounded-md text-white hover:bg-gray-700 cursor-pointer flex items-center justify-center' onClick={() => setSaveCodeVisibility(true)}><IoIosSave className='text-3xl mx-1' /> Save code</button>
                  <button className='h-[2.5rem] w-[8rem] bg-red-600 rounded-md text-white hover:bg-red-500 cursor-pointer flex items-center justify-center' onClick={logoutUser}><HiOutlineLogout className='text-2xl mx-1' />Logout</button>
                </div>
                :
                <button onClick={handleGoogleLogin}
                  className="bg-white hover:bg-gray-200 text-black flex items-center justify-center rounded w-[10rem] h-[2.5rem] p-1 cursor-pointer">
                  <FcGoogle className='mx-1 text-2xl' />Sign in</button>
            }

          </div>

          <div id='editing-area' className='w-full h-full bg-gray-900 flex-grow my-2 p-[7px] rounded overflow-hidden flex-grow'>
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

            <div className='flex justify-between items-center '>
              <button className='h-[2.5rem] w-[10rem] bg-gray-800 rounded-md text-white hover:bg-gray-700 cursor-pointer' onClick={getOutput}>
                {btnLoad ? <BiLoaderAlt className='text-xl m-auto animate-spin' /> : "Run"}
              </button>


              {isError.current ? <button onClick={settingDataForAccessabilityCall} className='bg-gradient-to-r from-green-900 to-green-600 hover:border-2 text-white h-[2.5rem] w-[10rem] rounded-md flex justify-center items-center mx-2'><BsStars />&nbsp;Ask Assistant</button> : null}
            </div>



            <button
              onClick={() => {
                isError.current = false;
                setOutput([`Click "Run" to see the output here`]);

                setRestBtnClr(false);
              }
              }
              className='h-[2.5rem] w-[10rem] bg-gray-800 rounded-md text-white hover:bg-gray-700 cursor-pointer' >Clear</button>
          </div>

          <div id="output-display-block" className={`bg-gray-900 h-[90%] w-full rounded p-4 overflow-auto break-words ${isError.current ? `text-red-500 border border-red-500` : `text-gray-300 border border-green-300`} ${!resetBtnClr ? `border-0 text-gray-300` : null} `}>
            {output.map((val, i) => {
              return <p key={i}>{val}</p>
            })}





          </div>




        </div>

        //toolbar
        <motion.div drag whileDrag={{ scale: 1.2 }} dragConstraints={screenWidthRef} id="nav" className='fixed left-0 bottom-0 z-10 bg-black text-white flex text-4xl items-center justify-evenly h-[6rem] w-full lg:w-[26rem] lg:bottom-0 md:w-[22rem] md:left:0 md:bottom-0 sm:w-[25rem] sm:bottom-0 sm:right-0 rounded-lg shadow-[0px_0px_20px_rgba(0,0,0,1)] cursor-pointer'>

          <FaChalkboardTeacher onClick={() => { setWhiteBoardVisibility((prev) => !prev) }} className='hover:text-gray-300' />

          <FaShareNodes className='hover:text-gray-300' />


          <BsStars onClick={() => setAssistantChatBoxVisibility((prev) => !prev)} className={`${assistantChatBoxVisibility ? `text-gray-400` : `text-white`} hover:text-gray-300`} />

          <IoMdChatbubbles onClick={chatBoxIconClicked} className={`${chatBoxVisibility ? `text-gray-400` : `text-white`} hover:text-gray-300`} />

          {isLoggedIn && <FaSave onClick={() => { setCodebaseVisibility((prev) => !prev) }} className='text-3xl hover:text-gray-300' />}

          {
            webrtcVisibility ? <IoEyeSharp className='hover:text-gray-300' onClick={videoWindowVisibility} /> : <FaEyeSlash className='text-gray-400 hover:text-gray-300' onClick={videoWindowVisibility} />
          }

          <IoMdInformationCircle className='hover:text-gray-300' />

          <IoExit className='text-red-500 hover:text-red-700' />

        </motion.div>

        //webrtc
        <Webrtc webrtcVisibility={webrtcVisibility} videoGrid={videoGrid} myStream={myStream} screenWidthRef={screenWidthRef} />




        //chatbox
        <Chatbox chatBoxVisibility={chatBoxVisibility} socket={socket} username={username} />

        //codebase
        <Codebase codebaseVisibility={codebaseVisibility}/>

        //assistantchatbox
        <ChatAI assistantChatBoxVisibility={assistantChatBoxVisibility} username={username} accessabilityTask={accessabilityTask} setAccessabilityTask={setAccessabilityTask} />


        //whiteboard
        <Whiteboard whiteBoardVisibility={whiteBoardVisibility} roomId={roomId} />


      </div>
      <>
        <ToastContainer />
      </>

    </div>
  )
}

export default Room