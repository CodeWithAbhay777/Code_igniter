import React, { useState } from 'react';
import { IoCaretBack } from "react-icons/io5";
import { IoCaretForwardOutline } from "react-icons/io5";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { useFetchCodes } from '../util/fetchCodes';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

//language icons imports
import { FaPython } from "react-icons/fa6";


const Codebase = ({ codebaseVisibility }) => {

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [codeData, setCodeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useFetchCodes([search], 400, search, currentPage, setCodeData, setTotal, setIsLoading);

  return (
    <div className={`fixed flex flex-col items-center justify-evenly ${codebaseVisibility ? `right-0 top-0` : `right-[-100rem] top-0 `}  h-full w-[25rem] lg:w-[25rem] md:w-[20rem] sm:w-[18rem] bg-gray-950 rounded shadow-[0px_0px_20px_rgba(0,0,0,1)] transition-all ease-in-out delay-3050`}>
      <div id='upperDiv' className=' w-full h-[8rem] mt-2 bg-gray-950 p-2 flex flex-col items-center justify-between'>

        <input value={search} onChange={(e) => setSearch(e.target.value)} className='h-[3rem] w-full p-2 font-4xl border-[1px] border-white-500 bg-gray-950 rounded text-white' placeholder='Search by title' />

        <div className='my-2 w-full h-[4rem] py-1 flex items-center justify-between bg-gray-700 rounded-lg'>

          <div className='w-1/2 h-full mx-1 rounded-lg flex'>

            <div className='bg-gray-900 w-1/3 h-full cursor-pointer hover:bg-gray-800 rounded-lg flex items-center justify-center'><IoCaretBack className='text-2xl text-white' /></div>
            <div className=' w-1/3 h-full flex items-center justify-center text-lg text-white'>{currentPage}</div>
            <div className='bg-gray-900 w-1/3 h-full cursor-pointer hover:bg-gray-800 rounded-lg flex items-center justify-center'><IoCaretForwardOutline className='text-2xl text-white' /></div>

          </div>

          <div className='bg-gray-900 w-1/2 h-full mx-1 flex items-center justify-center rounded-lg'><h3 className=' text-white text-lg'> total : {total}</h3></div>

        </div>

      </div>

      //lower div
      <div id='lowerDiv' className='flex-grow h-full overflow-auto w-full p-2'>

        {!isLoading ? codeData.map((val, i) => {
          return <div key={i} className='h-[6rem] w-full box-border cursor-pointer flex justify-between items-center bg-gray-800 mb-1 p-2 rounded-lg hover:shadow-[0px_0px_10px_rgba(0,0,0,1)] hover:border-l-2 hover:border-green-600 transition-all ease-in-out delay-3050'>
            <div className='h-full w-[85%] flex flex-col justify-between items-center'>

              <div className='h-[40%] w-full overflow-hidden p-1 flex items-center justify-start text-slate-300 text-lg'> 
                 { val.title}
              </div>
              <div className='w-full h-[60%] flex justify-evenly items-center'>
                <FaPython className='text-white text-4xl'/>

                <div className='h-3/4 flex-grow bg-gray-950 text-slate-300 flex items-center justify-center mx-8 rounded-lg'>
                  24 dec 2025
                </div>

              </div>

            </div>

            <div className='flex flex-col h-full flex-grow bg-gray-950 rounded-lg justify-evenly items-center text-3xl'>
            <MdEdit className='text-blue-500'/>
            <MdDelete className='text-red-600'/>

            </div>
          </div>
        }) : <Skeleton />}

      </div>
    </div>
  )
}

export default Codebase;