const express = require('express');
const router = express.Router();
const { register, getMyRegistrations, drop } = require('../controllers/registrationController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, register);
router.get('/my', auth, getMyRegistrations);
router.patch('/:id/drop', auth, drop);

module.exports = router;
