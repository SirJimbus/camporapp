const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connetti a MongoDB
mongoose
  .connect(
    "mongodb+srv://fedebertola95:VBXuGNMW28uU7hFn@cluster0.gsksc.mongodb.net/",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connesso a MongoDB"))
  .catch((err) => console.error("Errore di connessione a MongoDB", err));

// Modello utente
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// Endpoint di registrazione
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.json({ success: false, message: "Nome utente già in uso" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  await user.save();

  res.json({ success: true });
});

// Endpoint di login
app.post("/login", async (req, res) => {
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

app.listen(3000, () => {
  console.log("Server in ascolto su http://localhost:3000");
});
