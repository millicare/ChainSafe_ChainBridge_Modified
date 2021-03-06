import { ApiPromise, WsProvider } from "@polkadot/api";
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';

import BigNumber from "bn.js";
import {
  chainbridgeConfig,
  SubstrateBridgeConfig,
} from "../../../chainbridgeConfig";
import types from "./bridgeTypes.json";

export const createApi = async (rpcUrl: string) => {
  const provider = new WsProvider(rpcUrl);
  const subChainConfig = chainbridgeConfig.chains.find(
    (c) => c.rpcUrl === rpcUrl
  ) as SubstrateBridgeConfig;
  return ApiPromise.create({ provider, types, rpc: jsonrpc });
};

export const submitDeposit = (
  api: ApiPromise,
  amount: number,
  recipient: string,
  destinationChainId: number
) => {
  const subChainConfig = chainbridgeConfig.chains.find(
    (c) => c.chainId !== destinationChainId
  ) as SubstrateBridgeConfig;
  return api.tx[subChainConfig.transferPalletName].transferNative(
    new BigNumber(amount * (10 ^ subChainConfig.decimals)).toString(10),
    recipient,
    destinationChainId
  );
};
