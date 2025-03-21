import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import Chart from "react-apexcharts";
import {
  getAllFinancialYearsForDashboard,
  getApiForComplaintsDetails,
} from "../../services/contractorApi";

const ComplaintStatusCount = () => {
  const [data, setData] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);

  const fetchTransferDetails = async (year) => {
    const res = await getApiForComplaintsDetails(year);
    if (res.status) {
      setData(res.data);
    } else {
      setData([]);
    }
  };

  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYearsForDashboard();
    if (res.status) {
      const financialYears = res.data;
      setAllFinancialYear(financialYears);
      const defaultYear = financialYears[0];
      setYearValue({
        label: defaultYear.year_name,
        value: defaultYear.year_name,
      });

      fetchTransferDetails(defaultYear.year_name);
    } else {
      setAllFinancialYear([]);
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

  const valuesArray = orderedMonths.map((month) => data[month]);
  const chartData2 = {
    series: [
      {
        name: "complaints status count",
        data:
          valuesArray[0] == undefined
            ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 5, 1, 9]
            : valuesArray,
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: true,
        },
      },
      colors: ["#5200ff"],
      stroke: {
        curve: "smooth",
        width: 1,
      },
      grid: {
        padding: {
          left: 20,
          right: 0,
        },
      },
      xaxis: {
        categories: [
          "Apr",
          "May",
          "june",
          "july",
          "Aug",
          "Sep",
          "oct",
          "nov",
          "dec",
          "Jan",
          "Feb",
          "Mar",
        ],
      },
    },
  };
  return (
    <>
      <Row className="d-align justify-content-end">
        <Col md={2}>
          <Select
            placeholder={"--select--"}
            menuPortalTarget={document.body}
            options={allFinancialYear?.map((data) => ({
              label: data?.year_name,
              value: data?.year_name,
            }))}
            value={yearValue}
            onChange={(e) => {
              if (e) {
                setYearValue({ value: e?.value, label: e?.label });
                fetchTransferDetails(e?.value);
              } else {
                setYearValue(null);
              }
            }}
            isClearable
          />
        </Col>
      </Row>
      <Chart
        options={chartData2.options}
        series={chartData2.series}
        type="line"
        height={300}
      />
    </>
  );
};

export default ComplaintStatusCount;
