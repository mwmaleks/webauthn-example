import express from 'express';
import expressSession from 'express-session';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from './utils/logger';
import dotenv from 'dotenv';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import passport from 'passport';
import expressValidator from 'express-validator';
import bluebird from 'bluebird';
import nodeNotifier from 'node-notifier';

import { MONGODB_URI, SESSION_SECRET, ENVIRONMENT } from './constants/secrets';

// @ts-ignore
const mongoStore = connectMongo(expressSession);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env' });

// Controllers
import * as userController from './controllers/user';

// API keys and Passport configuration
import * as passportAttestations from './config/passport';

// Express server
const app = express();

// MongoDB
const mongoUrl = MONGODB_URI as string;
(<any>mongoose).Promise = bluebird;
mongoose.connect(mongoUrl).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch((err) => {
    logger.error(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    nodeNotifier.notify({
        title: 'WebAuthn Example',
        message: 'WebAuthn Example can\'t connect to database',
    });
    process.exit();
});

// dev cors
if (ENVIRONMENT !== 'production') {
    const corsOptions = {
        credentials: true,
        origin: `http://${process.env.FRONT_HOST || 'localhost'}:${process.env.FRONT_PORT || 3000}`,
        optionsSuccessStatus: 200,
    };

    logger.debug('set up cors options: ', corsOptions);

    app.use(cors(corsOptions));
    logger.info(`cors options: ${JSON.stringify(corsOptions)}`);
}

// configuration
app.set('port', process.env.PORT || 4000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(expressSession({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET as string,
    store: new mongoStore({
        url: mongoUrl,
        autoReconnect: true,
    }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// routes
app.post('/checkSession', passportAttestations.isAuthenticated, userController.postSession);
app.post('/getAttestationChallenge', userController.postCreateAttestationChallenge);
app.post('/finishAttestation', userController.postFinishAttestation);

export default app;
