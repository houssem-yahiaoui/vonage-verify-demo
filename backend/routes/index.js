const router = require('express').Router();

// [*] Loading all the routers.
require('./federated-identity').setupFederatedIdentiy(router);

module.exports = router;