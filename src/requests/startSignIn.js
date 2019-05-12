import request from './request';

const startSignIn = () => request({
    httpMethod: 'post',
    url: `${window.API_URL}signin/begin`,
    withCredentials: true,
    // todo handle errors
}).then(({ payload }) => payload);


export default startSignIn;
