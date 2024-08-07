const winston = require('winston');

const customLevels = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warn: 3,
        error: 4,
        fatal: 5
    },

    colors: {
        bedug: 'blue',
        http: 'magenta',
        info: 'green',
        warn: 'yellow',
        error:'red',
        fatal: 'red'
    }
};


const devLogger = winston.createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`) 
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'errors.log', level: 'error' })
    ]
});


const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

logger.debug('this is a debug log');
logger.http('this is an http log');
logger.info('this is an info log');
logger.warn('this is a warning log');
logger.error('this is an error log');
logger.fatal('this is a fatal log');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const logger = require('./logger')


app.get('/', (req, res) => {
    logger.info('Home route accessed');
    res.send('Hello, World!');
});

app.get("/loggerTest", (req, res) => {
    logger.debug('Debug log test');
    logger.http('HTTP log test');
    logger.info('Info log test');
    logger.warn('Warning log test');
    logger.error('Error log test');
    logger.fatal('Fatal log test');
    res.send('Logger test completed. Check your logs.');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
