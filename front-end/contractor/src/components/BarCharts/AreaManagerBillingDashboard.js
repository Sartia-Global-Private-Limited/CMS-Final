import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  getAllFinancialYearsForDashboard,
  getDetailsOfAreaManagerBillingDetails,
} from "../../services/contractorApi";
import CardComponent from "../CardComponent";
import { UserDetail } from "../ItemDetail";

export default function AreaManagerBillingDashboard() {
  const [data, setData] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();

  const fetchAreaManagerBillingDetails = async (year) => {
    const res = await getDetailsOfAreaManagerBillingDetails(year);
    if (res.status) {
      setData(res.data);
    } else {
      setData([]);
    }
    setIsLoading(false);
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

      fetchAreaManagerBillingDetails(defaultYear.year_name);
    } else {
      setAllFinancialYear([]);
    }
  };

  useEffect(() => {
    showFinancialYearApi();
  }, []);

  return (
    <>
      <CardComponent
        title={t("Area Manager Billing details")}
        custom={
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
                fetchAreaManagerBillingDetails(e?.value);
              } else {
                setYearValue(null);
              }
            }}
            isClearable
          />
        }
      >
        <div className="table-scroll">
          <Table className="table-sm table Roles">
            <thead>
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("manager name")}</th>
                <th>{t("measurements amounts")}</th>
                <th>{t("performa amounts")}</th>
                <th>{t("invoices amounts")}</th>
                <th>{t("Payment Paid")}</th>
                <th>{t("Total Amount")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                </tr>
              ) : data?.length > 0 ? (
                data?.map((itm, idx) => {
                  return (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <UserDetail
                          img={itm?.manager?.image}
                          name={itm?.manager?.name}
                          id={itm?.manager?.id}
                          unique_id={itm?.manager?.employee_id}
                        />
                      </td>
                      <td>{itm?.measurements_amounts?.toFixed(2)}</td>
                      <td>{itm?.performa_amounts?.toFixed(2)}</td>
                      <td>{itm?.invoices_amounts?.toFixed(2)}</td>
                      <td>{itm?.payment_amounts?.toFixed(2) ?? "--"}</td>
                      <td>{itm?.total?.toFixed(2) ?? "--"}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </CardComponent>
    </>
  );
}
