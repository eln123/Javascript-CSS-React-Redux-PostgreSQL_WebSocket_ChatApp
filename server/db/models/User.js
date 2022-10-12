const Sequelize = require("sequelize");
const db = require("../db");
const Message = require("./Message");
const Contact = require("./Contact");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const axios = require("axios");

const SALT_ROUNDS = 5;

const User = db.define("user", {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
  },
  phoneNumber: {
    type: Sequelize.DECIMAL,

    validate: {
      len: [9, 10],
      isNumeric: true,
    },
  },
});

module.exports = User;

/**
 * instanceMethods
 */
User.prototype.correctPassword = function (candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT);
};

/**
 * classMethods
 */
User.authenticate = async function ({ username, password }) {
  const user = await this.findOne({ where: { username } });
  if (!user || !(await user.correctPassword(password))) {
    const error = Error("Incorrect username/password");
    error.status = 401;
    throw error;
  }
  return user.generateToken();
};

User.findByToken = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT);
    const [user] = await User.findAll({
      where: {
        id: id,
      },
      include: [
        {
          model: Message,
        },
        {
          model: Contact,
        },
      ],
    });
    if (!user) {
      throw "nooo";
    }
    return user;
  } catch (ex) {
    const error = Error("bad token");
    error.status = 401;
    throw error;
  }
};

// User.findMessages = async function (roomNumber) {
//   try {
//     const messages = await Message.findAll({
//       where: {
//         roomNumber: req.body.roomNumber,
//       },
//     });
//     return messages;
//   } catch (ex) {
//     const error = Error("User.js line 89 is where this is being logged from");
//     throw error;
//   }
// };

/**
 * hooks
 */
const hashPassword = async (user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeBulkCreate((users) => Promise.all(users.map(hashPassword)));
