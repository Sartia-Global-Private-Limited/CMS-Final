import React from "react";
import Chart from "react-apexcharts";
import CardComponent from "../../../components/CardComponent";

const TotalClients = ({ rows }) => {
  const chartData2 = {
    series: [
      {
        name: "Total Clients",
        data: rows?.monthlyData?.map((item) => item?.total_client_company),
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        markers: {
          radius: 12,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 2,
          horizontal: false,
          columnWidth: "55%",
        },
      },
      colors: ["#ED415D"],
      stroke: {
        show: true,
        width: 5,
        colors: ["transparent"],
      },
      xaxis: {
        categories: rows?.monthlyData?.map((item) => item?.month),
      },
      grid: {
        borderColor: "#EFF1F3",
      },
    },
  };
  return (
    <>
      <CardComponent title={"Total Client Companies"}>
        <Chart
          options={chartData2.options}
          series={chartData2.series}
          type="bar"
          height={300}
        />
      </CardComponent>
    </>
  );
};

export default TotalClients;
