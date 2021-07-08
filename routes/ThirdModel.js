const express = require('express')
const router = express.Router()
const {
    addThirdGroup,
    deleteThirdGroup,
    getThirdGroups,
    getThirdGroup
} = require('../controllers/ThirdModel')

const {protect, authorize} = require('../middleware/auth');

router.post('/add', addThirdGroup)
router.get('/all', getThirdGroups)
router.get('/:id', getThirdGroup)
router.delete('/:id', deleteThirdGroup)


module.exports = router
