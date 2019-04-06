import React, { useState, useEffect } from 'react';
import pt from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import withRoot from '../withRoot';

// components
import LoginWrapper from '../components/LoginWrapper';
import RegisterWrapper from '../components/RegisterWrapper';
import Buttons from '../components/Buttons';
import AppBarBlock from '../components/AppBarBlock'

// actions
import { checkSession } from '../actions';

// images
import happyCat from '../images/cat-happy-yellow.png';
import happyAss from '../images/cat-ass-yellow.png';

const styles = theme => ({
    root: {
        backgroundColor: '#303030',
        height: '100%',
    },
    nonAuth: {
        textAlign: 'center',
        paddingTop: theme.spacing(20),
    },
    auth: {
        width: '100%',
        height: '100%',
    },
    happyCat: {
        height: '70%',
        minWidth: '400px',
        minHeight: '400px',
    },
    catAss: {
        width: '50%',
        minWidth: '400px',
        minHeight: '400px',
    },
    imageWrapper: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    }
});

function Main(props) {
    // fixme es-lint
    const { classes, dispatch, isEmailError, isLoginLoading, isRegisterLoading,
        isLoggedIn, isRegistered, email } = props;
    const [isOpenedLogin, setOpenLogin] = useState(false);
    const [isOpenedRegister, setOpenRegister] = useState(false);
    const [isLoggedInSate, setLoginState] = useState(false);
    const [isCheckedSession, setChecked] = useState(false);
    const handleOpenLogin = () => setOpenLogin(!isOpenedLogin);
    const handleOpenRegister = () => setOpenRegister(!isOpenedRegister);

    useEffect(() => {
        if (!isCheckedSession) {
            dispatch(checkSession());
            setChecked(true);
        }

        if (isLoggedIn && !isLoggedInSate) {
            setTimeout(() => {
                setLoginState(true);
            }, 1500);

            return;
        }

        if (!isLoggedIn && isLoggedInSate) {
            setTimeout(()=> {
                setLoginState(false);
            }, 2000);
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
                <RegisterWrapper
                    isOpened={isOpenedRegister}
                    onClose={() => setOpenRegister(false)}
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
                    isRegisterLoading={isRegisterLoading}
                    isLoggedIn={isLoggedIn}
                    isRegistered={isRegistered}
                />
            </div> : (!isLoggedIn ?
                <div className={classes.imageWrapper}>
                    <img src={happyAss} className={classes.happyCat} alt="Happy Ass"/>
                </div> : <div className={classes.auth}>
                <AppBarBlock email={email} dispatch={dispatch}/>
                <div className={classes.imageWrapper}>
                    <img src={happyCat} className={classes.happyCat} alt="Happy Cat"/>
                </div>
            </div>)
        }
    </div>);
}

Main.propTypes = {
    classes: pt.object.isRequired,
    dispatch: pt.func.isRequired,
    isEmailError: pt.bool.isRequired,
    isLoginLoading: pt.bool.isRequired,
    isRegisterLoading: pt.bool.isRequired,
    isLoggedIn: pt.bool.isRequired,
    email: pt.bool,
};

export default withRoot(withStyles(styles)(Main));
