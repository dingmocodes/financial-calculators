'use client';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import NaNJauneMidiBold from '../public/fonts/NaNJaune-MidiBold.ttf';
import SatoshiVariable from '../public/fonts/Satoshi-Variable.ttf';


const theme = createTheme({
  palette: {
    primary: {
      main: '#142a31', // dark blue-green
      light: '#43545a',
      dark: '#0e1d22',
      contrastText: '#fff',
    },
    secondary: {
      main: '#00a884', // vibrant medium green
      light: '#f7f9f8', // pale grey
      dark: '#00a884',
      contrastText: '#5c6260',
    },
    background: {default: '#fff'}
  },
  typography: {
    fontFamily: 'Satoshi-Variable, NaNJaune-MidiBold, Arial',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'NaNJaune-MidiBold';
          font-style: normal;
          font-display: swap;
          font-weight: 700;
          src: url(${NaNJauneMidiBold}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }

        @font-face {
          font-family: 'Satoshi-Variable';
          font-style: normal;
          font-display: swap;
          font-weight: 400, 500, 700;
          src: url(${SatoshiVariable}) format('truetype');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
    },
  },
  spacing: 5,
});

export default responsiveFontSizes(theme);
