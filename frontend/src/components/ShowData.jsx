import React from 'react';
import { getLanguageIcon } from '../util/getLanguageIcon';
import { RxCross1 } from "react-icons/rx";
import CodeEditor from './CodeEditor';

const ShowData = ({ setShowWindowState, showDataValues }) => {
  const IconComponent = getLanguageIcon(showDataValues.language);
  return (
    <div className='fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-[100] px-[15rem] py-10'>

      <div className='h-full w-full bg-black rounded-lg p-2 shadow-[0px_0px_50px_rgba(0,0,0,1)] flex flex-col items-center justify-between gap-2'>
        <div className='w-full h-[5rem] bg-gray-900 rounded-lg flex items-center justify-between p-4 gap-4'>
          <IconComponent className="text-3xl text-slate-300" />
          <div className=' flex-grow h-full flex items-center text-2xl font-bold text-white'>
            {showDataValues.title}
          </div>
          <div className='bg-red-600 h-full w-[3rem] rounded flex items-center justify-center hover:bg-red-500' onClick={() => setShowWindowState(false)}>
            <RxCross1 className='text-white text-lg cursor-pointer' />

          </div>
        </div>
        <div className='flex-grow w-full h-full rounded-lg flex justify-evenly'>
          <div className='h-full w-[49%]'>
            <CodeEditor language={showDataValues.language} input={showDataValues.inputValue} readOnly={true}/>
          </div>
          <div className='w-[49%] h-full rounded-lg flex flex-col'>
              <div className='p-2 w-1/3 flex items-center justify-center bg-gray-900 rounded-lg text-xl text-gray-300'>
                {showDataValues.date}
              </div>
              <div className='w-full flex-grow max-h-[24rem] mt-2 p-1 overflow-y-auto text-white text-[1.2rem] scrollbar-thin scrollbar-webkit'>

                  {showDataValues.note}
              </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ShowData