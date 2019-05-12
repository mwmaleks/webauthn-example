import request from './request';

const startRegister = (email) => request({
    httpMethod: 'post',
    url: `${window.API_URL}getAttestationChallenge`,
    withCredentials: true,
}, { email });

export default startRegister;
