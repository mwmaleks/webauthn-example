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
    const { isEmailError, runLogin, runRegister } = state;
    const {
        isLoginLoading,
        email,
        isLoggedIn = false,
    } = runLogin;
    const {
        isRegisterLoading,
        email: registeredEmail,
        isLoggedIn: isLoggedInWhileRegistration = false,
        isRegistered,
    } = runRegister;

    return {
        isEmailError,
        isLoginLoading,
        isRegisterLoading,
        email: registeredEmail || email,
        isLoggedIn: isLoggedInWhileRegistration || isLoggedIn,
        isRegistered,
    };
};

export default connect(mapStateToProps)(Index);
