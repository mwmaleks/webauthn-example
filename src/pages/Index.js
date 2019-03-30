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
    const { isEmailError, runLogin } = state;
    const {
        isLoginLoading,
        email,
        isLoggedIn,
    } = runLogin;

    return {
        isEmailError,
        isLoginLoading,
        email,
        isLoggedIn,
    };
};

export default connect(mapStateToProps)(Index);
