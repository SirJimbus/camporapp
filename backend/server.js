const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());

// Configura CORS per permettere richieste da localhost e dal dominio di Vercel
app.use(
  cors({
    origin: ["http://192.168.1.26", "https://camporapp.vercel.app"], // Sostituisci con i domini permessi
  })
);

// Connetti a MongoDB
mongoose
  .connect(
    "mongodb+srv://fedebertola95:VBXuGNMW28uU7hFn@cluster0.gsksc.mongodb.net/",
    {
      // Rimuovi le opzioni deprecate
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
  res.header("Access-Control-Allow-Origin", "*"); // Consenti a tutte le origini
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

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

app.post("/login", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // Consenti a tutte le origini
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

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

// Usa la porta fornita da Render o 3000 in locale
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto su http://localhost:${PORT}`);
});
