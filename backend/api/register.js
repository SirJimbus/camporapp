import bcrypt from "bcrypt";
import mongoose from "mongoose";
import Cors from "cors";

const cors = Cors({
  origin: [
    "http://localhost:8081",
    "http://192.168.1.26",
    "https://camporapp.vercel.app",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Origin",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

mongoose.connect(
  "mongodb+srv://fedebertola95:VBXuGNMW28uU7hFn@cluster0.gsksc.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === "POST") {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.json({ success: false, message: "Nome utente già in uso" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.json({ success: true });
  } else {
    res.status(405).json({ message: "Metodo non consentito" });
  }
}
