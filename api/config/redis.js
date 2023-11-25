const { createClient } = require('redis');
const logger = require('../utils/Logger');
const filename = 'config/redis.js';


class RedisClient
{
    constructor(REDIS_URL=process.env.REDIS_URL || 'redis://localhost:6379')
    {
        this.client = createClient();
        this.client.on('error', (err) => {
            logger.error(filename, `Redis Client Error ${err}`);
        });
        this.REDIS_URL = REDIS_URL;
    }

    async connect()
    {
        await this.client.connect(
            {
                url: this.REDIS_URL,
                legacyMode: false,
            }
        );
        logger.log(filename, `Redis Client connected to ${this.REDIS_URL}`);
    }

    async ping()
    {
        try
        {
            await this.client.ping();
            logger.log(filename, `Redis Client pinged ${this.REDIS_URL}`);
            return true;
        }
        catch(err)
        {
            logger.error(filename, `Redis Client ping error ${this.REDIS_URL}`);
            logger.error(filename, err);
            return false;
        }
    }

    async hGetAll(key)
    {
        try
        {
            const value = await this.client.hGetAll(key);
            logger.log(filename, `Redis Client hGetAll ${key}`);

            if(!value || Object.keys(value).length === 0)
            {
                logger.error(filename, `Key: ${key} not found in cache.`);
                return null;
            } 

            return value;
        }
        catch(err)
        {
            logger.error(filename, `Redis Client hGetAll error ${key}`);
            logger.error(filename, err);
            return null;
        }
    }

    async hSet(key, value)
    {
        try
        {
            // log the key and value
            logger.log(filename, `Performing hSet for key: ${key}`);
            logger.log(filename, `Performing hSet for value of type: ${typeof value}`);
            logger.log(filename, `Performing hSet for value: ${JSON.stringify(value)}`);

            await this.client.hSet(key, { 
                id: String(value._id), 
                name: String(value.name), 
                year: String(value.year), 
                wins: String(value.wins), 
                losses: String(value.losses), 
                win_percentage: String(value.win_percentage), 
                goals_for: String(value.goals_for),
                goals_against: String(value.goals_against), 
                diff: String(value.diff)
            });
            
            logger.log(filename, `Successefully performed hSet for key:  ${key}`);

            return true;
        }
        catch(err)
        {
            logger.error(filename, `Redis Client hSet error ${key}`);
            logger.error(filename, err);
            return false;
        }
    }
}
module.exports = { RedisClient };
    