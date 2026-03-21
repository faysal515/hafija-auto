import type { AppProps } from "next/app";
import Layout from "@/components/Layout";
import "@/globals.css";

// Pages can set `noLayout = true` to skip the main site nav/header
type PageWithLayout = AppProps["Component"] & { noLayout?: boolean };

export default function App({ Component, pageProps }: AppProps) {
  const noLayout = (Component as PageWithLayout).noLayout;
  if (noLayout) return <Component {...pageProps} />;
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
