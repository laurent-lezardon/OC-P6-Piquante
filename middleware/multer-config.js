// pour une requète avec un Content-Type: multipart/form-data

const multer = require("multer")

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
}
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images")
    },
    filename: (res, file, callback) => {
        const name = file.originalname.split(' ').join("_")
        const extension = MIME_TYPES[file.mimetype]
        callback(null, name + Date.now() + '.' + extension)
    }

})

module.exports = multer({storage}).single('image')