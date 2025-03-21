import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Select from "react-select";
import {
  getAllFinancialYearsForDashboard,
  getAllInvoiceforDashboard,
  getAllMeasurementDetails,
  getAllPaymentforDashboard,
  getAllProformaInvoiceforDashboard,
} from "../../services/contractorApi";
import CardComponent from "../CardComponent";
import { useTranslation } from "react-i18next";

const BillingChart = () => {
  const { t } = useTranslation();
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const [chartData, setChartData] = useState({
    details: [],
    proformaInvoice: [],
    invoice: [],
    payments: [],
  });

  const fetchData = async (year) => {
    const [detailsRes, invoiceRes, proformaInvoiceRes, paymentRes] =
      await Promise.all([
        getAllMeasurementDetails(year),
        getAllInvoiceforDashboard(year),
        getAllProformaInvoiceforDashboard(year),
        getAllPaymentforDashboard(year),
      ]);

    setChartData({
      details: detailsRes?.status ? detailsRes.data?.amounts : [],
      proformaInvoice: proformaInvoiceRes?.status
        ? proformaInvoiceRes.data?.amounts
        : [],
      invoice: invoiceRes?.status ? invoiceRes.data?.amounts : [],
      payments: paymentRes?.status ? paymentRes.data?.amounts : [],
    });
  };

  const loadFinancialYears = async () => {
    const res = await getAllFinancialYearsForDashboard();
    if (res.status) {
      const defaultYear = res.data[0];
      setAllFinancialYear(res.data);
      setYearValue({
        label: defaultYear.year_name,
        value: defaultYear.year_name,
      });
      fetchData(defaultYear.year_name);
    }
  };

  useEffect(() => {
    loadFinancialYears();
  }, []);

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

  const createSeriesData = (key) =>
    orderedMonths.map((month) => chartData[key][month] || 0);

  const getMaxValue = (data) => {
    const maxVal = Math.max(...data?.flatMap((obj) => Object.values(obj)));
    return maxVal;
  };

  const format = Object.values(chartData).flat();

  const maxValueData = getMaxValue(format);

  const chartOptions = {
    chart: { toolbar: { show: true }, offsetX: -10, offsetY: 10 },
    colors: ["#4285F4", "#EA4335", "#FBBC05", "#34A853"],
    stroke: { curve: "smooth", width: 1 },
    grid: { borderColor: "transparent", padding: { left: 20, right: 10 } },
    dataLabels: { enabled: false },
    xaxis: { categories: orderedMonths.slice(0, 12).map((m) => m.slice(0, 3)) },
    noData: { text: "Empty Data" },
    yaxis: {
      min: 0,
      max: maxValueData,
      title: { text: "Rupees" },
      labels: { formatter: (value) => value.toFixed(2) },
    },
  };

  return (
    <CardComponent
      title={t("Billing chart")}
      custom={
        <Select
          placeholder={t("--select--")}
          options={allFinancialYear.map(({ year_name }) => ({
            label: year_name,
            value: year_name,
          }))}
          value={yearValue}
          onChange={(e) => {
            setYearValue(e);
            fetchData(e?.value);
          }}
          isClearable
        />
      }
    >
      <div className="bg-new p-3">
        <Chart
          options={chartOptions}
          series={[
            { name: "Measurements", data: createSeriesData("details") },
            {
              name: "Proforma Invoice",
              data: createSeriesData("proformaInvoice"),
            },
            { name: "Invoice", data: createSeriesData("invoice") },
            { name: "Total Payments", data: createSeriesData("payments") },
          ]}
          type="bar"
          height={300}
        />
      </div>
    </CardComponent>
  );
};

export default BillingChart;
