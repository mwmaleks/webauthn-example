import request from './request';

const checkSession = () => {
    return request({
        httpMethod: 'post',
        url: `${window.API_URL}checkSession`
    })
        .then(response => {
            const {
                serverTime,
                email,
            } = response;
            if (serverTime && email) {
                return email;
            }

            return Promise.reject(new Error('not authorized'));
        });
};

export default checkSession;
