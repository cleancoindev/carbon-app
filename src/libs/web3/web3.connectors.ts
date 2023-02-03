import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { Network } from '@web3-react/network';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import {
  ConnectionType,
  RPC_URLS,
  SupportedChainId,
} from 'libs/web3/web3.constants';
import { Connection } from 'libs/web3/web3.types';
import iconMetaMask from 'assets/logos/metamask.svg';
import iconWalletConnect from 'assets/logos/walletConnect.svg';
import iconCoinbase from 'assets/logos/coinbase.svg';
import iconGnosis from 'assets/logos/gnosis.svg';

const onError = (error: Error) => {
  console.debug(`web3-react error: ${error}`);
};

// ********************************** //
// NETWORK CONNECTOR
// ********************************** //

const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  (actions) =>
    new Network({
      actions,
      urlMap: RPC_URLS,
      defaultChainId: SupportedChainId.MAINNET,
    })
);
export const networkConnection: Connection = {
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
  name: 'Network',
};

// ********************************** //
// INJECTED CONNECTOR
// ********************************** //

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions, onError })
);
export const injectedConnection: Connection = {
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
  name: 'MetaMask',
  logoUrl: iconMetaMask,
};

// ********************************** //
// GNOSIS CONNECTOR
// ********************************** //

const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>(
  (actions) => new GnosisSafe({ actions })
);
export const gnosisSafeConnection: Connection = {
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE,
  name: 'Gnosis Safe',
  logoUrl: iconGnosis,
};

// ********************************** //
// WALLETCONNECT CONNECTOR
// ********************************** //

const [web3WalletConnect, web3WalletConnectHooks] =
  initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          rpc: RPC_URLS,
          qrcode: true,
        },
        onError,
      })
  );
export const walletConnectConnection: Connection = {
  connector: web3WalletConnect,
  hooks: web3WalletConnectHooks,
  type: ConnectionType.WALLET_CONNECT,
  name: 'WalletConnect',
  logoUrl: iconWalletConnect,
};

// ********************************** //
// COINBASE WALLET CONNECTOR
// ********************************** //

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] =
  initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions,
        options: {
          url: RPC_URLS[SupportedChainId.MAINNET],
          appName: 'Bancor',
          // TODO: add Bancor Logo
          appLogoUrl: '',
          reloadOnDisconnect: false,
        },
        onError,
      })
  );
export const coinbaseWalletConnection: Connection = {
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
  name: 'Coinbase Wallet',
  logoUrl: iconCoinbase,
};
