'use client'
import {AptosWalletAdapterProvider} from "@aptos-labs/wallet-adapter-react";
import {PetraWallet} from "petra-plugin-wallet-adapter";
import React, {useState} from "react";
import {WalletSelector} from "./WalletSelector";
import {Disclosure} from '@headlessui/react'
import DelegatePage from "./DelegatePage";
import ProgressBar, {StepState} from "./ProgressBar";
import RegistrationPage from "./RegistrationPage";
import {ToastContainer} from "react-toastify";
import ViewPage from "./ViewPage";

export default function Home() {
  const [ wallet, setWallet ] = useState<PetraWallet>(new PetraWallet());
  const [ step, setStep ] = useState<StepState>('Register')
  return (
    <AptosWalletAdapterProvider plugins={[wallet]}
                                autoConnect={true}>
      <ToastContainer />
      <Disclosure as="nav" className="bg-white shadow">
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-end">
              <div className="flex justify-end">
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex justify-end space-x-4">
                    <WalletSelector />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </Disclosure>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Content goes here */}
          <ProgressBar step={step} setStep={setStep} />
          { renderContentPage(step) }
        </div>
      </div>

    </AptosWalletAdapterProvider>
  )
}

function renderContentPage(step: StepState): JSX.Element {
  switch (step) {
    case 'Register':
      return <RegistrationPage />;
    case 'Delegate':
      return <DelegatePage />;
    case 'View':
      return <ViewPage />;
    default:
      throw new Error('Unimplemented');
  }
}