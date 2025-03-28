import React from 'react'
import Skeleton from 'react-loading-skeleton'

const CodebaseLoader = ({count}) => {
  return (
    <>
    <div className='w-full m-1 '>
        <Skeleton height={90} enableAnimation={true} count={count}/>
    </div>
    </>
  )
}

export default CodebaseLoader;