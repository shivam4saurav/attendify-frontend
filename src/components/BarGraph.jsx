import React, { useContext } from 'react';
import { AttendContext } from '../contexts/AttendContext';
import ReactECharts from 'echarts-for-react';

const BarGraph = ({ goal }) => {
  const { subs } = useContext(AttendContext);

  const barOptions = {
    xAxis: {
      type: 'category',
      data: subs.map((sub) => ({
        value: sub.subject,
        textStyle: {
          color: sub.percentage >= goal ? '#00A859' : '#FF4136',
          fontWeight: 500,
          fontSize: 16,
        },
      })),
    },
    yAxis: {
      type: 'value',
      axisLabel: { textStyle: { fontSize: 20, color: '#000000' } },
    },
    grid: { width: subs.length * 140 },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    series: [
      {
        data: subs.map((sub) => ({
          value: sub.percentage,
          itemStyle: {
            color: sub.percentage >= goal ? '#00A859' : '#FF4136',
            opacity: 0.8,
          },
        })),
        type: 'bar',
        barWidth: 60,
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' },
        },
      },
    ],
  };

  return (
    <div className="BarGraph">
      <ReactECharts
        option={barOptions}
        style={{ width: `${(subs.length + 2) * 140}px`, height: '500px', transform: 'translate(100px,0)' }}
      />
    </div>
  );
};

export default BarGraph;
