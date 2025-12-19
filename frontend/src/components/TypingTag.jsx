import React from 'react'

const TypingTag = ({username}) => {
  return (
    <div className='absolute bottom-[3rem] right-40 bg-black  flex items-center justify-center px-[1rem] py-[0.5rem] z-999 rounded opacity-80 rounded-lg'>
        <span className="font-semibold mr-2 text-white opacity-100">{username}</span><p className='opacity-100 text-gray-400'>is typing</p> 
    </div>
  )
}

export default TypingTag