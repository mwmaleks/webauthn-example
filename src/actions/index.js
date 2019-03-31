export const SET_EMAIL_VALIDATION = '@SET_EMAIL_VALIDATION';

// LOGIN
export const LOGIN_START = '@LOGIN_START';
export const LOGIN_END = '@LOGIN_END';
export const LOGOUT = '@LOGOUT';

//REGISTER
export const REGISTER_START = '@REGISTER_START';
export const REGISTER_END = '@REGISTER_END';

export const setEmailError = (isEmailError) => ({
    type: SET_EMAIL_VALIDATION,
    isEmailError,
});

const loginStart = () => ({
    type: LOGIN_START,
});

const registerStart = () => ({
    type: REGISTER_START,
});

const loginEnd = ({ isLoggedIn, email, error }) => ({
    type: LOGIN_END,
    isLoggedIn,
    email,
    error
});

const registerEnd = ({ isRegistered, email, error }) => ({
    type: REGISTER_END,
    isRegistered,
    email,
    error,
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

const getAttestationChallenge = (email) => (dispatch) => {
    dispatch(registerStart());
    // fixme registration simulation
    return new Promise((resolve => {
        setTimeout(() => {
            resolve(dispatch(registerEnd({ isRegistered: true, email, error: null })));
        }, 3000);
    }))
};

export const runLogin = (email) => (dispatch) => {
    return dispatch(getLoginChallenge(email));
};

export const runRegister = (email) => (dispatch) => {
    return dispatch(getAttestationChallenge(email));
};

export const runLogout = () => ({
    type: LOGOUT
});
