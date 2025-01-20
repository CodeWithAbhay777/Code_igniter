import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"



const app = express();
const PORT = 3000;
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});


io.on("connection", (socket) => {
  

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    console.log(`User ${userId} joined room : ${roomId}`);
    socket.to(roomId).emit("user-connected", userId);

    //getting editor value
    socket.on("change-input", (inputValue, username, languageValue) => {
      socket.to(roomId).emit("new-input-value", inputValue, languageValue, username);
    });

    //chat functionality 
    socket.on("chat-message" , (username , message) => {
      socket.to(roomId).emit("get-message" , username , message);
    });


    socket.on("disconnect", () => {
      socket.to(roomId).emit("user-disconnected", userId);
    })
  })
})

server.listen(3000, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});