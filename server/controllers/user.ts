import { Request, Response, NextFunction } from 'express';

// models
import User from '../models/User';

// utils
import createName from '../utils/createName';
import logger from '../utils/logger';

// constants
import { DEFAULT_ATTESTATION_OPTIONS } from '../constants/constants';

// env
import { RP_NAME, RP_ID } from '../constants/secrets';

/**
 * POST /checkSession
 * Send ok session status
 */
export const postSession = (req: Request, res: Response) => {
    res.status(200);
    logger.info('send logged in, serverTime, user email');
    res.send({
        payload: {
            serverTime: new Date().toISOString(),
            email: req.session.user.email,
        },
    });
};

export const postCreateAttestationChallenge = (req: Request, res: Response) => {
    req.assert('email', 'Email is not valid').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
    const email = req.body.email;

    const user = new User({
        email,
        name: createName(email),
        challenges: [],
    });

    user.createAttestationOptions({
        rpId: RP_ID,
        rpName: RP_NAME,
        origin: RP_ID,
        ...DEFAULT_ATTESTATION_OPTIONS,
    }).then((options) => {
        return user.save()
            .then(() => {
                logger.debug('sending attestation options:', options);
                res.json(options);
            });
    }).catch((error) => {
        logger.error(error);
        res.status(500);
        res.send('Error while creating challenge');
    });
};

export const postFinishAttestation = (req: Request, res: Response) => {

};
