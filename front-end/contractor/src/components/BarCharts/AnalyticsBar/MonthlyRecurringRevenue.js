import React, { useState } from 'react'
import Chart from "react-apexcharts";

const MonthlyRecurringRevenue = () => {
  const [chartData2] = useState({
    series: [{
      data: [0, 15, 31, 47, 55, 60]
    }],
    options: {
      chart: {
        toolbar: {
          show: false
        }
      },
      colors: ['#4b56b8'],
      stroke: {
        curve: 'straight',
        width: 1
      },
      grid: {
        borderColor: 'transparent',
        padding: {
          left: 20,
          right: 0,
        },
      },
      xaxis: {
        categories: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      },
    }
  });
  return (
    <Chart options={chartData2.options} series={chartData2.series} type="area" height={300} />
  )
}

export default MonthlyRecurringRevenue