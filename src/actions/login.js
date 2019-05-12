import logoutRequest from '../requests/logout';

// LOGIN
export const LOGIN_START = '@LOGIN_START';
export const LOGIN_END = '@LOGIN_END';
export const LOGOUT = '@LOGOUT';

const loginStart = () => ({
    type: LOGIN_START,
});

export const loginEnd = ({ isLoggedIn, email, error }) => ({
    type: LOGIN_END,
    isLoggedIn,
    email,
    error
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

const logout = () => ({
    type: LOGOUT
});

export const runLogout = () => (dispatch) => logoutRequest().then(() => dispatch(logout()));
