# Summit Bridge UI

A frontend to aggregate cross-chain bridge quotes directly via TypeScript SDKs (no REST needed).

## Project Structure

- `app/`: Main application files including layout and page components.  
- `components/`: UI components like `PolkadotLogo`, `Footer`, and `Nav`.  
- `providers/`: Context providers for themes, Polkadot extensions, and blockchain connections.  
- `hooks/`: Example hooks with subscriptions (e.g. wallet/provider state).  
- `lib/`: Utility functions (e.g. formatting, conversions).  

## Installation

```bash
pnpm install
pnpm dev
````

## Overview

Summit Bridge UI queries current swap quotes from multiple bridge SDKs:

* **Wormhole Connect** (via `@wormhole-foundation/sdk` + plugins)
* **Rhino.fi** (via their official TypeScript SDK)

Quotes are fetched client-side over TypeScript, aggregated, and displayed in the UI.

---

## Integrating Wormhole

Use `@wormhole-foundation/sdk` to initialize and fetch quotes:

```ts
import { wormhole, bestRoute, TokenId, WormholeTransfer } from '@wormhole-foundation/sdk';
import evm from '@wormhole-foundation/sdk/evm';
import solana from '@wormhole-foundation/sdk/solana';

const wh = await wormhole('Mainnet', [evm, solana]);
const transfer: WormholeTransfer = {
  fromChain: 'Arbitrum',
  fromToken: TokenId.fromString('Arbitrum:...USDC'), // USDC on Arbitrum
  toChain: 'Solana',
  toToken: TokenId.fromString('Solana:...USDC'),     // USDC on Solana
  amount: BigInt(5000 * 10**6),
};
const quote = await bestRoute.quote(transfer);
if (quote.success) {
  console.log('Wormhole receive:', quote.outputAmount.toString());
}
```

---

## Integrating Rhino.fi

Use the Rhino SDK to request bridge quotes:

```ts
import { RhinoSdk, SupportedChains, SupportedTokens } from '@rhino.fi/sdk';

const sdk = new RhinoSdk({ apiKey: process.env.RHINO_API_KEY });
const chainIn = SupportedChains.ARBITRUM;
const chainOut = SupportedChains.SOLANA;
const token = SupportedTokens.USDC;

const publicQuote = await sdk.getBridgeQuote({
  chainIn, chainOut, tokenIn: token, amount: '5000', mode: 'pay'
});
console.log('Rhino public quote:', publicQuote.receiveAmount);
```

---

## Usage Flow

1. User selects:

  * Source/destination chains (e.g. Arbitrum → Solana)
  * Token (e.g. USDC)
  * Amount (e.g. 5,000 USDC)

2. On change, trigger:

  * Wormhole SDK quote (`bestRoute.quote`)
  * Rhino SDK public quote (`getBridgeQuote`)

3. Display aggregated results:

  * Estimated receive amount
  * Fees
  * Route (Wormhole)
  * Expiry/quote validity

---

## Notes & Tips

* SDKs require specific chain/token IDs; Rhino provides lists in `SupportedChains`, `SupportedTokens` but better to fetch live config ([Wormhole][3], [rhino.fi - Docs][4], [rhino.fi - Docs][5]).
* Handle quoting errors gracefully (e.g. insufficient balance, unsupported route).
* Use memoization or debounce inputs to avoid excessive quote calls.

---

## Dependencies

```json
{
  "dependencies": {
    "@wormhole-foundation/sdk": "^x.x.x",
    "@wormhole-foundation/sdk-evm": "^x.x.x",
    "@wormhole-foundation/sdk-solana": "^x.x.x",
    "@rhino.fi/sdk": "^x.x.x"
  }
}
```