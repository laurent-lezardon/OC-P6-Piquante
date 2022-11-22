const express = require("express")
const app = express()
const mongoose = require('mongoose')
const userRoutes = require('./routes/user')
const userSauces = require('./routes/sauce')
const path = require('path')



mongoose.connect('mongodb+srv://lezardon:Aaqwzsxedc0@lezardon.p1ktrcv.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/auth', userRoutes)
app.use('/api/sauces', userSauces)
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app
