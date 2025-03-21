import React, { useState } from 'react'
import Chart from "react-apexcharts";

const ActiveUser = () => {
  const [chartData2] = useState({
    series: [{
      data: [44, 55, 31, 47, 31]
    }],
    options: {
      chart: {
        toolbar: {
          show: false
        }
      },
      colors: ['#3e88c7'],
      stroke: {
        curve: 'smooth',
        width: 1
      },
      grid: {
        borderColor: 'transparent',
        padding: {
          left: 20,
          right: 10,
        },
      },
      xaxis: {
        labels: { show: false },
      },
    }
  });
  return (
    <Chart options={chartData2.options} series={chartData2.series} type="area" height={200} />
  )
}

export default ActiveUser