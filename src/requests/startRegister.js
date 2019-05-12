import request from './request';

const startRegister = (email) => request({
    httpMethod: 'post',
    url: `${window.API_URL}credential/begin`,
    withCredentials: true,
}, { email });

export default startRegister;
