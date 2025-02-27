import { FC } from 'react';
import { useModal } from 'hooks/useModal';
import { Button } from 'components/common/button';
import { ReactComponent as IconSearch } from 'assets/icons/search.svg';
import { IconTitleText } from 'components/common/iconTitleText/IconTitleText';
import { Trans, useTranslation } from 'libs/translations';
import { useStore } from 'store';

export const ModalTokenListImport: FC<{ address: string }> = ({ address }) => {
  const { t } = useTranslation();
  const { openModal } = useModal();
  const { innerHeight } = useStore();

  const onClick = () => {
    openModal('importToken', { address });
  };

  const Text = () => (
    <Trans
      i18nKey={'modals.selectToken.contents.content2'}
      components={{
        strong: <span className={'font-weight-500 dark:text-white'} />,
      }}
    />
  );

  return (
    <>
      <div
        className={'mt-40 flex w-full flex-col items-center'}
        style={{ height: innerHeight - 218 }}
      >
        <IconTitleText
          icon={<IconSearch />}
          title={t('modals.selectToken.contents.content1')}
          text={<Text />}
        />
        <Button variant={'white'} onClick={onClick} className={'my-30'}>
          {t('modals.selectToken.actionButton')}
        </Button>
      </div>
    </>
  );
};
