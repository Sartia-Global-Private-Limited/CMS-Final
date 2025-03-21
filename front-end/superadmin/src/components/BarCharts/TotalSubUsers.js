import React, { useState } from 'react'
import Chart from "react-apexcharts";

const TotalSubUsers = () => {
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
                    // borderRadius: 6,
                },
            },
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
            }
        },
        series: [{
            name: 'Total Sub Users',
            data: [30, 40, 45, 50, 49, 60, 70, 91]
        },]
    });
    return (
        <Chart options={chartData2.options} series={chartData2.series} type="bar" height={300} />
    )
}

export default TotalSubUsers