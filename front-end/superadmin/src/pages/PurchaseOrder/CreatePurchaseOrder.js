import React, { useEffect } from "react";
import { Col, Form, Row, Spinner, Stack } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Field, Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { RiFileExcel2Fill } from "react-icons/ri";
import { MdDownload } from "react-icons/md";
import {
  getAllBankListForDropdown,
  getAllFromCompanies,
  getAllGstTypes,
  getAllRegionalOffice,
  getAllState,
  getCheckPoIsExists,
  getSinglePurchaseOrderById,
  getToCompanyList,
  postPurchaseOrder,
  updatePurchaseOrder,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addPoSchema } from "../../utils/formSchema";
import { Helmet } from "react-helmet";
import Papa from "papaparse";
import TablePurchaseOrder from "./TablePurchaseOrder";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";
import { FORMAT_OPTION_LABEL } from "../../components/HelperStructure";
import {
  DOWNLOAD_FILE_WITH_BACKEND,
  formatNumberToINR,
} from "../../utils/helper";
import LoaderUi from "../../components/LoaderUi";

const CreatePurchaseOrder = () => {
  const [edit, setEdit] = useState({});
  const [stateData, setStateData] = useState([]);
  const [roData, setRoData] = useState([]);
  const [gstTypesData, setGstTypesData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [allBankData, setAllBankData] = useState([]);
  const [fromCompany, setFromCompany] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toCompany, setToCompany] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchPurchaseOrderData = async () => {
    const res = await getSinglePurchaseOrderById(id);
    if (res.status) {
      setEdit(res.data);
      showROApi(res.data?.fromCompanyDetails?.unique_id);
    } else {
      setEdit([]);
    }
    setIsLoading(false);
  };

  const fetchFromCompanyList = async () => {
    const res = await getAllFromCompanies();
    if (res.status) {
      setFromCompany(res.data);
    } else {
      setFromCompany([]);
    }
  };

  const fetchToCompanyList = async () => {
    const isDropdown = true;
    const res = await getToCompanyList(isDropdown);
    if (res.status) {
      setToCompany(res.data);
    } else {
      setToCompany([]);
    }
  };

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
              if (item.name) return item;
            });

            props.setFieldValue(
              "po_items",
              data.filter((item) => item)
            );
          },
        });
      };
      reader.readAsText(file);
    }
    setLoading(false);
  };

  const showStateApi = async () => {
    const res = await getAllState();
    if (res.status) {
      setStateData(res.data);
    } else {
      setStateData([]);
    }
  };
  const showROApi = async (id) => {
    const res = await getAllRegionalOffice({ id });
    if (res.status) {
      setRoData(res.data);
    } else {
      setRoData([]);
      toast.error(res.message);
    }
  };

  const fetchAllGstTypes = async () => {
    const res = await getAllGstTypes();
    if (res.status) {
      setGstTypesData(res.data);
    } else {
      setGstTypesData([]);
    }
  };
  const fetchAllBank = async () => {
    const res = await getAllBankListForDropdown();
    if (res.status) {
      setAllBankData(res.data);
    } else {
      setAllBankData([]);
    }
  };
  const handleCheckPoIsExists = async (e, setFieldValue) => {
    const poNumber = e.target.value;
    const res = await getCheckPoIsExists(poNumber);
    if (res.status) {
      toast.error(res.message);
    }
    if (setFieldValue) {
      setFieldValue("po_number", poNumber);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchPurchaseOrderData();
    }
  }, []);

  useEffect(() => {
    fetchToCompanyList();
    fetchFromCompanyList();
    showStateApi();
    fetchAllGstTypes();
    fetchAllBank();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const totalItemAmount =
      values.po_items
        .reduce((total, item) => +item.amount + total, 0)
        .toFixed(2) || 0;

    const formData = new FormData();
    for (const key in values) {
      if (
        key !== "limit" &&
        key !== "amount" &&
        key !== "po_for" &&
        key !== "po_items"
      ) {
        formData.append(key, values[key]);
      }
    }

    formData.append(
      "limit",
      values.po_for == "1"
        ? totalItemAmount
        : parseFloat(values.limit).toFixed(2)
    );

    formData.append(
      "amount",
      values.po_for == "1" ? totalItemAmount : values.po_amount
    );
    formData.append("po_for", values.po_for.toString());

    formData.append("po_items", JSON.stringify(values?.po_items));

    if (edit?.id) {
      formData.append("id", edit?.id);
    }
    const res = edit?.id
      ? await updatePurchaseOrder(formData)
      : await postPurchaseOrder(formData);
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

  if (isLoading && id !== "new") {
    return <LoaderUi />;
  }

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "Update" : "Create"} Purchase Order · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={`${edit?.id ? t("Update") : t("Create")} ${t(
            "Purchase Order"
          )}`}
        >
          <Formik
            initialValues={{
              po_for: edit?.po_for || "1",
              from_company: edit?.fromCompanyDetails?.unique_id || "",
              to_company: edit?.toCompanyDetails?.company_id || "",
              ro_office: edit?.ro_office_id || "",
              state: edit?.state || "",
              po_date: edit?.po_date || "",
              po_number: edit?.po_number || "",
              limit: edit?.limit || "",
              po_tax: edit?.po_tax || "",
              cr_copy_title: edit?.cr_copy_title || "",
              sd_letter_title: edit?.sd_letter_title || "",
              po_amount: edit?.po_amount || "",
              security_deposit_date: edit?.security_deposit_date || "",
              security_deposit_amount: edit?.security_deposit_amount || "",
              tender_date: edit?.tender_date || "",
              tender_number: edit?.tender_number || "",
              dd_bg_number: edit?.dd_bg_number || "",
              cr_date: edit?.cr_date || "",
              cr_number: edit?.cr_number || "",
              cr_code: edit?.cr_code || "",
              cr_copy: edit?.cr_copy || null,
              sd_letter: edit?.sd_letter || null,
              work: edit?.work || "",
              bank: edit?.bank || "",
              gst_id: edit?.gst_id || "",
              gst_percent: edit?.gst_percent || "",
              total_gst: edit?.total_gst || "",
              po_items: edit?.purchase_order_item?.data || [
                {
                  order_line_number: "",
                  hsn_code: "",
                  name: "",
                  unit: "",
                  change_gst_type: "0",
                  gst_id: "",
                  gst_percent: "",
                  rate: "",
                  qty: "",
                  amount: "",
                },
              ],
            }}
            validationSchema={addPoSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {(props) => {
              const po_limit = props.values?.po_items?.reduce(
                (total, item) => +item.amount + total,
                0
              );

              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3 align-items-center">
                    {loading ? (
                      <Col className="d-flex justify-content-center">
                        <img
                          className="p-3"
                          width="250"
                          src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                          alt="Loading"
                        />
                      </Col>
                    ) : (
                      <>
                        <Form.Group as={Col} md={12}>
                          <Stack
                            className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto ${
                              edit?.id ? "cursor-none" : null
                            }`}
                            direction="horizontal"
                            gap={4}
                          >
                            <span className="ps-3">
                              {t("purchase order")}:{" "}
                            </span>
                            <label className="fw-bolder">
                              <Field
                                type="radio"
                                name="po_for"
                                value="1"
                                disabled={Boolean(edit?.id)}
                                onChange={props.handleChange}
                                className="form-check-input"
                              />
                              {t("with quantity")}
                            </label>
                            <div className={`vr hr-shadow`} />
                            <label className="fw-bolder">
                              <Field
                                type="radio"
                                name="po_for"
                                value="2"
                                disabled={Boolean(edit?.id)}
                                onChange={props.handleChange}
                                className="form-check-input"
                              />
                              {t("without quantity")}
                            </label>
                          </Stack>
                        </Form.Group>

                        <Form.Group className="ms-2" as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"from_company"}
                            formikProps={props}
                            label={t("from company")}
                            customType={"select"}
                            selectProps={{
                              data: fromCompany?.map((itm) => ({
                                label: itm.company_name,
                                value: itm.unique_id,
                              })),
                              onChange: (e) => {
                                if (e) {
                                  showROApi(e?.value);
                                }
                                props.setFieldValue("ro_office", "");
                              },
                            }}
                          />
                        </Form.Group>

                        <Form.Group className="ms-2" as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"to_company"}
                            formikProps={props}
                            label={t("to company")}
                            customType={"select"}
                            selectProps={{
                              data: toCompany?.map((itm) => ({
                                label: itm.company_name,
                                value: itm.company_id,
                              })),
                            }}
                          />
                        </Form.Group>

                        <Form.Group as={Col} md={6}>
                          <div className="shadow p-3">
                            <div className="mb-2">
                              <MyInput
                                isRequired
                                name={"ro_office"}
                                formikProps={props}
                                label={t("regional_office")}
                                customType={"select"}
                                selectProps={{
                                  data: roData?.map((itm) => ({
                                    label: itm.regional_office_name,
                                    value: itm.id,
                                  })),
                                }}
                              />
                            </div>
                            <MyInput
                              isRequired
                              name={"state"}
                              formikProps={props}
                              label={t("Select State")}
                              customType={"select"}
                              selectProps={{
                                data: stateData?.map((itm) => ({
                                  label: itm.name,
                                  value: itm.id,
                                })),
                              }}
                            />
                          </div>
                        </Form.Group>
                        <Form.Group as={Col} md={6}>
                          <div className="shadow p-3">
                            <Row>
                              <Col md={12}>
                                <div className="mb-2">
                                  <MyInput
                                    isRequired
                                    name={"po_date"}
                                    formikProps={props}
                                    label={t("po date")}
                                    type="date"
                                  />
                                </div>
                              </Col>

                              <Col md={6}>
                                <MyInput
                                  isRequired
                                  name={"po_number"}
                                  formikProps={props}
                                  label={t("PO Number")}
                                  onBlur={(e) => {
                                    if (props.values.po_number) {
                                      handleCheckPoIsExists(
                                        e,
                                        props.setFieldValue
                                      );
                                    }
                                  }}
                                />
                              </Col>
                              <Col md={6}>
                                <MyInput
                                  name={"limit"}
                                  formikProps={props}
                                  label={t("limit")}
                                  disabled={props.values.po_for == "1" && true}
                                  value={
                                    props.values.po_for == "1"
                                      ? po_limit.toFixed(2)
                                      : props.values.limit
                                  }
                                />
                              </Col>
                            </Row>
                          </div>
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                          <div className="shadow p-3">
                            <Row className="g-3 align-items-center">
                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  name={"security_deposit_amount"}
                                  formikProps={props}
                                  label={t("security deposit amount")}
                                />
                              </Form.Group>
                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  name={"security_deposit_date"}
                                  formikProps={props}
                                  label={t("security deposit date")}
                                  type="date"
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  name={"bank"}
                                  formikProps={props}
                                  label={t("Bank")}
                                  customType={"select"}
                                  selectProps={{
                                    data: allBankData?.map((itm) => ({
                                      label: itm.bank_name,
                                      value: itm.id,
                                      image: `${process.env.REACT_APP_API_URL}${itm.logo}`,
                                    })),
                                  }}
                                  formatOptionLabel={FORMAT_OPTION_LABEL}
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  isRequired
                                  name={"tender_number"}
                                  formikProps={props}
                                  label={t("tender number")}
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  isRequired
                                  name={"tender_date"}
                                  formikProps={props}
                                  label={t("tender date")}
                                  type="date"
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  name={"dd_bg_number"}
                                  formikProps={props}
                                  label={t("DD/BG No")}
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  name={"cr_number"}
                                  formikProps={props}
                                  label={t("Cr Number")}
                                />
                              </Form.Group>
                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  name={"cr_date"}
                                  formikProps={props}
                                  label={t("cr date")}
                                  type="date"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  name={"cr_code"}
                                  formikProps={props}
                                  label={t("cr code")}
                                />
                              </Form.Group>
                              <Form.Group as={Col} md={12}>
                                <Form.Label id="cr_copy" className="fw-bold">
                                  {" "}
                                  {t("cr copy")}
                                </Form.Label>
                                <div className="row">
                                  <div className="col-md-4 my-2">
                                    <MyInput
                                      name={"cr_copy_title"}
                                      formikProps={props}
                                      label={t("Title")}
                                    />
                                  </div>

                                  <div className="col-md-8 my-2">
                                    <MyInput
                                      name={"cr_copy"}
                                      formikProps={props}
                                      label={t("File")}
                                      customType={"fileUpload"}
                                    />
                                  </div>
                                </div>
                              </Form.Group>

                              <Form.Group as={Col} md={12}>
                                <Form.Label id="sd_letter" className="fw-bold">
                                  {" "}
                                  {t("sd Letter")}
                                </Form.Label>
                                <div className="row">
                                  <div className="col-md-4 my-2">
                                    <MyInput
                                      name={"sd_letter_title"}
                                      formikProps={props}
                                      label={t("Title")}
                                    />
                                  </div>

                                  <div className="col-md-8 my-2">
                                    <MyInput
                                      name={"sd_letter"}
                                      formikProps={props}
                                      label={t("File")}
                                      customType={"fileUpload"}
                                    />
                                  </div>
                                </div>
                              </Form.Group>

                              <Form.Group as={Col} md={12}>
                                <MyInput
                                  isRequired
                                  name={"work"}
                                  formikProps={props}
                                  label={t("work")}
                                  customType={"multiline"}
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  name={"gst_id"}
                                  formikProps={props}
                                  label={t("gst type")}
                                  customType={"select"}
                                  selectProps={{
                                    data: gstTypesData?.map((itm) => ({
                                      label: itm.title,
                                      value: itm.id,
                                      percentage: itm.percentage,
                                    })),
                                    onChange: (e) => {
                                      props.setFieldValue(
                                        "gst_percent",
                                        e?.percentage
                                      );
                                      if (props.values.po_for == "2") {
                                        props.setFieldValue(
                                          "po_tax",
                                          (props.values.po_amount *
                                            e?.percentage) /
                                            100
                                        );
                                      }
                                    },
                                  }}
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={2}>
                                <MyInput
                                  name={"gst_percent"}
                                  formikProps={props}
                                  label={t("gst percentage %")}
                                  disabled
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={4}>
                                <Form.Label className="fw-bolder">
                                  {t("upload excel file")}
                                </Form.Label>
                                <Form.Control
                                  type="file"
                                  accepts={[".csv", ".xls", ".xlsx"]}
                                  onChange={(e) => handleFileUpload(e, props)}
                                />
                              </Form.Group>

                              <Form.Group as={Col} md={2}>
                                <button
                                  className="shadow border-0 purple-combo cursor-pointer mt-3 px-2 py-1"
                                  type="button"
                                  onClick={() => {
                                    DOWNLOAD_FILE_WITH_BACKEND(
                                      "purchase_data.csv"
                                    );
                                  }}
                                >
                                  {" "}
                                  <RiFileExcel2Fill className="fs-4 text-green"></RiFileExcel2Fill>
                                  {t("sample excel")}{" "}
                                  <MdDownload className="fs-6 " />
                                </button>
                              </Form.Group>

                              <Form.Group as={Col} md={12}>
                                <div className="">
                                  <Row className="g-3 align-items-center">
                                    <Form.Group as={Col} md={12}>
                                      <div className="table-scroll">
                                        {props?.values?.po_items?.length >
                                          0 && (
                                          <TablePurchaseOrder
                                            props={props}
                                            edit={edit}
                                            gstTypesData={gstTypesData}
                                            loading={loading}
                                          />
                                        )}
                                      </div>
                                    </Form.Group>

                                    {props.values.po_for == "1" && (
                                      <div className=" d-flex justify-content-end fs-6 ">
                                        <div className="mx-4 fw-bold">
                                          PO Amount :{" "}
                                          <span className="text-green fw-bold">
                                            {formatNumberToINR(
                                              props.values?.po_items?.reduce(
                                                (total, item) =>
                                                  +item.amount + total,
                                                0
                                              )
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </Row>
                                </div>
                              </Form.Group>
                            </Row>
                          </div>
                        </Form.Group>

                        <Form.Group as={Col} md={12}>
                          <div className="mt-4 text-center">
                            <button
                              type={`${edit?.id ? "button" : "submit"}`}
                              onClick={() => setShowAlert(edit?.id && true)}
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
                                  PLEASE WAIT...
                                </>
                              ) : (
                                <>
                                  {edit?.id ? "UPDATE" : "CREATE"} Purchase
                                  Order
                                </>
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
    </>
  );
};

export default CreatePurchaseOrder;
