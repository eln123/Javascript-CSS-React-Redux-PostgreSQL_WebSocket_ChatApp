const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  sender: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  receiver: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  content: {
    type: Sequelize.TEXT,
  },
  roomNumber: {
    type: Sequelize.STRING,
  },
  time: {
    type: Sequelize.DATE,
  },
});

Message.beforeCreate((message) => {
  message.time = new Date();
});

module.exports = Message;
