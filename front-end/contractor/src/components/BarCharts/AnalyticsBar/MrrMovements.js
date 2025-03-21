import React, { useState } from 'react'
import Chart from "react-apexcharts";

const MrrMovements = () => {
  const [chartData2] = useState({
    series: [{
      name: 'Mrr Movements',
      data: [0.9, 0.65, 0.76, 0.88, 1.5, 2.1, 0.9, 0.65, 0.76, 0.88, 1.5, 2.1]
    },
    {
      name: 'Mrr Movements',
      data: [-0.9, -1.05, -1.06, -1.18, -1.4, -2.2, -0.9, -1.05, -1.06, -1.18, -1.4, -2.2]
    }
    ],
    options: {
      chart: {
        stacked: true,
        toolbar: { show: false }
      },
      colors: ['#04a3fd', '#f90cd3'],
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 1,
        colors: ["#fff"]
      },

      grid: {
        borderColor: 'transparent',
        padding: {
          left: 0,
        },
        xaxis: {
          lines: {
            show: false
          }
        }
      },
      xaxis: {
        labels: { show: false },
      },
      yaxis: {
        labels: { show: false },
      },
    },
  });
  return (
    <Chart options={chartData2.options} series={chartData2.series} type="bar" height={300} />
  )
}

export default MrrMovements