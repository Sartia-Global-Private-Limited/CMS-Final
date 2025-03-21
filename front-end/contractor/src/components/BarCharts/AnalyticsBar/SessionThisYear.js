import React, { useState } from 'react'
import Chart from "react-apexcharts";

const SessionThisYear = () => {
  const [chartData2] = useState({
    series: [{
      data: [44, 55, 20, 15, 12, 1]
    }],
    options: {
      chart: {
        toolbar: {
          show: false
        },
      },
      colors: ['#3e88c7'],
      stroke: {
        curve: 'smooth',
        width: 1
      },
      dataLabels: {
        enabled: false
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      grid: {
        borderColor: 'transparent',
        padding: {
          left: 20,
          right: 10,
        },
      },
      xaxis: {
        categories: ['2017', '2018', '2019', '2020', '2021', '2022'],
      },
    }
  });
  return (
    <Chart options={chartData2.options} series={chartData2.series} type="bar" height={200} />
  )
}

export default SessionThisYear