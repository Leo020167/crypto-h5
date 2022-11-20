export const getOriginSymbol = (symbol?: string) => {
  if (symbol && symbol.includes('/')) {
    return symbol.split('/')[0];
  }
  return symbol;
};
