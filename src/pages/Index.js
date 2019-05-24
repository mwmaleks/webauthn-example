import React from 'react';
// import pt from 'prop-types';
import { connect } from 'react-redux'

import Main from '../containers/Main';

class Index extends React.PureComponent {

    render() {
        return (<Main {...this.props} />);
    }
}

const mapStateToProps = (state) => {
    const { errorState, runLogin, runRegister, main } = state;
    const {
        isLoginLoading,
        email,
        isLoggedIn = false,
    } = runLogin;
    const {
        isRegisterLoading,
        email: registeredEmail,
        isRegistered,
    } = runRegister;
    const {
        isCheckingSession = true,
        email: sessionEmail,
        isFullscreen,
    } = main;
    const {
        isApplicationError,
        isEmailError,
    } = errorState;

    return {
        isFullscreen,
        isCheckingSession,
        isEmailError,
        isApplicationError,
        isLoginLoading,
        isRegisterLoading,
        email: registeredEmail || email || sessionEmail,
        isLoggedIn,
        isRegistered,
    };
};

export default connect(mapStateToProps)(Index);
