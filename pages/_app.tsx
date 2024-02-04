import "../styles/globals.css";
import "@interchain-ui/react/styles";

import type { AppProps } from "next/app";
import { SignerOptions, wallets } from "cosmos-kit";
import { ChainProvider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import { Chain, AssetList } from "@chain-registry/types";
import {
  Box,
  ThemeProvider,
  useColorModeValue,
  useTheme,
} from "@interchain-ui/react";

// Add Local Cosmos Hub
const cosmosHubChain = chains.find((asset) => asset.chain_name == "cosmoshub");
const additionalChains: Chain[] = [
  {
    ...cosmosHubChain,
    bech32_prefix: "cosmos",
    chain_id: "gaialocal-1",
    chain_name: "localcosmoshub",
    network_type: "localnet",
    pretty_name: "Local Cosmos Hub",
    key_algos: ["secp256k1"],
    slip44: 118,
    status: "live",
    apis: {
      rpc: [
        {
          address: "http://localhost:16657",
        },
      ],
      rest: [
        {
          address: "http://localhost:1316",
        },
      ],
    },
    explorers: [
      {
        tx_page: "http://localhost:1316/cosmos/tx/v1beta1/txs/${txHash}",
      },
    ],
  },
];

const cosmosHubAssets = assets.find((asset) => asset.chain_name == "cosmoshub");
const additionalAssets: AssetList[] = [
  { chain_name: "localcosmoshub", assets: cosmosHubAssets!.assets },
];

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  const { themeClass } = useTheme();

  return (
    <ThemeProvider>
      <ChainProvider
        chains={[...chains, ...additionalChains]}
        assetLists={[...assets, ...additionalAssets]}
        wallets={wallets}
        walletConnectOptions={{
          signClient: {
            projectId: "a8510432ebb71e6948cfd6cde54b70f7",
            relayUrl: "wss://relay.walletconnect.org",
            metadata: {
              name: "CosmosKit Example",
              description: "CosmosKit test dapp",
              url: "https://test.cosmoskit.com/",
              icons: [
                "https://raw.githubusercontent.com/cosmology-tech/cosmos-kit/main/packages/docs/public/favicon-96x96.png",
              ],
            },
          },
        }}
      >
        <Box
          className={themeClass}
          minHeight="100dvh"
          backgroundColor={useColorModeValue("$white", "$background")}
        >
          <Component {...pageProps} />
        </Box>
      </ChainProvider>
    </ThemeProvider>
  );
}

export default CreateCosmosApp;
