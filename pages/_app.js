import RootLayout from "@/components/RootLayout";
import { StateProvider } from "@/context/stateContext";
import "@/styles/globals.scss";

export default function App({ Component, pageProps }) {
  return (
    <StateProvider>
      <RootLayout>
        <Component {...pageProps} />
      </RootLayout>
    </StateProvider>
  );
}
