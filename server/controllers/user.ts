import { Request, Response } from 'express';
import {
    Fido2Lib,
    PublicKeyCredentialCreationOptions,
    PublicKeyCredentialRequestOptions,
    Fido2LibOptions,
    AttestationResult,
    Fido2AttestationResult,
    AssertionResult,
}  from 'fido2-lib';

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

    req.getValidationResult()
        .then((result) => {

            logger.debug('id: ', id);
            logger.debug('decode(id): ', decode(id));
            logger.debug('rawId: ', rawId);
            logger.debug('decode(rawId): ', decode(rawId));
            logger.debug('clientDataJSON: ', clientDataJSON);
            logger.debug('attestationObject: ', attestationObject);
            logger.debug('type: ', type);

            if (!challenge) {
                res.send({
                    code: 'invalid_challenge',
                    error: 'Invalid saved challenge',
                    ok: false,
                });

                throw new Error('Invalid saved challenge');
            }

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

export const postSignInStart = (req: Request, res: Response) => {
    if (!req.session.credId) {
        res.send({
            error: 'can not find credential id',
            code: 'no_credential_id',
            ok: false,
        });
        logger.debug('========================================== postSignInStart');
    }

    User.getAssertionOptions()
        .then((options: PublicKeyCredentialRequestOptions) => {
            req.session.challenge = options.challenge;
            logger.debug('options: ', options);
            res.json({
                payload: {
                    id: req.session.credId,
                    ...options,
                },
                ok: true,
            });
            logger.debug('========================================== postSignInStart');
        })
        .catch((err: Error) => {
            logger.error('postSignInStart err: ', err);

            res.send({
                error: 'Assertion error',
                code: 'assertion_error',
                ok: false,
            });
            logger.debug('========================================== postSignInStart');
        });
};

export const postSignInEnd = (req: Request, res: Response) => {
    req.assert('assertion.id', invalidCredsMessage).isString().isLength({ max: 200, min: 50 });
    req.assert('assertion.rawId', invalidCredsMessage).isString().isLength({ max: 200, min: 50 });
    req.assert('assertion.response.clientDataJSON', invalidCredsMessage).isString().isLength({ max: 800, min: 50 });
    req.assert('assertion.response.authenticatorData', invalidCredsMessage)
        .isString()
        .isLength({ max: 500, min: 50 });
    req.assert('assertion.response.signature', invalidCredsMessage).isString().isLength({ max: 200, min: 10 });
    req.assert('attestation.type', invalidCredsMessage).isIn('public-key');

    const {
        challenge,
    } = req.session;
    const {
        id,
        rawId,
        response: {
            clientDataJSON,
            authenticatorData,
            signature,
        },
        userHandle,
    } = (req.body || {}).assertion;
    const assertion: AssertionResult = {
        id: decode(id),
        rawId: decode(rawId),
        response: {
            clientDataJSON,
            signature,
            userHandle,
            authenticatorData: decode(authenticatorData),
        },
    };

    req.getValidationResult()
        .then((result) => {
            if (!result.isEmpty()) {
                logger.error('assertion validationResult is not empty');
                logger.error('assertion validationResult is: ', result.mapped());

                res.send({
                    code: 'invalid_assertion',
                    error: 'Invalid assertion object',
                    ok: false,
                });

                throw new Error('Invalid assertion object');
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
        .then((user: UserModel) => user.validateAssertionObject(id, challenge, assertion))
        .then((user: UserModel) => new Promise<void>((resolve, reject) => {
            // invalidate the challenge
            delete req.session.challenge;

            req.logIn(user, ((err: Error) => {
                if (!err) {
                    logger.debug('successfully logged in user');
                    res.send({
                        email: user.email,
                        code: 'login_success',
                        ok: true,
                    });
                    resolve();
                    logger.debug('========================================== postSignInEnd');

                    return;
                }

                reject(new Error('unsuccessful login'));
            }));
        }))
        .catch((err: Error) => {
            logger.error('postSignInEnd error: ', err);
            if (!res.headersSent) {
                res.send({
                    code: 'failed_assertion',
                    error: 'Failed validate assertion',
                    ok: false,
                });
                logger.debug('========================================== postSignInEnd');
            }
        });
};
