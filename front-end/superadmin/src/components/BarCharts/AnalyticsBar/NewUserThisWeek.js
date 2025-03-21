import React, { useState } from 'react'
import Chart from "react-apexcharts";

const NewUserThisWeek = () => {
  const [chartData2] = useState({
    series: [{
      name: 'New Users',
      data: [44, 55, 41, 15, 22, 43, 21, 49, 55]
    }, {
      name: 'Returning Users',
      data: [11, 17, 15, 67, 21, 14, 15, 13, 35]
    }],
    options: {
      colors: ['#5200ff', '#3e88c7'],
      chart: {
        stacked: true,
        toolbar: false,
      },
      dataLabels: {
        enabled: false
      },
      grid: {
        borderColor: 'transparent',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
        },
      },
      xaxis: {
        categories: ['9 Mar', '10 Mar', '11 Mar', '12 Mar', '13 Mar', '14 Mar', '15 Mar', '16 Mar', '17 Mar'],
      },
    },
  });
  return (
    <Chart options={chartData2.options} series={chartData2.series} type="bar" height={300} />
  )
}

export default NewUserThisWeek