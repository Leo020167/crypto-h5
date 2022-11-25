export const getOriginSymbol = (symbol?: string) => {
  if (symbol && symbol.includes('/')) {
    const s = symbol.split('/');
    if (s.length === 2) {
      return s[0];
    }
  }
  return symbol;
};
export const getUnitSymbol = (symbol?: string) => {
  if (symbol && symbol.includes('/')) {
    const s = symbol.split('/');
    if (s.length === 2) {
      return s[1];
    }
  }
  return symbol;
};
