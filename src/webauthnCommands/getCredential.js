import { preformatGetCredential } from './utils';

const getCredential = (payload) => navigator.credentials.get({
    publicKey: preformatGetCredential(payload)
});

export default getCredential;
