const express = require('express');
const router = express.Router();
const {
 getStatistics
} = require('../controllers/statistic')
const {protect, authorize} = require('../middleware/auth');

router.get('/all',getStatistics);


module.exports = router