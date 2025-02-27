import { useMemo } from 'react';
import { carbonEvents } from 'services/events';
import { useLocation } from 'libs/routing';
import { useTranslation } from 'libs/translations';
import { m } from 'libs/motion';
import { items } from 'components/strategies/create/variants';
import { UseStrategyCreateReturn } from 'components/strategies/create';
import { ForwardArrow } from 'components/common/forwardArrow';
import { ReactComponent as IconCandles } from 'assets/icons/candles.svg';

export const CreateStrategyHeader = ({
  showGraph,
  showOrders,
  setShowGraph,
  strategyDirection,
}: UseStrategyCreateReturn) => {
  const { t } = useTranslation();
  const {
    history: { back },
  } = useLocation();

  const title = useMemo(() => {
    if (!showOrders) {
      return t('pages.strategyCreate.step1.title');
    }
    switch (strategyDirection) {
      case undefined:
        return t('pages.strategyCreate.step2.title', { count: 2 });
      default:
        return t('pages.strategyCreate.step2.title', { count: 1 });
    }
  }, [showOrders, strategyDirection, t]);

  return (
    <m.div
      variants={items}
      key={'createStrategyHeader'}
      className={`flex w-full flex-row justify-between ${
        showGraph ? '' : 'md:w-[440px]'
      }`}
    >
      <div className="flex items-center gap-16 text-24">
        <button
          onClick={() => back()}
          className="h-40 w-40 rounded-full bg-emphasis"
        >
          <div className="rotate-180">
            <ForwardArrow className="mx-auto w-14" />
          </div>
        </button>
        {title}
      </div>
      {!showGraph && showOrders && (
        <button
          onClick={() => {
            carbonEvents.strategy.strategyChartOpen(undefined);
            setShowGraph(true);
          }}
          className="h-40 w-40 self-end rounded-full bg-emphasis"
        >
          <IconCandles className="mx-auto w-14" />
        </button>
      )}
    </m.div>
  );
};
