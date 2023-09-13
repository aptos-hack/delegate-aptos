import {NetworkName, useWallet} from "@aptos-labs/wallet-adapter-react";
import {AptosClient, Types } from "aptos";
import {useEffect, useState} from "react";
import { ExclamationTriangleIcon, LinkIcon } from '@heroicons/react/20/solid'
import 'react-toastify/dist/ReactToastify.css';
import { getContractAddress, getRpcUrl } from "./common/env";


type DelegationInfo = {
    delegatation_hash: string,
    delegatation_type: number,
    delegate: string,
    vault: string,
}

// Captures 0x + 4 characters, then the last 4 characters.
const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */
const truncateAddress = (address: string) => {
    const match = address.match(truncateRegex);
    if (!match) return address;
    return `${match[1]}…${match[2]}`;
};

const blockExplorerUrl = (address: string) => {
    return `https://explorer.aptoslabs.com/account/${address}/modules?network=devnet`
}

const getDelegationType = (type: number) => {
    switch (type) {
        case 1:
            return 'Delegate Wallet';
        case 2:
            return 'Delegate NFT';
        default:
            return 'Unknown Type';
    }
}


export default function ViewPage() {
    const { account, isLoading, signAndSubmitTransaction, network } = useWallet();

    let contractAddress = getContractAddress(network?.name ?? NetworkName.Devnet); // TODO: change to mainnet once deployed
    const client = new AptosClient(getRpcUrl(network?.name ?? NetworkName.Devnet));

    const [delegationInfo, setDelegationInfo] = useState<DelegationInfo[]>([]);

    useEffect(() => {
        getDelegatesForVault().then((delegates) => {
            if (!delegates?.delegatesByVaultResult) {
                return;
            }
            setDelegationInfo(delegates.delegatesByVaultResult);
        }).catch((err) => {
            console.log(`Wallet has not yet registered: ${err.toString()}`);
        });
    }, [isLoading, account])

    const getDelegatesForVault = async () : Promise<{ delegatesByVaultResult?: Array<DelegationInfo>  }> => {
        if (!account) {
            // @ts-ignore
            return;
        }
        const delegatesByVaultPayload: Types.ViewRequest = {
            function: `${contractAddress}::delegate::get_delegates_by_vault`,
            type_arguments: [],
            arguments: [account!.address],
        };

        const delegatesByVaultResult = await client.view(delegatesByVaultPayload as Types.ViewRequest);

        return {
            delegatesByVaultResult: delegatesByVaultResult[0] as Array<DelegationInfo>,
        };
    }


    return (
        <>
            {!account && (
                <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4 w-full justify-center">
                    <div className="flex justify-center">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Login with Petra Wallet.{' '}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <table className="w-full text-left">
                <thead className="bg-white">
                <tr>
                    <th scope="col" className="relative isolate py-3.5 pr-3 text-left text-lg font-semibold text-gray-900">
                        Vault
                        <div className="absolute inset-y-0 right-full -z-10 w-screen border-b border-b-gray-200" />
                        <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-b-gray-200" />
                    </th>
                    <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-lg font-semibold text-gray-900 sm:table-cell"
                    >
                        Delegate
                    </th>
                    <th
                        scope="col"
                        className="hidden px-3 py-3.5 text-left text-lg font-semibold text-gray-900 sm:table-cell"
                    >
                        Type
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    delegationInfo.map((delegate) => {
                       return <tr key={delegate.delegatation_hash}>
                            <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                                <a href={blockExplorerUrl(delegate.vault)} target="_blank" className="text-blue-700">{truncateAddress(delegate.vault)}</a>
                                <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                                <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                            </td>
                            <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                                <a href={blockExplorerUrl(delegate.delegate)} target="_blank" className="text-blue-700">{truncateAddress(delegate.delegate)}</a>
                                <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                                <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                            </td>
                            <td className="relative py-4 pr-3 text-sm font-medium text-gray-900">
                                <span>{getDelegationType(delegate.delegatation_type)}</span>
                               <div className="absolute bottom-0 right-full h-px w-screen bg-gray-100" />
                               <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                           </td>
                        </tr>
                    })
                }
                </tbody>
            </table>

            <br />
        </>
    )
}
