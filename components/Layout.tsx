import React from "react";
import Head from "next/head";
import { Footer, Header } from "../components";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="layout">
      <Head>
        <title>Maji Store</title>
      </Head>

      <header>
        <Header />
      </header>

      <main className="main-container">{children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
