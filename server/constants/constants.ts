export type DefaultAttestationParams = {
    timeout: number;
    challengeSize: number;
    attestation: string;
    cryptoParams: number[];
    authenticatorAttachment?: string;
    authenticatorRequireResidentKey: false;
    authenticatorUserVerification: string;
};

export const DEFAULT_ATTESTATION_OPTIONS: DefaultAttestationParams = {
    timeout: 15000,
    challengeSize: 128,
    attestation: 'none',
    cryptoParams: [-7, -257],
    // FIXME
    // authenticatorAttachment: 'platform',
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: 'required',
};

export const invalidCredsMessage = 'Invalid attestation object';
