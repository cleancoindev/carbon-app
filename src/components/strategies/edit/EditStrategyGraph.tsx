import { m } from 'libs/motion';
import { carbonEvents } from 'services/events';
import { Token } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { Button } from 'components/common/button';
import { TradingviewChart } from 'components/tradingviewChart';
import { ReactComponent as IconX } from 'assets/icons/X.svg';
import { list } from '../create/variants';

type EditStrategyGraphProps = {
  base: Token | undefined;
  quote: Token | undefined;
  setShowGraph: (value: boolean) => void;
};

export const EditStrategyGraph = ({
  base,
  quote,
  setShowGraph,
}: EditStrategyGraphProps) => {
  const { t } = useTranslation();

  return (
    <m.div
      variants={list}
      className="flex h-[550px] flex-col rounded-10 bg-silver p-20 pb-40"
    >
      <div className="flex items-center justify-between">
        <h2 className="mb-20 font-weight-500">
          {t('pages.strategyEdit.chart.title')}
        </h2>
        <Button
          className={`mb-20 self-end bg-emphasis`}
          variant="secondary"
          size={'md'}
          onClick={() => {
            carbonEvents.strategy.strategyChartClose(undefined);
            setShowGraph(false);
          }}
        >
          <div className="flex items-center justify-center">
            <IconX className={'w-10 md:me-12'} />
            <span className="hidden md:block">
              {t('pages.strategyEdit.chart.actionButton')}
            </span>
          </div>
        </Button>
      </div>
      <TradingviewChart base={base} quote={quote} />
    </m.div>
  );
};
