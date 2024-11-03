// app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://192.168.1.26",
      "https://camporapp.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  })
);

// Connetti a MongoDB
mongoose
  .connect(
    "mongodb+srv://fedebertola95:VBXuGNMW28uU7hFn@cluster0.gsksc.mongodb.net/"
  )
  .then(() => console.log("Connesso a MongoDB"))
  .catch((err) => console.error("Errore di connessione a MongoDB", err));

// Importa le route
const loginRoute = require("./api/login");
const registerRoute = require("./api/register");
const placeRoutes = require("./api/place");

// Usa le route
app.use(loginRoute);
app.use(registerRoute);
app.use(placeRoutes);

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server in ascolto su porta: ${PORT}`);
});
