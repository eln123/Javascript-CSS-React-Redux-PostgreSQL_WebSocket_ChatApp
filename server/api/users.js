const router = require("express").Router();
const {
  models: { User, Message },
} = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and username fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ["id", "username"],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:userPhoneNumber/:roomName", async (req, res, next) => {
  try {
    const [userWithMessages] = await User.findAll({
      where: {
        phoneNumber: req.params.userPhoneNumber,
      },
      include: {
        model: Message,
        where: {
          roomNumber: req.params.roomName,
        },
      },
    });

    res.send(userWithMessages);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
