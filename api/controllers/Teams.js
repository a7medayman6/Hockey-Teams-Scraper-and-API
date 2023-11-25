const express = require('express');
const router = express.Router();
const logger = require('../utils/Logger');
const Team = require('../models/Teams.js');
const statusCodes = require('../config/status.codes.js');
const filename = 'controllers/Teams.js';

const Cache = require('../utils/Cache');

const cache = new Cache();

const CACHE_PREFIX = 'Team:';

/*
API Description: Teams service for Hockey teams API application, has following endpoints:
    - /Teams: GET, returns list of Teams
    - /Teams/{Team_id}: GET, returns Team with given id
*/

/**
 * Get all Teams.
 * Request body should be empty.
 * Endpoint: GET /api/v1/Teams
 * Example: /api/v1/Teams
 * @param {STRING} req
 * @param {STRING} res
 * @returns {JSON} # Returns a JSON object containing all Teams data, or an error message if an error occurs.
*/
const getTeams = async(req, res) =>
{
    try
    {
        const Teams = await Team.find()
        logger.log(filename, 'Sending all Teams ...');
        res.status(200).json({message: 'OK', data: {Teams}})
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(500).json({ error: 'Server error' });    
    }
};


/**
 * Get Team by id.
 * Request body should be empty.
 * Endpoint: GET /api/v1/Teams/{Team_id}
 * Example: /api/v1/Teams/1
 * @param {STRING} req
 * @param {STRING} res
 * @returns {JSON} # Returns a JSON object containing Team data, or an error message if an error occurs.
 * 
*/
const getTeam = async(req, res) =>
{
    // get req.params.id
    const id = req.params.id;
    
    if(!id)
    {
        logger.error(filename, 'No id provided');
        res.status(400).json({ error: 'No id provided' });
        return;
    }
    
    // try to get teams from Redis cache first
    try
    {
        const team = await cache.get(`${CACHE_PREFIX}${id}`);
        
        if(team)
        {
            logger.log(filename, 'Sending Team from cache ...');
            res.status(200).json({message: 'OK', data: {team}});
            return;
        }
    
    }
    catch(err)
    {
        logger.error(filename, `Error trying to get data from Cache: ${err} ...`);
        logger.error(filename, `skipping to DB ...`);  

    }


    // if not in cache, get from DB, then store in cache
    try
    {

        const team = await Team.findById(id)
        logger.log(filename, 'Storing Team data in Cache ...');

        const teamObj = 
        { 
            id: team._id, 
            name: team.name, 
            year: team.year, 
            wins: team.wins, 
            losses: team.losses, 
            win_percentage: team.win_percentage, 
            goals_for: team.goals_for,
            goals_against: team.goals_against, 
            diff: team.diff
        }

        await cache.set(`${CACHE_PREFIX}${id}`, team);
        logger.log(filename, 'Sending Team ...');
        res.status(200).json({message: 'OK', data: {team}})
        return;
    }
    catch(err)
    {
        logger.error(filename, err);
        res.status(500).json({ error: 'Server error' });   
        return; 
    }
};

module.exports = {
    
    getTeams,
    getTeam,
}