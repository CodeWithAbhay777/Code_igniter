import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { SiCodeigniter } from "react-icons/si";
import { FaHeart } from "react-icons/fa6";


import './App.css'

function App() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (roomId && username) {
      // navigate(`/room/${roomId}`, { state: { username } });
      navigate(`/room/${roomId}`, { state: { username } });
    }



  }

  
  const navigate = useNavigate();

  return (

    



      <div id='wrapper-grid'>

        <div className='h-[22rem] w-[20rem] lg:w-[30rem] md:w-[28rem] sm:w-[24rem] bg-gray-900 rounded-lg shadow-[0px_0px_50px_rgba(0,0,0,1)] flex flex-col'>
          <div className='text-white text-2xl w-full h-[4rem]  flex items-center justify-center'>
            <SiCodeigniter className='text-red-500' />&nbsp;
            <h2 >Code-Igniter</h2>
          </div>
          <div id="input-area" className=' flex-grow px-6 py-2'>

            <h2 className='text-lg my-2 text-white'>Username</h2>

            <input id='username' placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} className='h-[2.5rem] w-full m-auto bg-white rounded-md p-2 text-lg shadow-[0px_0px_50px_rgba(0,0,0,1)]' />

            <h2 className='text-lg my-2 text-white'>Room id</h2>

            <input id='roomId' placeholder="Enter room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} className='h-[2.5rem] w-full m-auto bg-white rounded-md p-2 text-lg shadow-[0px_0px_50px_rgba(0,0,0,1)]' />

            <button onClick={handleSubmit} className='h-[3rem] w-full bg-black hover:bg-gray-950 text-white text-xl rounded-md my-5 shadow-[0px_0px_10px_rgba(0,0,0,0.5)]'>Enter Room</button>

          </div>

        </div>


        <div id="owner-tag" className=' absolute bottom-[1rem] w-[13rem] h-[2.5rem] bg-gray-900 rounded text-white font-md text-sm flex items-center justify-center'>
          Made with <FaHeart className='text-red-500 text-lg mx-2' /> by <span className='font-bold mx-1'>Abhay</span>
        </div>



      </div>

   

  )
}

export default App
