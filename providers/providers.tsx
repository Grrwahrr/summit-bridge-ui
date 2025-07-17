"use client";

import { ThemeProvider } from "./theme-provider";
import { ExtensionProvider } from "./polkadot-extension-provider";
import { LightClientApiProvider } from "./lightclient-api-provider";
import { EthereumProvider } from "./ethereum-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <ExtensionProvider>
        <LightClientApiProvider>
          <EthereumProvider>{children}</EthereumProvider>
        </LightClientApiProvider>
      </ExtensionProvider>
    </ThemeProvider>
  );
}
