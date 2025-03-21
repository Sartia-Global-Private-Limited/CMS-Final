import React, { useState } from 'react'
import Chart from "react-apexcharts";

const SessionDurationThisWeek = () => {
  const [chartData2] = useState({
    series: [{
      name: 'SESSION (A)',
      data: [0.4, 0.65, 0.76, 0.88, 1.5, 2.1, 2.9, 3.8, 3.9, 4.2, 4, 4.3, 4.1, 4.2, 4.5,]
    },
    {
      name: 'SESSION (B)',
      data: [-0.8, -1.05, -1.06, -1.18, -1.4, -2.2, -2.85, -3.7, -3.96, -4.22, -4.3, -4.4, -4.1, -4, -4.1]
    }
    ],
    options: {
      chart: {
        stacked: true,
        toolbar: { show: false }
      },
      colors: ['#5200ff', '#3e88c7'],
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '80%',
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
      yaxis: {
        labels: {
          show: false
        }
      },
      xaxis: {
        labels: {
          show: false
        }
      },
    }
  })
  return (
    <Chart options={chartData2.options} series={chartData2.series} type="bar" height={300} />
  )
}

export default SessionDurationThisWeek