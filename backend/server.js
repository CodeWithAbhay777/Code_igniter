import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"



const app = express();
const PORT = 3000;
let rooms = {};
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});


io.on("connection", (socket) => {


  socket.on("join-room", (roomId, {id , username}) => {

    if (!rooms.roomId) rooms[roomId] = [];
    rooms[roomId].push(socket.id);

    socket.join(roomId);
    console.log(`User ${username} joined room: ${roomId} with Peer ID: ${id}`);
    socket.to(roomId).emit("user-connected", { id, username });

    
    socket.on("change-input", (inputValue, username, languageValue) => {
      socket.to(roomId).emit("new-input-value", inputValue, languageValue, username);
    });

    
    socket.on("chat-message", (username, message) => {
      console.log(`USERNAME : ${username} , MESSAGE : ${message}`);
      socket.to(roomId).emit("get-message", username, message);
    });


    socket.on("disconnect", () => {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id );
      socket.to(roomId).emit("user-disconnected",  { id, username });
    });
  });
});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});