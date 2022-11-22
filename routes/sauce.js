const express = require("express")
const router = express.Router()
const sauceCtrl = require("../controllers/sauce")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")

router.get('/', auth, sauceCtrl.getAllSauces)
router.post('/', auth, multer,sauceCtrl.createSauce)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.put('/:id', auth, sauceCtrl.modifySauce)
router.delete('/:id', auth, sauceCtrl.deleteSauce)
router.post('/:id/like', auth, sauceCtrl.modifySauceLike)



module.exports = router