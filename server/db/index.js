//this is the access point for all things database related!

const db = require("./db");

const User = require("./models/User");
const Message = require("./models/Message");
const Contact = require("./models/Contact");

//associations could go here!

User.belongsToMany(Message, { through: "messageThrough" });
Message.belongsToMany(User, { through: "messageThrough" });

User.belongsToMany(Contact, { through: "contactsThrough" });
Contact.belongsToMany(User, { through: "contactsThrough" });

module.exports = {
  db,
  models: {
    User,
    Message,
    Contact,
  },
};
