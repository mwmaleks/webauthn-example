import checkSessionRequest from '../requests/checkSession';
import { loginEnd } from './login';

export const SET_EMAIL_VALIDATION = '@SET_EMAIL_VALIDATION';

// LOGIN
export const LOGIN_START = '@LOGIN_START';
export const LOGIN_END = '@LOGIN_END';
export const LOGOUT = '@LOGOUT';
export const CHECK_SESSION_START = '@CHECK_SESSION_START';
export const CHECK_SESSION_END = '@CHECK_SESSION_END';

export const setEmailError = (isEmailError) => ({
    type: SET_EMAIL_VALIDATION,
    isEmailError,
});

export const checkSessionStart = () => ({
    type: CHECK_SESSION_START,
});

export const checkSessionEnd = (email) =>({
    type: CHECK_SESSION_END,
    email
});

export const checkSession = () => (dispatch) => {
    dispatch(checkSessionStart());

    return checkSessionRequest()
        .then((email) => {
            dispatch(checkSessionEnd(email));
            dispatch(loginEnd({ isLoggedIn: true, email, error: null }));
        })
        .catch(() => dispatch(checkSessionEnd(null)));
};
