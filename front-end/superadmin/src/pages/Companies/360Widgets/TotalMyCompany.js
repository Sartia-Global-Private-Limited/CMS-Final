import React from "react";
import Chart from "react-apexcharts";
import CardComponent from "../../../components/CardComponent";

const TotalMyCompany = ({ rows }) => {
  const chartData2 = {
    series: [
      rows?.totalCompanies?.both_company_count,
      rows?.totalCompanies?.client_company_count,
      rows?.totalCompanies?.vendor_company_count,
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        responsive: true,
      },
      legend: {
        position: "bottom",
      },
      labels: ["Both Companies", "Client Companies", "Vendor Companies"],
      tooltip: {
        enabled: true,
      },
      dataLabels: {
        enabled: true,
        formatter: (_, opts) => opts?.w?.config?.series[opts?.seriesIndex],
      },
      fill: {
        type: "gradient",
      },
      colors: ["#f16a1b", "#5200ff", "#09bd94"],
    },
  };
  return (
    <>
      <CardComponent title={"Total My Companies"} classbody={"d-align"}>
        <Chart
          options={chartData2.options}
          series={chartData2.series}
          type="donut"
          width={400}
          height={280}
        />
      </CardComponent>
    </>
  );
};

export default TotalMyCompany;
