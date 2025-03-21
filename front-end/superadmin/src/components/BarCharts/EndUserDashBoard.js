import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import {
  getAllFinancialYearsForDashboard,
  getDetailsOfComplaintInAreaManager,
  getDetailsOfEndUserDetails,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import Modaljs from "../Modal";
import CardComponent from "../CardComponent";
import { UserDetail } from "../ItemDetail";

export default function EndUserDashBoard() {
  const [data, setData] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [details, setDetails] = useState([]);

  const { t } = useTranslation();

  const fetchEndUserDetails = async (year) => {
    const res = await getDetailsOfEndUserDetails(year);
    setData(res.status ? res.data : []);
    setIsLoading(false);
  };

  const handleComplaintAction = async (item, type) => {
    const complaintData =
      item?.complaint_ids?.[type] !== null
        ? item?.complaint_ids?.[type].split(",").map(Number)
        : "";

    const res = await getDetailsOfComplaintInAreaManager({
      complaint_ids: complaintData,
    });
    if (res.status) {
      setDetails(res.data);
      setModal(true);
    } else {
      toast.error(res.message);
      setDetails([]);
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
      fetchEndUserDetails(defaultYear.year_name);
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
        title={t("End User Complaint details")}
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
              setYearValue(e ? { value: e.value, label: e.label } : null);
              if (e) fetchEndUserDetails(e?.value);
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
                <th>{t("name")}</th>
                <th>{t("Total Complaints")}</th>
                <th>{t("Pending")}</th>
                <th>{t("Approved")}</th>
                <th>{t("Working")}</th>
                <th>{t("Rejected")}</th>
                <th>{t("Resolved")}</th>
                <th>{t("Hold")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <UserDetail
                        img={item.image}
                        name={item.name}
                        id={item.id}
                        unique_id={item.employee_id}
                      />
                    </td>
                    <td>{item.total_complaints}</td>
                    {[
                      "pending",
                      "approved",
                      "working",
                      "rejected",
                      "resolved",
                      "hold",
                    ].map((status) => (
                      <td
                        key={status}
                        className={`text-${
                          item.status[status] === 0 ? "black" : "orange"
                        } cursor-${
                          item.status[status] === 0 ? "auto" : "pointer"
                        }`}
                        onClick={
                          item.status[status] === 0
                            ? () => {}
                            : () => handleComplaintAction(item, status)
                        }
                        aria-disabled={item.status[status] === 0}
                      >
                        {item.status[status] ?? "--"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
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
      <Modaljs
        open={modal}
        size={"xl"}
        closebtn={"Cancel"}
        Savebtn={"ok"}
        close={() => setModal(false)}
        title={t("Complaint Details")}
        hideFooter={true}
      >
        <div className="my-2 table-scroll">
          <Table className="table-sm table Roles">
            <thead>
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Complaint No")}</th>
                <th>{t("Complaint Type")}</th>
                <th>{t("Outlet")}</th>
                <th>{t("Regional Office")}</th>
                <th>{t("Sales Area")}</th>
                <th>{t("Order By")}</th>
                <th>{t("Company Name")}</th>
              </tr>
            </thead>
            <tbody>
              {details.length > 0 &&
                details.map((data, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{data.complaint_unique_id || "-"}</td>
                    <td>{data.complaint_type || "-"}</td>
                    <td>
                      {data.outlet
                        ? data.outlet.map((itm) => itm.outlet_name).join(", ")
                        : "-"}
                    </td>
                    <td>
                      {data.regionalOffice
                        ?.map((itm) => itm.regional_office_name)
                        .join(", ") || "-"}
                    </td>
                    <td>
                      {data.saleAreaDetails
                        ?.map((itm) => itm.sales_area_name)
                        .join(", ") || "-"}
                    </td>
                    <td>{data.order_by_details || "-"}</td>
                    <td>{data.energy_company_name || "-"}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </Modaljs>
    </>
  );
}
