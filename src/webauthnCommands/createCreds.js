import { preformatMakeCredReq } from './utils';

const createCredentials = (payload) => {
    const publicKey = preformatMakeCredReq(payload);

    return navigator.credentials.create({
        publicKey
    });
};

export default createCredentials;
