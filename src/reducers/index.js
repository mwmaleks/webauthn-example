import { combineReducers } from 'redux'
import {
    SET_EMAIL_VALIDATION,
    LOGIN_START,
    LOGIN_END,
    LOGOUT,
    REGISTER_START,
    REGISTER_END,
    CHECK_SESSION_START,
    CHECK_SESSION_END,
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
const runRegister = (state = {}, action) => {
    switch (action.type) {
        case REGISTER_START:
            return {
                ...state,
                isRegisterLoading: true,
                isLoggedIn: false,
                isRegistered: false,
                error: null,
            };
        case REGISTER_END:
            return {
                isRegisterLoading: false,
                isLoggedIn: action.isRegistered,
                isRegistered: action.isRegistered,
                email: action.email,
                error: action.error,
            };
        default:
            return {
                isLoginLoading: false,
                isLoggedIn: false,
                isRegistered: false,
                error: null,
                email: '',
            };
    }
};

const checkSession = (state = {}, action) => {
    switch (action.type) {
        case CHECK_SESSION_START:
            return {
                ...state,
                isCheckingSession: true,
            };
        case CHECK_SESSION_END:
            return {
                ...state,
                isCheckingSession: false,
                isLoggedIn: Boolean(action.email),
                email: action.email,
            };
        default:
            return {
                isCheckingSession: true,
                isLoggedIn: false,
                email: null,
            };
    }
};

const rootReducer = combineReducers({
    isEmailError,
    runLogin,
    runRegister,
    checkSession,
});

export default rootReducer
