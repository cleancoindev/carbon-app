import { PathNames } from 'libs/routing';
import { useTranslation } from 'libs/translations';
import { isProduction } from 'utils/helpers';

export interface MenuItem {
  label: string;
  href: string;
  hrefMatches: Array<string>;
}

export const useMenuItems = () => {
  const { t } = useTranslation();
  const menuItems: MenuItem[] = [
    {
      label: t('navBar.items.item1'),
      href: PathNames.strategies,
      hrefMatches: [
        PathNames.strategies,
        PathNames.createStrategy,
        PathNames.editStrategy,
        PathNames.portfolio,
        PathNames.portfolioToken('0x'),
      ],
    },
    {
      label: t('navBar.items.item2'),
      href: PathNames.trade,
      hrefMatches: [PathNames.trade],
    },
    ...(isProduction
      ? []
      : [
          {
            label: t('navBar.items.item3'),
            href: PathNames.debug,
            hrefMatches: [PathNames.debug],
          },
        ]),
  ];

  return { menuItems };
};
