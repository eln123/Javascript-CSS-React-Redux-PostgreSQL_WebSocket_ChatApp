const Sequelize = require("sequelize");
const db = require("../db");

const Contact = db.define("contact", {
  contactHolder: {
    type: Sequelize.STRING,

    allowNull: false,
  },

  contactName: {
    type: Sequelize.STRING,

    allowNull: false,
  },
  phoneNumber: {
    type: Sequelize.DECIMAL,
    validate: {
      len: [9, 10],
      isNumeric: true,
    },
    unique: true,
  },
});

module.exports = Contact;
