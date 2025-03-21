import React, { useState } from "react";
import CardComponent from "../components/CardComponent";
import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDownload } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { OutletData } from "../utils/ExcelSamples";
import { uploadOutlets } from "../services/contractorApi";
import { toast } from "react-toastify";

export default function ImportExcelFile() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const module = location?.state?.module;
  const sampleFile = OutletData;

  const handleFileUpload = (event, props) => {
    setLoading(true);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;

        Papa.parse(text, {
          header: true,
          complete: (result) => {
            const data = result.data.map((item) => {
              if (item.energy_company_id) return item;
            });

            setResult(data.filter((item) => item));
            // navigate(-1);
          },
        });
      };
      reader.readAsText(file);
    }
    setLoading(false);
  };

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

  const handleSubmit = async () => {
    const sData = { outlets: result };
    // return console.log("sData", sData);

    const res = await uploadOutlets(sData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <>
      <CardComponent title={"import excel file"} showBackButton={true}>
        <Row>
          <Col md={6} className="">
            <Form.Label className="fw-bolder">
              {t("upload excel file")}
            </Form.Label>
            <Form.Control
              type="file"
              accept=".csv"
              onChange={(e) => handleFileUpload(e)}
            />
          </Col>

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

          <div className="d-flex justify-content-center my-4">
            <span>
              <button
                className="shadow border-0 purple-combo cursor-pointer px-2 py-1"
                onClick={() => handleSubmit()}
              >
                Save
              </button>
            </span>
          </div>
        </Row>
      </CardComponent>
    </>
  );
}
