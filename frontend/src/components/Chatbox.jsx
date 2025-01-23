
import { useCallback, useEffect, useRef, useState } from 'react';
import { IoSend } from "react-icons/io5";

const Chatbox = ({ chatBoxVisibility, socket, username }) => {

  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState([]);
  const socketref = useRef(socket);

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

  const getMessage = useCallback((username, message) => {
    setNewMessage((prev) => {
      return [...prev, {
        isAuthor: false,
        displayMessage: message,
        sendBy: username
      }]
    })
  }, [])

  // const getMessage = (username, message) => {


  //   setNewMessage((prev) => {
  //     return [...prev, {
  //       isAuthor: false,
  //       displayMessage: message,
  //       sendBy: username
  //     }]
  //   })


  // }

  useEffect(() => {
    
    const handleMessage = (username , message) => {
      console.log("Message received by client:", username, message);
        getMessage(username , message);
    }

    socketref.current.on("get-message", handleMessage);

    return () => {
      console.log("Cleaning up 'get-message' listener");
      socketref.current.off("get-message", handleMessage);
    }
  }, [getMessage])

  return (
    <div className={`fixed ${chatBoxVisibility ? `right-0 top-0` : `right-[-100rem] top-0 `}  h-full w-[25rem] lg:w-[25rem] md:w-[20rem] sm:w-[18rem] bg-gray-950 rounded shadow-[0px_0px_20px_rgba(0,0,0,1)] transition-all ease-in-out delay-3050`}>
      <div id='upperChatDiv' className='w-full h-[90%] p-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-webkit text-white flex-column'>

        {newMessage.map((e) => {

          return e.isAuthor ? <div className='h-[5rem] w-full bg-gray-300 m-y-2'>{e.displayMessage}</div> :
            <div className='h-[5rem] w-full bg-red-500 m-y-2'>{e.displayMessage}</div>
        })}




      </div>
      <div id='lowerChatDiv' className='w-full h-[10%] bg-gray-950 p-2 flex items-center justify-between'>
        <input className='h-[3rem] w-[85%] p-2 font-4xl border-[1px] border-white-500 bg-gray-950 rounded text-white' value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Enter message' />
        <button className='h-[3rem] w-[3rem] bg-red-500 rounded flex justify-center items-center text-2xl bg-white hover:bg-gray-300' onClick={sendMessage}><IoSend /></button>
      </div>


    </div>
  )
}

export default Chatbox