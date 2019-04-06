import base64url from 'base64url';
import crypto from 'crypto';

type CreateRandomBase64URLBuffer = (len?: number) => string;

const createRandomBase64URLBuffer: CreateRandomBase64URLBuffer = (len = 32) => base64url(crypto.randomBytes(len));

export default createRandomBase64URLBuffer;
