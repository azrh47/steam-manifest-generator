import Head from 'next/head';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Nerai Manifest Generator</title>
        <meta name="description" content="Steam manifest generator Discord bot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#0a0a0a',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        {children}
      </body>
    </html>
  );
}
