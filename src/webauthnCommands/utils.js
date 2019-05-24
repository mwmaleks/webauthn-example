import { decode } from './base64';

export const preformatMakeCredReq = ({ challenge, user, ...restOptions }) => ({
    ...restOptions,
    challenge: decode(challenge),
    user: {
        ...user,
        id: decode(user.id)
    }
});

export const preformatGetCredential = ({ challenge, timeout, rpId, id, userVerification  }) => ({
    rpId,
    userVerification,
    challenge: decode(challenge),
    allowCredentials: id.map((value) => ({
        type: 'public-key',
        id: decode(value)
    })),
});
