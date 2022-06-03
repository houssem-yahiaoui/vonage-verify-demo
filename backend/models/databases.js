const path = require('path');

const databaseOptions = {
  operatorsAliases: false,
  logging: console.log, //! process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 100000,
    idle: 10000
  },
  dialectOptions: {}
};

if (process.env.SSL_DATABASE) {
  databaseOptions.dialectOptions.ssl = {};
  databaseOptions.dialectOptions.ssl.rejectUnauthorized = false;
}

if (process.env.ENCRYPT_DATABASE) {
  databaseOptions.dialectOptions.encrypt = true;
}

module.exports = [{
  name: 'vonagedemo',
  modelsDir: path.resolve(__dirname, 'demo'),
  connection: {
    url: process.env.DATABASE_URL,
    options: { ...databaseOptions }
  }
}];
