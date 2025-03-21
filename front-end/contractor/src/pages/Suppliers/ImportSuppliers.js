import React, { useEffect, useState } from "react";
import { Form, Col, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdDownload } from "react-icons/md";
import { toast } from "react-toastify";
import { CompanyData } from "../../utils/ExcelSamples";
import { getAllBankData, importSuppliers } from "../../services/contractorApi";
import MyInput from "../../components/MyInput";
import { getAllCitiesByStateId, getAllStates } from "../../services/generalApi";
import { importSupplierSchema } from "../../utils/formSchema";
import { DOWNLOAD_FILE_WITH_BACKEND } from "../../utils/helper";
import { FORMAT_OPTION_LABEL } from "../../components/HelperStructure";

const ImportSuppliers = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [allBank, setAllBank] = useState([]);
  const [allState, setAllState] = useState([]);
  const [allCity, setAllCity] = useState([]);

  const fetchBankData = async () => {
    const res = await getAllBankData();
    if (res.status) {
      setAllBank(res.data);
    } else {
      setAllBank([]);
    }
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
    for (const key in values) {
      formData.append(key, values[key]);
    }

    const res = await importSuppliers(formData);

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
    fetchBankData();
    fetchStateData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Import Suppliers · CMS Electricals </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={"Import Suppliers"} showBackButton={true}>
          <Formik
            enableReinitialize={true}
            initialValues={{ bank_id: "", state: "", city: "", excel: "" }}
            validationSchema={importSupplierSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"bank_id"}
                      formikProps={props}
                      label={t("Bank Name")}
                      customType={"select"}
                      selectProps={{
                        data: allBank?.map((itm) => ({
                          label: itm.bank_name,
                          value: itm.id,
                          image: itm.logo
                            ? `${process.env.REACT_APP_API_URL}${itm.logo}`
                            : null,
                        })),
                        onChange: () => {
                          ["state", "city"].forEach((field) =>
                            props.setFieldValue(`${field}`, "")
                          );
                        },
                      }}
                      formatOptionLabel={FORMAT_OPTION_LABEL}
                    />
                  </Form.Group>

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
                  <Form.Group
                    as={Col}
                    md={4}
                    className="d-align justify-content-start gap-2"
                  >
                    <MyInput
                      isRequired
                      name={"excel"}
                      formikProps={props}
                      label={t("upload excel file")}
                      accepts={[".csv", ".xls", ".xlsx"]}
                      customType={"fileUpload"}
                    />
                    <button
                      className="shadow border-0 purple-combo cursor-pointer px-2 py-1"
                      type="button"
                      onClick={() => {
                        DOWNLOAD_FILE_WITH_BACKEND("sample_supplier_file.xlsx");
                      }}
                    >
                      <MdDownload className="fs-6" />
                    </button>
                  </Form.Group>

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
                            />{" "}
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

export default ImportSuppliers;
