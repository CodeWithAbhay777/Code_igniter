import React, { useState, lazy, useRef, useEffect } from 'react';
import { deleteCode } from '../util/deleteCode';
import { IoCaretBack } from "react-icons/io5";
import { IoCaretForwardOutline } from "react-icons/io5";
import { SkeletonTheme} from 'react-loading-skeleton'
import  CodebaseLoader from '../components/CodebaseLoader'; 
import 'react-loading-skeleton/dist/skeleton.css'
import { useFetchCodes } from '../util/fetchCodes';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { getLanguageIcon } from '../util/getLanguageIcon';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShowData from './ShowData';
import { BiLoaderAlt } from "react-icons/bi";





const Codebase = ({ codebaseVisibility, isLoggedIn, savedRefresh , setEditWindowState , setSavedData , setShowDataValues , setShowWindowState }) => {

  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [codeData, setCodeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [maxMin, setMaxMin] = useState({ max: false, min: false });
  const [holdDelBtn , setHoldDelBtn] = useState(false);
  const [holdEditBtn , setHoldEditBtn] = useState(false);

  const maxPageLimit = useRef();


  useFetchCodes([search, savedRefresh, currentPage], 400, search, currentPage, setCodeData, setTotal, setIsLoading);

  useEffect(() => {

    maxPageLimit.current = Math.ceil(total / 10);

    maxPageLimit === 0 || maxPageLimit === 1 ? setMaxMin(prev => ({ ...prev, max: false })) : setMaxMin(prev => ({ ...prev, max: true }));
    (currentPage < maxPageLimit) && (maxPageLimit !== 0) ? setMaxMin(prev => ({ ...prev, max: true })) : setMaxMin(prev => ({ ...prev, max: false }));


  }, [codeData]);

  const previous = () => {
    if (currentPage <= 1){
      return;
    }
    else {
      setCurrentPage(prev => prev--);
    }
  }

  const next = () => {
    if (currentPage >= maxPageLimit.current){
      return;
    }
    else {
      setCurrentPage(prev => prev++);
    }
  }

  const deleteCodeAPICall = async(id) => {
    
    if (id){
      setHoldDelBtn(true);
      const responseData = await deleteCode(id);
      setHoldDelBtn(false);
      if (responseData){
        
        const newData = codeData.filter(e => e._id !== responseData.data._id); 
        
        setCodeData(newData);
      }else {
        toast.error("Something went wrong : try again later")
      }
     
    }

  }

  const setupForEdit = (val) => {
    console.log(setSavedData)
    
    if (val && isLoggedIn) {

      setEditWindowState(true);

      setSavedData({
        newLangValue : val.language,
        newNote : val.note,
        newInputValue : val.code,
        newTitle : val.title,
        ownerId : val.ownerId,
        id:val._id,
      })

      

    }
  }

  const callShowData = (val) => {
      if (val && isLoggedIn) {

        setShowWindowState(true);

        setShowDataValues({
          language : val.language,
          id : val._id ,
          ownerId : val.ownerId,
          inputValue : val.code,
          note : val.note,
          date : val.date,
          title : val.title,

        })
      }
  }

  

  return (
    <div className={`fixed flex flex-col items-center justify-evenly ${(codebaseVisibility && isLoggedIn) ? `right-0 top-0` : `right-[-100rem] top-0 `}  h-full w-[25rem] lg:w-[25rem] md:w-[20rem] sm:w-[18rem] bg-gray-950 rounded shadow-[0px_0px_20px_rgba(0,0,0,1)] transition-all ease-in-out delay-3050`}>
      <div id='upperDiv' className=' w-full h-[8rem] mt-2 bg-gray-950 p-2 flex flex-col items-center justify-between'>

        <input value={search} onChange={(e) => setSearch(e.target.value)} className='h-[3rem] w-full p-2 font-4xl border-[1px] border-white-500 bg-gray-950 rounded text-white' placeholder='Search by title' />

        <div className='my-2 w-full h-[4rem] py-1 flex items-center justify-between bg-gray-700 rounded-lg'>

          <div className='w-1/2 h-full mx-1 rounded-lg flex'>

            <div onClick={previous} className={`bg-gray-900 w-1/3 h-full cursor-pointer ${!maxMin.min ? "pointer-events-none opacity-50" : "hover:bg-gray-800"} rounded-lg flex items-center justify-center`}><IoCaretBack className='text-2xl text-white' /></div>
            <div className=' w-1/3 h-full flex items-center justify-center text-lg text-white'>{currentPage}</div>
            <div onClick={next} className={`bg-gray-900 w-1/3 h-full cursor-pointer ${!maxMin.max ? "pointer-events-none opacity-50" : "hover:bg-gray-800"} rounded-lg flex items-center justify-center`}><IoCaretForwardOutline className='text-2xl text-white' /></div>

          </div>

          <div className='bg-gray-900 w-1/2 h-full mx-1 flex items-center justify-center rounded-lg'><h3 className=' text-white text-lg'> total : {total}</h3></div>

        </div>

      </div>

     
      <div id='lowerDiv' className='flex-grow h-full overflow-auto w-full p-2 overflow-x-hidden scrollbar-thin scrollbar-webkit'>

        {!isLoading ? codeData.map((val) => {

          const IconComponent = getLanguageIcon(val.language);

          return <div key={val._id} onClick={() => callShowData(val)} className='h-[6rem] w-full box-border cursor-pointer flex justify-between items-center bg-gray-800 mb-1 p-2 rounded-lg hover:shadow-[0px_0px_10px_rgba(0,0,0,1)] hover:border-2 hover:border-green-600 transition-all ease-in-out delay-3050'>
            <div className='h-full w-[85%] flex flex-col justify-between items-center'>

              <div className='h-[40%] w-full overflow-hidden p-1 flex items-center justify-start text-white text-lg'>
                {val.title}
              </div>
              <div className='w-full h-[60%] flex justify-evenly items-center'>

                < IconComponent className="text-3xl text-slate-300" />

                <div className='h-3/4 flex-grow bg-gray-950 text-slate-300 flex items-center justify-center mx-8 rounded-lg'>
                  {val.date}
                </div>

              </div>

            </div>

            <div className='flex flex-col h-full flex-grow bg-gray-950 rounded-lg justify-evenly items-center text-3xl'>
              {holdEditBtn ? <BiLoaderAlt className='text-xl m-auto animate-spin' /> : <MdEdit className='text-blue-500 cursor-pointer' onClick={(e) => {
                e.stopPropagation();
                setupForEdit(val)}}/>}
              {holdDelBtn ? <BiLoaderAlt className='text-xl m-auto animate-spin' /> : <MdDelete className={`text-red-600 cursor-pointer hover:text-red-500`} onClick={(e) => {
                e.stopPropagation();
                deleteCodeAPICall(val._id)} }/>}

            </div>
          </div>
        }) : <SkeletonTheme baseColor="#1F2937" highlightColor="#444"><CodebaseLoader count = {5}/></SkeletonTheme>}

      </div>
    </div>
  )
}

export default Codebase;