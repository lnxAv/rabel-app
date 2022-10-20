import Document, {
  DocumentContext,
  DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import React from 'react';
import { ServerStyleSheet } from 'styled-components';

import manifest from '../../manifest.json';
import splash from '../@styles/splashScreen';

function DocumentHead() {
  const titleDefault = manifest.name;
  const url = manifest.homepage_url;
  const { description } = manifest;
  const { author } = manifest;
  const keywords = '';
  const robots = '';

  return (
    <Head>
      {/* Important Meta Tags */}
      <meta charSet="utf-8" />
      <meta name="language" content="english" />
      <meta httpEquiv="content-type" content="text/html" />
      <meta name="author" content={author} />
      <meta name="designer" content={author} />
      <meta name="publisher" content={author} />
      {/* Search Engine Meta Tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robots} />
      <meta name="distribution" content="web" />
      {/* Application Meta Tags */}
      <meta name="application-name" content={titleDefault} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={titleDefault} />
      <meta name="description" content={description} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/icons/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#2B5797" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#000000" />
      {/* Link Meta Tags */}
      <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" />
      <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="manifest" href="/manifest.json" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#5bbad5" />
      <link rel="shortcut icon" href="/favicon.ico" />
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={titleDefault} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content="https://yourdomain.com/icons/android-chrome-192x192.png"
      />
      <meta name="twitter:creator" content={author} />
      {/* Facebook Meta Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={titleDefault} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={titleDefault} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content="https://yourdomain.com/icons/apple-touch-icon.png" />
      {/* Fonts */}
      <link
        rel="preload"
        href="/fonts/dotgothic16-regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/dotgothic16-regular.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/project_space.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/fonts/project_space.woff"
        as="font"
        type="font/woff"
        crossOrigin="anonymous"
      />
      {/* apple splash screen images */}
      {/*
        <link rel='apple-touch-startup-image' href='/images/apple_splash_2048.png' sizes='2048x2732' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1668.png' sizes='1668x2224' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1536.png' sizes='1536x2048' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1125.png' sizes='1125x2436' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_1242.png' sizes='1242x2208' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_750.png' sizes='750x1334' />
        <link rel='apple-touch-startup-image' href='/images/apple_splash_640.png' sizes='640x1136' />
        */}
      {/* -- XSplashScreen -- */}
      <style>{splash}</style>
    </Head>
  );
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          // Useful for wrapping the whole react tree
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
          // Useful for wrapping in a per-page basis
          enhanceComponent: (Component) => Component,
        });
      const initialProps = await Document.getInitialProps(ctx);
      // Run the React rendering logic synchronously
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <DocumentHead />
        <body>
          <Main />
          <NextScript />
          <div id="globalLoader">
            <div className="loader" />
          </div>
        </body>
      </Html>
    );
  }
}
