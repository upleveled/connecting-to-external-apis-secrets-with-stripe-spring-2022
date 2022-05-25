import { Global } from '@emotion/react';
import Head from 'next/head';
import myGlobalStyles from '../shared/globalStyles';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Global styles={myGlobalStyles} />
      <Head>
        <title>UpLeveled - stripe</title>
        <link rel="icon" href="/images/logo.png" />
      </Head>
      <header>
        <img src="/images/logo.svg" alt="UpLeveled" />
      </header>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
