const router = require("express").Router();
const {
  models: { User, Message, Contact },
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

router.get("/:id", async (req, res, next) => {
  try {
    const [user] = await User.findAll({
      where: {
        id: req.params.id,
      },
      include: [{ model: Message }, { model: Contact }],
    });

    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/:room", async (req, res, next) => {
  try {
    const [user] = await User.findAll({
      where: {
        id: req.params.id,
      },
      include: [{ model: Message }, { model: Contact }],
    });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put(`/logout/:id`, async (req, res, next) => {
  try {
    console.log(req.params);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
