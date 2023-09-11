import {NetworkName} from "@aptos-labs/wallet-adapter-react";
import env from '../env.json'

export function getContractAddress(networkName: NetworkName): string {
    // Check the network and get the corresponding address
    let network = networkName.toLowerCase();
    console.log(network);
    switch (network) {
        case NetworkName.Devnet:
            return env.devnet.contractAddress;
        case NetworkName.Testnet:
            return env.testnet.contractAddress;
        // case NetworkName.Mainnet:
        //     return env.mainnet.contractAddress;
      default:
        throw new Error('Unsupported network type');
    }
}

export function getRpcUrl(networkName: NetworkName): string {
    // Check the network and get the corresponding address
    let network = networkName.toLowerCase();
    console.log(network);
    switch (network) {
        case NetworkName.Devnet:
            return env.devnet.rpcUrl;
        case NetworkName.Testnet:
            return env.testnet.rpcUrl;
        // case NetworkName.Mainnet:
        //     return env.mainnet.contractAddress;
      default:
        throw new Error('Unsupported network type');
    }
  }  