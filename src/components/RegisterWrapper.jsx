import React from 'react';
import FormDialog from './FormDialog';
import isEmail from 'validator/lib/isEmail';
import { setEmailError, runRegister } from '../actions';

const errorMessage = 'Please, enter valid email address';

class LoginWrapper extends React.PureComponent {
    handleRegister = (email) => {
        const {
            dispatch,
            onClose,
        } = this.props;

        if (isEmail(email)) {
            onClose();
            dispatch(runRegister(email));
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
                title="Register"
                {...this.props}
                onAction={this.handleRegister}
                errorMessage={this.props.isEmailError ? errorMessage : null}
                onBlur={this.handleBlur}
            />
        );
    }
}

export default LoginWrapper;
