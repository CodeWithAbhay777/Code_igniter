import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client'
import Room from "./pages/room.jsx";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/room/:roomId" element={<Room />} />
     
    </Routes>
  </Router>



)
