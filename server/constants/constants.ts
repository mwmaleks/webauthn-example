import { Attachment, UserVerification, Attestation } from 'fido2-lib';

export type DefaultAttestationOptions = {
    timeout: number;
    challengeSize: number;
    attestation: Attestation;
    cryptoParams: number[];
    authenticatorAttachment?: Attachment;
    authenticatorRequireResidentKey: false;
    authenticatorUserVerification: UserVerification;
};

export const DEFAULT_ATTESTATION_OPTIONS: DefaultAttestationOptions = {
    timeout: 150000,
    challengeSize: 128,
    attestation: 'none',
    cryptoParams: [-7, -257],
    authenticatorAttachment: 'platform',
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: 'required',
};

export const invalidCredsMessage = 'Invalid attestation object';
