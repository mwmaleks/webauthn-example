import { combineReducers } from 'redux'
import {
    SET_EMAIL_VALIDATION,
    LOGIN_START,
    LOGIN_END,
    LOGOUT,
} from '../actions'

const isEmailError = (state = {}, action) => {
    switch (action.type) {
        case SET_EMAIL_VALIDATION:
            return action.isEmailError;
        default:
            return false;
    }
};

const runLogin = (state = {}, action) => {
    switch (action.type) {
        case LOGIN_START:
            return {
                ...state,
                isLoginLoading: true,
                isLoggedIn: false,
            };
        case LOGIN_END:
            return {
                isLoginLoading: false,
                isLoggedIn: action.isLoggedIn,
                email: action.email,
            };
        case LOGOUT:
        default:
            return {
                isLoginLoading: false,
                isLoggedIn: false,
                email: '',
            };
    }
};

const rootReducer = combineReducers({
    isEmailError,
    runLogin,
});

export default rootReducer
