// import * as bcrypt from 'bcrypt-nodejs';
// import * as crypto from 'crypto';
import mongoose from 'mongoose';
import {
    Fido2Lib,
    PublicKeyCredentialCreationOptions,
    Fido2LibOptions,
    AttestationResult,
    Fido2AttestationResult,
}  from 'fido2-lib';
import base64url from 'base64url';
import createRandomBase64URLBuffer from '../utils/createRandomBase64URLBuffer';
import { DEFAULT_ATTESTATION_OPTIONS, DefaultAttestationOptions } from '../constants/constants';
import logger from '../utils/logger';
import { RP_NAME, RP_ID, ORIGIN } from '../constants/secrets';

export type AuthToken = {
    accessToken: string,
    kind: string,
};

type PubKeyCredParams = {
    type: string;
    alg: number;
};

// challenge
// timeout
// rpId
// userVerification

export type Options = {
    rp: {
        name: string;
        id: string;
    };
    user: {
        id: string;
        name: string;
        displayName: string;
        email: string;
        authenticators: any;
        challenge: string;
        origin: string;
    };
    challenge: string;
    pubKeyCredParams: PubKeyCredParams[];
    timeout: number;
    attestation: string;
    authenticatorSelectionCriteria: {
        authenticatorAttachment: string;
        requireResidentKey: boolean;
        userVerification: string;
    };
};

// fixme types
type AttestationObject = Object;

export type PublicKey = {};

type CreateAttestationOptions = () => Promise<Options>;
type ValidateAttestationObject = (challenge: string, attestation: AttestationResult) => Promise<UserModel>;

type Cred = {
    fmt: string;
    counter: number;
    credId?: Buffer;
    credentialPublicKeyJwk: {
        kty: string;
        alg: string;
        crv: string;
        x: string;
        y: string;
    },
    credentialPublicKeyPem: string;
};

type MapKey = keyof Cred;

export type UserModel = mongoose.Document & {
    id: string;
    email: string;
    name: string;
    displayName: string;
    creds: {
        [id: string]: Partial<Cred> & { id: string };
    };
    lastCredId: string;
    tokens: AuthToken[];
    createAttestationOptions: CreateAttestationOptions;
    validateAttestationObject: ValidateAttestationObject;
    createAssertionChallenge: Function;
    verifyAttestation: Function;
    verifyAssertion: Function;
};

const userSchema = new mongoose.Schema({
    id: String,
    email: { type: String, unique: true },
    name: String,
    displayName: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    creds: Object,
    lastCredId: String,
    tokens: Array,
}, { timestamps: true });

const f2l = new Fido2Lib({
    rpId: RP_ID,
    rpName: RP_NAME,
    ...DEFAULT_ATTESTATION_OPTIONS,
});

userSchema.methods.createAttestationOptions = function () {
    this.id = createRandomBase64URLBuffer();

    return this.save()
        .then(() => f2l.attestationOptions())
        .then((options: Options) => {
            const challenge = base64url(options.challenge);

            logger.debug('createAttestationOptions: ', options);

            return {
                ...options,
                challenge,
                user: {
                    challenge,
                    id: this.id,
                    name: this.name,
                    displayName: this.name,
                    email: this.email,
                    authenticators: [] as any,
                    origin: ORIGIN,
                },
            };
        });
};

userSchema.methods.validateAttestationObject =
    function (challenge: string, attestation: AttestationResult) {

        return f2l.attestationResult(attestation, {
            challenge,
            rpId: RP_ID,
            origin: ORIGIN,
            factor: 'either',
        }).then<Fido2AttestationResult>(({ authnrData: result }) => {
            logger.debug('authnrData: ', result);
            const credentialPublicKeyPem = result.get('credentialPublicKeyPem');
            const credentialPublicKeyJwk = result.get('credentialPublicKeyJwk');
            const fmt = result.get('fmt');
            const counter = result.get('counter');
            const id = base64url(result.get('credId') as Buffer);

            logger.debug('result: ', result);
            this.creds = this.creds || {};
            this.creds[id] = {
                id,
                fmt,
                counter,
                credentialPublicKeyJwk,
                credentialPublicKeyPem,
            };
            this.lastCredId = id;

            return this.save();
        });
    };

const UserPure = mongoose.model<UserModel>('User', userSchema);

class User extends UserPure {
    static getAssertionOptions() {
        return f2l.assertionOptions();
    }
}

export default User;
