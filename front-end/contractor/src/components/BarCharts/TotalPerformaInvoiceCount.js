import React, { useState } from 'react'
import Chart from "react-apexcharts";

const TotalPerformaInvoiceCount = () => {
    const [chartData2] = useState({
        series: [{
            name: 'Mrr Movements',
            data: [0.9, 0.65, 0.76, 0.88, 1.5, 2.1, 0.9, 0.65, 0.76, 0.88, 1.5, 2.1, 0.76, 0.88, 1.5, 2.1, 0.88, 1.5, 2.1, 0.9, 0.88, 1.5, 2.1, 0.9, 0.65, 0.76, 0.88, 1.5, 2.1, 0.76, 0.88, 1.5]
        },
        {
            name: 'Mrr Movements',
            data: [-0.9, -1.05, -1.06, -1.18, -1.4, -2.2, -0.9, -1.05, -1.06, -1.18, -1.4, -2.2, -1.06, -1.18, -1.4, -2.2, -2.2, -0.9, -1.05, -1.06, -2.2, -0.9, -1.05, -1.06, -1.18, -1.4, -2.2, -1.06, -1.18, -1.4, -2.2, -2.2]
        }
        ],
        options: {
            chart: {
                stacked: true,
                toolbar: { show: false }
            },
            colors: ['#5200ff', '#fa0101'],
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '30%',
                    borderRadius: 6,
                    endingShape: 'rounded',
                },
            },
            legend: { show: false },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: 1,
                colors: ["#fff"]
            },

            grid: {
                padding: {
                    left: 20,
                },
            },
            xaxis: {
                labels: { show: false },
            },
        },
    });
    return (
        <Chart options={chartData2.options} series={chartData2.series} type="bar" height={300} />
    )
}

export default TotalPerformaInvoiceCount