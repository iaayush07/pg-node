const express = require('express');
const router = express.Router();
const anyController = require('../controllers/anyController.js');

router.post('/anys', anyController.createAny);
router.get('/anys', anyController.getAllAnys);
router.get('/anys/:id', anyController.getAnyById);
router.put('/anys/:id', anyController.updateAnyById);
router.delete('/anys/:id', anyController.deleteAnyById);

module.exports = router;
