import React from 'react';
import pt from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

// components
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import Done from '@material-ui/icons/Done';

// colors
import yellow from '@material-ui/core/colors/yellow';

const noop = () => {};

const styles = theme => ({
    root: {
        flexGrow: 1,
        margin: '0 auto',
        maxWidth: '400px',
    },
    item: {
        padding: theme.spacing(2),
        textAlign: 'center',
        margin: theme.spacing.unit,
        position: 'relative',
    },
    buttonProgress: {
        color: yellow[500],
        marginLeft: '10px',
    },
    buttonDone: {
        marginLeft: '5px',
    },
    loginWrapper: {
        display: 'flex'
    }
});

const ActionButton = ({
    variant,
    isLoading,
    isSuccess,
    onClick,
    classes,
    text,
    disabled,
}) => (
    <Button
        color="primary"
        variant={variant}
        disabled={disabled}
        onClick={isLoading ? noop : onClick}
    >
        {!isSuccess && !isLoading && text}
        {(isLoading || isSuccess)  &&
            <div className={classes.loginWrapper}>
                {text}
                {isLoading
                    ? <CircularProgress size={24} className={classes.buttonProgress} />
                    : <Done color="secondary" className={classes.buttonDone} />
                }
            </div>
        }
    </Button>
);

ActionButton.propTypes = {
    isLoading: pt.bool.isRequired,
    isSuccess: pt.bool.isRequired,
    onClick: pt.func.isRequired,
    classes: pt.object.isRequired,
    text: pt.string.isRequired,
};

const Buttons = ({
    onClickLogin,
    onClickRegister,
    classes,
    isLoginLoading,
    isLoggedIn,
    isRegistered,
    isRegisterLoading
}) => {
    return (
        <Grid className={classes.root} spacing={10}>
            <Grid item xs={12} className={classes.item}>
                <ActionButton
                    variant="outlined"
                    text="LOGIN"
                    onClick={onClickLogin}
                    classes={classes}
                    isLoading={isLoginLoading}
                    isSuccess={isLoggedIn && !isRegistered}
                    disabled={isRegisterLoading || isRegistered}
                />
            </Grid>
            <Grid item xs={12} className={classes.item}>
                <ActionButton
                    variant={isRegisterLoading || isRegistered ? "outlined" : "contained"}
                    text="REGISTER"
                    onClick={onClickRegister}
                    classes={classes}
                    isLoading={isRegisterLoading}
                    isSuccess={isRegistered}
                    disabled={isLoginLoading || isLoggedIn && !isRegistered}
                />
            </Grid>
        </Grid>
    )
};

Buttons.propTypes = {
    onClickLogin: pt.func.isRequired,
    onClickRegister: pt.func.isRequired,
    classes: pt.object.isRequired,
    isLoginLoading: pt.bool.isRequired,
    isLoggedIn: pt.bool.isRequired,
    isRegistered: pt.bool.isRequired,
    isRegisterLoading: pt.bool.isRequired,
};

export default withStyles(styles)(Buttons);
