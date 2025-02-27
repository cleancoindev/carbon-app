import { PathNames, useSearch, useNavigate } from 'libs/routing';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList';
import { useModal } from 'hooks/useModal';
import { useGetTradePairsData } from 'libs/queries/sdk/pairs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { MyLocationGenerics } from 'components/trade/useTradeTokens';
import { config } from 'services/web3/config';
import { lsService } from 'services/localeStorage';
import { useWeb3 } from 'libs/web3';
import { buildPairKey } from 'utils/helpers';

export const useTradePairs = () => {
  const { user } = useWeb3();
  const { openModal } = useModal();

  const navigate = useNavigate<MyLocationGenerics>();
  const search = useSearch<MyLocationGenerics>();

  const pairsQuery = useGetTradePairsData();

  const onTradePairSelect = (tradePair: TradePair) => {
    navigate({
      to: PathNames.trade,
      search: {
        base: tradePair.baseToken.address,
        quote: tradePair.quoteToken.address,
      },
    });
  };

  const tradePairs = useMemo<TradePair[]>(() => {
    if (!pairsQuery.data) {
      return [];
    }
    return pairsQuery.data;
  }, [pairsQuery.data]);

  const tradePairsMap = useMemo(
    () => new Map(tradePairs.map((p) => [buildPairKey(p), p])),
    [tradePairs]
  );

  const getTradePair = useCallback(
    (base: string, quote: string): TradePair | undefined => {
      return tradePairsMap.get(
        [base.toLowerCase(), quote.toLowerCase()].join('-')
      );
    },
    [tradePairsMap]
  );

  const tradePairsPopular = useMemo(
    () =>
      popularPairs
        .map(([base, quote]) => getTradePair(base, quote))
        .filter((p) => !!p) as TradePair[],
    [getTradePair]
  );

  const [favoritePairs, _setFavoritePairs] = useState<TradePair[]>(
    lsService.getItem(`favoriteTradePairs-${user}`) || []
  );

  useEffect(() => {
    if (user) {
      _setFavoritePairs(lsService.getItem(`favoriteTradePairs-${user}`) || []);
    }
  }, [user]);

  const addFavoritePair = useCallback(
    (pair: TradePair) => {
      _setFavoritePairs((prev) => {
        const newValue = [...prev, pair];
        lsService.setItem(`favoriteTradePairs-${user}`, newValue);
        return newValue;
      });
    },
    [user]
  );

  const removeFavoritePair = useCallback(
    (pair: TradePair) => {
      _setFavoritePairs((prev) => {
        const newValue = prev.filter(
          (p) =>
            p.baseToken.address.toLowerCase() !==
              pair.baseToken.address.toLowerCase() ||
            p.quoteToken.address.toLowerCase() !==
              pair.quoteToken.address.toLowerCase()
        );
        lsService.setItem(`favoriteTradePairs-${user}`, newValue);
        return newValue;
      });
    },
    [user]
  );

  const isTradePairError = !tradePairs.some(
    (item) =>
      item.baseToken.address.toLowerCase() === search.base?.toLowerCase() &&
      item.quoteToken.address.toLowerCase() === search.quote?.toLowerCase()
  );

  const openTradePairList = () => {
    openModal('tradeTokenList', { onClick: onTradePairSelect });
  };

  return {
    tradePairs,
    openTradePairList,
    isLoading: pairsQuery.isLoading,
    isError: pairsQuery.isError,
    isTradePairError,
    tradePairsPopular,
    favoritePairs,
    addFavoritePair,
    removeFavoritePair,
  };
};

const { ETH, DAI, BNT, USDT, WBTC, USDC, SHIB } = config.tokens;

const popularPairs: string[][] = [
  [ETH, USDC],
  [ETH, USDT],
  [ETH, DAI],
  [ETH, WBTC],
  [BNT, USDC],
  [BNT, USDT],
  [BNT, DAI],
  [BNT, ETH],
  [BNT, WBTC],
  [WBTC, USDC],
  [WBTC, USDT],
  [WBTC, DAI],
  [WBTC, ETH],
  [USDT, USDC],
  [USDC, USDT],
  [USDT, DAI],
  [USDC, DAI],
  [DAI, USDC],
  [DAI, USDT],
  [SHIB, USDT],
  [SHIB, USDC],
  [SHIB, DAI],
  [SHIB, ETH],
];
