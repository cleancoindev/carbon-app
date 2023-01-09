import { useMutation, useQuery } from '@tanstack/react-query';
import { useWeb3 } from 'libs/web3';
import { Token, useTokens } from 'libs/tokens';
import { shrinkToken } from 'utils/tokens';
import { fetchTokenData } from 'libs/tokens/tokenHelperFn';
import { QueryKey } from 'libs/queries/queryKey';
import BigNumber from 'bignumber.js';
import { sdk } from 'libs/sdk/carbonSdk';
import { useContract } from 'hooks/useContract';

export enum StrategyStatus {
  Active,
  NoBudget,
  OffCurve,
  Inactive,
}

export interface Order {
  balance: string;
  curveCapacity: string;
  startRate: string;
  endRate: string;
}

export interface Strategy {
  id: number;
  token0: Token;
  token1: Token;
  order0: Order;
  order1: Order;
  status: StrategyStatus;
  name?: string;
}

export const useGetUserStrategies = () => {
  const { user } = useWeb3();
  const { tokens, getTokenById, importToken } = useTokens();
  const { Token } = useContract();

  return useQuery<Strategy[]>(
    QueryKey.strategies(user),
    async () => {
      if (!user) return [];

      const strategies: any[] = []; //FETCH

      const _getTknData = async (address: string) => {
        const data = await fetchTokenData(Token, address);
        importToken(data);
        return data;
      };

      const promises = strategies.map(async (s) => {
        const token0 =
          getTokenById(s.pair[0]) || (await _getTknData(s.pair[0]));
        const token1 =
          getTokenById(s.pair[1]) || (await _getTknData(s.pair[1]));

        const decodedOrder0 = s.orders[0];
        const decodedOrder1 = s.orders[1];

        const offCurve =
          decodedOrder0.lowestRate.isZero() &&
          decodedOrder0.highestRate.isZero() &&
          decodedOrder1.lowestRate.isZero() &&
          decodedOrder1.highestRate.isZero();

        const noBudget =
          decodedOrder0.liquidity.isZero() && decodedOrder1.liquidity.isZero();

        const status =
          noBudget && offCurve
            ? StrategyStatus.Inactive
            : offCurve
            ? StrategyStatus.OffCurve
            : noBudget
            ? StrategyStatus.NoBudget
            : StrategyStatus.Active;

        // ATTENTION *****************************
        // This is the buy order | UI order 0 and CONTRACT order 1
        // ATTENTION *****************************
        const order0: Order = {
          balance: shrinkToken(
            decodedOrder1.liquidity.toString(),
            token1.decimals
          ),
          curveCapacity: shrinkToken(
            decodedOrder1.marginalRate.toString(),
            token1.decimals
          ),
          startRate: new BigNumber(decodedOrder1.lowestRate.toString())
            .div(new BigNumber(10).pow(token0.decimals - token1.decimals))
            .toString(),
          endRate: new BigNumber(decodedOrder1.highestRate.toString())
            .div(new BigNumber(10).pow(token0.decimals - token1.decimals))
            .toString(),
        };

        // ATTENTION *****************************
        // This is the sell order | UI order 1 and CONTRACT order 0
        // ATTENTION *****************************
        const order1: Order = {
          balance: shrinkToken(
            decodedOrder0.liquidity.toString(),
            token0.decimals
          ),
          curveCapacity: shrinkToken(
            decodedOrder0.marginalRate.toString(),
            token0.decimals
          ),
          startRate: new BigNumber(1)
            .div(decodedOrder0.highestRate.toString())
            .times(new BigNumber(10).pow(token1.decimals - token0.decimals))
            .toString(),
          endRate: new BigNumber(1)
            .div(decodedOrder0.lowestRate.toString())
            .times(new BigNumber(10).pow(token1.decimals - token0.decimals))
            .toString(),
        };

        const strategy: Strategy = {
          id: s.id.toNumber(),
          token0,
          token1,
          order0,
          order1,
          status,
        };

        return strategy;
      });

      return await Promise.all(promises);
    },
    { enabled: tokens.length > 0 }
  );
};

interface CreateStrategyOrder {
  budget?: string;
  min?: string;
  max?: string;
  price?: string;
}

type TokenAddressDecimals = Pick<Token, 'address' | 'decimals'>;

export interface CreateStrategyParams {
  token0: TokenAddressDecimals;
  token1: TokenAddressDecimals;
  order0: CreateStrategyOrder;
  order1: CreateStrategyOrder;
}
export const useCreateStrategy = () => {
  const { signer } = useWeb3();

  return useMutation(
    async ({ token0, token1, order0, order1 }: CreateStrategyParams) => {
      const order0Low = order0.price
        ? order0.price
        : order0.min
        ? order0.min
        : '0';
      const order0Max = order0.price
        ? order0.price
        : order0.max
        ? order0.max
        : '0';

      const order1Low = order1.price
        ? order1.price
        : order1.min
        ? order1.min
        : '0';
      const order1Max = order1.price
        ? order1.price
        : order1.max
        ? order1.max
        : '0';

      const unsignedTx = await sdk.createBuySellStrategy(
        token0,
        token1,
        order0Low,
        order0Max,
        order0.budget ?? '0',
        order1Low,
        order1Max,
        order1.budget ?? '0'
      );

      return signer!.sendTransaction(unsignedTx);
    }
  );
};
