const mongoose = require('mongoose');
const logger = require('../utils/Logger');
const filename = 'config/db.js';

require('dotenv').config();
 
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/e-voting-topics-service';

mongoose.set('strictQuery', false);


mongoose.connect(connectionString, 
    {
        useNewUrlParser: true,
    })
.then(() => logger.log(filename, `Connected to MongoDB at ${connectionString}`))
.catch(err => logger.error(filename, err, error=true));

module.exports = mongoose.connection;