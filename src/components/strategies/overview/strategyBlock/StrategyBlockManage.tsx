import { FC } from 'react';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { Button } from 'components/common/button';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { useDuplicateStrategy } from 'components/strategies/create/useDuplicateStrategy';
import { Strategy } from 'libs/queries';

export const StrategyBlockManage: FC<{
  strategy: Strategy;
  manage: boolean;
  setManage: (flag: boolean) => void;
}> = ({ strategy, manage, setManage }) => {
  const { duplicate } = useDuplicateStrategy();
  const items = [
    {
      name: 'Withdraw Funds',
    },
    {
      name: 'Duplicate Strategy',
      action: () => duplicate(strategy),
    },
    {
      name: 'Delete Strategy',
    },
  ];

  return (
    <DropdownMenu
      isOpen={manage}
      setIsOpen={setManage}
      button={(onClick) => (
        <Button
          className="flex items-center justify-center gap-8"
          fullWidth
          variant={'black'}
          onClick={onClick}
        >
          Manage
          <IconChevron className="w-12" />
        </Button>
      )}
      className="w-full !p-10"
    >
      {items.map(({ name, action }) => (
        <ManageItem
          key={name}
          title={name}
          setManage={setManage}
          action={action}
        />
      ))}
    </DropdownMenu>
  );
};

const ManageItem: FC<{
  title: string;
  setManage: (flag: boolean) => void;
  action?: () => void;
}> = ({ title, setManage, action }) => {
  return (
    <div
      onClick={() => {
        action && action();
        setManage(false);
      }}
      className="hover:bg-body cursor-pointer rounded-6 p-12"
    >
      {title}
    </div>
  );
};
