import '@mantine/core/styles.css';
import './globals.css';

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  createTheme,
} from '@mantine/core';

const greenGlideTheme = createTheme({
  primaryColor: 'green',
  colors: {
    green: [
      '#00FF56',
      '#00CC56',
      '#00993F',
      '#007F3F',
      '#00602E',
      '#00502E',
      '#00381F',
      '#0C3523',
      '#163326',
      '#20332A',
    ],
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={greenGlideTheme}>{children}</MantineProvider>
      </body>
    </html>
  );
}
