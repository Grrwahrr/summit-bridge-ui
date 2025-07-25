"use client";

import { useLightClientApi } from "@/providers/lightclient-api-provider";
import { usePolkadotExtension } from "@/providers/polkadot-extension-provider";
import { useEffect, useState } from "react";

export type AccountBalance = {
  free: bigint;
  reserved: bigint;
  frozen: bigint;
  flags: bigint;
  lastUpdated?: Date;
};

export function useAccountBalance() {
  const { api } = useLightClientApi();
  const { selectedAccount } = usePolkadotExtension();
  const [accountBalance, setAccountBalance] = useState<AccountBalance | null>(
    null,
  );

  useEffect(() => {
    if (!selectedAccount || !api) return;
    
    // Use type assertion to tell TypeScript about the structure
    const systemQuery = api.query as any;
    
    const subscription = systemQuery.System.Account.watchValue(
      selectedAccount.address,
      "best",
    ).subscribe((value: any) => {
      console.log("value", value);
      setAccountBalance({
        ...value.data,
        lastUpdated: new Date(),
      });
    });

    return () => {
      setAccountBalance(null);
      subscription?.unsubscribe();
    };
  }, [selectedAccount, api]);

  return accountBalance;
}
