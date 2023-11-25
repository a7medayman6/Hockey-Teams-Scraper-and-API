const { RedisClient } = require('../config/redis');

const logger = require('../utils/Logger');

const filename = 'utils/Cache.js';


class Cache
{
    constructor()
    {
        this.cache = new RedisClient();
        this.cache.connect();
    }

    async get(key)
    {
        const value = await this.cache.hGetAll(key);
        if(!value)
        {
            logger.error(filename, `Cache miss for key: ${key}`);
            return null;
        }

        logger.log(filename, `Cache hit for key: ${key}`);
        return value;
    }

    async set(key, value)
    {
        
        const set = await this.cache.hSet(key, value);
        if(set) logger.log(filename, `Cache set for key: ${key}`);
        
        
        return set;
        
    }
}

module.exports = Cache;