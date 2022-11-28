const Sauce = require("../models/sauce")
const fs = require('fs')
const sauce = require("../models/sauce")


exports.getAllSauces = async (req, res) => {
    try {
        const sauces = await Sauce.find()
        res.status(200).json(sauces)
    }
    catch (error) {
        res.status(500).json({ error })
    }
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
    Sauce.findById({ _id: req.params.id })
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
                const filename = sauceImageUrl.split('/images/')[1]
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
            let modifyArray = (likeObject.like === 1) ? sauce.usersLiked : sauce.usersDisliked
            let indexInArray = modifyArray.indexOf(likeObject.userId)
            // action en fonction du type de like
            switch (likeObject.like) {
                case 1:
                    // si l'identifiant du like est absent de la liste des likes, on l'ajoute
                    if (indexInArray === -1) {
                        modifyArray.push(likeObject.userId)
                        sauce.likes += 1
                        Sauce.updateOne({ _id: sauce._id }, { usersLiked: modifyArray, likes: sauce.likes })
                            .then(() => res.status(200).json({ message: 'Like ajouté !' }))
                            .catch(error => res.status(401).json({ error }));
                    } else {
                        // console.log("id deja dans le tableau")
                        res.status(200).json({ message: 'Sauce déjà liké par cet id!' })
                    }
                    break;
                case -1:
                    // si l'identifiant du dislike est absent de la liste des dislikes, on l'ajoute                    
                    if (indexInArray === -1) {
                        modifyArray.push(likeObject.userId)
                        sauce.dislikes += 1
                        Sauce.updateOne({ _id: sauce._id }, { usersDisliked: modifyArray, dislikes: sauce.dislikes })
                            .then(() => res.status(200).json({ message: 'Objet modifié!' }))
                            .catch(error => res.status(401).json({ message: "Dislike ajouté !" }));
                    } else {
                        // console.log("id deja dans le tableau")
                        res.status(200).json({ message: 'Sauce déjà disliké par cet id!' })
                    }
                    break
                case 0:
                    // si l'identifiant est présent dans liste des dislikes, on le retire
                    if (indexInArray !== -1) {
                        modifyArray.splice(indexInArray, 1)
                        sauce.dislikes -= 1
                        Sauce.updateOne({ _id: sauce._id }, { usersDisliked: modifyArray, dislikes: sauce.dislikes })
                            .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
                            .catch(error => res.status(401).json({ error }));
                    }
                    // sinon, si l'identifiant est présent dans liste des likes, on le retire
                    else if (sauce.usersLiked.indexOf(likeObject.userId) !== -1) {
                        modifyArray = sauce.usersLiked
                        indexInArray = modifyArray.indexOf(likeObject.userId)
                        modifyArray.splice(indexInArray, 1)
                        sauce.likes -= 1
                        Sauce.updateOne({ _id: sauce._id }, { usersLiked: modifyArray, likes: sauce.likes })
                            .then(() => res.status(200).json({ message: 'Like retiré !' }))
                            .catch(error => res.status(401).json({ error }));
                    }
                    else {                        
                        res.status(200).json({ message: 'Identifiant incorrect !' })
                    }
                    break

                default:
                    // console.log("pas like")
                    res.status(200).json({ message: "modifySauce like !" })
            }
        }
        )
}

