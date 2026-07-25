import RootLayout from "@/components/RootLayout";
import { StateProvider } from "@/context/stateContext";
import Head from "next/head";
import "@/styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <StateProvider>
      <RootLayout>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, viewport-fit=cover"
          />
          <meta name="theme-color" content="#fafbf6" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
        </Head>
        <Component {...pageProps} />
      </RootLayout>
    </StateProvider>
  );
}
