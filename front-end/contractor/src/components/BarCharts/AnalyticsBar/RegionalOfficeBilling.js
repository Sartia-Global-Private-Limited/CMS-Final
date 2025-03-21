import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  getAllFinancialYearsForDashboard,
  getBillingDetailsOfRegionalOffice,
} from "../../../services/contractorApi";
import CardComponent from "../../CardComponent";

export default function RegionalOfficeBilling() {
  const [data, setData] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchBillingDetails = async (year) => {
    setIsLoading(true);
    const { status, data } = await getBillingDetailsOfRegionalOffice(year);
    setData(status ? data : []);
    setIsLoading(false);
  };

  const fetchFinancialYears = async () => {
    const { status, data } = await getAllFinancialYearsForDashboard();
    if (status) {
      const [defaultYear] = data;
      setFinancialYears(data);
      setSelectedYear({
        label: defaultYear.year_name,
        value: defaultYear.year_name,
      });
      fetchBillingDetails(defaultYear.year_name);
    }
  };

  useEffect(() => {
    fetchFinancialYears();
  }, []);

  const handleYearChange = (option) => {
    setSelectedYear(option);
    if (option) fetchBillingDetails(option.value);
  };

  return (
    <CardComponent
      title={t("Regional Office Billing details")}
      custom={
        <Select
          placeholder={t("--select--")}
          options={financialYears.map(({ year_name }) => ({
            label: year_name,
            value: year_name,
          }))}
          value={selectedYear}
          onChange={handleYearChange}
          isClearable
        />
      }
    >
      <div className="my-2 table-scroll">
        <Table className="table-sm table Roles">
          <thead>
            <tr>
              {[
                "Sr No.",
                "regional office",
                "measurements amounts",
                "performa amounts",
                "invoices amounts",
                "Payment Paid",
                "Total Amount",
              ].map((header) => (
                <th key={header}>{t(header)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7}>
                  <img
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                    alt="Loading"
                  />
                </td>
              </tr>
            ) : data.length ? (
              data.map((itm, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{itm?.manager?.regional_office_name}</td>
                  <td>{itm?.measurements_amounts?.toFixed(2)}</td>
                  <td>{itm?.performa_amounts?.toFixed(2)}</td>
                  <td>{itm?.invoices_amounts?.toFixed(2)}</td>
                  <td>{itm?.payment_amounts?.toFixed(2)}</td>
                  <td>{itm?.total?.toFixed(2) ?? "--"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>
                  <img
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    alt="No results"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </CardComponent>
  );
}
