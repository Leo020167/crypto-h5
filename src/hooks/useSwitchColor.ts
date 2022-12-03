import { useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { switchColorValueAtom } from '../atoms';

export default function useSwitchColor() {
  const switchColorValue = useAtomValue(switchColorValueAtom);
  const getColor = useCallback(
    (value?: number | string) => {
      const rate = Number(value ?? 0);
      if (switchColorValue === '0') {
        if (rate > 0) {
          return '#E2214E';
        } else if (rate < 0) {
          return '#00AD88';
        }
      } else {
        if (rate > 0) {
          return '#00AD88';
        } else if (rate < 0) {
          return '#E2214E';
        }
      }

      return '#555555';
    },
    [switchColorValue],
  );
  return getColor;
}