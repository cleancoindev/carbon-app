import { createContext, FC, ReactNode, useContext } from 'react';
import {
  defaultTradeSettingsStore,
  TradeSettingsStore,
  useTradeSettingsStore,
} from 'store/useTradeSettingsStore';
import {
  defaultNotificationsStore,
  NotificationsStore,
  useNotificationsStore,
} from 'store/useNotificationsStore';
import {
  defaultModalStore,
  ModalStore,
  useModalStore,
} from 'store/useModalStore';
import {
  defaultTokensStore,
  TokensStore,
  useTokensStore,
} from 'store/useTokensStore';
import { defaultSDKStore, SDKStore, useSDKStore } from 'store/useSDKStore';
import {
  defaultFiatCurrencyStore,
  FiatCurrencyStore,
  useFiatCurrencyStore,
} from 'store/useFiatCurrencyStore';
import {
  defaultStrategiesStore,
  StrategiesStore,
  useStrategiesStore,
} from './useStrategiesStore';

// ********************************** //
// STORE CONTEXT
// ********************************** //

interface StoreContext {
  sdk: SDKStore;
  tokens: TokensStore;
  strategies: StrategiesStore;
  notifications: NotificationsStore;
  modals: ModalStore;
  trade: {
    settings: TradeSettingsStore;
  };
  fiatCurrency: FiatCurrencyStore;
}

const defaultValue: StoreContext = {
  sdk: defaultSDKStore,
  tokens: defaultTokensStore,
  strategies: defaultStrategiesStore,
  notifications: defaultNotificationsStore,
  modals: defaultModalStore,
  trade: {
    settings: defaultTradeSettingsStore,
  },
  fiatCurrency: defaultFiatCurrencyStore,
};

const StoreCTX = createContext(defaultValue);

export const useStore = () => {
  return useContext(StoreCTX);
};

// ********************************** //
// STORE PROVIDER
// ********************************** //

export const StoreProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const sdk = useSDKStore();
  const tradeSettings = useTradeSettingsStore();
  const notifications = useNotificationsStore();
  const modals = useModalStore();
  const tokens = useTokensStore();
  const fiatCurrency = useFiatCurrencyStore();
  const strategies = useStrategiesStore();

  const value: StoreContext = {
    sdk,
    tokens,
    strategies,
    notifications,
    modals,
    trade: {
      settings: tradeSettings,
    },
    fiatCurrency,
  };

  return <StoreCTX.Provider value={value}>{children}</StoreCTX.Provider>;
};
