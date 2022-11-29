const mongoose = require("mongoose")
// plugin permettant de contrôler l'unicité d'une clé (ici "email")
const uniqueValidator = require("mongoose-unique-validator")
// mongoose-errors transforme les erreurs mongoose en erreurs http
const mongooseErrors = require("mongoose-errors")


// création du Schema User, l'email doit être unique dans la BdD user
const userSchema = mongoose.Schema({
    email : {type:String, required:true, unique: true},
    password : {type:String, required:true}
})

userSchema.plugin(uniqueValidator)
userSchema.plugin(mongooseErrors)

module.exports = mongoose.model('User', userSchema)