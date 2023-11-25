const express = require('express');
const router = express.Router();

const {
    getTeams,
    getTeam,
} = require('../controllers/Teams')


/* @desc Get all Teams */
router.get('/', getTeams)

/* @desc Get Team */
router.get('/:id', getTeam)

module.exports = router