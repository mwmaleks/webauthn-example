import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import yellow from '@material-ui/core/colors/yellow';
import green from '@material-ui/core/colors/green';
import CssBaseline from '@material-ui/core/CssBaseline';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: yellow[300],
      main: yellow[500],
      dark: yellow[700],
    },
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
  },
});

const themeCustom = createMuiTheme({
  palette: {
    secondary: {
      light: yellow[300],
      main: yellow[500],
      dark: yellow[700],
    },
    primary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
  },
});


export function customTheme(Component) {
  function customTheme(props) {
    return (
        <ThemeProvider theme={themeCustom}>
          <Component {...props} />
        </ThemeProvider>
    );
  }

  return customTheme;
}

function withRoot(Component) {
  function WithRoot(props) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
