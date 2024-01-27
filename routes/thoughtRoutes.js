const express = require('express');
const router = express.Router();
const ThoughtController = require('../controllers/api/thoughtController');

router.get('/', ThoughtController.getThoughts);
router.get('/:thoughtId', ThoughtController.getSingleThought);
router.post('/', ThoughtController.createThought);
router.put('/:thoughtId', ThoughtController.updateThought);
router.delete('/:thoughtId', ThoughtController.deleteThought);

module.exports = router;