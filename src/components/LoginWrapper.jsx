import React from 'react';
import Login from './Login';
import isEmail from 'validator/lib/isEmail';
import { setEmailError, runLogin } from '../actions';

const errorMessage = 'Please, enter valid email address';

class LoginWrapper extends React.PureComponent {
    handleLogin = (email) => {
        const {
            dispatch,
            onClose,
        } = this.props;

        if (isEmail(email)) {
            onClose();
            dispatch(runLogin(email));
            return;
        }

        dispatch(setEmailError(true));
    };

    handleBlur = (email) => {
        const { dispatch } = this.props;

        if (isEmail(email)) {
            dispatch(setEmailError(false));
            return;
        }

        dispatch(setEmailError(true));
    };

    render() {
        return (
            <Login
                {...this.props}
                onLogin={this.handleLogin}
                errorMessage={this.props.isEmailError ? errorMessage : null}
                onBlur={this.handleBlur}
            />
        );
    }
}

export default LoginWrapper;
