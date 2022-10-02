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
});

module.exports = Message;
