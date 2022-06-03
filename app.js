// eslint-disable-line global-require
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// Configuration
const express = require('express');
const logger = require('./backend/config/logger.config');


// Application dependencies
const app = express();

// [*] Configuring Express Server.
require('./backend/config/express.config').setupExpressServer(app, express);


app.listen(process.env.PORT, () => {
    logger.info("I'm alive ⚡️");
});
