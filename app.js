const express = require("express");
// création d'une application Express
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const userSauces = require("./routes/sauce");
const path = require("path");

// connexion à la base de données MongoDB
mongoose
  .connect(
    "mongodb+srv://lezardon:Aaqwzsxedc0@lezardon.p1ktrcv.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// utilisation du parser JSON d'express  
app.use(express.json());

// ========= CORS Cross Origin Resource Sharing =============
app.use((req, res, next) => {
    // accès à l'API depuis n'importe quelle origine (*)
  res.setHeader("Access-Control-Allow-Origin", "*");
  // indique à l'API, les headers utilisés par les requetes
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // indique à l'API les méthodes utilisées
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// ========= création des routes principales ==================
app.use("/api/auth", userRoutes);
app.use("/api/sauces", userSauces);
// route vers le dossier statique "images"
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
