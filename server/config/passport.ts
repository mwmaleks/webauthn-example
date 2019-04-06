import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import User from '../models/User';
import logger from '../utils/logger';
// import { Strategy } from 'passport-local';

passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err: Error, user) => {
        done(err, user);
    });
});

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
        return next();
    }

    logger.info('not authenticated');

    res.status(200);
    res.send({
        payload: 'Not authorized',
    });
};
