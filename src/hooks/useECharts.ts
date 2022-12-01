import { ECharts } from 'echarts/core';
import { ECBasicOption } from 'echarts/types/dist/shared';
import { debounce } from 'lodash-es';
import { useRef, useEffect } from 'react';
import myECharts from '../my-echarts';

export default function useECharts(ref: React.RefObject<HTMLDivElement>, options?: ECBasicOption) {
  const myChartRef = useRef<ECharts>();

  useEffect(() => {
    if (ref.current) {
      myChartRef.current = myECharts.init(ref.current);
    }

    return () => {
      myChartRef.current?.dispose();
    };
  }, [ref]);

  useEffect(() => {
    if (options) {
      myChartRef.current?.setOption(options);
    }
  }, [options]);

  useEffect(() => {
    const handleResize = debounce(() => {
      myChartRef.current?.resize();
    }, 200);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return myChartRef;
}
