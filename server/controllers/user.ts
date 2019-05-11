import { Request, Response, NextFunction } from 'express';

// models
import User, { UserModel, PublicKey } from '../models/User';

// utils
import createName from '../utils/createName';
import logger from '../utils/logger';
import { decode } from '../utils/base64';

// constants
import { DEFAULT_ATTESTATION_OPTIONS, invalidCredsMessage } from '../constants/constants';

// env
import { RP_NAME, RP_ID, ORIGIN } from '../constants/secrets';

/**
 * POST /checkSession
 * Send ok session status
 */
export const postSession = (req: Request, res: Response) => {
    logger.info('send logged in, serverTime, user email');

    res.status(200);
    logger.debug('postSession req.session: ', req.session.user);
    logger.debug('postSession user: ', req.user);
    res.send({
        payload: {
            serverTime: new Date().toISOString(),
            email: req.user.email,
        },
    });
};

export const postCreateAttestationChallenge = (req: Request, res: Response) => {
    req.assert('email', 'Email is not valid').isEmail();

    req.getValidationResult()
        .then((result) => {
            if (!result.isEmpty()) {
                logger.error('ValidationResult is empty');
                res.send({
                    code: 'invalid_email',
                    error: 'Invalid email',
                });
                return;
            }

            req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

            const email = req.body.email;

            logger.debug('email:', email);

            const user = new User({
                email,
                name: createName(email),
                challenges: [],
            });

            logger.debug('user createName:', user);

            return user.createAttestationOptions({
                rpId: RP_ID,
                rpName: RP_NAME,
                origin: ORIGIN,
                ...DEFAULT_ATTESTATION_OPTIONS,
            }).then((options) => {
                return user.save()
                    .then(() => {
                        logger.debug('sending attestation options:', options);
                        res.json(options);
                    });
            });
        })
        .catch((error) => {
            logger.error(error);
            res.status(500);
            res.send('Error while creating challenge');
        });
};

export const postFinishAttestation = (req: Request, res: Response) => {
    req.assert('attestation.id', invalidCredsMessage).isString().isLength({ max: 200, min: 50 });
    req.assert('attestation.rawId', invalidCredsMessage).isString().isLength({ max: 200, min: 50 });
    req.assert('attestation.response.clientDataJSON', invalidCredsMessage).isString().isLength({ max: 400, min: 50 });
    req.assert('attestation.response.attestationObject', invalidCredsMessage).isString().isLength({ max: 400, min: 50 });
    req.assert('attestation.type', invalidCredsMessage).isIn('public-key');
    req.assert('email', 'Email is not valid').isEmail();

    const {
        id,
        rawId,
        response: {
            clientDataJSON,
            attestationObject,
        },
        type,
    } = (req.body || {}).attestation;

    logger.debug('id: ', id);
    logger.debug('decode(id): ', decode(id));
    logger.debug('rawId: ', rawId);
    logger.debug('decode(rawId): ', decode(rawId));
    logger.debug('clientDataJSON: ', clientDataJSON);
    logger.debug('attestationObject: ', attestationObject);
    logger.debug('type: ', type);

    const attestation = {
        type,
        response: {
            clientDataJSON,
            attestationObject,
        },
        id: decode(id),
        rawId: decode(rawId),
    };

    req.getValidationResult()
        .then((result) => {
            if (!result.isEmpty()) {
                logger.error('ValidationResult is empty');

                res.send({
                    code: 'invalid_attestation',
                    error: 'Invalid attestation object',
                });
                return Promise.reject(new Error('Invalid attestation object'));
            }

        })
        .then(() => User.findOne({ email: req.body.email }, (err: Error, user: UserModel) => {
            if (err) {
                res.send({
                    code: 'not_found_user',
                    error: 'User not found',
                });

                return Promise.reject(new Error('User not found'));
            }

            return user;
        }))
        .then((user: UserModel) => user.validateAttestationObject({
            attestation,
            params: {
                rpId: RP_ID,
                rpName: RP_NAME,
                origin: ORIGIN,
                ...DEFAULT_ATTESTATION_OPTIONS,
            },
            origin: ORIGIN,
        }))
        .then(user => new Promise((resolve, reject) => {
            logger.debug('new user: ', user);
            req.logIn(user, ((err: Error) => {
                if (!err) {
                    logger.debug('successfully logged in new user');
                    res.send({
                        code: 'createCreds',
                        ok: true,
                    });
                    logger.debug('req.session: ', req.session);
                    resolve();
                    return;
                }

                reject(new Error('unsuccessful login'));
            }));
        }))
        .catch((err) => {
            logger.error('err: ', err);
            if (!res.headersSent) {
                res.send({
                    code: 'failed_attestation',
                    error: 'Failed attestation',
                });
            }
        });
};
