import React, { useState } from 'react'
import Chart from "react-apexcharts";

const TotalPerformaInvoiceStatusCount = () => {
    const [chartData2] = useState({
        series: [{
            name: 'Peter',
            data: [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9]
        }, {
            name: 'Johnny',
            data: [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null]
        }, {
            name: 'David',
            data: [null, null, null, null, 3, 4, 1, 3, 4, 6, 7, 9, 5, null, null, null]
        }],
        options: {
            chart: {
                toolbar: {
                    show: false
                },
            },
            legend: { show: false },
            colors: ['#fc5f06', '#4a4c65', '#5181cd'],
            stroke: {
                width: [5, 5, 4],
                curve: 'straight'
            },
            labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
            xaxis: {
            },
        }
    });
    return (
        <Chart options={chartData2.options} series={chartData2.series} type="line" height={300} />
    )
}

export default TotalPerformaInvoiceStatusCount