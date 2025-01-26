import React, { useState } from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { SiCodeigniter } from "react-icons/si";

const NeedUsername = () => {
    const [username , setUsername] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const roomID = location.state?.roomId;

    const submitInfo = (e) => {
        if (username || roomID) {
            navigate(`/room/:${roomID}` , {state : {username}})
        }
    }
    
    return (
        <div className='h-screen w-screen bg-black flex items-center justify-center'>
            <div className='h-[22rem] w-[20rem] lg:w-[30rem] md:w-[28rem] sm:w-[24rem] bg-gray-900 rounded-lg shadow-[0px_0px_50px_rgba(0,0,0,1)] flex flex-col'>
                    <div className='text-white text-2xl w-full h-[4rem]  flex items-center justify-center'>
                      <SiCodeigniter className='text-red-500' />&nbsp;
                      <h2 >Code-Igniter</h2>
                    </div>
                    <div id="input-area" className=' flex-grow px-6 py-2'>
                      
                        <h2 className='text-lg my-2 text-white'>Username</h2>
                        
                        <input id='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username"  className='h-[2.5rem] w-full m-auto bg-white rounded-md p-2 text-lg shadow-[0px_0px_50px_rgba(0,0,0,1)]'/>
            
                        <h2 className='text-lg my-2 text-white'>Room id</h2>
                        
                        <h2 className='text-white text-xl font-bold'>{roomID}</h2>
            
                        <button onClick={submitInfo} className='h-[3rem] w-full bg-black hover:bg-gray-950 text-white text-xl rounded-md my-5 shadow-[0px_0px_10px_rgba(0,0,0,0.5)]'>Enter Room</button>
                      
                    </div>
            
                  </div>
        </div>
    )
}

export default NeedUsername