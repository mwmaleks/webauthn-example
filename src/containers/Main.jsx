import React, { useState, useEffect } from 'react';
import pt from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';

// components
import LoginWrapper from '../components/LoginWrapper';
import Buttons from '../components/Buttons';
import AppBarBlock from '../components/AppBarBlock'

const styles = theme => ({
    root: {
        backgroundColor: '#303030',
        height: '100%',
    },
    nonAuth: {
        textAlign: 'center',
        paddingTop: theme.spacing(20),
        color: 'white',
    }
});

function Main(props) {
    const { classes, dispatch, isEmailError, isLoginLoading, isLoggedIn, email } = props;
    const [isOpenedLogin, setOpenLogin] = useState(false);
    const [isOpenedRegister, setOpenRegister] = useState(false);
    const [isLoggedInSate, setLoginState] = useState(false);
    const handleOpenLogin = () => setOpenLogin(!isOpenedLogin);
    const handleOpenRegister = () => setOpenRegister(!isOpenedRegister);

    useEffect(() => {
        if (isLoggedIn && !isLoggedInSate) {
            setTimeout(() => {
                setLoginState(true);
            }, 1500);

            return;
        }

        if (!isLoggedIn && isLoggedInSate) {
            setLoginState(false);
        }
    });

    return (<div className={classes.root}>
        {
            !isLoggedInSate ? <div className={classes.nonAuth}>
                <LoginWrapper
                    isOpened={isOpenedLogin}
                    onClose={() => setOpenLogin(false)}
                    dispatch={dispatch}
                    isEmailError={isEmailError}
                />
                <Typography variant="h4" gutterBottom color={'primary'}>
                    WebAuthn Demo
                </Typography>
                <Buttons
                    onClickLogin={handleOpenLogin}
                    onClickRegister={handleOpenRegister}
                    isLoginLoading={isLoginLoading}
                    isLoggedIn={isLoggedIn}
                />
            </div> : <AppBarBlock email={email} dispatch={dispatch}/>
        }
    </div>);
}

Main.propTypes = {
    classes: pt.object.isRequired,
    dispatch: pt.func.isRequired,
    isEmailError: pt.bool.isRequired,
    isLoginLoading: pt.bool.isRequired,
    isLoggedIn: pt.bool.isRequired,
    email: pt.bool,
};

export default withRoot(withStyles(styles)(Main));
