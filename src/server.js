const https = require("https");
const fs = require("fs");
const socketIO = require("socket.io");
const express = require("express");
const path = require("path");

const options = {
  key: fs.readFileSync("/Users/hyesu/_wildcard.example.dev+3-key.pem"),
  cert: fs.readFileSync("/Users/hyesu/_wildcard.example.dev+3.pem"),
};

const app = express();

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/:id", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const httpsServer = https.createServer(options, app); // HTTPS 서버 생성

const wsServer = socketIO(httpsServer);

wsServer.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

const handleListen = () => console.log("Listening on https://localhost:3001");
httpsServer.listen(3001, handleListen); // HTTPS 서버로 변경
