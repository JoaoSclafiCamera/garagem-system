const express = require('express');
const router = express.Router();
const { getCatalog, getCar, addCar, removeCar } = require('../controllers/catalogController');

router.get('/', getCatalog);
router.get('/:id', getCar);
router.post('/add', addCar);
router.delete('/:id', removeCar);

module.exports = router;
