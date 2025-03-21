
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDebounceEffect } from '../util/debounce';
import { IoSend } from "react-icons/io5";

const Chatbox = ({ chatBoxVisibility, socket, username }) => {

  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState([]);
  const socketref = useRef(socket);
  const scrollForNewMessage = useRef();

  useDebounceEffect(() => {
    sessionStorage.setItem("allMessageState",JSON.stringify(newMessage));
  },[newMessage] , 2000);

  useEffect(() => {
    const allMessageState = sessionStorage.getItem("allMessageState");
    if (allMessageState) setNewMessage(JSON.parse(allMessageState));
  },[])

  useEffect((e) => {
    scrollForNewMessage.current?.scrollIntoView();
  }, [newMessage])

  const sendMessage = (e) => {


    setNewMessage((prev) => {
      return [...prev, {
        isAuthor: true,
        displayMessage: message,
        sendBy: username
      }]
    })

    socketref.current.emit("chat-message", username, message);

    setMessage("");

  }

  useEffect(() => {

    const handleMessage = (username, message) => {
      console.log("Message received by client:", username, message);
      setNewMessage((prev) => {
        return [...prev, {
          isAuthor: false,
          displayMessage: message,
          sendBy: username
        }]
      })
    }

    socketref.current.on("get-message", handleMessage);

    return () => {
      console.log("Cleaning up 'get-message' listener");
      socketref.current.off("get-message", handleMessage);
    }
  }, [socket])

  return (
    <div className={`fixed ${chatBoxVisibility ? `right-0 top-0` : `right-[-100rem] top-0 `}  h-full w-[25rem] lg:w-[25rem] md:w-[20rem] sm:w-[18rem] bg-gray-950 rounded shadow-[0px_0px_20px_rgba(0,0,0,1)] transition-all ease-in-out delay-3050`}>
      <div id='upperChatDiv' className='w-full h-[calc(100%-10%)] bg-gray-950 p-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-webkit text-white flex-column'>

        {newMessage.map((e) => {

          return e.isAuthor ? <div className='min-h-[5rem] w-full bg-gray-700 my-2 rounded flex flex-col break-words'>
            <h6 className='text-gray-400 m-2 h-[0.8rem] text-[13.5px]'>{e.sendBy}&nbsp;(You)</h6>
            <p className='text-white m-2 flex-grow text-[19px]'>{e.displayMessage}</p>

          </div> :
            <div className='min-h-[5rem] w-full bg-slate-800 my-2 flex flex-col break-words rounded'>
              <h6 className='text-gray-400 m-2 h-[0.8rem] text-[13.5px]'>{e.sendBy}</h6>
              <p className='text-white m-2 flex-grow text-[19px]'>{e.displayMessage}</p>
            </div>
        })}


        <div ref={scrollForNewMessage}></div>

      </div>
      <div id='lowerChatDiv' className='w-full h-[10%] bg-gray-950 p-2 flex items-center justify-between'>
        <input className='h-[3rem] w-[85%] p-2 font-4xl border-[1px] border-white-500 bg-gray-950 rounded text-white' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter message' />
        <button className='h-[3rem] w-[3rem] bg-red-500 rounded flex justify-center items-center text-2xl bg-white hover:bg-gray-300' onClick={sendMessage}><IoSend /></button> */
      </div>


    </div>
  )
}

export default Chatbox