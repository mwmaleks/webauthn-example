// import * as bcrypt from 'bcrypt-nodejs';
// import * as crypto from 'crypto';
import mongoose from 'mongoose';
import { Fido2Lib }  from 'fido2-lib';
import base64url from 'base64url';
import createRandomBase64URLBuffer from '../utils/createRandomBase64URLBuffer';
import { DefaultAttestationParams } from '../constants/constants';

export type AuthToken = {
    accessToken: string,
    kind: string,
};

type PubKeyCredParams = {
    type: string;
    alg: number;
};

type Options = {
    rp: {
        name: string;
        id: string;
    };
    user: {
        id: string;
        name: string;
        displayName: string;
        email: string;
        authenticators: string[];
        challenge: string;
        origin: string;
    };
    challenge: string;
    pubKeyCredParams: PubKeyCredParams[];
    timeout: number;
    attestation: string;
    authenticatorSelectionCriteria: {
        attachment: string;
        requireResidentKey: boolean;
        userVerification: string;
    };
};
type CreateAttestationParams = {
    rpId: string;
    rpName: string;
    origin: string;
} & DefaultAttestationParams;

type CreateAttestationOptions = (params: CreateAttestationParams) => Promise<Options>;

export type UserModel = mongoose.Document & {
    id: string,
    email: string,
    challenges: string[],
    tokens: AuthToken[],
    createAttestationOptions: CreateAttestationOptions,
    createAssertionChallenge: Function,
    verifyAttestation: Function,
    verifyAssertion: Function,
};

const userSchema = new mongoose.Schema({
    id: String,
    email: { type: String, unique: true },
    passwordResetToken: String,
    passwordResetExpires: Date,
    challenges: Array,
    tokens: Array,
}, { timestamps: true });

userSchema.methods.createAttestationOptions = function (params: CreateAttestationParams) {
    const f2l = new Fido2Lib(params);
    this.id = createRandomBase64URLBuffer();

    return f2l.attestationOptions()
        .then((options: Options) => {
            const challenge = base64url(options.challenge);
            this.challenges.push(challenge);

            return {
                challenge,
                id: this.id,
                name: this.name,
                displayName: this.name,
                email: this.email,
                // TODO
                authenticators: ['sd'],
            };
        });
};

const User = mongoose.model<UserModel>('User', userSchema);
export default User;
