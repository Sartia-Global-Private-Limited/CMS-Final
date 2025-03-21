import React from "react";
import { Col, Row } from "react-bootstrap";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDownload } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import CardComponent from "../components/CardComponent";

export default function ExportExcelFile() {
  const location = useLocation();

  const { t } = useTranslation();
  const sampleFile = location?.state?.exportData;

  const convertToCSV = (data) => {
    const csv = data.map((row) => row.join(",")).join("\n");
    return "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
  };

  const DownloadCsvFile = async () => {
    const csvData = convertToCSV(sampleFile);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", csvData);
    downloadLink.setAttribute("download", "sampleFile.csv");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  return (
    <CardComponent showBackButton={true} title={"download file"}>
      <Row>
        <Col md={6} className="my-4 ">
          <button
            className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
            type="button"
            onClick={() => DownloadCsvFile()}
          >
            {" "}
            <RiFileExcel2Fill className="fs-4 text-green"></RiFileExcel2Fill>
            {t("sample excel")} <MdDownload className="fs-6 " />
          </button>
        </Col>
      </Row>
    </CardComponent>
  );
}
