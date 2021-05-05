import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import appTheme from '../src/gatsby-theme-material-ui-top-layout/theme';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
export const decorators = [(Story) => <ThemeProvider theme={appTheme}><Story /></ThemeProvider>];
