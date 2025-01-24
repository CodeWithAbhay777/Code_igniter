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


  socket.on("join-room", (roomId, user) => {

    if (!rooms.roomId) rooms[roomId] = [];
    rooms[roomId].push(socket.id);

    socket.join(roomId);
    console.log(`User ${user} joined room : ${roomId}`);
    socket.to(roomId).emit("user-connected", user);

    //getting editor value
    socket.on("change-input", (inputValue, username, languageValue) => {
      socket.to(roomId).emit("new-input-value", inputValue, languageValue, username);
    });

    //chat functionality 
    socket.on("chat-message", (username, message) => {
      console.log(`USERNAME : ${username} , MESSAGE : ${message}`);
      socket.to(roomId).emit("get-message", username, message);
    });


    socket.on("disconnect", () => {
      rooms[roomId] = rooms[roomId].filter((id) => id !== socket.id );
      socket.to(roomId).emit("user-disconnected",  user);
    });
  });
});

server.listen(3000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});