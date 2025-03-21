import React, { useState } from "react";
import MultiSelectVisibility from "../pages/Complaints/MultiSelectVisibility";
import FormLabelText from "./FormLabelText";
import TooltipComponent from "./TooltipComponent";
import { Col, Row, Spinner } from "react-bootstrap";
import { FaFileExcel, FaRegFilePdf } from "react-icons/fa";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const ExportExcelPdf = ({
  api,
  headerNames,
  id,
  typeSelect,
  bankId,
  employeeId,
  status,
  retention_status,
}) => {
  const [column, setColumn] = useState([]);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(false);

  const { t } = useTranslation();
  const handleClickPdf = async () => {
    fetchPdfData();
  };
  const fetchPdfData = async () => {
    setIsFileLoading(true);
    const type = "2";
    const columns = JSON.stringify(column);

    let res;
    if (id) {
      res = await api(id, typeSelect, { type, columns });
    } else if (bankId) {
      res = await api(bankId, { type, columns });
    } else if (employeeId) {
      res = await api(employeeId, { type, columns });
    } else {
      res = await api({ type, columns, status, retention_status });
    }

    if (res.status) {
      toast.success(res.message);

      const filePath = res.filePath;
      const fileUrl = `${process.env.REACT_APP_API_URL}${filePath}`;
      window.open(fileUrl, "_blank");
    } else {
      toast.error(res.message);
    }
    setIsFileLoading(false);
  };
  const handleClickExcel = async () => {
    fetchData();
  };
  const fetchData = async () => {
    setIsExcelLoading(true);
    const type = "1";
    const columns = JSON.stringify(column);

    let res;
    if (id) {
      res = await api(id, typeSelect, { type, columns });
    } else if (bankId) {
      res = await api(bankId, { type, columns });
    } else if (employeeId) {
      res = await api(employeeId, { type, columns });
    } else {
      res = await api({ type, columns, status, retention_status });
    }
    if (res?.status) {
      toast.success(res?.message);

      const filePath = res?.filePath;
      const fileUrl = `${process.env.REACT_APP_API_URL}${filePath}`;
      window.open(fileUrl, "_blank");
    } else {
      toast.error(res?.message);
    }
    setIsExcelLoading(false);
  };
  return (
    <>
      <Col md="3">
        <FormLabelText children={t("Select Column For Report")} />
        <MultiSelectVisibility
          headerNames={headerNames}
          setColumn={setColumn}
          column={column}
        />
      </Col>
      <Col md={"3"}>
        <div className="d-flex gap-2">
          <TooltipComponent title={"Excel Report"}>
            <button
              className="shadow border-0 danger-combo cursor-pointer p-1"
              onClick={handleClickExcel}
              disabled={isExcelLoading}
            >
              {isExcelLoading ? (
                <>
                  <Spinner animation="border" variant="primary" size="sm" />{" "}
                  {t("PLEASE WAIT")}...
                </>
              ) : (
                <FaFileExcel className="fs-4" />
              )}
            </button>
          </TooltipComponent>
          <TooltipComponent title={"pdf report"}>
            <button
              className="shadow border-0 danger-combo cursor-pointer p-1"
              onClick={handleClickPdf}
              disabled={isFileLoading}
            >
              {isFileLoading ? (
                <>
                  <Spinner animation="border" variant="primary" size="sm" />{" "}
                  {t("PLEASE WAIT")}...
                </>
              ) : (
                <FaRegFilePdf className="fs-4" />
              )}
            </button>
          </TooltipComponent>
        </div>
      </Col>
    </>
  );
};

export default ExportExcelPdf;
