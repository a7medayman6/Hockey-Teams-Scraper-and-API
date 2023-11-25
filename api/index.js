const express = require("express");
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const logger = require('./utils/Logger.js');
const db = require('./config/db');

const app = express();

app.use(express.json());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

// enable cors
app.use(cors({
    origin: 'http://localhost:3000'
}));

// loggers
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms -  :body - :req[content-length]  - :res[content-length]'));


const version = 'v1';
const testPath = `/api/${version}/test`
const teamsPath = `/api/${version}/teams`;

// routes
app.use(`${testPath}`, require('./routes/Test.js'));
app.use(`${teamsPath}/`, require('./routes/Teams.js'));


const PORT = process.env.PORT || 3000;
const filename = path.basename(__filename);

app.listen(PORT, () => 
{    
    logger.log(filename, `Server Started at ${PORT} ...`);
})