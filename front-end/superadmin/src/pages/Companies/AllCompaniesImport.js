import React, { useEffect, useState } from "react";
import { Form, Col, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdDownload } from "react-icons/md";
import { RiFileExcel2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import { uploadCompany } from "../../services/contractorApi";
import FormLabelText from "../../components/FormLabelText";
import MyInput from "../../components/MyInput";
import { getAllCitiesByStateId, getAllStates } from "../../services/generalApi";
import { importAllCompanySchema } from "../../utils/formSchema";
import { DOWNLOAD_FILE_WITH_BACKEND } from "../../utils/helper";

const AllCompaniesImport = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [allState, setAllState] = useState([]);
  const [allCity, setAllCity] = useState([]);
  const [file, setFile] = useState();

  const handleFileUpload = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchStateData = async () => {
    const res = await getAllStates();
    if (res.status) {
      setAllState(
        res?.data?.map((state) => {
          return { value: state.id, label: state.name };
        })
      );
    } else {
      setAllState([]);
    }
  };

  const fetchCityData = async (id) => {
    const res = await getAllCitiesByStateId(id);
    if (res.status) {
      setAllCity(
        res?.data?.map((state) => {
          return { value: state.id, label: state.name };
        })
      );
    } else {
      setAllCity([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("excel", file);
    formData.append("state", values.state);
    formData.append("city", values.city);

    const res = await uploadCompany(formData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    fetchStateData();
  }, []);

  return (
    <>
      <Helmet>
        <title> Company Management · CMS Electricals </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"import company"} showBackButton={true}>
          <Formik
            enableReinitialize={true}
            initialValues={{ state: "", city: "" }}
            validationSchema={importAllCompanySchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"state"}
                      formikProps={props}
                      label={t("State")}
                      customType={"select"}
                      selectProps={{
                        data: allState,
                        onChange: (e) => {
                          fetchCityData(e?.value);
                        },
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"city"}
                      formikProps={props}
                      label={t("City")}
                      customType={"select"}
                      selectProps={{
                        data: allCity,
                      }}
                    />
                  </Form.Group>
                  <Col md={6} className="my-4">
                    <Form.Label className="fw-bolder">
                      {t("upload excel file")}
                    </Form.Label>
                    <Form.Control
                      type="file"
                      accept=".csv, .xls, .xlsx"
                      onChange={(e) => handleFileUpload(e)}
                    />

                    <FormLabelText
                      info
                      children={
                        "Company Type : 1 For Sale Company, 2 For Purchase Company, 3 For Both"
                      }
                    />
                    <br />
                    <FormLabelText
                      info
                      children={"my_company : If My Company Then 1 Otherwise 0"}
                    />
                    <br />
                    <FormLabelText
                      info
                      children={
                        "enable_company_type : Do You Want Company Login Then 1 Otherwise 0"
                      }
                    />
                  </Col>
                  <Col md={6} className="my-5">
                    <button
                      className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      type="button"
                      onClick={() => {
                        DOWNLOAD_FILE_WITH_BACKEND("sample_company.xlsx");
                      }}
                    >
                      {" "}
                      <RiFileExcel2Fill className="fs-4 text-green"></RiFileExcel2Fill>
                      {t("sample excel")} <MdDownload className="fs-6 " />
                    </button>
                  </Col>
                  <Col md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`submit`}
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
                          "Import"
                        )}
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default AllCompaniesImport;
