import BigNumber from 'bignumber.js';

export const formatTokenBalance = (balance?: string, decimals: string = '18') => {
  if (!balance) {
    return null;
  }

  return new BigNumber(balance).times(new BigNumber(10).pow(-decimals)).toString();
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('en-US').format(number);
};
