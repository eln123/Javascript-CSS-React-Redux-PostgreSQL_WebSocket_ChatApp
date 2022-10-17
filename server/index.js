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
    const [contact] = await User.findAll({
      where: {
        phoneNumber: receiver,
      },
      include: {
        model: Message,
      },
    });
    if (!contact) {
      console.log("yo");
      const errorMessage = "user doesn't exist";
      socket.to(room).emit("userNoExist", errorMessage);
      console.log("sentBackToRoom", errorMessage);
      return;
    }

    const messageCreated = await Message.create({
      sender: sender,
      receiver: receiver,
      content: message,
      roomNumber: room,
    });
    const [user] = await User.findAll({
      where: {
        phoneNumber: sender,
      },
      include: {
        model: Message,
      },
    });

    await user.addMessage(messageCreated);
    await contact.addMessage(messageCreated);

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

    socket.to(room).emit("receive-message", messageCreated, user, contact);
  });

  socket.on(
    "addContact",
    async (userPhoneNumber, contactName, contactPhoneNumber) => {
      const [user] = await User.findAll({
        where: {
          phoneNumber: userPhoneNumber,
        },
      });
      const contactCreated = await Contact.create({
        contactHolder: userPhoneNumber,
        contactName: contactName,
        phoneNumber: contactPhoneNumber,
      });
      await user.addContact(contactCreated);
      const message = "contact was added - from back end";
      socket.emit("contact-added", message);
    }
  );

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("joined", room);
    const message = `joined ${room}`;
    socket.to(room).emit("joined-room", message);
  });
});
