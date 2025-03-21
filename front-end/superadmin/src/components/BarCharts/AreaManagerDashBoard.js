import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import Modaljs from "../../components/Modal";
import CardComponent from "../CardComponent";
import { UserDetail } from "../../components/ItemDetail";
import {
  getAllFinancialYearsForDashboard,
  getDetailsOfAreaManagerDetails,
  getDetailsOfComplaintInAreaManager,
} from "../../services/contractorApi";
import { toast } from "react-toastify";

export default function AreaManagerDashBoard() {
  const [data, setData] = useState([]);
  const [details, setDetails] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const [modal, setModal] = useState(false);
  const [pageDetail, setPageDetail] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();

  const fetchAreaManagerDetails = async (year) => {
    setIsLoading(true);
    const res = await getDetailsOfAreaManagerDetails(year);
    res.status ? setData(res.data) : setData([]);
    setIsLoading(false);
  };

  const handleComplaintDetails = async (item, statusType) => {
    const complaintData =
      item?.complaint_ids?.[statusType]?.split(",").map(Number) || "";
    const res = await getDetailsOfComplaintInAreaManager(
      { complaint_ids: complaintData },
      "",
      pageSize,
      pageNo
    );
    res.status ? setDetails(res.data) : toast.error(res.message);
    setPageDetail(res.pageDetails || {});
    setModal(res.status);
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
      fetchAreaManagerDetails(defaultYear.year_name);
    } else {
      setAllFinancialYear([]);
    }
  };

  useEffect(() => {
    showFinancialYearApi();
  }, [pageNo]);

  const statusTypes = [
    "pending",
    "approved",
    "working",
    "rejected",
    "resolved",
    "hold",
  ];

  return (
    <>
      <CardComponent
        title={t("Area Manager Complaint details")}
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
              setYearValue(e || null);
              fetchAreaManagerDetails(e?.value);
            }}
            isClearable
          />
        }
      >
        <div className="my-2 table-scroll">
          <Table className="table-sm table Roles">
            <thead>
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("name")}</th>
                <th>{t("Total Complaints")}</th>
                {statusTypes.map((status) => (
                  <th key={status}>{t(status)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                </tr>
              ) : data?.length > 0 ? (
                data?.map((itm, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <UserDetail
                        img={itm?.image}
                        name={itm?.name}
                        id={itm?.id}
                        unique_id={itm?.employee_id}
                      />
                    </td>
                    <td>{itm?.total_complaints}</td>
                    {statusTypes.map((status) => (
                      <td
                        key={status}
                        className={`text-${
                          itm.status[status] == 0 ? "black" : "orange"
                        } cursor-${
                          itm.status[status] == 0 ? "auto" : "pointer"
                        }`}
                        onClick={
                          itm.status[status] == 0
                            ? null
                            : () => handleComplaintDetails(itm, status)
                        }
                        aria-disabled={itm?.status[status] == 0}
                      >
                        {itm?.status[status] ?? "--"}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
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
              {details?.map((data, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{data.complaint_unique_id || "-"}</td>
                  <td>{data.complaint_type || "-"}</td>
                  <td>{data?.outlet?.map((itm) => itm.outlet_name) || "-"}</td>
                  <td>
                    {data?.regionalOffice?.map(
                      (itm) => itm.regional_office_name
                    ) || "-"}
                  </td>
                  <td>
                    {data?.saleAreaDetails?.map((itm) => itm.sales_area_name) ||
                      "-"}
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
