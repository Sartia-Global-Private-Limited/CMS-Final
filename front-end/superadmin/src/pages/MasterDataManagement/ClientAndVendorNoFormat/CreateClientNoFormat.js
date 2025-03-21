import React, { useState, useEffect } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { ErrorMessage, Formik } from "formik";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getAllFinancialYears,
  getSingleClientNoFormatById,
  postBillNoFormat,
  postClientNoFormat,
  updateBillNoFormat,
  updateClientNoFormat,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import {
  addBillNoFormatSchema,
  addClientNoFormatSchema,
} from "../../../utils/formSchema";
import CardComponent from "../../../components/CardComponent";
import ConfirmAlert from "../../../components/ConfirmAlert";
import moment from "moment";
import { Helmet } from "react-helmet";
import { getSingleBillNoFormatById } from "../../../services/contractorApi";
import { useTranslation } from "react-i18next";

const CreateClientNoFormat = () => {
  const { id } = useParams();
  const [edit, setEdit] = useState({});
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const { t } = useTranslation();
  const fetchClientNoFormatDetails = async () => {
    const res = await getSingleClientNoFormatById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYears();
    if (res.status) {
      setAllFinancialYear(res.data);
    } else {
      setAllFinancialYear([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchClientNoFormatDetails();
    }
    showFinancialYearApi();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      prefix: values.prefix,
      financial_year_format: values.financial_year_format.value,
      start_company_number: values.start_company_number,
      financial_year: values.financial_year.value,
      separation_symbol: values.separation_symbol.value,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log("sData", sData);
    const res = edit?.id
      ? await updateClientNoFormat(sData)
      : await postClientNoFormat(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };
  return (
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>
          {type === "view" ? "View" : edit?.id ? "Update" : "Create"} Client And
          Vendor Number Format · CMS Electricals
        </title>
      </Helmet>
      <CardComponent
        className={type === "view" && "after-bg-light"}
        title={`${
          type === "view" ? "View" : edit?.id ? t("Update") : t("Create")
        } ${t("Client Number And Vendor Format")}`}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            prefix: edit?.prefix || "",
            financial_year_format: edit.financial_year_format
              ? {
                  label: edit?.financial_year_format,
                  value: edit.financial_year_format,
                }
              : "",
            start_company_number: edit?.start_company_number || "",
            financial_year: edit.financial_year
              ? {
                  label: edit?.financial_year,
                  value: edit.financial_year,
                }
              : "",
            separation_symbol: edit.separation_symbol
              ? {
                  label: edit?.separation_symbol,
                  value: edit.separation_symbol,
                }
              : "",
          }}
          validationSchema={addClientNoFormatSchema}
          onSubmit={handleSubmit}
        >
          {(props) => {
            const financialYear =
              props?.values?.financial_year?.value ||
              `${moment().year()}-${moment().add(1, "year").format("YY")}`;

            // const financialYear = "2023-24";
            const [startYear, endYear] = financialYear?.split("-");
            const format1 = `${startYear}-${startYear?.slice(0, 2)}${endYear}`;
            const format2 = `${startYear}-${endYear?.slice(-2)}`;
            const format3 = `${startYear}${startYear?.slice(0, 2)}${endYear}`;
            const format4 = `${startYear?.slice(-2)}${endYear?.slice(-2)}`;
            const financialYearFormat = [format1, format2, format3, format4];
            return (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  {type === "view" ? (
                    // <ViewMeasurementDetails edit={edit} />
                    "view"
                  ) : (
                    <>
                      <Form.Group as={Col} md={12}>
                        <div className="shadow p-3">
                          <Row className="g-3 align-items-center">
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("Prefix")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="prefix"
                                value={props.values.prefix}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                              />
                              <ErrorMessage
                                name="prefix"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("Financial Year")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                name={"financial_year"}
                                value={props.values.financial_year}
                                onBlur={props.handleBlur}
                                options={allFinancialYear?.map((year) => ({
                                  label: year.year_name,
                                  value: year.year_name,
                                }))}
                                onChange={(selectedOption) => {
                                  props.setFieldValue(
                                    "financial_year",
                                    selectedOption
                                  );
                                }}
                              />
                              <ErrorMessage
                                name="financial_year"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("Financial Year Format")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                name={"financial_year_format"}
                                value={props.values.financial_year_format}
                                onBlur={props.handleBlur}
                                options={financialYearFormat?.map((itm) => ({
                                  label: itm,
                                  value: itm,
                                }))}
                                onChange={(selectedOption) => {
                                  props.setFieldValue(
                                    "financial_year_format",
                                    selectedOption
                                  );
                                }}
                              />
                              <ErrorMessage
                                name="financial_year_format"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("Start Client And Vendor Number")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="start_company_number"
                                value={props.values.start_company_number}
                                onChange={(e) => {
                                  const cleanedValue = e.target.value.replace(
                                    /[^0-9]/g,
                                    ""
                                  );
                                  props.handleChange("start_company_number")(
                                    cleanedValue
                                  );
                                }}
                                onBlur={props.handleBlur}
                              />
                              <ErrorMessage
                                name="start_company_number"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>

                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("symbol separation")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <CreatableSelect
                                menuPortalTarget={document.body}
                                name={"separation_symbol"}
                                value={props.values.separation_symbol}
                                onBlur={props.handleBlur}
                                formatCreateLabel={(inputText) =>
                                  `add new "${inputText}"`
                                }
                                options={[
                                  {
                                    label: `-`,
                                    value: `-`,
                                  },
                                  {
                                    label: `/`,
                                    value: `/`,
                                  },
                                  {
                                    label: `type for add more symbol.`,
                                    value: `type for add more symbol.`,
                                    isDisabled: true,
                                  },
                                ]}
                                onChange={(selectedOption) => {
                                  props.setFieldValue(
                                    "separation_symbol",
                                    selectedOption
                                  );
                                }}
                              />
                              {/* <Form.Text muted>
                                Your password must be 8-20 characters.
                              </Form.Text> */}
                              <ErrorMessage
                                name="separation_symbol"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>

                            {props.values.prefix &&
                            props.values.financial_year_format &&
                            props.values.separation_symbol &&
                            props.values.start_company_number ? (
                              <Form.Group as={Col} md="4">
                                <Form.Label>
                                  {t("Sample Client no format")}
                                </Form.Label>
                                <Form.Control
                                  disabled
                                  value={
                                    props.values.prefix +
                                    props.values.separation_symbol.value +
                                    props.values.financial_year_format.value +
                                    props.values.separation_symbol.value +
                                    props.values.start_company_number
                                  }
                                  className="purple-combo"
                                />
                              </Form.Group>
                            ) : null}
                          </Row>
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} md={12}>
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
                      </Form.Group>
                    </>
                  )}
                </Row>
              </Form>
            );
          }}
        </Formik>
      </CardComponent>
    </Col>
  );
};

export default CreateClientNoFormat;
