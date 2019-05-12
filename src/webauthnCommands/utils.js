import { decode } from './base64';

export const preformatMakeCredReq = ({ challenge, user, ...restOptions }) => ({
    ...restOptions,
    challenge: decode(challenge),
    user: {
        ...user,
        id: decode(user.id)
    }
});

