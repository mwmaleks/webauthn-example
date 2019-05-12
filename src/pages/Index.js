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
    const { isEmailError, runLogin, runRegister, checkSession } = state;
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
    // fixme use only correct emails without mocks
    const {
        isCheckingSession = true,
        email: sessionEmail,
    } = checkSession;

    return {
        isCheckingSession,
        isEmailError,
        isLoginLoading,
        isRegisterLoading,
        email: registeredEmail || email || sessionEmail,
        isLoggedIn,
        isRegistered,
    };
};

export default connect(mapStateToProps)(Index);
