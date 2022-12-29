const upColor = '#08a886';
const downColor = '#e1234d';
export const options = {
  animation: false,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
    borderWidth: 1,
    borderColor: 'rgb(34, 43, 58)',
    padding: 10,
    textStyle: {
      color: '#fff',
      fontSize: 12,
      width: 100,
    },

    backgroundColor: 'rgb(18, 27, 42, 0.8)',
    position: function (pos: any, params: any, el: any, elRect: any, size: any) {
      const obj: any = {
        top: 10,
      };
      obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
      return obj;
    },
    formatter(params: any) {
      return [
        `<div class="flex justify-between">日期<span class="ml-2">${params[0].axisValue}</span></div>`,
        `<div class="flex justify-between">开<span class="ml-2">${params[0].value[1]}</span></div>`,
        `<div class="flex justify-between">高<span class="ml-2">${params[0].value[2]}</span></div>`,
        `<div class="flex justify-between">低<span class="ml-2">${params[0].value[3]}</span></div>`,
        `<div class="flex justify-between">收<span class="ml-2">${params[0].value[4]}</span></div>`,
        `<div class="flex justify-between">漲跌額<span class="ml-2">${params[0].value[4]}</span></div>`,
        `<div class="flex justify-between">漲跌幅<span class="ml-2">${params[0].value[4]}</span></div>`,
        `<div class="flex justify-between">成交量<span class="ml-2">${params[0].value[5]}</span></div>`,
      ].join('');
    },
  },
  axisPointer: {
    link: [
      {
        xAxisIndex: 'all',
      },
    ],
    label: {
      backgroundColor: '#777',
    },
  },
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
        show: true,
        lineStyle: {
          color: '#222c38',
        },
      },
    },
    {
      scale: true,
      gridIndex: 1,
      axisLabel: { show: false },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#222c38',
        },
      },
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
