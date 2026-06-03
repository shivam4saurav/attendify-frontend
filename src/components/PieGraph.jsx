import React, { useContext } from 'react';
import { AttendContext } from '../contexts/AttendContext';
import ReactECharts from 'echarts-for-react';

const PieGraph = () => {
  const { subs } = useContext(AttendContext);

  const avgPresent = subs.length > 0
    ? (subs.reduce((acc, curr) => acc + curr.percentage, 0) / subs.length).toFixed(2)
    : 0;

  const avgAbsent = (100 - avgPresent).toFixed(2);

  const pieOptions = {
    tooltip: { trigger: 'item' },
    series: [
      {
        name: 'Percentage',
        type: 'pie',
        data: [
          { value: avgPresent, name: 'Present', itemStyle: { color: '#00A859', opacity: 0.8 } },
          { value: avgAbsent, name: 'Absent', itemStyle: { color: '#FF4136', opacity: 0.8 } },
        ],
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
        label: {
          show: true,
          formatter: (params) => `${params.name}: ${params.value}`,
          textStyle: { fontSize: 20, color: '#000000' },
        },
      },
    ],
  };

  return <ReactECharts className="PieGraph" option={pieOptions} />;
};

export default PieGraph;
