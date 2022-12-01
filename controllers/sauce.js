const Sauce = require("../models/sauce");
const fs = require("fs");
const sauce = require("../models/sauce");

// ========= logique de récupération de toutes les sauces =========
exports.getAllSauces = async (req, res) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    } catch (error) {
        res.status(500).json({ error });
    }
};

// ========= logique de création d'une sauce =========
exports.createSauce = (req, res, next) => {
    console.log(req.body.sauce);
    const sauce = new Sauce({
        ...JSON.parse(req.body.sauce),
        // filename : attribué par multer
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
    });    
    sauce
        .save()
        .then(() => {
            res.status(201).json({ message: "Sauce créé !" });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};


// ========= logique de récupération d'une sauce =========
exports.getOneSauce = (req, res, next) => {
    Sauce.findById({ _id: req.params.id }).then((sauce) => {
        res.status(200).json(sauce);
    });
};

// ========= logique de suppression d'une sauce =========
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        // Si l'utilisateur n'est pas le propriétaire, la suppression n'est pas autorisée
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message: "Not Authorized" });
        } else {            
            // filename : nom du fichier image
            const filename = sauce.imageUrl.split("/images/")[1];
            // suppression du fichier image et de la sauce en BdD
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: "Sauce supprimée !" });
                    })
                    .catch((error) => res.status(401).json({ error }));
            });
        }
    });
};


// ========= logique de modification d'une sauce =========
exports.modifySauce = (req, res, next) => {
    // Si la requète contient un fichier, multer revoi un JSON et un nom de fichier
    // sinon le body contient un objet déjà parsé (express)
    const sauceObject = req.file
        ? {
            ...JSON.parse(req.body.sauce),
            // filename : attribué par multer
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                }`,
        }
        : { ...req.body };
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Si l'utilisateur n'est pas le propriétaire, la modification n'est pas autorisée
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" });
            }
            // la requete contient une nouvelle image, suppression de l'ancienne
            else if (req.file) {
                // filename : nom de l'ancien fichier
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        { ...sauceObject, _id: req.params.id }
                    )
                        .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                        .catch((error) => res.status(401).json({ error }));
                });
            }
            // la requete ne contient pas de nouvelle image
            else {
                Sauce.updateOne(
                    { _id: req.params.id },
                    { ...sauceObject, _id: req.params.id }
                )
                    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
                    .catch((error) => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

// ========= logique de gestion des 'like' =========
exports.modifySauceLike = (req, res, next) => {
    // req.body { userId, like : 1(like),-1(dislike) ou 0(change)}
    const likeObject = req.body;
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        // liste des like/dislike a scruter (si like = 0, liste dislike en premier)
        let modifyArray =
            likeObject.like === 1 ? sauce.usersLiked : sauce.usersDisliked;
        // l'identifiant de l'utilisateur est-il présent dans cette liste ?
        let indexInArray = modifyArray.indexOf(likeObject.userId);
        // action en fonction du type de like
        switch (likeObject.like) {
            case 1:
                // si l'identifiant du like est absent de la liste des likes, on l'ajoute
                if (indexInArray === -1) {
                    modifyArray.push(likeObject.userId);
                    sauce.likes += 1;
                    Sauce.updateOne(
                        { _id: sauce._id },
                        { usersLiked: modifyArray, likes: sauce.likes }
                    )
                        .then(() => res.status(200).json({ message: "Like ajouté !" }))
                        .catch((error) => res.status(401).json({ error }));
                } else {
                    res.status(200).json({ message: "Sauce déjà liké par cet id!" });
                }
                break;
            case -1:
                // si l'identifiant du dislike est absent de la liste des dislikes, on l'ajoute
                if (indexInArray === -1) {
                    modifyArray.push(likeObject.userId);
                    sauce.dislikes += 1;
                    Sauce.updateOne(
                        { _id: sauce._id },
                        { usersDisliked: modifyArray, dislikes: sauce.dislikes }
                    )
                        .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
                        .catch((error) => res.status(401).json({ error }));
                } else {
                    // console.log("id deja dans le tableau")
                    res.status(200).json({ message: "Sauce déjà disliké par cet id!" });
                }
                break;
            case 0:
                // si l'identifiant est présent dans liste des dislikes, on le retire
                if (indexInArray !== -1) {
                    modifyArray.splice(indexInArray, 1);
                    sauce.dislikes -= 1;
                    Sauce.updateOne(
                        { _id: sauce._id },
                        { usersDisliked: modifyArray, dislikes: sauce.dislikes }
                    )
                        .then(() => res.status(200).json({ message: "Dislike retiré !" }))
                        .catch((error) => res.status(401).json({ error }));
                }
                // sinon, si l'identifiant est présent dans liste des likes, on le retire
                else if (sauce.usersLiked.indexOf(likeObject.userId) !== -1) {
                    modifyArray = sauce.usersLiked;
                    indexInArray = modifyArray.indexOf(likeObject.userId);
                    modifyArray.splice(indexInArray, 1);
                    sauce.likes -= 1;
                    Sauce.updateOne(
                        { _id: sauce._id },
                        { usersLiked: modifyArray, likes: sauce.likes }
                    )
                        .then(() => res.status(200).json({ message: "Like retiré !" }))
                        .catch((error) => res.status(401).json({ error }));
                } else {
                    // identifiant non touvé dans les tableaux usersLike et usersDislike
                    res.status(400).json({ message: "Bad Request !" });
                }
                break;

            default:
                // valeur du like inexistante
                res.status(400).json({ message: "Bad Request !" });
        }
    });
};
