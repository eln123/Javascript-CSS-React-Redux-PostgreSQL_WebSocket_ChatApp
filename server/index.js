const { db } = require("./db");
const PORT = process.env.PORT || 8080;
const app = require("./app");
const seed = require("../script/seed");
const socket = require("socket.io");
const {
  models: { User, Message },
} = require("./db");

const init = async () => {
  try {
    if (process.env.SEED === "true") {
      await seed();
    } else {
      await db.sync();
    }
  } catch (ex) {
    console.log(ex);
  }
};

init();

// start listening (and create a 'server' object representing our server)
const server = app.listen(PORT, () =>
  console.log(`Mixing it up on port ${PORT}`)
);
const serverSocket = socket(server);
serverSocket.on("connection", (socket) => {
  console.log(`Connection from client ${socket.id}`);

  setInterval(() => {
    const time = new Date().toLocaleString();
    socket.emit("time-change", time);
  }, 1000);

  socket.on("send-message", (message, room, sender, receiver) => {
    if (room === "") {
      socket.broadcast.emit("receive-message", message);
    } else {
      Message.create({
        sender: sender,
        receiver: receiver,
        content: message,
        roomNumber: room,
      });
      socket.to(room).emit("receive-message", message);
    }
  });

  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`Joined ${room}`);
  });
});
