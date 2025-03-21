import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import ImageViewer from "../ImageViewer";
import Modaljs from "../../components/Modal";
import {
  getAllFinancialYearsForDashboard,
  getDetailsOfAreaManagerDetails,
  getDetailsOfComplaintInAreaManager,
} from "../../services/contractorApi";
import { toast } from "react-toastify";

export default function RegionalOfficeDashboard() {
  const [data, setData] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { t } = useTranslation();

  const fetchTransferDetails = async (year) => {
    const res = await getDetailsOfAreaManagerDetails(year);
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

  return (
    <div>
      <Col md={12} className="my-2">
        <Row className="d-align mb-3 justify-content-end">
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
        <div className="p-20 shadow rounded h-100">
          <div className="mt-2">
            <Table className="table-sm table Roles">
              <thead>
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("name")}</th>
                  <th>{t("Total Complaints")}</th>
                  <th>{t("Pending")}</th>
                  <th>{t("approved")}</th>
                  <th>{t("Working")}</th>
                  <th>{t("Rejected")}</th>
                  <th>{t("resolved")}</th>
                  <th>{t("hold")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={7}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : data?.length > 0 ? (
                  data?.map((itm, idx) => {
                    return (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <ImageViewer
                            src={
                              itm?.image
                                ? `${process.env.REACT_APP_API_URL}${itm?.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                            }
                          >
                            <img
                              width={30}
                              height={30}
                              className="my-bg object-fit p-1 rounded-circle"
                              src={
                                itm?.image
                                  ? `${process.env.REACT_APP_API_URL}${itm?.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                              }
                            />{" "}
                            {itm?.name}
                          </ImageViewer>
                        </td>
                        <td>{itm?.total_complaints}</td>
                        <td>{itm?.status.pending ?? "--"}</td>
                        <td>{itm?.status.approved ?? "--"}</td>
                        <td>{itm?.status.working ?? "--"}</td>
                        <td>{itm?.status.rejected ?? "--"}</td>
                        <td>{itm?.status.resolved ?? "--"}</td>
                        <td>{itm?.status.hold ?? "--"}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={12}>
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
        </div>
      </Col>
    </div>
  );
}
