import { MakeGenerics, PathNames, useNavigate, useSearch } from 'libs/routing';
import { Strategy } from 'libs/queries';

type MyLocationGenerics = MakeGenerics<{
  Search: {
    strategy: string;
  };
}>;

const isValid = (strategy: Strategy) => {
  return (
    (strategy.hasOwnProperty('base') && strategy.hasOwnProperty('quote')) ||
    (strategy.hasOwnProperty('order0') && strategy.hasOwnProperty('order1'))
  );
};

const decodeStrategyAndValidate = (
  urlStrategy?: string
): Strategy | undefined => {
  if (!urlStrategy) return;

  try {
    const decodedStrategy = JSON.parse(
      Buffer.from(urlStrategy, 'base64').toString('utf8')
    );

    if (isValid(decodedStrategy)) {
      return decodedStrategy;
    }
    return undefined;
  } catch (error) {
    console.log('Invalid value for search param `strategy`', error);
  }
};

export const useDuplicateStrategy = () => {
  const navigate = useNavigate<MyLocationGenerics>();
  const search = useSearch<MyLocationGenerics>();
  const { strategy: urlStrategy } = search;

  const duplicate = (strategy: Partial<Strategy>) => {
    const encodedStrategy = Buffer.from(JSON.stringify(strategy)).toString(
      'base64'
    );

    navigate({
      to: `${PathNames.createStrategy}`,
      search: {
        ...search,
        strategy: encodedStrategy,
      },
    });
  };

  return {
    duplicate,
    templateStrategy: decodeStrategyAndValidate(urlStrategy),
  };
};
