import { ModalFC } from 'libs/modals/modals.types';
import { Button } from 'components/common/button';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { ReactComponent as IconNotification } from 'assets/icons/activeBell.svg';
import { useModal } from 'hooks/useModal';
import { ModalOrMobileSheet } from 'libs/modals/ModalOrMobileSheet';

export type ModalManageNotificationsData = {
  strategyId: string;
};

export const ModalManageNotifications: ModalFC<
  ModalManageNotificationsData
> = ({ id, data: { strategyId } }) => {
  const { closeModal } = useModal();
  const onClick = () => {
    window?.open(
      `https://app.hal.xyz/recipes/carbon-track-strategy-updated?strategy_id=${strategyId}`,
      '_blank',
      'noopener'
    );
    closeModal(id);
  };

  return (
    <ModalOrMobileSheet id={id}>
      <IconTitleText
        variant={'success'}
        icon={<IconNotification />}
        title="Strategy Notification"
      />

      <p
        className={
          'text-secondary my-20 flex w-full items-center justify-center text-center'
        }
      >
        {
          'You can set notification to be informed every time some trade against your strategy.'
        }
      </p>
      <p
        className={
          'text-secondary my-20 flex w-full items-center justify-center text-12'
        }
      >
        {'It is a 3rd party service managed by Hal.xyz'}
      </p>

      <Button variant={'white'} fullWidth onClick={onClick}>
        {'Manage Notification'}
      </Button>
    </ModalOrMobileSheet>
  );
};
