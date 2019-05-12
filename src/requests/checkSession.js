import request from './request';

const checkSession = () => {
    return request({
        httpMethod: 'post',
        url: `${window.API_URL}session/check`,
        withCredentials: true
    })
        .then(response => {
            const {
                serverTime,
                email,
            } = response.payload;
            if (serverTime && email) {
                return email;
            }

            return Promise.reject(new Error('not authorized'));
        });
};

export default checkSession;
