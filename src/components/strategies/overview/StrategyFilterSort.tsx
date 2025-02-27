import { FC } from 'react';
import { useTranslation } from 'libs/translations';
import { Button } from 'components/common/button';
import { DropdownMenu } from 'components/common/dropdownMenu';
import { getSortAndFilterItems } from './utils';
import { ReactComponent as IconChevron } from 'assets/icons/chevron.svg';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';

export enum StrategyFilter {
  All,
  Active,
  Inactive,
}

export enum StrategySort {
  Recent,
  Old,
  PairAscending,
  PairDescending,
}

export const StrategyFilterSort: FC<{
  filter: StrategyFilter;
  sort: StrategySort;
  setSort: (sort: StrategySort) => void;
  setFilter: (sort: StrategyFilter) => void;
}> = ({ sort, filter, setSort, setFilter }) => {
  const { t } = useTranslation();
  const { sortItems, filterItems } = getSortAndFilterItems(t);

  return (
    <DropdownMenu
      button={(onClick) => (
        <Button
          onClick={onClick}
          variant="secondary"
          className="flex items-center gap-10"
        >
          {t('pages.strategyOverview.header.actionButtons.actionButton2')}{' '}
          <IconChevron className="w-14" />
        </Button>
      )}
    >
      <div className="grid w-[300px] gap-20 p-10">
        <div className="text-secondary text-20">
          {t('pages.strategyOverview.header.filterMenu.subtitles.subtitle1')}
        </div>
        <>
          {sortItems.map((sortItem) => (
            <FilterSortItem
              key={sortItem.title}
              item={sortItem.item}
              selectedItem={sort}
              setItem={setSort}
              title={sortItem.title}
            />
          ))}
        </>

        <hr className="border-2 border-silver dark:border-emphasis" />
        <div className="text-secondary">
          {t('pages.strategyOverview.header.filterMenu.subtitles.subtitle2')}
        </div>

        <>
          {filterItems.map((filterItem) => (
            <FilterSortItem
              key={filterItem.title}
              item={filterItem.item}
              selectedItem={filter}
              setItem={setFilter}
              title={filterItem.title}
            />
          ))}
        </>
      </div>
    </DropdownMenu>
  );
};

const FilterSortItem: FC<{
  title: string;
  item: StrategyFilter | StrategySort;
  selectedItem: StrategyFilter | StrategySort;
  setItem: (filter: any) => void;
}> = ({ title, item, selectedItem, setItem }) => {
  return (
    <button
      onClick={() => setItem(item)}
      className="flex items-center justify-between"
    >
      {title}
      {selectedItem === item && <IconCheck />}
    </button>
  );
};
