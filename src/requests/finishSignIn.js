import request from './request';
import publicKeyCredToJSON from '../webauthnCommands/publicKeyCredToJSON';

const finishSignIn = (attestationObject) => request({
    httpMethod: 'post',
    url: `${window.API_URL}signin/finish`,
    withCredentials: true,
}, {
    assertion: publicKeyCredToJSON(attestationObject),
});

export default finishSignIn;
