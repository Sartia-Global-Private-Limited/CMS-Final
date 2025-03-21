import React, { useState } from 'react'
import Chart from "react-apexcharts";

const NewSessionThisWeek = () => {
  const [chartData2] = useState({
    series: [{
      data: [44, 55, 31, 47]
    }],
    options: {
      chart: {
        toolbar: {
          show: false
        }
      },
      colors: ['#3e88c7'],
      stroke: {
        curve: 'straight',
        width: 1
      },
      grid: {
        padding: {
          left: 20,
          right: 0,
        },
      },
      xaxis: {
        categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      },
    }
  });
  return (
    <Chart options={chartData2.options} series={chartData2.series} type="line" height={200} />
  )
}

export default NewSessionThisWeek