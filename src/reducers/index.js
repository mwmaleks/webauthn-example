import { combineReducers } from 'redux'
import {
    SET_EMAIL_VALIDATION,
    SET_APP_ERROR,
    LOGIN_START,
    LOGIN_END,
    LOGOUT,
    CHECK_SESSION_START,
    CHECK_SESSION_END,
} from '../actions'
import {
    REGISTER_START,
    REGISTER_END,
} from '../actions/register';

const errorState = (state = {}, action = {}) => {
    switch (action.type) {
        case SET_EMAIL_VALIDATION:
            return {
                isEmailError: action.isEmailError
            };
        case SET_APP_ERROR:
            return {
                isApplicationError: action.isApplicationError
            };
        default:
            return {};
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
    errorState,
    runLogin,
    runRegister,
    checkSession,
});

export default rootReducer
