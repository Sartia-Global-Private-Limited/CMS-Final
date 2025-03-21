import React, { useState } from "react";
import Chart from "react-apexcharts";

const TotalMeasurementStatusCount = () => {
  const [chartData2] = useState({
    series: [25, 15],
    options: {
      chart: {
        width: "100%",
      },
      colors: ["#018a7c", "#5200ff"],
      labels: ["LOREM IPSUM", "LOREM IPSUM"],
      plotOptions: {
        pie: {
          dataLabels: {
            offset: -35,
          },
        },
      },
      legend: {
        show: false,
      },
    },
  });
  return (
    <Chart
      options={chartData2.options}
      series={chartData2.series}
      type="pie"
      height={300}
    />
  );
};

export default TotalMeasurementStatusCount;
