import React, { useState } from 'react'
import Chart from "react-apexcharts";

const ActivateVsCancelled = () => {
  const [chartData2] = useState({
    series: [{
      name: 'Activate',
      data: [44, 55, 41, 15, 22, 43, 21, 49, 55]
    }, {
      name: 'Cancelled',
      data: [11, 17, 15, 67, 21, 14, 15, 13, 35]
    }],
    options: {
      colors: ['#018a7c', '#fa0101'],
      chart: {
        stacked: true,
        toolbar: false,
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: 'transparent',
        padding: {
          left: 0,
          right: 10,
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
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
    <Chart options={chartData2.options} series={chartData2.series} type="bar" height={200} />
  )
}

export default ActivateVsCancelled