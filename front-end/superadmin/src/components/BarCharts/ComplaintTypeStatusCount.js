import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { Card, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  getAllFinancialYearsForDashboard,
  getAllInvoiceforDashboard,
  getAllMeasurementDetails,
  getAllPaymentforDashboard,
  getAllProformaInvoiceforDashboard,
} from "../../services/contractorApi";
import CardComponent from "../CardComponent";
import Select from "react-select";

const ComplaintTypeStatusCount = () => {
  const { t } = useTranslation();
  const [details, setDetails] = useState({});
  const [proformaInvoice, setProformaInvoice] = useState({});
  const [invoice, setInvoice] = useState({});
  const [allPayment, setAllPayment] = useState({});
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);

  const fetchData = async (year, fetchFunc, setData) => {
    const res = await fetchFunc(year);
    setData(res?.status ? res.data.amounts : {});
  };

  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYearsForDashboard();
    if (res.status) {
      setAllFinancialYear(res.data);
      const defaultYear = res.data[0];
      setYearValue({
        label: defaultYear.year_name,
        value: defaultYear.year_name,
      });
      fetchData(defaultYear.year_name, getAllMeasurementDetails, setDetails);
      fetchData(
        defaultYear.year_name,
        getAllProformaInvoiceforDashboard,
        setProformaInvoice
      );
      fetchData(defaultYear.year_name, getAllInvoiceforDashboard, setInvoice);
      fetchData(
        defaultYear.year_name,
        getAllPaymentforDashboard,
        setAllPayment
      );
    }
  };

  useEffect(() => {
    showFinancialYearApi();
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

  const formatData = (data) => orderedMonths.map((month) => data[month] || 0);
  const maxVal = (arr) => Math.max(...arr);

  const chartOptions = (name, data, color) => ({
    series: [{ name, data }],
    options: {
      chart: { toolbar: { show: true }, offsetX: -10, offsetY: 10 },
      colors: [color],
      stroke: { curve: "smooth", width: 1 },
      dataLabels: { enabled: false },
      plotOptions: { bar: { columnWidth: "60%" } },
      grid: { borderColor: "transparent", padding: { left: 20, right: 10 } },
      xaxis: { categories: orderedMonths.map((month) => month.slice(0, 3)) },
      yaxis: {
        min: 0,
        max: maxVal(data),
        title: { text: "Rupees" },
        labels: { formatter: (value) => value.toFixed(2) },
      },
    },
  });

  const chartData = [
    {
      title: t("Total Measurement"),
      data: formatData(details),
      color: "#4285F4",
    },
    {
      title: t("Total Proforma invoice"),
      data: formatData(proformaInvoice),
      color: "#EA4335",
    },
    { title: t("Total Invoice"), data: formatData(invoice), color: "#FBBC05" },
    {
      title: t("Total Payment"),
      data: formatData(allPayment),
      color: "#34A853",
    },
  ];

  return (
    <CardComponent
      title={t("Complaint Type Status Count")}
      custom={
        <Select
          placeholder={"--select--"}
          menuPortalTarget={document.body}
          options={allFinancialYear.map((data) => ({
            label: data.year_name,
            value: data.year_name,
          }))}
          value={yearValue}
          onChange={(e) => {
            if (e) {
              setYearValue(e);
              fetchData(e?.value, getAllMeasurementDetails, setDetails);
              fetchData(
                e.value,
                getAllProformaInvoiceforDashboard,
                setProformaInvoice
              );
              fetchData(e?.value, getAllInvoiceforDashboard, setInvoice);
              fetchData(e?.value, getAllPaymentforDashboard, setAllPayment);
            } else {
              setYearValue(null);
            }
          }}
          isClearable
        />
      }
    >
      <Row className="g-4 row-cols-1 row-cols-md-2 text-center">
        {chartData.map((chart, idx) => (
          <Col key={idx}>
            <div className="bg-new p-3">
              <Card className="card-bg">
                <Card.Body>
                  <Chart
                    options={
                      chartOptions(chart.title, chart.data, chart.color).options
                    }
                    series={
                      chartOptions(chart.title, chart.data, chart.color).series
                    }
                    type="bar"
                    height={200}
                  />
                  <p className="mb-0">{chart.title}</p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        ))}
      </Row>
    </CardComponent>
  );
};

export default ComplaintTypeStatusCount;
