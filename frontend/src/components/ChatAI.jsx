import React, { useState } from 'react'
import { IoSend } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from 'axios';



const ChatAI = ({ assistantChatBoxVisibility , username }) => {

  const [task, setTask] = useState('');
  const [messageList, setMessageList] = useState([]);

  const handleTaskSubmit = async (e) => {
    try {

      if (task !== "" || null || undefined) {
        setMessageList((prev) => {
          return [...prev , {type : 'user' , username , task}]
        } )
        const response = await axios.post("http://localhost:3000/api/v1/assistant", { task });
        if (response.data.success === false) {
          toast.info(`${response.data.msg}`);
          setMessageList((prev) => {
            return [...prev , {type : 'assistant' , reply : response.data.msg , success : false }]
          })
          console.log(response.data.msg);
        }
        else {
          setMessageList((prev) => {
            return [...prev , {type : 'assistant' , reply : response.data.msg , success : true}]
          })
          
        }


        setTask("");


      }



    } catch (error) {
      toast.error(`Something went wrong!`);
      console.log(error);
    }
  }

    const clearChat = (e) => {
      setMessageList([]);
    }



  return (

    <div className={`fixed ${assistantChatBoxVisibility ? `right-0 top-0` : `right-[-100rem] top-0 `}  h-full w-[35rem] lg:w-[35rem] md:w-[23rem] sm:w-[18rem] bg-gray-950 rounded shadow-[0px_0px_20px_rgba(0,0,0,1)] transition-all ease-in-out delay-3050`}>
      <div id='upperChatDiv' className='w-full h-[calc(100%-10%)] bg-gray-950 p-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-webkit text-white flex-column'>
        <div className='w-full'> 
          <button onClick={clearChat}>Clear chat</button>
        </div>

        {
          messageList.map((e , i ) => {
            return e.type === "user" ? <div className='min-h-[5rem] w-full bg-gray-700 my-2 rounded flex flex-col break-words'>
            <h6 className='text-gray-400 m-2 h-[0.8rem] text-[13.5px]'>{e.username}&nbsp;(You)</h6>
            <p className='text-white m-2 flex-grow text-[19px]'>{e.task}</p>

          </div> :
            <div className='min-h-[5rem] w-full bg-slate-800 my-2 flex flex-col break-words rounded'>
              <h6 className='text-gray-400 m-2 h-[0.8rem] text-[13.5px]'>Code-Igniter Assistant</h6>
              <p className='text-white m-2 flex-grow text-[19px]'>{e.reply}</p>
            </div>
          })
        }


        {/* <div ref={scrollForNewMessage}></div> */} 

      </div>
      <div id='lowerChatDiv' className='w-full h-[10%] bg-gray-950 p-2 flex items-center justify-between'>
        <input className='h-[3rem] w-[85%] p-2 font-4xl border-[1px] border-white-500 bg-gray-950 rounded text-white' placeholder='Enter message' value={task} onChange={(e) => setTask(e.target.value)} />
        <button className='h-[3rem] w-[3rem] bg-red-500 rounded flex justify-center items-center text-2xl bg-white hover:bg-gray-300' onClick={handleTaskSubmit}><BsStars /></button> */
      </div>
      <>
        <ToastContainer />
      </>

    </div>


  )
}

export default ChatAI