import React, { useEffect } from "react";
import { Col, Form, Row, Spinner, Stack, Table } from "react-bootstrap";
import Select from "react-select";
import { ErrorMessage, Formik } from "formik";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getAllFinancialYears,
  getAllItemsOnMeasurementId,
  getAllPoDetails,
  getAllROData,
  getMeasurementsById,
  getPoOnRoId,
  getSingleInvoiceById,
  postInvoice,
  updateInvoice,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useState } from "react";
import { addInvoiceSchema } from "../../utils/formSchema";
import CardComponent from "../../components/CardComponent";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import moment from "moment/moment";
import ViewInvoice from "./ViewInvoice";
import { BsRecord2 } from "react-icons/bs";

const CreateInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [roData, setRoData] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const [itemsOnMeasurementId, setItemsOnMeasurementId] = useState([]);
  const [poAllDataById, setPoAllDataById] = useState([]);
  const [poAllData, setPoAllData] = useState([]);
  const [showAllpo, setShowAllpo] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;

  const fetchProformaInvoiceData = async () => {
    const res = await getSingleInvoiceById(id);
    if (res.status) {
      fetchMeasurementData(res.data.po_id);
      fetchItemsOnMeasurementId(res.data.measurement_id);
      showPoOnRoIdApi(res.data.regional_office);
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

  const showROApi = async () => {
    const res = await getAllROData();
    if (res.status) {
      setRoData(res.data);
    } else {
      setRoData([]);
    }
  };

  const handleRoChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("regional_office", val);
    }
    if (!val) return false;
    showPoOnRoIdApi(val.value);
  };

  const showPoOnRoIdApi = async (e) => {
    const res = await getPoOnRoId(e);
    if (res.status) {
      setPoAllDataById(res.data);
    } else {
      setPoAllDataById([]);
      toast.error(res.message);
    }
  };

  const handlePoChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("po_number", val);
      setFieldValue("estimate_list", "");
      setMeasurementData([]);
      setItemsOnMeasurementId([]);
    }
    if (!val) return false;
    fetchMeasurementData(val.value);
  };

  const handleItemsOnMeasurementId = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("estimate_list", val);
    }
    if (!val) return false;
    fetchItemsOnMeasurementId(val.value);
  };

  const fetchItemsOnMeasurementId = async (e) => {
    const res = await getAllItemsOnMeasurementId(e);
    if (res.status) {
      setItemsOnMeasurementId(res.data);
    } else {
      setItemsOnMeasurementId([]);
      toast.error(res.message);
    }
  };

  const fetchMeasurementData = async (e) => {
    const res = await getMeasurementsById(e);
    if (res.status) {
      setMeasurementData(res.data);
    } else {
      setMeasurementData([]);
      toast.error(res.message);
    }
  };

  const handleShowAllpo = (setFieldValue) => {
    setShowAllpo(!showAllpo);
    if (showAllpo) {
      setFieldValue("po_number", "");
      setFieldValue("estimate_list", "");
      setMeasurementData([]);
      setItemsOnMeasurementId([]);
    }
  };
  const fetchAllPoData = async () => {
    const res = await getAllPoDetails();
    if (res.status) {
      setPoAllData(res.data);
    } else {
      setPoAllData([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchProformaInvoiceData();
    }
    showFinancialYearApi();
    showROApi();
    fetchAllPoData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      invoice_date: values.invoice_date,
      due_date: values.due_date,
      financial_year: values.financial_year.value,
      regional_office: values.regional_office.value,
      po_number: values.po_number.value,
      callup_number: values.callup_number,
      estimate_list: JSON.stringify(values.estimate_list.value),
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log("values", sData);
    const res = edit?.id
      ? await updateInvoice(edit?.id, sData)
      : await postInvoice(sData);
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
        <title>
          {type === "view" ? "View" : edit?.id ? "Update" : "Create"} Invoice ·
          CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${
            type === "view" ? "View" : edit?.id ? "Update" : "Create"
          } Invoice`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              invoice_date: edit?.invoice_date
                ? moment(edit?.invoice_date).format("YYYY-MM-DD")
                : "",
              due_date: edit?.due_date
                ? moment(edit?.due_date).format("YYYY-MM-DD")
                : "",
              financial_year: edit.financial_year
                ? {
                    label: edit?.financial_year,
                    value: edit.financial_year,
                  }
                : "",
              regional_office: edit.regional_office
                ? {
                    label: edit?.regional_office_name,
                    value: edit.regional_office,
                  }
                : "",
              po_number: edit.po_number
                ? {
                    label: edit.po_number,
                    value: edit.po_id,
                  }
                : "",
              estimate_list: edit.measurement_id
                ? {
                    label: edit?.measurement_unique_id,
                    value: edit?.measurement_id,
                  }
                : "",
              callup_number: edit.callup_number || "",
            }}
            validationSchema={addInvoiceSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  {type === "view" ? (
                    <ViewInvoice
                      itemsOnMeasurementId={itemsOnMeasurementId}
                      edit={edit}
                    />
                  ) : (
                    <>
                      <Form.Group as={Col} md={6}>
                        <div className="shadow p-3">
                          <Form.Label className="fw-bolder">
                            invoice date <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="invoice_date"
                            value={props.values.invoice_date}
                            onChange={(e) => {
                              props.setFieldValue("due_date", e.target.value);
                              props.setFieldValue(
                                "invoice_date",
                                e.target.value
                              );
                            }}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.invoice_date &&
                                props.errors.invoice_date
                            )}
                          />
                          <ErrorMessage
                            name="invoice_date"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </Form.Group>
                      <Form.Group as={Col} md={6}>
                        <div className="shadow p-3">
                          <Form.Label className="fw-bolder">
                            due date <span className="text-danger">*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            name="due_date"
                            value={props.values.due_date}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.due_date && props.errors.due_date
                            )}
                          />
                          <ErrorMessage
                            name="due_date"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} md={12}>
                        <div className="shadow p-3">
                          <Row className="g-3 align-items-center">
                            {/* <Form.Group as={Col} md={6}>
                              <Form.Label>
                                Financial Year{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                name={"financial_year"}
                                value={props.values.financial_year}
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
                            </Form.Group> */}
                            <Form.Group as={Col} md={6}>
                              <Form.Label>
                                Regional Office{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Select
                                className="text-primary w-100"
                                menuPortalTarget={document.body}
                                name={"regional_office"}
                                value={props.values.regional_office}
                                options={roData?.map((itm) => ({
                                  label: itm.regional_office_name,
                                  value: itm.id,
                                }))}
                                onChange={(e) => {
                                  handleRoChange(e, props.setFieldValue);
                                  props.setFieldValue("po_number", "");
                                  props.setFieldValue("estimate_list", "");
                                  setMeasurementData([]);
                                  setItemsOnMeasurementId([]);
                                }}
                              />
                              <ErrorMessage
                                name="regional_office"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                              <Form.Label className="d-flex justify-content-between">
                                <div className="w-100">
                                  PO Number{" "}
                                  <span className="text-danger">*</span>
                                </div>
                                <Form.Check
                                  className="w-100 d-flex justify-content-end"
                                  type={"checkbox"}
                                  onChange={() =>
                                    handleShowAllpo(props.setFieldValue)
                                  }
                                  id={`po`}
                                  label={`Show All Po`}
                                />{" "}
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                name={"po_number"}
                                value={props.values.po_number}
                                options={
                                  showAllpo
                                    ? poAllData?.map((itm) => ({
                                        label: itm.po_number,
                                        value: itm.id,
                                      }))
                                    : poAllDataById?.map((itm) => ({
                                        label: itm.po_number,
                                        value: itm.id,
                                      }))
                                }
                                onChange={(e) =>
                                  handlePoChange(e, props.setFieldValue)
                                }
                              />
                              <ErrorMessage
                                name="po_number"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={6}>
                              <Form.Label>
                                Callup Number{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                maxLength={10}
                                placeholder="(123) 456-7890"
                                type="text"
                                name="callup_number"
                                value={props.values.callup_number}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.callup_number &&
                                    props.errors.callup_number
                                )}
                              />
                              <ErrorMessage
                                name="callup_number"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={12}>
                              <Form.Label>
                                Measurement List{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                name={"estimate_list"}
                                value={props.values.estimate_list}
                                options={measurementData?.map((itm) => ({
                                  label: itm.measurement_no,
                                  value: itm.measurement_id,
                                }))}
                                onChange={(e) =>
                                  handleItemsOnMeasurementId(
                                    e,
                                    props.setFieldValue
                                  )
                                }
                              />
                              <ErrorMessage
                                name="estimate_list"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            {itemsOnMeasurementId?.items_data?.length > 0 && (
                              <>
                                <Col md={12}>
                                  <div>
                                    Item List
                                    <Stack
                                      className="mt-2"
                                      direction="horizontal"
                                      gap={2}
                                    >
                                      {itemsOnMeasurementId?.items_id?.map(
                                        (itm, idd) => (
                                          <span
                                            key={idd}
                                            className="social-btn-re text-none w-auto h-auto success-combo"
                                            bg="success"
                                          >
                                            {itm?.label}
                                          </span>
                                        )
                                      )}
                                    </Stack>
                                  </div>
                                </Col>
                                <Form.Group as={Col} md={12}>
                                  <div className="overflow-auto shadow">
                                    <Table
                                      striped
                                      hover
                                      className="text-body bg-new Roles"
                                    >
                                      <thead>
                                        <tr>
                                          <th>Sr No.</th>
                                          <th>Item Name</th>
                                          <th>Unit</th>
                                          <th>No.</th>
                                          <th>Length</th>
                                          <th>Breadth</th>
                                          <th>Depth</th>
                                          <th>Qty</th>
                                          <th>Total Qty</th>
                                          <th>Rate</th>
                                          <th>Amount</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {itemsOnMeasurementId?.items_data?.map(
                                          (parentItem, parentIndex) => (
                                            <>
                                              <tr
                                                key={parentIndex}
                                                className="bg-light"
                                              >
                                                <td>{parentIndex + 1}</td>
                                                <td>{parentItem.item_name}</td>
                                                <td>{parentItem.unit}</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td>{parentItem.total_qty}</td>
                                                <td>{parentItem.rate}</td>
                                                <td>
                                                  {parentItem?.childArray?.reduce(
                                                    (total, itm) =>
                                                      total + +itm.qty,
                                                    0
                                                  ) * +parentItem.rate}
                                                </td>
                                              </tr>
                                              {parentItem?.childArray?.map(
                                                (childItem, childIndex) => (
                                                  <tr key={childIndex}>
                                                    <td></td>
                                                    <td colSpan={2}>
                                                      <BsRecord2 />{" "}
                                                      {childItem?.description}
                                                    </td>
                                                    <td>{childItem?.no}</td>
                                                    <td>{childItem?.length}</td>
                                                    <td>
                                                      {childItem?.breadth}
                                                    </td>
                                                    <td>{childItem?.depth}</td>
                                                    <td
                                                      className="text-start"
                                                      colSpan={5}
                                                    >
                                                      {childItem.qty}
                                                    </td>
                                                  </tr>
                                                )
                                              )}
                                            </>
                                          )
                                        )}
                                      </tbody>
                                    </Table>
                                  </div>
                                </Form.Group>
                              </>
                            )}
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
                                PLEASE WAIT...
                              </>
                            ) : (
                              <>{edit.id ? "UPDATE" : "SAVE"}</>
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
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateInvoice;
