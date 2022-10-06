const { db } = require("./db");
const PORT = process.env.PORT || 8080;
const app = require("./app");
const seed = require("../script/seed");
const socket = require("socket.io");
const {
  models: { User, Message, Contact },
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

  socket.on("send-message", async (message, room, sender, receiver) => {
    if (room === "") {
      socket.broadcast.emit("receive-message", message);
    } else {
      const messageCreated = await Message.create({
        sender: sender,
        receiver: receiver,
        content: message,
        roomNumber: room,
      });
      const [person1] = await User.findAll({
        where: {
          phoneNumber: sender,
        },
      });
      const [person2] = await User.findAll({
        where: {
          phoneNumber: receiver,
        },
      });
      console.log("person1", person1, "person2", person2);

      await person1.addMessage(messageCreated);
      await person2.addMessage(messageCreated);

      // const [sendBack] = await User.findAll({
      //   where: {
      //     phoneNumber: sender,
      //   },
      //   include: [
      //     {
      //       model: Message,
      //     },
      //     { model: Contact },
      //   ],
      // });

      socket.to(room).emit("receive-message", message, sender, receiver);
    }
  });

  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`Joined ${room}`);
  });
});
