const logger = require('./logger.config');

module.exports = {
    development: {
        databases: {
            demo: {
                url: process.env.DATABASE_URL,
                logging: (msg) => logger.info(msg),
                pool: {
                    maxConnections: 10,
                    minConnections: 1
                },
                operatorsAliases: false,
                dialect: 'postgres'
            }
        }
    },
    production: {
        databases: {
            demo: {
                url: process.env.DATABASE_URL,
                logging: (msg) => logger.info(msg),
                pool: {
                    maxConnections: 10,
                    minConnections: 1
                },
                operatorsAliases: false,
                dialect: 'postgres'
            }
        }
    },
    // Special environment only for Merlin DB
    demo: {
        url: process.env.DATABASE_URL,
        logging: (msg) => logger.info(msg),
        pool: {
            maxConnections: 10,
            minConnections: 1
        },
        operatorsAliases: false,
        dialect: 'postgres'
    }
};
