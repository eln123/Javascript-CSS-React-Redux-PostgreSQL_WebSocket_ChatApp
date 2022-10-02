const Sequelize = require("sequelize");
const db = require("../db");

const Contact = db.define("contact", {
  contactHolder: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },

  contactName: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  phoneNumber: {
    type: Sequelize.DECIMAL,
    validate: {
      len: [9, 10],
      isNumeric: true,
    },
  },
});

module.exports = Contact;
