import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';
import { CssBaseline } from '@geist-ui/core';

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
