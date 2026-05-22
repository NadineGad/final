const express = require('express');
const router = express.Router();
const { getCourses, getCourse, seedCourses } = require('../controllers/courseController');

router.get('/', getCourses);
router.get('/seed', seedCourses);
router.get('/:id', getCourse);

module.exports = router;
