import request from './request';
import publicKeyCredToJSON from '../webauthnCommands/publicKeyCredToJSON';

const finishRegister = () => (attestationObject) => request({
    httpMethod: 'post',
    url: `${window.API_URL}finishAttestation`,
    withCredentials: true,
}, {
    attestation: publicKeyCredToJSON(attestationObject),
});

export default finishRegister;
