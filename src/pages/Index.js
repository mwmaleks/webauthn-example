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
    const { errorState, runLogin, runRegister, checkSession } = state;
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
    } = checkSession;
    const {
        isApplicationError,
        isEmailError,
    } = errorState;

    return {
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
