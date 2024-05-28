const { body } = require("express-validator");
const User = require("../modal/user.modal");
const jwt = require("jsonwebtoken");
const { application, json } = require("express");

exports.signUp = async (req, res) => {
  const { email } = req.body;
  let existingUser = null;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  if (existingUser) {
    return res.status(422).json({
      message: "user with this email already exists",
    });
  } else {
    let updatedBody = { ...req.body, blocked: false };
    const user = new User(updatedBody);

    try {
      const createdUser = await user.save();
      return res.status(201).json({ user: createdUser });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  let existing;
  try {
    existing = await User.findOne({ email });
  } catch (error) {
    return res.status(500).json({
      message: "Something when wring",
    });
  }

  if (!existing) {
    return res.status(404).json({ message: "User not found" });
  } else {
    //check if password matches
    //   console.log(existing,'re',req.body.password)
    if (!existing.authenticate(password)) {
      return res.status(401).json({ message: "Invalid Password" });
    } else {
      console.log(existing.blocked);
      if (existing.blocked) {
        return res.status(401).json({ message: "User Blocked" });
      }
      //generate an auth token
      const token = jwt.sign(
        { _id: existing?._id },
        "asdsadsadasdasdsadasdadasdasdasdasdadasdsadasdasdasd",
        { expiresIn: "15m" }
      );
      res.cookie("jwt", token, { expire: "15m" });
      return res.status(200).json({ user: existing, token: token });
    }
  }
};

exports.getUserDetails = async (req, res) => {
  const id = req.query._id;
  User.findById(id, function (err, user) {
    if (err) return res.status(404).json({ message: "User doesnot exist" });
    return res.status(200).json({ user: user });
  });
};
