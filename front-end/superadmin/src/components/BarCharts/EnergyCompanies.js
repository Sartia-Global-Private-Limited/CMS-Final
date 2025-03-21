import React, { useState } from 'react'
import Chart from "react-apexcharts";

const EnergyCompanies = () => {
    const [chartData2] = useState({
        series: [
            {
                name: "Energy Companies",
                data: [12, 11, 14, 18, 17, 13, 13]
            }
        ],
        options: {
            chart: {
                dropShadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#3e88c7'],
            dataLabels: {
                enabled: true,
            },
            stroke: {
                curve: 'smooth'
            },
            grid: {
                borderColor: 'rgba(255, 255, 255, 0.25)',
                padding: {
                    left: 30,
                    right: 0,
                    top: -16,
                    bottom: -8,
                },
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
            }
        }
    });
    return (
        <Chart options={chartData2.options} series={chartData2.series} type="line" height={300} />
    )
}

export default EnergyCompanies