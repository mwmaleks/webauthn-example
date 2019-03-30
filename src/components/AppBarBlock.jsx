import React, { useState } from 'react';
import pt from 'prop-types';

// hoc
import { withStyles } from '@material-ui/core/styles';

// components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

// actions

import { runLogout } from '../actions';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
};

const AppBarBlock = (props) => {
    const { classes, email, dispatch } = props;
    const [anchorEl, setAnchorEl] = useState(null);
    const isOpened = Boolean(anchorEl);
    const handleOpen = (event = {}) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogout = () => {
        setAnchorEl(null);
        dispatch(runLogout());
    };

    return (
        <AppBar position="fixed">
            <Toolbar>
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" className={classes.grow}>
                    WebAuthn Demo
                </Typography>
                <div>
                    <IconButton
                        aria-owns={isOpened ? 'menu-appbar' : undefined}
                        aria-haspopup="true"
                        color="inherit"
                        onClick={handleOpen}
                    >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={isOpened}
                        onClose={handleClose}
                    >
                        <MenuItem disabled>{email}</MenuItem>
                        <MenuItem onClick={handleLogout}>LOGOUT</MenuItem>
                    </Menu>
                </div>
            </Toolbar>
        </AppBar>
    );
};

AppBarBlock.propTypes = {
    classes: pt.object.isRequired,
    dispatch: pt.func.isRequired,
    email: pt.string,
};

AppBarBlock.defaultProps = {
    email: '',
};

export default withStyles(styles)(AppBarBlock);
