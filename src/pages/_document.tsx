import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import { CssBaseline } from '@geist-ui/react';

class AppDocument extends Document {
  static async getInitialProps(context: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(context);
    const styles = CssBaseline.flush();

    return {
      ...initialProps,
      styles: [
        <>
          {initialProps.styles}
          {styles}
        </>,
      ],
    };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preload" href="/api/servers" as="fetch" crossOrigin="anonymous" />
          <link rel="preload" href="/api/servers/home" as="fetch" crossOrigin="anonymous" />
          <link rel="preload" href="/api/filters" as="fetch" crossOrigin="anonymous" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />

          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/icon.png"></link>
          <meta name="theme-color" content="#0070f3" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
