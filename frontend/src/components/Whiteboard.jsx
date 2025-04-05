import React, { useEffect, useRef, useState } from 'react'
import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { useSyncDemo } from '@tldraw/sync'

const Whiteboard = ({ whiteBoardVisibility, roomId }) => {
  const store = useSyncDemo({ roomId: roomId })

  return (
    <div className={`absolute p-2 ${whiteBoardVisibility ? `right-0 top-0 ` : `right-[-100rem] top-0`} h-full lg:w-[50rem] w-full md:w-[40rem] bg-white shadow-[0px_0px_20px_rgba(0,0,0,1)] transition-all ease-in-out delay-3050 flex items-center justify-center`} >
      <Tldraw store={store} />


    </div>
  )
}

export default Whiteboard


