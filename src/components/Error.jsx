import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// images
import errorCat from '../images/error_cat.png';

// styles
const styles = {
    errorWrapper: {
        display: 'flex',
        justifyContent: 'center',
    },
    errorText: {
        marginTop: '100px',
    },
    errorCat: {
        position: 'absolute',
        bottom: '0',
        maxWidth: '360px'
    }
};

const Error = ({ classes }) => (<div className={classes.errorWrapper}>
    <Typography variant="h4" color="primary"  className={classes.errorText}> Some error occurs</Typography>
    <img src={errorCat} className={classes.errorCat} alt="Error cat" />
</div>);

export default withStyles(styles)(Error);
