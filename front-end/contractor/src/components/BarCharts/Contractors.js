import React, { useState } from 'react'
import Chart from "react-apexcharts";

const Contractors = () => {
    const [chartData2] = useState({
        options: {
            colors: ['#3e88c7'],
            chart: {
                toolbar: {
                    show: false
                },
            },
            stroke: { lineCap: 'round' },
            dataLabels: {
                enabled: false
            },
            grid: {
                padding: {
                    left: 10,
                    right: 0,
                    top: -16,
                    bottom: -8,
                },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '50%',
                },
            },
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996]
            }
        },
        series: [{
            name: 'Contractors',
            data: [25, 35, 55, 50, 35, 60]
        },]
    });
    return (
        <Chart options={chartData2.options} series={chartData2.series} type="bar" height={300} />
    )
}

export default Contractors