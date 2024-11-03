// routes/place.js
const express = require("express");
const axios = require("axios"); // Per fare richieste al servizio di geocoding
const Place = require("../models/Place");
const router = express.Router();

router.post("/add-place", async (req, res) => {
  const { userId, streetName } = req.body;

  try {
    // Esegui la richiesta a Nominatim o Photon per ottenere le coordinate
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search`,
      {
        params: {
          q: streetName,
          format: "json",
          addressdetails: 1,
          limit: 1,
          countrycodes: "IT", // Limita la ricerca all'Italia
        },
      }
    );

    if (response.data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Indirizzo non trovato" });
    }

    const { lat, lon } = response.data[0];
    const place = new Place({
      userId,
      streetName,
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lon) },
    });

    await place.save();
    res.json({ success: true, place });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Errore del server" });
  }
});

// routes/place.js (aggiungi dopo l'endpoint POST)
router.get("/places", async (req, res) => {
  try {
    const places = await Place.find({}, "streetName coordinates"); // Ottieni solo i campi necessari
    res.json({ success: true, places });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Errore del server" });
  }
});

module.exports = router;
