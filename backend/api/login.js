// routes/login.js
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.json({ success: false, message: "Nome utente non trovato" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.json({ success: false, message: "Password errata" });
  }

  res.json({ success: true });
});

module.exports = router;
