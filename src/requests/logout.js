import request from './request';

const logout = () => request({
    httpMethod: 'post',
    url: `${window.API_URL}logout`,
    withCredentials: true
})
// выходим в любом случае
.catch(_ => {});

export default logout;
