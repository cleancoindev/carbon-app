import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TradePair } from 'libs/modals/modals/ModalTradeTokenList/ModalTradeTokenList';
import { TokensOverlap } from 'components/common/tokensOverlap';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ReactComponent as IconStar } from 'assets/icons/star.svg';
import { buildPairKey } from 'utils/helpers';
import { lsService } from 'services/localeStorage';
import { WarningWithTooltip } from 'components/common/WarningWithTooltip/WarningWithTooltip';
import { CategoryButtonWithCounter } from 'libs/modals/modals/common/CategoryButtonWithCounter';
import { useStore } from 'store';

const categories = ['popular', 'favorites', 'all'] as const;
export type TradePairCategory = (typeof categories)[number];

type Props = {
  tradePairs: { [k in TradePairCategory]: TradePair[] };
  handleSelect: (tradePair: TradePair) => void;
  onAddFavorite: (tradePair: TradePair) => void;
  onRemoveFavorite: (tradePair: TradePair) => void;
  search: string;
};

export const ModalTradeTokenListContent: FC<Props> = ({
  tradePairs,
  handleSelect,
  search,
  onRemoveFavorite,
  onAddFavorite,
}) => {
  const { innerHeight } = useStore();
  const parentRef = useRef<HTMLDivElement>(null);
  const [selectedList, _setSelectedList] = useState<TradePairCategory>(
    lsService.getItem('tradePairsCategory') || 'popular'
  );

  const setSelectedList = (category: TradePairCategory) => {
    _setSelectedList(category);
    lsService.setItem('tradePairsCategory', category);
  };

  const tradePairs2 = !!search ? tradePairs.all : tradePairs[selectedList];

  const rowVirtualizer = useVirtualizer({
    count: tradePairs2.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 55,
    overscan: 10,
  });

  useEffect(() => {
    if (parentRef.current) parentRef.current.scrollTop = 0;
    if (!!search) setSelectedList('all');
  }, [search]);

  const favoritesMap = useMemo(
    () => new Set(tradePairs.favorites.map((pair) => buildPairKey(pair))),
    [tradePairs.favorites]
  );

  const isFavorite = useCallback(
    (tradePair: TradePair) => favoritesMap.has(buildPairKey(tradePair)),
    [favoritesMap]
  );

  const suspiciousTokenTooltipMsg =
    'This token is not part of any known token list. Always conduct your own research before trading.';

  return (
    <div>
      <div className={'my-20 grid w-full grid-cols-3'}>
        {categories.map((category, i) => (
          <CategoryButtonWithCounter
            key={category}
            category={category}
            numOfItemsInCategory={tradePairs[category].length}
            isActive={category === selectedList}
            setSelectedList={setSelectedList}
            categoryIndex={i}
          />
        ))}
      </div>

      <div
        id={'bodyScrollTarget'}
        ref={parentRef}
        style={{
          height: innerHeight - 242,
          overflow: 'auto',
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const tradePair = tradePairs2[virtualRow.index];

            return (
              <div
                key={`${selectedList}-${virtualRow.key}-${tradePair.baseToken.address}-${tradePair.quoteToken.address}`}
                data-index={virtualRow.index}
                className={
                  'flex w-full items-center justify-between  rounded-12 px-8 hover:bg-black'
                }
                style={{
                  position: 'absolute',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <button
                  onClick={() => handleSelect(tradePair)}
                  className={'flex w-full items-center ps-10 space-s-10'}
                >
                  <TokensOverlap
                    className="h-30 w-30"
                    tokens={[tradePair.baseToken, tradePair.quoteToken]}
                  />
                  <span className={'flex font-weight-500'}>
                    {tradePair.baseToken.symbol}
                    {tradePair.baseToken.isSuspicious && (
                      <WarningWithTooltip
                        className="ms-5"
                        tooltipContent={suspiciousTokenTooltipMsg}
                      />
                    )}
                    <span className={'px-5 text-white/60'}>/</span>
                    {tradePair.quoteToken.symbol}
                    {tradePair.quoteToken.isSuspicious && (
                      <WarningWithTooltip
                        className="ms-5"
                        tooltipContent={suspiciousTokenTooltipMsg}
                      />
                    )}
                  </span>
                </button>
                <button
                  onClick={() =>
                    isFavorite(tradePair)
                      ? onRemoveFavorite(tradePair)
                      : onAddFavorite(tradePair)
                  }
                >
                  <IconStar
                    className={`${
                      isFavorite(tradePair)
                        ? 'fill-green text-green'
                        : 'text-white/40'
                    } w-20 transition hover:fill-white/80 hover:text-white/80`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
