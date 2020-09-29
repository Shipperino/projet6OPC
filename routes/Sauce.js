const express = require('express');
const router = express.Router();
const stuffCtrl = require('../controllers/Sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config')


router.get('/',  auth, stuffCtrl.getAllSauces);
router.post('/',auth,multer, stuffCtrl.createSauce);
router.get('/:id',auth,  stuffCtrl.getOneSauce);
router.put('/:id', auth, multer, stuffCtrl.modifySauce);
router.delete('/:id', auth,stuffCtrl.deleteSauce);
router.post('/:id/like', auth, stuffCtrl.likedSauce);
module.exports = router;