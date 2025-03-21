import React, { useEffect, useState, useCallback } from "react";
import Chart from "react-apexcharts";
import Select from "react-select";
import {
  getAllFinancialYearsForDashboard,
  getApiForComplaintsDetails,
} from "../../services/contractorApi";
import CardComponent from "../CardComponent";
import { useTranslation } from "react-i18next";

const orderedMonths = [
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
];

const chartOptions = {
  chart: {
    toolbar: { show: true },
    offsetX: -10,
    offsetY: 10,
  },
  colors: ["#5200ff"],
  stroke: { curve: "smooth", width: 1 },
  plotOptions: { bar: { columnWidth: "60%" } },
  grid: { borderColor: "transparent", padding: { left: 20, right: 10 } },
  dataLabels: { enabled: false },
  xaxis: {
    categories: [
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ],
  },
};

const TotalComplaint = () => {
  const [data, setData] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const { t } = useTranslation();

  const fetchTotalComplaintDetails = useCallback(async (year) => {
    const res = await getApiForComplaintsDetails(year);
    setData(res.status ? res.data : []);
  }, []);

  const showFinancialYearApi = useCallback(async () => {
    const res = await getAllFinancialYearsForDashboard();
    if (res.status) {
      const financialYears = res.data;
      setAllFinancialYear(financialYears);
      const defaultYear = financialYears[0];
      setYearValue({
        label: defaultYear.year_name,
        value: defaultYear.year_name,
      });
      fetchTotalComplaintDetails(defaultYear.year_name);
    }
  }, [fetchTotalComplaintDetails]);

  useEffect(() => {
    showFinancialYearApi();
  }, [showFinancialYearApi]);

  const valuesArray = orderedMonths.map((month) => data[month] || 0);

  const chartData = {
    series: [{ name: "complaints", data: valuesArray }],
    options: chartOptions,
  };

  return (
    <CardComponent
      title={t("Complaints Details")}
      custom={
        <Select
          placeholder={t("--select--")}
          menuPortalTarget={document.body}
          options={allFinancialYear.map((data) => ({
            label: data.year_name,
            value: data.year_name,
          }))}
          value={yearValue}
          onChange={(e) => {
            setYearValue(e ? { value: e.value, label: e.label } : null);
            if (e) fetchTotalComplaintDetails(e?.value);
          }}
          isClearable
        />
      }
    >
      <div className="bg-new p-3">
        <Chart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={300}
        />
      </div>
    </CardComponent>
  );
};

export default TotalComplaint;
