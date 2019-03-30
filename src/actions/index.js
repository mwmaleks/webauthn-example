export const SET_EMAIL_VALIDATION = '@SET_EMAIL_VALIDATION';
export const LOGIN_START = '@LOGIN_START';
export const LOGIN_END = '@LOGIN_END';
export const LOGOUT = '@LOGOUT';

export const setEmailError = (isEmailError) => ({
    type: SET_EMAIL_VALIDATION,
    isEmailError,
});

const loginStart = () => ({
    type: LOGIN_START,
});

const loginEnd = ({ isLoggedIn, email }) => ({
    type: LOGIN_END,
    isLoggedIn,
    email
});

const getLoginChallenge = (email) => (dispatch) => {
    dispatch(loginStart());
    // fixme login simulation
    return new Promise((resolve => {
        setTimeout(() => {
            resolve(dispatch(loginEnd({ isLoggedIn: true, email })));
        }, 3000);
    }))
};

export const runLogin = (email) => (dispatch) => {
    return dispatch(getLoginChallenge(email));
};

export const runLogout = () => ({
    type: LOGOUT
});
