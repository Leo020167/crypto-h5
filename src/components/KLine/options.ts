const upColor = '#08a886';
const downColor = '#e1234d';
export const options = {
  animation: false,
  visualMap: {
    show: false,
    seriesIndex: 4,
    dimension: 2,
    pieces: [
      {
        value: 1,
        color: downColor,
      },
      {
        value: -1,
        color: upColor,
      },
    ],
  },
  grid: [
    { top: 0, left: 0, right: 0, height: '60%' },
    {
      top: '70%',
      right: 0,
      left: 0,
      bottom: 0,
      height: '30%',
    },
  ],
  xAxis: [
    {
      type: 'category',
      data: [],
      boundaryGap: true,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        show: false,
      },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
    },
    {
      type: 'category',
      gridIndex: 1,
      data: [],
      boundaryGap: false,
      axisLine: { onZero: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      min: 'dataMin',
      max: 'dataMax',
    },
  ],
  yAxis: [
    {
      scale: true,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: false,
      },
    },
    {
      scale: true,
      gridIndex: 1,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: false,
      },
    },
    {
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#222c38',
        },
      },
      data: [1, 2, 3, 4],
    },
    {
      gridIndex: 1,
      axisLabel: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#222c38',
        },
      },
      data: [1, 2],
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      xAxisIndex: [0, 1],
      start: 86,
      end: 100,
    },
  ],
  series: [
    {
      name: 'Dow-Jones index',
      type: 'candlestick',
      data: [],
      itemStyle: {
        color: upColor,
        color0: downColor,
        borderColor: undefined,
        borderColor0: undefined,
      },
    },
    {
      name: 'MA5',
      type: 'line',
      data: [],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: 0.5,
        color: '#357dad',
      },
    },
    {
      name: 'MA10',
      type: 'line',
      data: [],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: 0.5,
        color: '#ffc43e',
      },
    },
    {
      name: 'MA30',
      type: 'line',
      data: [],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: 0.5,
        color: '#b080ce',
      },
    },
    {
      name: 'Volume',
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: [],
    },
    {
      name: 'VMA5',
      type: 'line',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: [],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: 0.5,
        color: '#357dad',
      },
    },
    {
      name: 'VMA10',
      type: 'line',
      xAxisIndex: 1,
      yAxisIndex: 1,
      data: [],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: 0.5,
        color: '#ffc43e',
      },
    },
  ],
};
