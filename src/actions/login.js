import logoutRequest from '../requests/logout';
import startSignIn from '../requests/startSignIn';
import finishSignIn from '../requests/finishSignIn';

// common actions
import { error } from './';
import { matchMediaOnInit, matchMedia } from './matchMedia';

// commands
import getCredential from '../webauthnCommands/getCredential';

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

const getLoginChallenge = () => (dispatch) => {
    dispatch(loginStart());
    startSignIn()
        .then(getCredential)
        .then(finishSignIn)
        .then(payload => {
            if (!payload.ok) {
                return Promise.reject();
            }

            return new Promise((resolve => {
                setTimeout(() => {
                    resolve(dispatch(loginEnd({ isLoggedIn: true, email: payload.email })));
                }, 500);
            }))
        })
        .catch(() => dispatch(error(true)))

};

export const runLogin = () => (dispatch) => {
    return dispatch(getLoginChallenge());
};

const logout = () => ({
    type: LOGOUT
});

export const runLogout = () => (dispatch) => logoutRequest()
    .then(() => dispatch(logout()))
    .catch(() => dispatch(error(true)));

export const pwaAutoLogin = () => (dispatch) => {
    const isFullScreen = matchMediaOnInit();
    if (isFullScreen) {
        dispatch(runLogin());
    }

    return dispatch(matchMedia(isFullScreen));
}
