import React from 'react';
import FormDialog from './FormDialog';
import isEmail from 'validator/lib/isEmail';
import { runLogin } from '../actions/login';
import { setEmailError } from '../actions';

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
            <FormDialog
                title="Login"
                {...this.props}
                onAction={this.handleLogin}
                errorMessage={this.props.isEmailError ? errorMessage : null}
                onBlur={this.handleBlur}
            />
        );
    }
}

export default LoginWrapper;
