import React, { useState } from 'react'
import Chart from "react-apexcharts";

const TotalInvoiceStatusValue = () => {
    const [chartData2] = useState({
        series: [{
            data: [44, 55, 41, 64, 22, 43, 21]
        }, {
            data: [53, 32, 33, 52, 13, 44, 32]
        }],
        options: {
            chart: {
                toolbar: {
                    show: false
                },
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        position: 'top',
                    },
                }
            },
            dataLabels: {
                enabled: true,
                offsetX: -6,
                style: {
                    fontSize: '12px',
                    colors: ['#fff']
                }
            },
            legend: { show: false },
            colors: ['#5200ff', '#5181cd'],
            stroke: {
                show: true,
                width: 1,
                colors: ['#fff']
            },
            tooltip: {
                shared: true,
                intersect: false
            },
            xaxis: {
                categories: [2001, 2002, 2003, 2004, 2005, 2006, 2007],
            },
        },
    });
    return (
        <Chart options={chartData2.options} series={chartData2.series} type="bar" height={300} />
    )
}

export default TotalInvoiceStatusValue