import React, { useState } from 'react'
import Chart from "react-apexcharts";

const WalletBalanceStatus = () => {
    const [chartData2] = useState({
        series: [{
            name: 'Lorem1',
            data: [31, 40, 28, 61, 42, 109, 100]
        }, {
            name: 'Lorem2',
            data: [11, 72, 45, 32, 34, 52, 41]
        }],
        options: {
            chart: {
                toolbar: { show: false },
                offsetY: 30,
            },
            legend: { show: false },
            dataLabels: {
                enabled: false
            },
            grid: {
                padding: {
                    left: -10,
                    right: 0,
                    top: -30,
                    bottom: 0,
                },
            },
            colors: ['#024fad', '#5200ff'],
            stroke: {
                curve: 'smooth',
                width: '0'
            },
            yaxis: {
                labels: { show: false },
            },
            xaxis: {
                labels: { show: false },
            },
        },
    });
    return (
        <Chart options={chartData2.options} series={chartData2.series} type="area" height={90} />
    )
}

export default WalletBalanceStatus