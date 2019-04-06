import winston, { Logger } from 'winston';

// @ts-ignore
const logger = new Logger({
    transports: [
        new (winston.transports.Console)({
            level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
            colorize: true,
        }),
        new (winston.transports.File)({ filename: 'debug.log', level: 'debug' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.debug('Logging initialized at debug level');
}

export default logger;
