import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import Room from "./pages/room.jsx";
import './index.css'
import App from './App.jsx'
import NeedUsername from "./pages/NeedUsername.jsx";


createRoot(document.getElementById('root')).render(


<Router>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/room/:roomId" element={<Room />} />
    <Route path="/ready" element={<NeedUsername />} />

  </Routes>
</Router>



)
