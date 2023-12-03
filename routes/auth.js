const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/User");

router.post("/populateData", async (req, res) => {
  try {
    const { sampleData } = req.body;

    await User.bulkCreate(sampleData);
    res.status(200).json({ message: "Sample data stored" });
  } catch (error) {
    res.status(201).json(error);
  }
});

router.post("/createUser", async (req, res) => {
  const { name, email, password, phone, isSpam } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    const newUser = await User.create({
      name,
      email,
      password: hash,
      phone,
      isSpam,
      isRegistered: true,
    });
    res.status(200).json({ message: "The user has been created" });
  } catch (error) {
    res.status(201).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = await User.findOne({
      where: { email },
    });

    if (newUser) {
      const isPasswordCorrect = bcrypt.compareSync(
        password,
        newUser.dataValues.password
      );

      if (!isPasswordCorrect) {
        return res.status(201).json("Incorrect Password");
      } else {
        const token = jwt.sign({ id: newUser.dataValues.id }, "jwtkey");
        res.status(200).json({ ...newUser.dataValues, token }); // sending with the hashed password and token ... maybe change it later
      }
    } else {
      return res.status(201).json("User does not exist !");
    }
  } catch (error) {
    res.status(201).json(error);
  }
});

router.post("/logout", async (req, res) => {
  res.status(200).json("User has been logged out.");
});

router.put("/markSpam", async (req, res) => {
  const { phone } = req.body;
  try {
    const user = await User.findOne({
      where: { phone },
    });

    await User.update(
      { isSpam: true },
      {
        where: { phone },
      }
    );

    const spamCount = user.dataValues.spamCount;

    await User.update(
      { spamCount: spamCount + 1 },
      {
        where: { phone },
      }
    );
    res.status(200).json({ "spam count for this number is": spamCount });
  } catch (error) {
    res.status(201).json(error);
  }
});

router.post("/searchByName", async (req, res) => {
  const { name } = req.body;

  try {
    const users = await User.findAll({
      where: {
        name,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/searchByPhone", async (req, res) => {
  const { phone } = req.body;

  try {
    const users = await User.findAll({
      where: {
        phone,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
