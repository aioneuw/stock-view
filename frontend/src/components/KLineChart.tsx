'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { KLineData } from '@/lib/api';

interface KLineChartProps {
  data: KLineData[];
  name: string;
}

export function KLineChart({ data, name }: KLineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // 初始化图表
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    const chart = chartInstance.current;

    // 准备数据
    const dates = data.map((item) => item.date);
    const klineData = data.map((item) => [item.open, item.close, item.low, item.high]);
    const volumes = data.map((item) => item.volume);

    // 计算均线
    const calculateMA = (dayCount: number) => {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        if (i < dayCount - 1) {
          result.push('-');
          continue;
        }
        let sum = 0;
        for (let j = 0; j < dayCount; j++) {
          sum += data[i - j].close;
        }
        result.push((sum / dayCount).toFixed(2));
      }
      return result;
    };

    const option: echarts.EChartsOption = {
      animation: false,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        textStyle: {
          color: '#000',
        },
      },
      legend: {
        data: [name, 'MA5', 'MA10', 'MA20'],
        top: 10,
        left: 'center',
      },
      grid: [
        {
          left: '10%',
          right: '8%',
          height: '50%',
        },
        {
          left: '10%',
          right: '8%',
          top: '65%',
          height: '16%',
        },
      ],
      xAxis: [
        {
          type: 'category',
          data: dates,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#999' } },
          axisLabel: {
            formatter: (value: string) => {
              return value.slice(5); // 只显示月-日
            },
          },
          min: 'dataMin',
          max: 'dataMax',
        },
        {
          type: 'category',
          gridIndex: 1,
          data: dates,
          boundaryGap: false,
          axisLine: { lineStyle: { color: '#999' } },
          axisLabel: { show: false },
          min: 'dataMin',
          max: 'dataMax',
        },
      ],
      yAxis: [
        {
          scale: true,
          splitArea: {
            show: true,
          },
          axisLine: { lineStyle: { color: '#999' } },
        },
        {
          scale: true,
          gridIndex: 1,
          splitNumber: 2,
          axisLabel: { show: false },
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: [0, 1],
          start: 50,
          end: 100,
        },
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          bottom: 10,
          start: 50,
          end: 100,
        },
      ],
      series: [
        {
          name: name,
          type: 'candlestick',
          data: klineData,
          itemStyle: {
            color: '#ef5350', // 阳线颜色（红）
            color0: '#26a69a', // 阴线颜色（绿）
            borderColor: '#ef5350',
            borderColor0: '#26a69a',
          },
        },
        {
          name: 'MA5',
          type: 'line',
          data: calculateMA(5),
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
        },
        {
          name: 'MA10',
          type: 'line',
          data: calculateMA(10),
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
        },
        {
          name: 'MA20',
          type: 'line',
          data: calculateMA(20),
          smooth: true,
          lineStyle: {
            width: 1,
          },
          showSymbol: false,
        },
        {
          name: '成交量',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          data: volumes,
          itemStyle: {
            color: (params: any) => {
              const index = params.dataIndex;
              if (index === 0) return '#999';
              return data[index].close >= data[index - 1].close
                ? '#ef5350'
                : '#26a69a';
            },
          },
        },
      ],
    };

    chart.setOption(option);

    // 响应式
    const handleResize = () => {
      chart.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, name]);

  // 组件卸载时销毁图表
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
      }
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{ width: '100%', height: '500px' }}
    />
  );
}
