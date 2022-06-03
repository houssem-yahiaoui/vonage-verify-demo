// Utilities
const jwt = require('jsonwebtoken');
const Vonage = require('@vonage/server-sdk');


// Config
const logger = require('../config/logger.config');

// Models
const parentModels = require('../models');


const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY,
    apiSecret: process.env.VONAGE_API_SECRET
});


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
                attributes: ['id', 'name', 'picture', 'phone_number']
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
                logger.info(`[${featureName.toUpperCase()}] : request finished`);
                const token = await createReturnToken(user, req);
                if (token) {
                    res.json({
                        success: true,
                        token
                    });
                }
            } else {
                if(user.phone_number && user.phone_number.verified) {
                    vonage.verify.request({
                        number: user.phone_number.number.replace('+', ''),
                        brand: "VonageDemo",
                        code_length: 6
                    }, async (err, verificationResult ) => {
                        if(err) {
                            return res.status(400).json({
                                err
                            });
                        } else {
                            if(verificationResult && verificationResult.request_id) {
                                console.log(verificationResult)
                                logger.info(`[${featureName.toUpperCase()}] : request finished`);
                                const token = await createReturnToken(user, req);
                                if (token) {
                                    res.json({
                                        success: true,
                                        token,
                                        requestId: verificationResult.request_id
                                    });
                                }
                            }
                        }
                    })    
                }
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
                vonage.verify.request({
                    number: req.body.number.replace('+', ''),
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
                                    phone_number: {
                                        number: req.body.number,
                                        verified: false
                                    }
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
            const featureName = 'verify 2fa';
            logger.info(`[${featureName.toUpperCase()}] : request started`);
            vonage.verify.check({
                request_id: req.body.requestId,
                code: req.body.verificationCode
              }, async (err, result) => {
                if (err) {
                  res.status(400).json({ success: false, err })
                } else {
                    if(result.status === '0') {
                        const user = await parentModels.FederatedUser.findOne({
                            id: req.auth.id
                        });
                        let phone = user.phone_number;
                        phone.verified = true;
                        user.set({ phone_number: phone });
                        await user.save();
                        res.status(200).json({ success: true });
                    }
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
