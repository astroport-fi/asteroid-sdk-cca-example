import {
  Box,
  Button,
  ClipboardCopyText,
  Stack,
  useColorModeValue,
  Link,
} from "@interchain-ui/react";
import { WalletStatus } from "cosmos-kit";
import { useChain } from "@cosmos-kit/react";
import { getChainLogo } from "@/utils";
import { CHAIN_NAME, GAS_PRICE } from "@/config";
import { User } from "./User";
import { Chain } from "./Chain";
import { Warning } from "./Warning";
import {
  ButtonConnect,
  ButtonConnected,
  ButtonConnecting,
  ButtonDisconnected,
  ButtonError,
  ButtonNotExist,
  ButtonRejected,
} from "./Connect";
import { useCallback, useEffect, useState } from "react";
import {
  InscriptionOperations,
  SigningStargateClient,
} from "@asteroid-protocol/sdk";
import { GasPrice } from "@cosmjs/stargate";

function useClient() {
  const { getRpcEndpoint, getOfflineSignerDirect, isWalletConnected } =
    useChain(CHAIN_NAME);

  const [client, setClient] = useState<SigningStargateClient>();
  useEffect(() => {
    if (!isWalletConnected) {
      return;
    }
    async function createSigningClient() {
      const rpcEndpoint = await getRpcEndpoint();
      const signer = getOfflineSignerDirect();
      const gasPrice = GasPrice.fromString(GAS_PRICE);
      const signingClient = await SigningStargateClient.connectWithSigner(
        rpcEndpoint,
        signer,
        { gasPrice }
      );
      setClient(signingClient);
    }
    createSigningClient();
  }, [getRpcEndpoint, getOfflineSignerDirect, isWalletConnected]);

  return client;
}

export function Wallet() {
  const {
    chain,
    status,
    wallet,
    username,
    address,
    message,
    connect,
    openView,
    isWalletConnected,
  } = useChain(CHAIN_NAME);

  const ConnectButton = {
    [WalletStatus.Connected]: <ButtonConnected onClick={openView} />,
    [WalletStatus.Connecting]: <ButtonConnecting />,
    [WalletStatus.Disconnected]: <ButtonDisconnected onClick={connect} />,
    [WalletStatus.Error]: <ButtonError onClick={openView} />,
    [WalletStatus.Rejected]: <ButtonRejected onClick={connect} />,
    [WalletStatus.NotExist]: <ButtonNotExist onClick={openView} />,
  }[status] || <ButtonConnect onClick={connect} />;

  const [sendingTx, setSendingTx] = useState(false);
  const [transactionHash, setTransactionHash] = useState("");
  const [error, setError] = useState("");
  const client = useClient();

  const sendTx = useCallback(async () => {
    if (!address) {
      throw new Error("invalid address");
    }

    if (!client) {
      throw new Error("invalid client");
    }

    setSendingTx(true);

    // create an inscription
    const operations = new InscriptionOperations(chain.chain_id, address);

    const data = "SOME DATA";
    const txData = operations.inscribe(data, {
      mime: "text/plain",
      name: "some text",
      description: "some text description",
    });

    try {
      const res = await client.signAndBroadcast(
        address,
        txData.messages,
        "auto",
        txData.memo,
        undefined,
        txData.nonCriticalExtensionOptions
      );
      setTransactionHash(res.transactionHash);
    } catch (err) {
      setError((err as Error).message);
      console.error(err);
    }

    setSendingTx(false);
  }, [address, client, chain]);

  return (
    <Box py="$16">
      <Stack attributes={{ mb: "$12", justifyContent: "center" }}>
        <Chain
          name={chain.pretty_name}
          logo={getChainLogo(chain.chain_name)!}
        />
      </Stack>
      <Stack
        direction="vertical"
        attributes={{
          mx: "auto",
          px: "$8",
          py: "$15",
          maxWidth: "21rem",
          borderRadius: "$lg",
          justifyContent: "center",
          backgroundColor: useColorModeValue("$white", "$blackAlpha500"),
          boxShadow: useColorModeValue(
            "0 0 2px #dfdfdf, 0 0 6px -2px #d3d3d3",
            "0 0 2px #363636, 0 0 8px -2px #4f4f4f"
          ),
        }}
      >
        {username ? <User name={username} /> : null}
        {address ? (
          <ClipboardCopyText text={address} truncate="middle" />
        ) : null}
        <Box
          my="$8"
          flex="1"
          width="full"
          display="flex"
          height="$16"
          overflow="hidden"
          justifyContent="center"
          px={{ mobile: "$8", tablet: "$10" }}
        >
          {ConnectButton}
        </Box>
        {isWalletConnected && (
          <>
            <Button isLoading={sendingTx} onClick={sendTx}>
              Send tx
            </Button>
            <Box pt="$8" overflow="hidden" textOverflow="ellipsis">
              <Link
                color="BlueViolet"
                target="_blank"
                href={`${chain.explorers![0].tx_page!.replace(
                  "${txHash}",
                  transactionHash
                )}`}
              >
                {transactionHash}
              </Link>
              {error && <pre style={{ whiteSpace: "pre-wrap" }}>{error}</pre>}
            </Box>
          </>
        )}

        {message &&
        [WalletStatus.Error, WalletStatus.Rejected].includes(status) ? (
          <Warning text={`${wallet?.prettyName}: ${message}`} />
        ) : null}
      </Stack>
    </Box>
  );
}
