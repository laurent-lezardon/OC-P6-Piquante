const Sauce = require("../models/sauce")
const fs = require('fs')
const sauce = require("../models/sauce")



exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {
            // console.log(sauces)
            res.status(200).json(sauces)
        })
        .catch((error) => res.status(400).json({ error }))
}


exports.createSauce = (req, res, next) => {
    // console.log(req.body.sauce)
    // console.log(req.file.filename)
    // console.log("protocole : ", req.protocol, " host : ", req.get('host'))
    const sauceObject = JSON.parse(req.body.sauce)
    const sauce = new Sauce({
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        // usersLiked : usersLiked.push(sauceObject.userId)
    })
    console.log(sauce)
    sauce.save()
        .then(() => {
            res.status(201).json({ message: 'Sauce créé !' })
        })
        .catch(error => {
            res.status(400).json({ error })
        })
}



exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // console.log(sauce)
            res.status(200).json(sauce)
        }
        )
}





exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log(sauce)
            console.log(sauce.userId, req.auth.userId)
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not Authorized' })
            } else {
                const sauceImageUrl = sauce.imageUrl
                const filename = sauce.imageUrl.split('/images/')[1]
                // console.log(filename)
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Sauce supprimée !' })
                        })
                        .catch(error => res.status(401).json({ error }))
                })
            }
        }
        )
}



exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // console.log("sauce modifiée : ",req.params.id,sauceObject)
            // console.log("sauce BdD : ",sauce)
            // res.status(200).json({ message: "modifySauce !" })

            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' });
            } else if (req.file) {
                // console.log(sauce.imageUrl)
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                        .catch(error => res.status(401).json({ error }));
                })

            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                    .catch(error => res.status(401).json({ error }));

            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}


exports.modifySauceLike = (req, res, next) => {
    const likeObject = req.body
    console.log(likeObject.userId)
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log(likeObject.like)
            switch (likeObject.like) {
                case 1:
                    console.log("like")
                    console.log("avant : " ,sauce.usersLiked)
                    sauce.usersLiked.push(likeObject.userId)
                    console.log("après : " ,sauce.usersLiked)
                    console.log(sauce)
                    sauce.likes += 1

                    Sauce.updateOne({ _id: sauce._id }, { usersLiked : sauce.usersLiked,likes : sauce.likes })
                        .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                        .catch(error => res.status(401).json({ error }));

                    break
                case -1:
                    console.log("unlike")
                    res.status(200).json({ message: "modifySauce like !" })
                    break
                case 0:
                    console.log("changé d'avis")
                    res.status(200).json({ message: "modifySauce like !" })
                    break

                default:
                    console.log("pas like")
                    res.status(200).json({ message: "modifySauce like !" })
            }
            
        }
        )
}
