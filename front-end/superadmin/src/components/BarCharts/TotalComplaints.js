import React, { useEffect, useState, useCallback } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import {
  getAllComplaints,
  getAllComplaintsDetails,
  getAllFinancialYearsForDashboard,
  getAllPaymentRecievedListing,
} from "../../services/contractorApi";
import CardComponent from "../CardComponent";
import { useTranslation } from "react-i18next";
import { SiMicrosoftexcel } from "react-icons/si";
import { toast } from "react-toastify";
import StatusChip from "../StatusChip";

const TotalComplaints = () => {
  const [details, setDetails] = useState({});
  const [financialData, setFinancialData] = useState({});
  const [yearValue, setYearValue] = useState(null);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [isExcelLoading, setIsExcelLoading] = useState(null);
  const { t } = useTranslation();

  const fetchAllComplaintsDetails = async (year) => {
    const res = await getAllComplaintsDetails(year);
    if (res?.status) {
      setDetails(res.data);
      setFinancialData(res.data?.financialYearData?.status || {});
    } else {
      setDetails({});
      setFinancialData({});
    }
  };

  const showFinancialYearApi = useCallback(async () => {
    const res = await getAllFinancialYearsForDashboard();
    if (res?.status) {
      const financialYears = res.data;
      const defaultYear = financialYears[0];
      setAllFinancialYear(financialYears);
      setYearValue({
        label: defaultYear.year_name,
        value: defaultYear.year_name,
      });
      fetchAllComplaintsDetails(defaultYear.year_name);
    } else {
      setAllFinancialYear([]);
    }
  }, []);

  useEffect(() => {
    showFinancialYearApi();
  }, [showFinancialYearApi]);

  const handleClickExcel = async (status) => {
    const statusMap = {
      pending: "1",
      approved: "2",
      working: "3",
      rejected: "4",
      resolved: "5",
      hold: "6",
    };
    const statusCode = statusMap[status] || "";
    await fetchData(statusCode, status);
  };

  const fetchData = async (statusCode, index) => {
    setIsExcelLoading(index);
    const res = await getAllComplaints({
      year_name: yearValue?.value,
      status: statusCode,
    });
    if (res?.status) {
      toast.success(res.message);
      window.open(`${process.env.REACT_APP_API_URL}${res.filePath}`, "_blank");
    } else {
      toast.error(res.message);
    }
    setIsExcelLoading(null);
  };

  const handlePaymentExcel = async () => {
    setIsExcelLoading("payment");
    const res = await getAllPaymentRecievedListing({
      status: 2,
      year_name: yearValue?.value,
    });
    if (res?.status) {
      toast.success(res.message);
      window.open(`${process.env.REACT_APP_API_URL}${res.filePath}`, "_blank");
    } else {
      toast.error(res.message);
    }
    setIsExcelLoading(null);
  };

  const renderComplaintCard = (count, label, status, onClick) => (
    <Col md={3} className="text-center text-primary">
      <div className="bg-new p-3 h-100">
        <Card className="card-bg h-100">
          <Card.Body>
            <div className="fw-bold">
              <span className="fs-1 text-shadow-1">{count}</span>
              <br />
              <strong className="fs-6">{<StatusChip status={label} />}</strong>
            </div>
            <div className="hr-border2 my-4" />
            <div className="d-align justify-content-between">
              {details?.currentMonthData?.current_month_and_year}
              <div className="cursor-pointer fs-5" onClick={onClick}>
                {isExcelLoading === status ? (
                  <Spinner animation="grow" size="sm" />
                ) : (
                  <SiMicrosoftexcel />
                )}
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Col>
  );

  return (
    <CardComponent
      title={t("Complaints Details")}
      custom={
        <Select
          placeholder="--select--"
          menuPortalTarget={document.body}
          options={allFinancialYear.map((data) => ({
            label: data?.year_name,
            value: data?.year_name,
          }))}
          value={yearValue}
          onChange={(selectedOption) => {
            if (selectedOption) {
              setYearValue(selectedOption);
              fetchAllComplaintsDetails(selectedOption.value);
            } else {
              setYearValue(null);
              setDetails({});
            }
          }}
          isClearable
        />
      }
    >
      <Row className="g-3">
        {renderComplaintCard(
          details?.financialYearData?.totalComplaints,
          "Total Complaints",
          "",
          () => handleClickExcel("")
        )}
        {Object.keys(financialData).map((status, i) =>
          renderComplaintCard(financialData[status], status, status, () =>
            handleClickExcel(status)
          )
        )}
        {renderComplaintCard(
          details?.getPaymentData?.financialYearCount,
          "Payment received",
          "Payment",
          handlePaymentExcel
        )}
      </Row>
    </CardComponent>
  );
};

export default TotalComplaints;
