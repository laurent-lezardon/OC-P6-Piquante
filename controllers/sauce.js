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
exports.modifySauce = (req, res, next) => {
    res.status(200).json({ message: "modifySauce !" })
}
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log(sauce)
            console.log(sauce.userId, req.auth.userId)
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message : 'Not Authorized'})
            } else {
                
                const filename = sauce.imageUrl.split('/images/')[1]
                console.log(filename)
                fs.unlink(`images/${filename}`, () => {
                    sauce.deleteOne({_id:req.params.id})
                    .then(() => {
                        res.status(200).json({message: 'Sauce supprimée !'})
                    })
                    .catch(error => res.status(401).json({error}))
                })
            }
            
        }
        )

    
}
exports.modifySauceLike = (req, res, next) => {
    res.status(200).json({ message: "modifySauceLike !" })
}