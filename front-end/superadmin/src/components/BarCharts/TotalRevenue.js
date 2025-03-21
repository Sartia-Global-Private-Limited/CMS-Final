import React, { useState } from 'react'
import Chart from "react-apexcharts";

const TotalRevenue = () => {
    const [chartData2] = useState({
        series: [{
            name: 'Total Revenue',
            data: [3.3, 4.8, 10.0, 7.1, 11.0, 8,]
        }],
        options: {
            colors: ['#3e88c7'],
            chart: {
                toolbar: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%',
                    dataLabels: {
                        position: 'top',
                    },
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "%";
                },
                offsetY: -20,
                style: {
                    colors: ["#09bd94"]
                }
            },

            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
            },
        },
    });
    return (
        <Chart options={chartData2.options} series={chartData2.series} type="bar" height={300} />
    )
}

export default TotalRevenue