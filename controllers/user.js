const bcrypt = require("bcrypt")
const User = require("../models/User")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

// ============== logique de création de compte =============================
exports.signup = (req, res, next) => {
    // hash du mot de passe reçu (10 passages)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// ================ logique de connexion ================================
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error });
            }
            // comparaison bcrypt entre le mot de passe reçu en clair et le hash en BdD
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error });
                    }
                    res.status(200)
                        .json({
                            userId: user._id,
                            // ajout d'un token contenant le userId à la réponse
                            token: jwt.sign(
                                { userId: user._id },
                                process.env.APP_SECRET,
                                { expiresIn: '24h' }
                            )
                        });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};