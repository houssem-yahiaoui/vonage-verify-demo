const { createLogger, format, transports } = require('winston');
const rTracer = require('cls-rtracer');

const { combine, timestamp, printf, colorize, errors } = format;

const rTracerFormat = printf(({ level, message }) => {
    const rid = rTracer.id();
    return rid ? `🔔 [request-id:${rid}] - ${level} : ${message}` : `🔔 ${level} : ${message}`;
});

let loggerFormat;

if (process.env.NODE_ENV !== 'production') {
    loggerFormat = combine(errors({ stack: true }), timestamp(), colorize(), rTracerFormat);
} else {
    loggerFormat = combine(errors({ stack: true }), timestamp(), rTracerFormat);
}

const logger = createLogger({
    format: loggerFormat,
    transports: [new transports.Console()]
});

module.exports = logger;
