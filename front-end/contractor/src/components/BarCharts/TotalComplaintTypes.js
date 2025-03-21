import React, { useState } from "react";
import Chart from "react-apexcharts";

const TotalComplaintTypes = () => {
  const [chartData2] = useState({
    series: [76, 67, 61, 90],
    options: {
      chart: {
        height: 390,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 10,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              show: false,
            },
          },
        },
      },
      colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
      labels: [
        "54% LOREM IPSUM",
        "54% LOREM IPSUM",
        "54% LOREM IPSUM",
        "54% LOREM IPSUM",
      ],
      legend: {
        show: true,
        floating: true,
        fontSize: "13px",
        position: "left",
        offsetX: -60,
        offsetY: 0,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0,
        },
        formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
        },
        itemMargin: {
          vertical: 4,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false,
            },
          },
        },
      ],
    },
  });
  return (
    <div className="d-align h-100">
      <Chart
        options={chartData2.options}
        series={chartData2.series}
        type="radialBar"
        height={300}
      />
    </div>
  );
};

export default TotalComplaintTypes;
