import BigNumber from 'bignumber.js';
import { useCarbonSDK } from 'hooks/useCarbonSDK';
import { useQuery } from '@tanstack/react-query';
import { QueryKey } from 'libs/queries/queryKey';
import { ONE_DAY_IN_MS } from 'utils/time';
import { carbonSDK } from 'index';

const ONE = new BigNumber(1);

export type OrderRow = { rate: string; total: string; amount: string };

export type OrderBook = {
  buy: OrderRow[];
  sell: OrderRow[];
  middleRate: string;
  step?: BigNumber;
};

export const orderBookConfig = {
  steps: 100,
  buckets: {
    orderBook: 14,
    depthChart: 50,
  },
};

const buildOrderBook = async (
  buy: boolean,
  baseToken: string,
  quoteToken: string,
  startRate: BigNumber,
  step: BigNumber,
  min: BigNumber,
  max: BigNumber,
  buckets: number
) => {
  const orders: OrderRow[] = [];
  let i = 0;
  let minEqMax = false;

  while (orders.length < buckets && !minEqMax) {
    minEqMax = min.eq(max);
    let rate = startRate[buy ? 'minus' : 'plus'](step.times(i)).toString();
    rate = buy ? rate : ONE.div(rate).toString();
    rate = minEqMax ? max.toString() : rate;
    i++;
    const amount = await carbonSDK.getRateLiquidityDepthByPair(
      baseToken,
      quoteToken,
      rate
    );
    let amountBn = new BigNumber(amount);
    if (amountBn.eq(0)) {
      continue;
    }
    if (buy) {
      amountBn = amountBn.div(rate);
    } else {
      rate = ONE.div(rate).toString();
    }
    const total = amountBn.times(rate).toString();
    orders.push({ rate, total, amount: amountBn.toString() });
    if (minEqMax) {
      Array.from({ length: buckets - 1 }).map((_, i) =>
        orders.push({
          rate: new BigNumber(rate)
            [buy ? 'minus' : 'plus'](step.times(i))
            .toString(),
          total,
          amount: amountBn.toString(),
        })
      );
    }
  }
  return orders;
};

const getOrderBook = async (
  base: string,
  quote: string,
  buckets: number
): Promise<OrderBook> => {
  const buyHasLiq = await carbonSDK.hasLiquidityByPair(base, quote);
  const sellHasLiq = await carbonSDK.hasLiquidityByPair(quote, base);
  const minBuy = new BigNumber(
    buyHasLiq ? await carbonSDK.getMinRateByPair(base, quote) : 0
  );
  const maxBuy = new BigNumber(
    buyHasLiq ? await carbonSDK.getMaxRateByPair(base, quote) : 0
  );
  const minSell = new BigNumber(
    sellHasLiq ? await carbonSDK.getMinRateByPair(quote, base) : 0
  );
  const maxSell = new BigNumber(
    sellHasLiq ? await carbonSDK.getMaxRateByPair(quote, base) : 0
  );

  const stepBuy = maxBuy.minus(minBuy).div(orderBookConfig.steps);
  const stepSell = ONE.div(minSell)
    .minus(ONE.div(maxSell))
    .div(orderBookConfig.steps);

  const getStep = () => {
    if (stepBuy.isFinite() && stepBuy.gt(0)) {
      if (stepSell.isFinite() && stepSell.gt(0)) {
        return stepBuy.lte(stepSell) ? stepBuy : stepSell;
      } else {
        return stepBuy;
      }
    } else if (stepSell.isFinite() && stepSell.gt(0)) {
      return stepSell;
    } else {
      return ONE.div(minSell).minus(minBuy).div(orderBookConfig.steps);
    }
  };
  const step = getStep();

  const getMiddleRate = () => {
    if (
      maxBuy.isFinite() &&
      maxBuy.gt(0) &&
      maxSell.isFinite() &&
      maxSell.gt(0)
    ) {
      return maxBuy.plus(ONE.div(maxSell)).div(2);
    }
    if (maxBuy.isFinite() && maxBuy.gt(0)) {
      return maxBuy;
    }
    if (maxSell.isFinite() && maxSell.gt(0)) {
      return ONE.div(maxSell);
    }
    return new BigNumber(0);
  };
  const middleRate = getMiddleRate();

  return {
    buy: buyHasLiq
      ? await buildOrderBook(
          true,
          base,
          quote,
          middleRate,
          step,
          minBuy,
          maxBuy,
          buckets
        )
      : [],
    sell: sellHasLiq
      ? await buildOrderBook(
          false,
          quote,
          base,
          middleRate,
          step,
          minSell,
          maxSell,
          buckets
        )
      : [],
    middleRate: middleRate.toString(),
    step,
  };
};

export const useGetOrderBook = (
  base?: string,
  quote?: string,
  buckets = orderBookConfig.buckets.depthChart
) => {
  const { isInitialized } = useCarbonSDK();

  return useQuery({
    queryKey: QueryKey.tradeOrderBook(base!, quote!, buckets),
    queryFn: () => getOrderBook(base!, quote!, buckets),
    enabled: isInitialized && !!base && !!quote,
    retry: 1,
    staleTime: ONE_DAY_IN_MS,
  });
};
