import { encode } from './base64';

/**
 * Converts PublicKeyCredential into serialised JSON
 * @param  {Object} pubKeyCred
 * @return {Object} - JSON encoded publicKeyCredential
 */
const publicKeyCredToJSON = (pubKeyCred) => {
    if (pubKeyCred instanceof Array) {
        let arr = [];

        for (let i of pubKeyCred)
            arr.push(publicKeyCredToJSON(i));

        return arr;
    }

    if (pubKeyCred instanceof ArrayBuffer) {
        return encode(pubKeyCred);
    }

    if (pubKeyCred instanceof Object) {
        let obj = {};

        for (let key in pubKeyCred) {
            obj[key] = publicKeyCredToJSON(pubKeyCred[key])
        }

        return obj;
    }

    return pubKeyCred
};

export default publicKeyCredToJSON;
