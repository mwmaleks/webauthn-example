import React from 'react';
import pt from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

const handleSubmit = cb => event => {
    event.preventDefault();
    cb();
};

const UserChoice = ({
    isOpened,
    onClose,
    onAction,
}) => {
    return (
        <Dialog open={isOpened} onClose={onClose}>
            <form onSubmit={handleSubmit(() => onAction())}>
                <DialogTitle id="form-login-title">Use fingerprint login?</DialogTitle>
                <DialogActions>
                    <Button onClick={onClose} color="default">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(() => onAction())} color="secondary">
                        Accept
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

UserChoice.propTypes = {
    isOpened: pt.bool.isRequired,
    onClose: pt.func.isRequired,
    onAction: pt.func.isRequired,
};

export default UserChoice;



