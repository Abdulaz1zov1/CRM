const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
 addSubject,
 getSubjects,
 getSubject,
 editSubject,
 deleteSubject
} = require('../controllers/subject')


router.post('/add', addSubject);
router.get('/all', getSubjects);
router.get('/:id', getSubject)
router.put('/:id', editSubject);
router.delete('/:id', deleteSubject)

module.exports = router