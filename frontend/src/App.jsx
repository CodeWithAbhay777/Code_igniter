import { useState } from 'react'

import {  Routes, Route, } from "react-router-dom";
import Room from './pages/Room.jsx';
import './index.css'
import './App.css'
import Entry from './pages/Entry.jsx';
import NeedUsername from "./pages/NeedUsername.jsx";

function App() {


  return (





    <div id='wrapper-grid'>


      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/room/:roomId" element={<Room />} />
        <Route path="/ready" element={<NeedUsername />} />

      </Routes>

     




    </div>



  )
}

export default App;
