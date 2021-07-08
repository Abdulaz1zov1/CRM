const express = require('express');
const router = express.Router();
const {
    addTest,
    getTests,
    getTest,
    editTest,
    deleteTest
} = require('../controllers/test')
const {protect, authorize} = require('../middleware/auth');

router.post('/add', addTest);
router.get('/all',getTests);
router.get('/:id',getTest)
router.put('/:id',editTest );
router.delete('/:id',deleteTest)

module.exports = router