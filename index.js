const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

let dbData = {
  open: [],
  inProcess: [],
  completed: [],
};

io.on("connection", (socket) => {
  console.log(`${socket.id}  connected`);

  socket.on("join", (data) => {
    socket.join(1);
    console.log("user joined", dbData);
    socket.emit("update", dbData);
  });
  socket.on("send", (data) => {
    dbData = { ...data };
    console.log("received", dbData);
    io.in(1).emit("update", dbData);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} disconnected`);
  });
});

server.listen(3001, () => {
  console.log("Server Running");
});
