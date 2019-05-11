import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import User from '../models/User';
import logger from '../utils/logger';
// import { Strategy } from 'passport-local';

passport.serializeUser<any, any>((user, done) => {
    logger.debug('serializeUser: ', user);
    logger.debug('user.id: ', user.id);
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    logger.debug('deserializeUser: ', id);
    User.findOne({
        id,
    }, (err: Error, user) => {
        logger.debug('deserializeUser value:', user);
        done(err, user);
    });
});

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    logger.debug('req.session: ', req.session);
    logger.debug('req.sessionID: ', req.sessionID);
    if (req.isAuthenticated()) {
        return next();
    }

    logger.info('not authenticated');
    res.status(200);
    res.send({
        payload: 'Not authorized',
    });
};
