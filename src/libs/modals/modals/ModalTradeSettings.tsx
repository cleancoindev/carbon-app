import { useStore } from 'store';
import { carbonEvents } from 'services/events';
import { ModalFC } from 'libs/modals/modals.types';
import { ModalSlideOver } from 'libs/modals/ModalSlideOver';
import { Token } from 'libs/tokens';
import { useTranslation } from 'libs/translations';
import { TradeSettings } from 'components/trade/settings/TradeSettings';

export type ModalTradeSettingsData = {
  base: Token;
  quote: Token;
};

export const ModalTradeSettings: ModalFC<ModalTradeSettingsData> = ({
  id,
  data,
}) => {
  const { t } = useTranslation();
  const {
    trade: {
      settings: { resetAll, isAllSettingsDefault },
    },
  } = useStore();

  const handleReset = () => {
    resetAll();
    carbonEvents.trade.tradeSettingsResetAllClick({
      ...data,
    });
  };

  return (
    <ModalSlideOver
      id={id}
      title={
        <div className="flex flex-1 items-center justify-between">
          <h2>{t('modals.tradeSettings.modalTitle')}</h2>
          {!isAllSettingsDefault && (
            <button
              className="font-mono text-16 font-weight-500 text-white me-20"
              onClick={handleReset}
            >
              {t('modals.tradeSettings.actionButton')}
            </button>
          )}
        </div>
      }
      size={'md'}
    >
      <TradeSettings
        isAllSettingsDefault={isAllSettingsDefault}
        base={data.base}
        quote={data.quote}
      />
    </ModalSlideOver>
  );
};
