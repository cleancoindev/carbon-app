import { Fragment } from 'react';
import { useStore } from 'store';
import { carbonEvents } from 'services/events';
import { Token } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { TradeSettingsRow } from './TradeSettingsRow';
import { TradeSettingsData } from './utils';

export const TradeSettings = ({
  base,
  quote,
  isAllSettingsDefault,
}: {
  base: Token;
  quote: Token;
  isAllSettingsDefault: boolean;
}) => {
  const { t } = useTranslation();
  const {
    trade: {
      settings: { slippage, setSlippage, deadline, setDeadline, presets },
    },
  } = useStore();

  const settingsData: TradeSettingsData[] = [
    {
      id: 'slippageTolerance',
      title: t('modals.tradeSettings.section1.title'),
      value: slippage,
      prepend: '+',
      append: '%',
      setValue: (value) => {
        setSlippage(value);
        carbonEvents.trade.tradeSettingsSlippageToleranceChange({
          value,
          base,
          quote,
        });
      },
      presets: presets.slippage,
    },
    {
      id: 'transactionExpiration',
      title: t('modals.tradeSettings.section2.title'),
      value: deadline,
      prepend: '',
      append: ` ${t('common.contents.content9')}`,
      setValue: (value) => {
        setDeadline(value);
        carbonEvents.trade.tradeSettingsTransactionExpirationTimeChange({
          value,
          base,
          quote,
        });
      },
      presets: presets.deadline,
    },
  ];

  return (
    <div className={'mt-30'}>
      {settingsData.map((item) => (
        <Fragment key={item.id}>
          <TradeSettingsRow
            isAllSettingsDefault={isAllSettingsDefault}
            item={item}
            base={base}
            quote={quote}
          />
          <hr className={'my-20 border-b-2 border-grey5 last:hidden'} />
        </Fragment>
      ))}
    </div>
  );
};
