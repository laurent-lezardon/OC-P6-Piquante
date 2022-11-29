// pour une requète avec un Content-Type: multipart/form-data

const multer = require("multer")

// const MIME_TYPES = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png': 'png',
//     'image/webp': 'webp',
// }
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (res, file, callback) => {
        // nom d'origine (API multer)
        const name = file.originalname.split(' ').join("_")
        // const extension = MIME_TYPES[file.mimetype]
        callback(null, Date.now() + "_" + name)
        // callback(null, name + Date.now() + '.' + extension)
    }

})
// single : accepte un seul fichier portant le nom image dans la requète
module.exports = multer({storage}).single('image')