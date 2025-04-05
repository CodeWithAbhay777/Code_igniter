import 'dotenv/config';
import express from "express"
import http from "http"
import OpenAI from "openai";
import db from "./db.js";
import { Server } from "socket.io";
import cookieSession from 'cookie-session';
import passport from 'passport';


import mainRouter from "./routes/index.js";
import cors from "cors";



const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

//cookie-session
const sessionOptions = {
  name: "session",
  keys: ["Avenger16#"],
  maxAge: 14 * 24 * 60 * 60 * 1000,
}

//db connection
db().then(res => console.log("DB connected"))
  .catch(err => console.log(err));

app.use(cookieSession(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const secretKey = process.env.OPENAI_API_KEY;
let rooms = {};

const server = http.createServer(app);




const openai = new OpenAI({
  apiKey: secretKey,
});

const io = new Server(server,{
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
 
});







app.use("/api/v1", mainRouter);



io.on("connection", (socket) => {


  socket.on("join-room", (roomId, { id, username }) => {

    if (!rooms.roomId) rooms[roomId] = [];





    
      rooms[roomId].push({ socketId: socket.id, username });
     
      socket.join(roomId);

      socket.to(roomId).emit("user-connected", { id, username });

    

    socket.on("change-input", (inputValue, username, languageValue) => {
      socket.to(roomId).emit("new-input-value", inputValue, languageValue, username);
    });


    socket.on("chat-message", (username, message) => {
     
      socket.to(roomId).emit("get-message", username, message);
    });


    socket.on("disconnect", () => {
      rooms[roomId] = rooms[roomId].filter(user => user.socketId !== socket.id);
      socket.to(roomId).emit("user-disconnected", { id: socket.id, username });
    });
  });
});

server.listen(3000, () => {
  console.log(`Server running`);
});