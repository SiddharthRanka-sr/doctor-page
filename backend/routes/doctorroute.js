const express = require('express');
const { addDoctor, getDoctors, getFilters } = require('../controller/doctorcontroller');
const router = express.Router();
const upload = require('../middlewares/uploads')


router.post('/add-doctor', upload.single('image'), addDoctor);
router.get('/doctors',getDoctors)
router.get('/filters',getFilters)


module.exports = router;