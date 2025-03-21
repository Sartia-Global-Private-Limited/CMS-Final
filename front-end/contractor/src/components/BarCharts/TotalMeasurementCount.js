import React, { useState } from 'react'
import Chart from "react-apexcharts";

const TotalMeasurementCount = () => {
  const [chartData2] = useState({
    series: [{
      data: [44, 55, 31, 47, 34, 49, 30]
    }],
    options: {
      chart: {
        toolbar: {
          show: false
        }
      },
      colors: ['#5200ff'],
      stroke: {
        width: 1
      },
      grid: {
        padding: {
          left: 20,
          right: 0,
        },
      },
      xaxis: {
        categories: ['0', '10K', '20K', '30K', '40K', '50K', '60K'],
      },
    }
  });
  return (
    <Chart options={chartData2.options} series={chartData2.series} type="line" height={280} />
  )
}

export default TotalMeasurementCount