import React, { useState } from "react";
import { Form, Col, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdDownload } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import ViewRequestsComplaint from "./ViewRequestsComplaint";

const ImportExcelFile = ({ excelFile, api, navigateUrl, title }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [file, setFile] = useState();

  const location = useLocation();
  const data = location?.state;

  const apiFunction = data?.api;
  const sampleFile = data.excelFile;
  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("excel", file);

    const res = await apiFunction(formData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    setShowAlert(false);
  };

  return (
    <>
      <Helmet>
        <title> Company Management · CMS Electricals </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={`import ${data.title}`} showBackButton={true}>
          <Formik
            enableReinitialize={true}
            initialValues={{}}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  {type === "view" ? (
                    <ViewRequestsComplaint edit={edit} />
                  ) : (
                    <>
                      <Col md={6} className="my-4">
                        <Form.Label className="fw-bolder">
                          {t("upload excel file")}
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".csv, .xls, .xlsx"
                          onChange={(e) => handleFileUpload(e)}
                        />
                      </Col>
                      <Col md={6} className="my-5">
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
                      <Col md={12}>
                        <div className="mt-4 text-center">
                          <button
                            type={`${edit.id ? "button" : "submit"}`}
                            onClick={() => setShowAlert(edit.id && true)}
                            disabled={props?.isSubmitting}
                            className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                          >
                            {props?.isSubmitting ? (
                              <>
                                <Spinner
                                  animation="border"
                                  variant="primary"
                                  size="sm"
                                />
                                {t("PLEASE WAIT")}...
                              </>
                            ) : (
                              <>{edit.id ? t("UPDATE") : t("CREATE")}</>
                            )}
                          </button>
                          <ConfirmAlert
                            size={"sm"}
                            deleteFunction={props.handleSubmit}
                            hide={setShowAlert}
                            show={showAlert}
                            title={"Confirm UPDATE"}
                            description={
                              "Are you sure you want to update this!!"
                            }
                          />
                        </div>
                      </Col>
                    </>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default ImportExcelFile;
