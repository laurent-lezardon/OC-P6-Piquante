const mongoose = require("mongoose")
// mongoose-errors transforme les erreurs mongoose en erreurs http
const mongooseErrors = require("mongoose-errors")

// création du schéma pour les sauces
const sauceSchema = mongoose.Schema({
    userId : {type:String, required:true},
    name : {type:String, required:true},
    manufacturer : {type:String, required:true},
    description : {type:String, required:true},
    mainPepper : {type: String, required:true},
    imageUrl : {type : String, required:true},
    heat : {type : Number, required:true},
    likes : {type : Number, default : 0},
    dislikes : {type : Number, default : 0},
    usersLiked : {type : [String], default : []},
    usersDisliked : {type : [String], default : []}


})
// ajout du plugin au schéma
sauceSchema.plugin(mongooseErrors)

// export du modèle "Sauce"
module.exports = mongoose.model('Sauce', sauceSchema)