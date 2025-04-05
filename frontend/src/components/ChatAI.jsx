import React, { useState, useEffect, useRef } from 'react'
import { IoSend } from "react-icons/io5";
import { BsStars } from "react-icons/bs";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from 'axios';



const ChatAI = ({ assistantChatBoxVisibility, username, accessabilityTask, setAccessabilityTask }) => {

  const [task, setTask] = useState('');
  const [messageList, setMessageList] = useState([]);
  const acc_Text = useRef(null);
  const scrollForNewMessage = useRef();

  useEffect(() => {
    scrollForNewMessage.current?.scrollIntoView();

  },[messageList])


  const handleTaskSubmit = async (e) => {
    try {

      if ((task !== "" || null || undefined) || acc_Text.current !== null) {
        let finalTaskToSearch;

        if (acc_Text.current !== null) {
          finalTaskToSearch = acc_Text.current;
        }
        else {
          finalTaskToSearch = task;
        }
        setMessageList((prev) => {

          return [...prev, { type: 'user', username, task: finalTaskToSearch }]


        })
        const response = await axios.post(`${import.meta.env.BACKEND_BASEURL}/api/v1/assistant`, { task: finalTaskToSearch });
        if (response.data.success === false) {
          toast.info(`${response.data.msg}`);
          setMessageList((prev) => {
            return [...prev, { type: 'assistant', reply: response.data.msg, success: false }]
          })
          
        }
        else {
          setMessageList((prev) => {
            return [...prev, { type: 'assistant', reply: response.data.msg, success: true }]
          })

        }

        acc_Text.current = null;
        setTask("");


      }



    } catch (error) {
      toast.error(`Something went wrong!`);
      
    }
  }

  const setAndMakeCall = async () => {
    

    let newTask = `I tried to run this code 
    //////
    ${accessabilityTask.acc_taskCode} 
    //////
    But getting this error in compiler
    //////
    ${accessabilityTask.acc_taskError}
    //////
    Please check where is the problem in my code and fix it.`;
    acc_Text.current = newTask;

    await handleTaskSubmit();
    setAccessabilityTask((prev) => {
      return {
        ...prev,
        acc_call: false
      }

    })

  }

  useEffect(() => {
    if (accessabilityTask.acc_call) {
      setAndMakeCall();
    }
  }, [accessabilityTask.acc_call]);



  const clearChat = (e) => {
    setMessageList([]);
  }



  return (

    <div className={`fixed ${assistantChatBoxVisibility ? `right-0 top-0` : `right-[-100rem] top-0 `}  h-full w-[90%] lg:w-[35rem] md:w-[30rem] sm:w-[22rem] bg-gray-950 rounded shadow-[0px_0px_20px_rgba(0,0,0,1)] transition-all ease-in-out delay-3050`}>
      <div id='upperChatDiv' className='w-full h-[calc(100%-10%)] bg-gray-950 p-4 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-webkit text-white flex-column'>
        <div className='px-2 py-1 rounded bg-gray-800 fixed'>
          <button onClick={clearChat}>Clear chat</button>
        </div>

        {
          messageList.map((e, i) => {
            return e.type === "user" ? <div className='min-h-[5rem] w-full bg-gray-700 my-2 rounded flex flex-col break-words'>
              <h6 className='text-gray-400 m-2 h-[0.8rem] text-[13.5px]'>{e.username}&nbsp;(You)</h6>
              <p className='text-white m-2 flex-grow text-[19px] whitespace-pre-line'>{e.task}</p>

            </div> :
              <div className='min-h-[5rem] w-full bg-slate-800 my-2 flex flex-col break-words rounded'>
                <h6 className='text-gray-400 m-2 h-[0.8rem] text-[13.5px]'>Code-Igniter Assistant</h6>
                <p className='text-white m-2 flex-grow text-[19px] whitespace-pre-line'>{e.reply}</p>
              </div>
          })
        }


        <div ref={scrollForNewMessage}></div>

      </div>
      <div id='lowerChatDiv' className='w-full h-[10%] bg-gray-950 p-2 flex items-center justify-between'>
        <input className='h-[3rem] w-[85%] p-2 font-4xl border-[1px] border-white-500 bg-gray-950 rounded text-white' placeholder='Enter message' value={task} onChange={(e) => setTask(e.target.value)} />
        <button className='h-[3rem] w-[3rem] bg-red-500 rounded flex justify-center items-center text-2xl bg-white hover:bg-gray-300' onClick={handleTaskSubmit}><BsStars /></button>
      </div>




    </div>


  )
}

export default ChatAI