// Utilities
const path = require('path');
const jwt = require('express-jwt');
const cors = require('cors');
const rTracer = require('cls-rtracer');
const rateLimit = require('express-rate-limit');

// Configs
const logger = require('./logger.config');

// routers
const API = require('../routes');

module.exports.setupExpressServer = async (app, express) => {
    app.use(rTracer.expressMiddleware());
    logger.stream = {
        write(message) {
            logger.info(message);
        }
    };
    app.use(
        require('morgan')('tiny', {
            stream: logger.stream
        })
    );
    app.use(
        jwt.expressjwt({
            secret: process.env.SECRET,
            algorithms: ['HS256']
        }).unless({ path: ['/api/federated/user'] })
    );

    app.use(
        express.json({
            limit: '50mb'
        })
    );
    app.use(
        express.urlencoded({
            extended: false,
            limit: '50mb'
        })
    );
    app.use(express.static(path.join(__dirname, '..', 'public')));
    const allowedOrigins = [/localhost:\d{4}$/];
    const corsConfig = {
        origin: allowedOrigins,
        allowedHeaders: ['Authorization', 'X-Requested-With', 'Content-Type'],
        maxAge: 86400, // NOTICE: 1 day
        credentials: true
    };
    app.use(cors(corsConfig));
    app.get('/health', (_, res) => res.status(200).send('ok'));
    app.use(
        '/api',
        API,
        rateLimit({
            windowMs: 30 * 60 * 1000, // 30 minutes
            max: 800, // limit each IP to 800 requests per windowMs
            message: 'Too many action requests from this IP, please try again after an 30min'
        })
    );
};
