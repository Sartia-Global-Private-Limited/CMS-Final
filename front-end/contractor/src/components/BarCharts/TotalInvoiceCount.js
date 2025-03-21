import React, { useState } from 'react'
import Chart from "react-apexcharts";

const TotalInvoiceCount = () => {
    const [chartData2] = useState({
        series: [{
            name: 'series1',
            data: [31, 40, 28, 51, 42, 109, 100]
        }, {
            name: 'series2',
            data: [11, 32, 45, 32, 34, 52, 41]
        }],
        options: {
            chart: {
                toolbar: { show: false },
            },
            legend: { show: false },
            dataLabels: {
                enabled: false
            },
            colors: ['#fc5f06', '#4a4c65'],
            stroke: {
                curve: 'smooth'
            },
            xaxis: {
                type: 'datetime',
                categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
            },
        },
    });
    return (
        <Chart options={chartData2.options} series={chartData2.series} type="area" height={300} />
    )
}

export default TotalInvoiceCount