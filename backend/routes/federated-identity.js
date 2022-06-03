// Utilities
const jwt = require('jsonwebtoken');
const Vonage = require('@vonage/server-sdk');
const util = require('util')


// Config
const logger = require('../config/logger.config');

// Models
const parentModels = require('../models');


const createReturnToken = (user, req) =>
    new Promise((resolve, reject) => {
        const { id, name, picture } = user;
        jwt.sign(
            {
                id,
                name,
                picture
            },
            process.env.SECRET,
            {
                issuer: req.headers.host,
                expiresIn: '7 days'
            },
            (err, token) => {
                if (!err) {
                    resolve(token);
                } else {
                    reject(err);
                }
            }
        );
    });

module.exports.setupFederatedIdentiy = (router) => {
    router.post('/federated/user', async (req, res) => {
        const featureName = 'User login';
        logger.info(`[${featureName.toUpperCase()}] : request started`);
        try {
            let user = await parentModels.FederatedUser.findOne({
                where: {
                    google_id: req.body.uid
                },
                attributes: ['id', 'name', 'picture']
            });
            if (!user) {
                // We create new profile.
                logger.info('[*] Creating new user.');
                user = await parentModels.FederatedUser.create({
                    name: req.body.name,
                    google_id: req.body.uid,
                    picture: req.body.photo,
                    email: req.body.email,
                });
            }
            logger.info(`[${featureName.toUpperCase()}] : request finished`);
            const token = await createReturnToken(user, req);
            if (token) {
                res.json({
                    success: true,
                    token
                });
            }
        } catch (error) {
            logger.error(error);
            res.status(400).send({
                error
            });
        }
    });
    router.patch(
        '/federated/:id/phone-number',
        async (req, res) => {
            const featureName = 'Update phone number';
            logger.info(`[${featureName.toUpperCase()}] : request started`);
            console.log(req.body.number);
            try {
                const vonage = new Vonage({
                    apiKey: process.env.VONAGE_API_KEY,
                    apiSecret: process.env.VONAGE_API_SECRET
                });
                vonage.verify.request({
                    number: '48 505 206 248',//req.body.number.replace('+', ''),
                    brand: "VonageDemo",
                    code_length: 6
                }, async(err, verificationResult ) => {
                    if(err) {
                        return res.status(400).json({
                            err
                        });
                    } else {
                        if(verificationResult && verificationResult.request_id) {
                            await parentModels.FederatedUser.update(
                                {
                                    phone_number: req.body.number
                                },
                                {
                                    where: {
                                        id: req.params.id
                                    }
                                }
                            );
                            logger.info(`[${featureName.toUpperCase()}] : request finished`);
                            return res.status(200).json({
                                success: true,
                                requestId: verificationResult.request_id
                            });
                        }
                    }
                });                
            } catch (error) {
                logger.error(error);
                res.status(400).send({
                    error
                });
            }
        }
    );

    router.post(
        '/federated/verify-2fa',
        async (req, res) => {
            const featureName = 'Update phone number';
            logger.info(`[${featureName.toUpperCase()}] : request started`);
            console.log(req.body.verificationCode);
            console.log(req.body.requestId);
            const vonage = new Vonage({
                apiKey: process.env.VONAGE_API_KEY,
                apiSecret: process.env.VONAGE_API_SECRET
            });
            vonage.verify.check({
                request_id: req.body.requestId,
                code: req.body.verificationCode
              }, (err, result) => {
                if (err) {
                  res.status(400).json(err)
                } else {
                  res.status(200).json(result);
                }
            });
        }
    );

    router.get(
        '/federated/:id/metadata',
        async (req, res) => {
            const featureName = 'fetch federated metadata';
            logger.info(`[${featureName.toUpperCase()}] : request started`);
            try {
                const user = await parentModels.FederatedUser.findOne({
                    where: {
                        id: req.params.id
                    },
                    attributes: ['phone_number', 'picture', 'name', 'email', 'created_at']
                });
                if(user.phone_number) {
                    const vonage = new Vonage({
                        apiKey: process.env.VONAGE_API_KEY,
                        apiSecret: process.env.VONAGE_API_SECRET
                    });        
                    // TODO: Do the vonage check here.
                }
                // Do the Vonage check if the user added correct verification code or not.
                // If yes, keep going.
                // Else, delete the phone number and the metadata

                logger.info(`[${featureName.toUpperCase()}] : request finished`);
                res.json(user);
            } catch (error) {
                logger.error(error);
                res.status(400).send({
                    error
                });
            }
        }
    );
};
