import React from "react";
import Chart from "react-apexcharts";
import CardComponent from "../../../components/CardComponent";

const TotalVendor = ({ rows }) => {
  const chartData2 = {
    series: [
      {
        name: "Total Vendor",
        data: rows?.monthlyData?.map((item) => item?.total_vendor_company),
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: rows?.monthlyData?.map((item) => item?.month),
      },
      grid: {
        borderColor: "#EFF1F3",
      },
      colors: ["#5200ff", "#f16a1b"],
    },
  };
  return (
    <>
      <CardComponent title={"Total Vendor Companies"}>
        <Chart
          options={chartData2.options}
          series={chartData2.series}
          type="line"
          height={300}
        />
      </CardComponent>
    </>
  );
};

export default TotalVendor;
