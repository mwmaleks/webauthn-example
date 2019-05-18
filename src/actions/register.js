import startRegister from '../requests/startRegister';
import createCredentials from '../webauthnCommands/createCreds';
import finishRegister from '../requests/finishRegister';

// utils
import publicKeyCredToJSON from '../webauthnCommands/publicKeyCredToJSON';

import { loginEnd } from './login';

// common actions
import { error } from './';

//REGISTER
export const REGISTER_START = '@REGISTER_START';
export const REGISTER_END = '@REGISTER_END';

const registerStart = () => ({
    type: REGISTER_START,
});

const registerEnd = ({ isRegistered, email, error }) => ({
    type: REGISTER_END,
    isRegistered,
    email,
    error,
});

export const runRegister = (email) => (dispatch) => {
    return dispatch(getAttestationChallenge(email));
};

const getAttestationChallenge = (email) => (dispatch) => {
    dispatch(registerStart());

    return startRegister(email)
        .then(createCredentials)
        .then(publicKeyCredToJSON)
        .then(finishRegister)
        .then(result => {
            if (!result.ok) {
                return Promise.reject();
            }

            return new Promise((resolve => {
                setTimeout(() => {
                    dispatch(registerEnd({ isRegistered: true, email, error: null }));
                    dispatch(loginEnd({ isLoggedIn: true, email, error: null }));
                    resolve();
                }, 500);
            }))
        })
        .catch(() => dispatch(error(true)));
};
