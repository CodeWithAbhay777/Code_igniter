import React from 'react'

const Codebase = ({codebaseVisibility}) => {
  return (
    <div className={`fixed ${codebaseVisibility ? `right-0 top-0` : `right-[-100rem] top-0 `}  h-full w-[25rem] lg:w-[25rem] md:w-[20rem] sm:w-[18rem] bg-gray-950 rounded shadow-[0px_0px_20px_rgba(0,0,0,1)] transition-all ease-in-out delay-3050`}>
        
    </div>
  )
}

export default Codebase;