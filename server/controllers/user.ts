import { Request, Response } from 'express';

// models
import User, { UserModel } from '../models/User';

// utils
import createName from '../utils/createName';
import logger from '../utils/logger';
import { decode } from '../utils/base64';

// constants
import { invalidCredsMessage } from '../constants/constants';

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
    logger.debug('========================================== postSession');
};

export const postCreateAttestationChallenge = (req: Request, res: Response) => {
    req.assert('email', 'Email is not valid').isEmail();

    req.getValidationResult()
        .then((result) => {
            if (!result.isEmpty()) {
                logger.error('ValidationResult is not empty');
                logger.error('ValidationResult is: ', result.mapped());
                res.send({
                    code: 'invalid_email',
                    error: 'Invalid email',
                    ok: false,
                });
                logger.debug('========================================== postCreateAttestationChallenge');
                return;
            }

            req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });

            const email = req.body.email;

            logger.debug('email:', email);

            const user = new User({
                email,
                name: createName(email),
            });

            logger.debug('user createName:', user);

            return user.createAttestationOptions()
                .then((options) => {
                    // save user id for further login flows, and challenge for to continue registration
                    req.session.challenge = options.challenge;
                    req.session.userId = options.user.id;
                    logger.debug('sending attestation options:', options);

                    res.json(options);
                    logger.debug('========================================== postCreateAttestationChallenge');
                });
        })
        .catch((error) => {
            logger.error(error);
            res.status(500);
            res.send({
                error: 'Error while creating challenge',
                ok: false,
            });
            logger.debug('========================================== postCreateAttestationChallenge');
        });
};

export const postFinishAttestation = (req: Request, res: Response) => {
    req.assert('attestation.id', invalidCredsMessage).isString().isLength({ max: 200, min: 50 });
    req.assert('attestation.rawId', invalidCredsMessage).isString().isLength({ max: 200, min: 50 });
    req.assert('attestation.response.clientDataJSON', invalidCredsMessage).isString().isLength({ max: 800, min: 50 });
    req.assert('attestation.response.attestationObject', invalidCredsMessage)
        .isString()
        .isLength({ max: 500, min: 50 });
    req.assert('attestation.type', invalidCredsMessage).isIn('public-key');

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
    const {
        challenge,
    } = req.session;

    if (!challenge) {
        res.send({
            code: 'invalid_challenge',
            error: 'Invalid saved challenge',
            ok: false,
        });
        logger.debug('========================================== postFinishAttestation');
        return;
    }

    req.getValidationResult()
        .then((result) => {
            if (!result.isEmpty()) {
                logger.error('attestation validationResult is not empty');
                logger.error('attestation validationResult is: ', result.mapped());

                res.send({
                    code: 'invalid_attestation',
                    error: 'Invalid attestation object',
                    ok: false,
                });

                throw new Error('Invalid attestation object');
            }

        })
        .then(() => User.findOne({ id: req.session.userId }, (err: Error, user: UserModel) => {
            if (err) {
                res.send({
                    code: 'not_found_user',
                    error: 'User not found',
                    ok: false,
                });

                throw new Error('User not found');
            }

            return user;
        }))
        .then((user: UserModel) => user.validateAttestationObject(challenge, attestation))
        .then(user => new Promise<void>((resolve, reject) => {
            // invalidate the challenge
            delete req.session.challenge;
            // save credId just signed up to session
            req.session.credId = user.lastCredId;

            logger.debug('new user: ', user);

            req.logIn(user, ((err: Error) => {
                if (!err) {
                    logger.debug('successfully logged in new user');
                    res.send({
                        code: 'create_creds',
                        ok: true,
                    });
                    resolve();
                    logger.debug('========================================== postFinishAttestation');

                    return;
                }

                reject(new Error('unsuccessful login'));
            }));
        }))
        .catch((err: Error) => {
            logger.error('err: ', err);
            if (!res.headersSent) {
                res.send({
                    code: 'failed_attestation',
                    error: 'Failed attestation',
                    ok: false,
                });
                logger.debug('========================================== postFinishAttestation');
            }
        });
};

export const postLogout = (req: Request, res: Response) => {
    req.logOut();
    res.send({
        code: 'success_logout',
        ok: true,
    });
    logger.debug('logout successful');
    logger.debug('req.session: ', req.session);
    logger.debug('req.sessionID: ', req.sessionID);
    logger.debug('req.user: ', req.user);
    logger.debug('========================================== logout');
};
