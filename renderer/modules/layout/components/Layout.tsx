import React from 'react';
import Head from 'next/head';
import { Header } from './Header';
import { Footer } from './Footer';

export function Layout({
  children,
  metaDescription = 'Your boilerplate for your frontend application'
}: {
  children: React.ReactNode;
  metaDescription?: string;
}): React.ReactElement {
  return (
    <React.Fragment>
      <Head>
        <title>Web3 | {metaDescription}</title>
        <meta name="description" content={metaDescription} />
        <link rel="icon" href={'/images/logo.png'} />
      </Head>
      <div className="body">
        <Header />
        <div className="main">{children}</div>
        <Footer />
      </div>
      <style jsx>{`
        .body {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
          max-width: 100%;
          margin: 0 auto;
        }

        .main {
          max-width: 1400px;
          padding: 30px;
          margin: 0 auto;
        }
      `}</style>
    </React.Fragment>
  );
}
