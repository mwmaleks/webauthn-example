import React, { useState } from 'react';
import pt from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';

import { customTheme } from '../withRoot';

const handleSubmit = cb => event => {
    event.preventDefault();
    cb();
};

const EmailField = customTheme(TextField);

const FormDialog = ({
    isOpened,
    onClose,
    onAction,
    isEmailError,
    errorMessage,
    onBlur,
    title,
}) => {
    const [email, setEmail] = useState('');

    return (
        <Dialog open={isOpened} onClose={onClose}>
            <form onSubmit={handleSubmit(() => onAction(email))}>
                <DialogTitle id="form-login-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your email address here
                    </DialogContentText>
                    <EmailField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="Email Address"
                        type="email"
                        fullWidth
                        name="email"
                        autoComplete="email"
                        variant="outlined"
                        error={isEmailError}
                        helperText={errorMessage}
                        onChange={({target: { value: email }}) => setEmail(email)}
                        onBlur={() => onBlur(email)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="default">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(() => onAction(email))} color="secondary">
                        {title}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

FormDialog.propTypes = {
    isOpened: pt.bool.isRequired,
    onClose: pt.func.isRequired,
    onBlur: pt.func.isRequired,
    onAction: pt.func.isRequired,
    isEmailError: pt.bool,
    errorMessage: pt.string,
};

FormDialog.defaultProps = {
    isEmailError: false,
    errorMessage: '',
};

export default FormDialog;



