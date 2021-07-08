const express = require('express');
const router = express.Router();
const {protect, authorize} = require('../middleware/auth');
const {
    addGroup,
    getGroups,
    getGroup,
    editGroup,
    deleteGroup,
    GetBall
} = require('../controllers/groups')


router.post('/add', addGroup);
router.get('/all',getGroups);
router.get('/info',getGroups);
router.get('/:id/user/:user/ball',GetBall)
router.get('/:id',getGroup)
router.put('/:id',editGroup );
router.delete('/:id',deleteGroup)




module.exports = router

