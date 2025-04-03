import { Server } from "Socket.io";
import { server } from "./app"; // Import the server
import { codeBlock } from "./src/models/codeBlockModel";
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
const fetchCodeBlock = async (roomId: string) => {
const codeBlockData = await codeBlock.findOne({ _id: roomId });
return codeBlockData;
}
const rooms: Record<string, { code: string; solution: string; mentor: string; students: string[] }> = {};

io.on("connection", (userSocket) => {

  userSocket.on("joinRoom", ({ roomId }) => {
    console.log(userSocket.id, "joined room");
    if (!rooms[roomId]) {
      //Room creation
      rooms[roomId] = {
        code: ``,
        solution: ``,
        mentor: "",
        students: []
      };
      fetchCodeBlock(roomId).then((codeBlockData) => {
        rooms[roomId].code = codeBlockData.code;
        rooms[roomId].solution = codeBlockData.solution;
      })

    }
    //only if the user is not already in the room
    if(!rooms[roomId].students.includes(userSocket.id) ||rooms[roomId].mentor === userSocket.id){
    //assign the mentor to the room
    if (!rooms[roomId].mentor) {
      rooms[roomId].mentor = userSocket.id;
      userSocket.emit("role", "mentor");
    } else {
      rooms[roomId].students.push(userSocket.id);
      userSocket.emit("role", "student");
    }

    userSocket.join(roomId);
    userSocket.emit("codeUpdate", rooms[roomId].code);
    io.to(roomId).emit("studentsCount", rooms[roomId].students.length);
    
    }
  });

  userSocket.on("codeUpdate", ({ roomId, code }) => {
    rooms[roomId].code = code;
    userSocket.to(roomId).emit("codeUpdate", code);
  });

  userSocket.on("disconnectFromRoom", ({ roomId }) => {
    //mentor leaving
    if (rooms[roomId].mentor === userSocket.id) {
      if (rooms[roomId].students.length > 0) {
        userSocket.to(roomId).emit("mentorLeft", "the mentor has left the session");
      } 
        delete rooms[roomId]; 
      
    }
    //student leaving
    else{
      rooms[roomId].students = rooms[roomId].students.filter(id => id !== userSocket.id);
      userSocket.to(roomId).emit("studentLeft");
    }
    console.log(`User disconnected: ${userSocket.id}`);
  });

 userSocket.on("sendMessage", ({ senderId, message, timestamp, roomId }) => {

  const chatMessage = {
    senderId,
    message,
    timestamp,
  };

  // Broadcast the message to all users in the room
  io.to(roomId).emit("newMessage", chatMessage);
});

userSocket.on("solutionUpdateByMentor", ({ roomId, code }) => {
  rooms[roomId].solution = code;
  userSocket.to(roomId).emit("solutionUpdateForStudents", code);

});

});


export { io };
