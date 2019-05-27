import logger from '../utils/logger';
import dotenv from 'dotenv';
import nodeNotifier from 'node-notifier';
import fs from 'fs';

if (fs.existsSync('.env')) {
    logger.debug('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
} else {
    logger.debug('Using .env.example file to supply config environment variables');
    dotenv.config({ path: '.env.example' });
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production';

export const SESSION_SECRET = process.env['SESSION_SECRET'];
export const MONGODB_URI = prod ? process.env['MONGODB_URI'] : process.env['MONGODB_URI_LOCAL'];
export const RP_ID = process.env.RP_ID || 'localhost';
export const ORIGIN = process.env.ORIGIN || 'http://localhost:8080';
export const RP_NAME = process.env.RP_NAME || 'webauthn-example';

if (!SESSION_SECRET) {
    logger.error('No client secret. Set SESSION_SECRET environment variable.');
    nodeNotifier.notify({
        title: 'WebAuthn Example',
        message: 'WebAuthn Example can\'t locate SESSION_SECRET',
    });
    process.exit(1);
}

if (!MONGODB_URI) {
    logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
    nodeNotifier.notify({
        title: 'WebAuthn Example',
        message: 'WebAuthn Example can\'t locate MONGODB_URI',
    });
    process.exit(1);
}
