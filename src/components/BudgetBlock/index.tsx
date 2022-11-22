import { FC } from 'react';
import { Imager } from 'elements/Imager';

export const BudgetBlock: FC<{
  amount: string;
  setAmount: (value: string) => void;
  symbol?: string;
  logoURI?: string;
}> = ({ amount, setAmount, symbol, logoURI }) => {
  return (
    <div className={'bg-body space-y-10 rounded-14 p-20'}>
      <div className={'flex items-center justify-between'}>
        <div
          className={
            'bg-secondary flex items-center space-x-6 rounded-full p-4 pr-20'
          }
        >
          <Imager alt={''} src={logoURI} className={'h-30 w-30 rounded-full'} />
          <div>{symbol}</div>
        </div>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={'enter amount'}
          className={'bg-transparent text-right text-[22px]'}
        />
      </div>
      <div className={'flex items-center justify-between'}>
        <div className={'text-secondary text-12'}>
          Balance: 100.000.000 (MAX)
        </div>
        <div className={'text-secondary text-12'}>$100.000.000</div>
      </div>
    </div>
  );
};