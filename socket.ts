import { Server } from "socket.io";
import { server } from "./app"; // Import the server

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const rooms: Record<string, { code: string; solution: string; mentor: string; students: string[] }> = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("joinRoom", ({ roomId }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        code: `// Code block ${roomId} template`,
        solution: `console.log('Hello, World!');`, // Example solution
        mentor: "",
        students: []
      };
    }

    if (!rooms[roomId].mentor) {
      rooms[roomId].mentor = socket.id;
      socket.emit("role", "mentor");
    } else {
      rooms[roomId].students.push(socket.id);
      socket.emit("role", "student");
    }

    socket.join(roomId);
    socket.emit("codeUpdate", rooms[roomId].code);
    io.to(roomId).emit("studentsCount", rooms[roomId].students.length);

    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on("codeUpdate", ({ roomId, code }) => {
    rooms[roomId].code = code;
    socket.to(roomId).emit("codeUpdate", code);
  });

  socket.on("disconnectFromRoom", ({ roomId }) => {
    if (rooms[roomId]) {
      rooms[roomId].students = rooms[roomId].students.filter(id => id !== socket.id);
      
      if (rooms[roomId].mentor === socket.id) {
        if (rooms[roomId].students.length > 0) {
          const newMentor = rooms[roomId].students.shift(); // Assign the first student as mentor
          rooms[roomId].mentor = newMentor!;
          io.to(newMentor!).emit("role", "mentor");
          console.log(`New mentor assigned: ${newMentor}`);
        } else {
          delete rooms[roomId]; // No students left, delete room
        }
      }

      io.to(roomId).emit("studentsCount", rooms[roomId].students.length);
      socket.to(roomId).emit("studentLeft");
    }

    console.log(`User disconnected: ${socket.id}`);
  });

  console.log(`User disconnected: ${socket.id}`);
});
