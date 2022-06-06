const { Router } = require('express');
const controllers = require('../controllers');

const router = Router();

router.get('/health-check/', controllers.healthCheck);
router.get('/tips/:pair/', controllers.getTips);
router.post('/operation/', controllers.buySell);

module.exports = router;