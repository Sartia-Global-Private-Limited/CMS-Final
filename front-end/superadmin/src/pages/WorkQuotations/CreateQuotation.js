import React, { useEffect } from "react";
import { Col, Form, Row, Spinner, Stack, Table } from "react-bootstrap";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import { ErrorMessage, FieldArray, Field, Formik } from "formik";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getAllComapnyData,
  getAllComplaintType,
  getAllItemsByPoId,
  getAllMyCompanyList,
  getAllPoDetails,
  getAllROData,
  getAllState,
  getEnergyCompanydata,
  getOutletOnSaId,
  getQuotationById,
  postQuotation,
  updateQuotation,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addQuotationSchema } from "../../utils/formSchema";
import TextareaAutosize from "react-textarea-autosize";
import { getSalesOnRoId } from "../../services/authapi";
import TooltipComponent from "../../components/TooltipComponent";
import { Helmet } from "react-helmet";
import ViewWorkQuotations from "./ViewWorkQuotations";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";

const CreateQuotation = () => {
  const [edit, setEdit] = useState({});
  const [companyData, setCompanyData] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [energyCompanyData, setEnergyCompanyData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [roData, setRoData] = useState([]);
  const [complaintTypeData, setComplaintTypeData] = useState([]);
  const [poAllData, setPoAllData] = useState([]);
  const [showAllPo, setShowAllPo] = useState(false);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [finalSubmit, setFinalSubmit] = useState("");
  const [allSa, setAllSa] = useState([]);
  const [allOutlet, setAllOutlet] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchQuotationData = async () => {
    const res = await getQuotationById(id);
    if (res.status) {
      setEdit(res.data[0]);
    } else {
      setEdit([]);
    }
  };

  const fetchEnergyComapanyData = async () => {
    const res = await getEnergyCompanydata();
    if (res.status) {
      setEnergyCompanyData(res.data);
    } else {
      setEnergyCompanyData([]);
    }
  };

  const showCompanyApi = async () => {
    const res = await getAllComapnyData();
    if (res.status) {
      setCompanyData(res.data);
    } else {
      setCompanyData([]);
    }
  };

  const showMyCompanyApi = async () => {
    const res = await getAllMyCompanyList(true);
    if (res.status) {
      setCompanyList(res.data);
    } else {
      setCompanyList([]);
    }
  };

  const showStateApi = async () => {
    const res = await getAllState();
    if (res.status) {
      setStateData(res.data);
    } else {
      setStateData([]);
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
  const showComplaintTypeApi = async () => {
    const res = await getAllComplaintType();
    if (res.status) {
      setComplaintTypeData(res.data);
    } else {
      setComplaintTypeData([]);
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

  const fetchItemMasterData = async (id) => {
    const res = await getAllItemsByPoId(id);
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
    }
  };

  const checkUnits = (x) => {
    switch (x) {
      case "cubic meter":
      case "cum":
      case "CUM":
      case "CUBIC METER":
        return ["length", "breadth", "depth"];

      case "square meter":
      case "SQAURE METER":
      case "SQM":
      case "sqm":
        return ["length", "breadth"];
      case "running meter":
        return ["length"];
      case "meter":
        return ["length"];
      case "each":
        return [];
      case "lump sum":
        return ["length"];
      case "set":
        return [];
      case "lot":
        return [];
      case "km":
        return [];
      case "month":
        return [];
      case "quarter":
        return [];
      case "months":
        return [];
      case "page":
        return [];
      case "man day":
        return [];
      case "litre":
        return [];
      case "pair":
        return [];
      case "inch":
        return [];
      case "KILO LITRE":
        return ["length"];
      case "VISIT":
        return [];
      case "CAN":
        return [];
      case "ACTUALS":
        return [];
      case "HOUR":
        return [];
      case "KILO GRAM":
        return [];
      case "METRIC TON":
        return [];

      default:
        return [];
    }
  };

  const handlePoChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("po_id", val);
      if (!val) return false;
      fetchItemMasterData(val.value);
    }
  };

  useEffect(() => {
    if (edit.po_id) fetchItemMasterData(edit.po_id);
  }, [edit]);

  const handleRoChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("regional_office_id", val);
      setFieldValue("sales_area_id", val);
      setFieldValue("outlet", val);
    }
    if (!val) return false;
    setAllSa([]);
    setAllOutlet([]);
    fetchSaData(val);
  };
  const handleSaChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("sales_area_id", val);
      setFieldValue("outlet", val);
    }
    if (!val) return false;
    setAllOutlet([]);
    fetchOutletData(val);
  };

  const fetchSaData = async (ro_id) => {
    const res = await getSalesOnRoId(ro_id);
    if (res.status) {
      setAllSa(res.data);
    } else {
      toast.error(res.message);
      setAllSa([]);
    }
  };

  const fetchOutletData = async (sa_id) => {
    const res = await getOutletOnSaId(sa_id);
    if (res.status) {
      setAllOutlet(res.data);
    } else {
      toast.error(res.message);
      setAllOutlet([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchQuotationData();
    }
    showCompanyApi();
    showStateApi();
    showROApi();
    showComplaintTypeApi();
    fetchAllPoData();
    showMyCompanyApi();
    fetchEnergyComapanyData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const modified_items_data = values?.items_data.map((items) => {
      return {
        ...items,
        total_qty: items.childArray.reduce((total, itm) => total + +itm.qty, 0),
      };
    });
    const sData = {
      company_from: values.company_from.value,
      company_from_state: values.company_from_state.value,
      company_to: values.company_to.value,
      company_to_regional_office: values.company_to_regional_office.value,
      quotation_date: values.quotation_date,
      regional_office_id: values.regional_office_id.value,
      sales_area_id: values.sales_area_id.value,
      outlet: values.outlet,
      po_id: values.po_id.value,
      status: !edit.id
        ? "3"
        : finalSubmit == "final_submit"
        ? "4"
        : finalSubmit == "ready_to_pi"
        ? "5"
        : edit?.status,
      items_id: values?.items_id,
      items_data: modified_items_data,
      po_number: values.po_id.label,
      complaint_type: values?.complaint_type?.value,
      quotation_type: values?.quotation_type,
      amount: values?.amount,
      remark: values.remark,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }
    const res = edit?.id
      ? await updateQuotation(sData)
      : await postQuotation(sData);
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
    <Col md={12} data-aos={"fade-up"}>
      <Helmet>
        <title>
          {type === "view" ? "View" : edit?.id ? "Update" : "Create"} Quotation
          · CMS Electricals
        </title>
      </Helmet>
      <CardComponent
        className={type === "view" && "after-bg-light"}
        title={`${
          type === "view" ? "View" : edit?.id ? "Update" : "Create"
        } Work Quotation`}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            company_from: edit.company_from
              ? {
                  label: edit?.company_from_name,
                  value: parseInt(edit.company_from),
                }
              : "",
            company_from_state: edit.company_from_state
              ? {
                  label: edit.state_name,
                  value: parseInt(edit.company_from_state),
                }
              : "",
            company_to: edit.company_to
              ? {
                  label: edit?.company_to_name,
                  value: parseInt(edit.company_to),
                }
              : "",
            company_to_regional_office: edit.company_to_regional_office
              ? {
                  label: edit.company_to_regional_office_name,
                  value: parseInt(edit.company_to_regional_office),
                }
              : "",
            quotation_date: edit?.quotation_date || "",
            regional_office_id: edit.regional_office_id
              ? {
                  label: edit.regional_office_name,
                  value: parseInt(edit.regional_office_id),
                }
              : "",
            sales_area_id: edit.sales_area_id
              ? {
                  label: edit.sales_area_name,
                  value: parseInt(edit.sales_area_id),
                }
              : "",
            outlet: edit.outlet || "",
            po_id: edit?.po_id
              ? {
                  label: edit?.po_number,
                  value: edit?.po_id,
                }
              : "",
            items_id: edit?.items_id || [],
            status: edit.status
              ? {
                  label: edit?.status === "1" ? "Active" : "De-Active",
                  value: edit.status,
                }
              : { value: "1", label: "Active" },
            items_data: edit?.items_data || [],
            po_for: edit.po_for || "",
            amount: edit?.amount || "",

            complaint_type: edit.complaint_type
              ? {
                  label: edit?.complaint_type_name,
                  value: parseInt(edit.complaint_type),
                }
              : "",

            remark: edit.remark || "",
            quotation_type: edit.quotation_type || "1",
          }}
          validationSchema={addQuotationSchema}
          onSubmit={handleSubmit}
        >
          {(props) => {
            let final_amount = 0;
            let po_used_amount = 0;
            let remaining_limit = 0;

            props.values?.items_data?.forEach((item) => {
              const item_qty = item.childArray.reduce(
                (total, itm) => total + +itm.qty,
                0
              );
              final_amount = final_amount + +item_qty * +item.rate;
            });

            let po_amount_other =
              +itemMasterData?.po_used_amount -
              (+edit?.measurement_amount || 0);

            if (props.values.po_for == "2") {
              remaining_limit =
                +itemMasterData?.po_limit - (+final_amount + +po_amount_other);
              po_used_amount = +po_amount_other + +final_amount;
            } else {
              remaining_limit =
                itemMasterData.po_limit - itemMasterData.po_used_amount;
              po_used_amount = itemMasterData.po_used_amount;
            }

            return (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3 align-items-center">
                  {type === "view" ? (
                    <ViewWorkQuotations edit={edit} />
                  ) : (
                    <>
                      <Form.Group as={Col} md={12}>
                        <Stack
                          menuPortalTarget={document.body}
                          className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto ${
                            edit?.id ? "cursor-none" : null
                          }`}
                          direction="horizontal"
                          gap={4}
                        >
                          <span className="ps-3">{t("Quotation Type")}: </span>
                          <label className="fw-bolder">
                            <Field
                              type="radio"
                              name="quotation_type"
                              value={"1"}
                              disabled={Boolean(edit?.id)}
                              checked={Boolean(
                                props.values.quotation_type == "1"
                              )}
                              onChange={() => {
                                props.setFieldValue("quotation_type", "1");
                              }}
                              className="form-check-input"
                            />
                            {t("Energy Company")}
                          </label>
                          <div className={`vr hr-shadow`} />
                          <label className="fw-bolder">
                            <Field
                              type="radio"
                              name="quotation_type"
                              value={"2"}
                              disabled={Boolean(edit?.id)}
                              checked={Boolean(
                                props.values.quotation_type == "2"
                              )}
                              onChange={() => {
                                props.setFieldValue("quotation_type", "2");
                              }}
                              className="form-check-input"
                            />
                            {t("Other Company")}
                          </label>
                        </Stack>
                      </Form.Group>

                      <Form.Group as={Col} md={6}>
                        <div className="shadow p-3">
                          <div className="mb-2">
                            <Form.Label className="fw-bolder">
                              {t("From")} <span className="text-danger">*</span>
                            </Form.Label>
                            <Select
                              className="text-primary  w-100"
                              placeholder="-- Select Company --"
                              menuPortalTarget={document.body}
                              name={"company_from"}
                              value={props.values.company_from}
                              options={
                                props?.values.quotation_type == "2"
                                  ? companyList?.map((company) => ({
                                      label: company.company_name,
                                      value: company.company_id,
                                    }))
                                  : props.values.quotation_type == "1"
                                  ? companyData?.map((otherCompany) => ({
                                      label: otherCompany.company_name,
                                      value: otherCompany.company_id,
                                    }))
                                  : ""
                              }
                              // options={companyData?.map((itm) => ({
                              //   label: itm.company_name,
                              //   value: itm.company_id,
                              // }))}
                              onChange={(selectedOption) => {
                                props.setFieldValue(
                                  "company_from",
                                  selectedOption
                                );
                                props.setFieldValue("company_to", null);
                              }}
                              onBlur={props.handleBlur}
                              isInvalid={Boolean(
                                props.touched.company_from &&
                                  props.errors.company_from
                              )}
                            />
                            <ErrorMessage
                              name="company_from"
                              component="small"
                              className="text-danger"
                            />
                          </div>

                          <Form.Label className="fw-bolder">
                            {t("Select State")}{" "}
                            <span className="text-danger">*</span>
                          </Form.Label>

                          <Select
                            className="text-primary w-100"
                            menuPortalTarget={document.body}
                            name={"company_from_state"}
                            value={props.values.company_from_state}
                            options={stateData?.map((itm) => ({
                              label: itm.name,
                              value: itm.id,
                            }))}
                            onChange={(selectedOption) => {
                              props.setFieldValue(
                                "company_from_state",
                                selectedOption
                              );
                            }}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.company_from_state &&
                                props.errors.company_from_state
                            )}
                          />
                          <ErrorMessage
                            name="company_from_state"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} md={6}>
                        <div className="shadow p-3">
                          <div className="mb-2">
                            <Form.Label className="fw-bolder">
                              {t("To")} <span className="text-danger">*</span>
                            </Form.Label>
                            <Select
                              className="text-primary w-100"
                              placeholder="-- Select Company --"
                              menuPortalTarget={document.body}
                              name={"company_to"}
                              value={props.values.company_to}
                              options={
                                props?.values.quotation_type == "1"
                                  ? energyCompanyData?.map((company) => ({
                                      label: company.name,
                                      value: company.energy_company_id,
                                    }))
                                  : props.values.quotation_type == "2"
                                  ? companyData?.map((otherCompany) => ({
                                      label: otherCompany.company_name,
                                      value: otherCompany.company_id,
                                    }))
                                  : ""
                              }
                              onChange={(selectedOption) => {
                                props.setFieldValue(
                                  "company_to",
                                  selectedOption
                                );
                              }}
                              onBlur={props.handleBlur}
                              isInvalid={Boolean(
                                props.touched.company_to &&
                                  props.errors.company_to
                              )}
                            />
                            <ErrorMessage
                              name="company_to"
                              component="small"
                              className="text-danger"
                            />
                          </div>
                          <Form.Label className="fw-bolder">
                            {t("Select Regional Office")}
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <Select
                            className="text-primary w-100"
                            menuPortalTarget={document.body}
                            name={"company_to_regional_office"}
                            value={props.values.company_to_regional_office}
                            options={roData?.map((itm) => ({
                              label: itm.regional_office_name,
                              value: itm.id,
                            }))}
                            onChange={(selectedOption) => {
                              props.setFieldValue(
                                "company_to_regional_office",
                                selectedOption
                              );
                            }}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.company_to_regional_office &&
                                props.errors.company_to_regional_office
                            )}
                          />
                          <ErrorMessage
                            name="company_to_regional_office"
                            component="small"
                            className="text-danger"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} md={12}>
                        <div className="shadow p-3">
                          <Row className="g-3 align-items-center">
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("Quotation Date")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="date"
                                name="quotation_date"
                                value={props.values.quotation_date}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.quotation_date &&
                                    props.errors.quotation_date
                                )}
                              />
                              <Form.Control.Feedback type="invalid">
                                {props.errors.quotation_date}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>{t("Regional Office")}</Form.Label>
                              <Select
                                className="text-primary w-100"
                                menuPortalTarget={document.body}
                                name={"regional_office_id"}
                                value={props.values.regional_office_id}
                                options={roData?.map((itm) => ({
                                  label: itm.regional_office_name,
                                  value: itm.id,
                                }))}
                                onChange={(val) => {
                                  handleRoChange(
                                    val.value,
                                    props.setFieldValue
                                  );
                                  props.setFieldValue(
                                    "regional_office_id",
                                    val
                                  );
                                }}
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label>{t("Sales Area")}</Form.Label>
                              <Select
                                className="text-primary w-100"
                                menuPortalTarget={document.body}
                                name={"sales_area_id"}
                                value={props.values.sales_area_id}
                                options={allSa?.map((itm) => ({
                                  label: itm.sales_area_name,
                                  value: itm.id,
                                }))}
                                onChange={(val) => {
                                  handleSaChange(
                                    val.value,
                                    props.setFieldValue
                                  );
                                  props.setFieldValue("sales_area_id", val);
                                }}
                              />
                            </Form.Group>

                            {props.values.quotation_type === "1" && (
                              <Form.Group as={Col} md={4}>
                                <MyInput
                                  isRequired
                                  name={"outlet"}
                                  formikProps={props}
                                  label={t("Outlet")}
                                  customType={"select"}
                                  selectProps={{
                                    data: allOutlet?.map((itm) => ({
                                      label: itm.outlet_name,
                                      value: itm.id,
                                    })),
                                  }}
                                />
                              </Form.Group>
                            )}

                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                {t("Complaint Type")}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Select
                                placeholder="-- Select Company Type --"
                                menuPortalTarget={document.body}
                                name={"complaint_type"}
                                value={props.values.complaint_type}
                                options={complaintTypeData?.map((itm) => ({
                                  label: itm.complaint_type_name,
                                  value: itm.id,
                                }))}
                                onChange={(selectedOption) => {
                                  props.setFieldValue(
                                    "complaint_type",
                                    selectedOption
                                  );
                                }}
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.complaint_type &&
                                    props.errors.complaint_type
                                )}
                              />
                              <ErrorMessage
                                name="complaint_type"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label className="d-flex justify-content-between">
                                <div className="w-100">
                                  {t("PO Number")}
                                  <span className="text-danger">*</span>
                                </div>
                                <Form.Check
                                  className="w-100 d-flex justify-content-end"
                                  type={"checkbox"}
                                  checked={edit.id}
                                  disabled={
                                    edit.id || props.values.items_id.length > 0
                                  }
                                  onChange={() => {
                                    setShowAllPo(!showAllPo);
                                    setItemMasterData([]);
                                  }}
                                  id={`po`}
                                  label={`Show All Po`}
                                />
                              </Form.Label>

                              <Select
                                placeholder="-- Select Po Number --"
                                menuPortalTarget={document.body}
                                isDisabled={
                                  props.values.items_id.length > 0 || edit.id
                                }
                                name={"po_id"}
                                value={props.values.po_id}
                                options={
                                  showAllPo
                                    ? poAllData?.map((itm) => ({
                                        label: itm.po_number,
                                        value: itm.id,
                                        po_for: itm.po_for,
                                      }))
                                    : []
                                }
                                onChange={(e) => {
                                  handlePoChange(e, props.setFieldValue);
                                  props.setFieldValue("po_for", e.po_for);
                                }}
                                onBlur={props.handleBlur}
                              />
                              <ErrorMessage
                                name="po_id"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={12}>
                              <Form.Label>{t("Item List")}</Form.Label>
                              <Select
                                isMulti={true}
                                closeMenuOnSelect={true}
                                name={"items_id"}
                                value={props.values.items_id}
                                options={itemMasterData?.po_items
                                  ?.filter((item) => {
                                    return !props.values.items_data.some(
                                      (sItem) =>
                                        sItem.order_line_number ==
                                        item.order_line_number
                                    );
                                  })
                                  ?.map((itm) => ({
                                    label: itm.name,
                                    value: itm.po_item_id,
                                    rate: itm.rate,
                                    hsn_code: itm.hsn_code,
                                    unit_name: itm.unit,
                                    unit_id: itm.item_unit_id,
                                    po_for: itm.po_for,
                                    order_line_number: itm.order_line_number,
                                    remaining_quantity: itm.remaining_quantity,
                                  }))}
                                onChange={(selectedOptions) => {
                                  props.setFieldValue(
                                    "items_id",
                                    selectedOptions
                                  );
                                  props.setFieldValue(
                                    "items_data",
                                    selectedOptions.map((option) => {
                                      const existingItem =
                                        props.values.items_data.find(
                                          (item) =>
                                            item.item_name == option.label
                                        );
                                      return {
                                        item_name: option.label,
                                        item_id: option.value,
                                        unit: option.unit_name,
                                        hsn_code: option.hsn_code,
                                        unit_id: option.unit_id,
                                        total_qty: option.total_qty,
                                        remaining_quantity:
                                          option.remaining_quantity,
                                        rate: option.rate,
                                        order_line_number:
                                          option.order_line_number,
                                        childArray: existingItem
                                          ? existingItem.childArray
                                          : [],
                                      };
                                    })
                                  );
                                }}
                              />
                              <ErrorMessage
                                name="items_id"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md={12}>
                              {props?.values.items_data.length > 0 ? (
                                <div className="table-scroll ">
                                  <Table
                                    striped
                                    hover
                                    className="text-body Roles"
                                  >
                                    <thead>
                                      <tr>
                                        <th>{t("Order Line Number")}</th>
                                        <th>{t("Hsn Code")}</th>
                                        <th style={{ width: "180px" }}>
                                          {t("Item Name")}
                                        </th>
                                        <th style={{ width: "100px" }}>
                                          {t("Unit")}
                                        </th>
                                        <th>{t("No.")}</th>
                                        <th>{t("Length")}</th>
                                        <th>{t("Breadth")}</th>
                                        <th>{t("Depth")}</th>
                                        <th>{t("Qty")}</th>
                                        <th>{t("Rate")}</th>
                                        <th>{t("Total Qty")}</th>
                                        <th>{t("Amount")}</th>
                                        <th>{t("Action")}</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <FieldArray name="items_data">
                                        {({ remove }) =>
                                          props?.values.items_data.map(
                                            (parentItem, parentIndex) => (
                                              <FieldArray
                                                name={`items_data.${parentIndex}.childArray`}
                                              >
                                                {({
                                                  push: pushChild,
                                                  remove: removeChild,
                                                }) => (
                                                  <>
                                                    <tr key={parentIndex}>
                                                      <td>
                                                        {
                                                          parentItem.order_line_number
                                                        }
                                                      </td>
                                                      <td>
                                                        {parentItem?.hsn_code}
                                                      </td>

                                                      <td>
                                                        <span className="fw-bold">
                                                          {parentItem.item_name}
                                                        </span>
                                                      </td>

                                                      <td>
                                                        <span>
                                                          {parentItem.unit}
                                                        </span>
                                                      </td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td></td>
                                                      <td>
                                                        <span>
                                                          ₹ {parentItem.rate}
                                                        </span>
                                                      </td>

                                                      <td>
                                                        {props.values.items_data[
                                                          parentIndex
                                                        ].childArray
                                                          .reduce(
                                                            (total, itm) =>
                                                              total + +itm.qty,
                                                            0
                                                          )
                                                          .toFixed(2)}
                                                      </td>

                                                      <td>
                                                        <span>
                                                          ₹
                                                          {(
                                                            parentItem?.childArray?.reduce(
                                                              (total, itm) =>
                                                                total +
                                                                +itm.qty,
                                                              0
                                                            ) * +parentItem.rate
                                                          )?.toFixed(2)}
                                                        </span>
                                                      </td>
                                                      <td>
                                                        <span className="">
                                                          <TooltipComponent
                                                            title={"Add Item"}
                                                            align="left"
                                                          >
                                                            <BsPlusLg
                                                              onClick={() =>
                                                                pushChild({
                                                                  description:
                                                                    "",
                                                                  no: "",
                                                                  length: "",
                                                                  breadth: "",
                                                                  depth: "",
                                                                  qty: "",
                                                                })
                                                              }
                                                              className="social-btn success-combo "
                                                            />
                                                          </TooltipComponent>
                                                        </span>
                                                      </td>
                                                    </tr>
                                                    {parentItem.childArray.map(
                                                      (
                                                        childItem,
                                                        childIndex
                                                      ) => (
                                                        <tr key={childIndex}>
                                                          <td></td>

                                                          <td></td>
                                                          <td>
                                                            <Form.Control
                                                              value={
                                                                childItem?.description
                                                              }
                                                              name={`items_data.${parentIndex}.childArray.${childIndex}.description`}
                                                              onChange={
                                                                props.handleChange
                                                              }
                                                              placeholder="description..."
                                                            />
                                                            <ErrorMessage
                                                              name={`items_data.${parentIndex}.childArray.${childIndex}.description`}
                                                              component="small"
                                                              className="text-danger"
                                                            />
                                                          </td>
                                                          <td></td>

                                                          <td>
                                                            <Form.Control
                                                              style={{
                                                                width: "50px",
                                                              }}
                                                              value={
                                                                childItem?.no
                                                              }
                                                              name={`items_data.${parentIndex}.childArray.${childIndex}.no`}
                                                              type="number"
                                                              step="any"
                                                              onChange={(e) => {
                                                                const no =
                                                                  e.target
                                                                    .value;
                                                                const length =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].length || 1;
                                                                const breadth =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].breadth ||
                                                                  1;

                                                                const depth =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].depth || 1;
                                                                const total =
                                                                  no *
                                                                  length *
                                                                  breadth *
                                                                  depth;
                                                                props.setFieldValue(
                                                                  `items_data.${parentIndex}.childArray.${childIndex}.no`,
                                                                  e.target.value
                                                                );
                                                                props.setFieldValue(
                                                                  `items_data.${parentIndex}.childArray.${childIndex}.qty`,
                                                                  total
                                                                );
                                                              }}
                                                            />
                                                            <ErrorMessage
                                                              name={`items_data.${parentIndex}.childArray.${childIndex}.no`}
                                                              component="small"
                                                              className="text-danger"
                                                            />
                                                          </td>

                                                          <td>
                                                            <Form.Control
                                                              value={
                                                                childItem?.length
                                                              }
                                                              style={{
                                                                width: "50px",
                                                              }}
                                                              type="number"
                                                              step="any"
                                                              name={`items_data.${parentIndex}.childArray.${childIndex}.length`}
                                                              onChange={(e) => {
                                                                const length =
                                                                  e.target
                                                                    .value;
                                                                const no =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].no || 1;
                                                                const breadth =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].breadth ||
                                                                  1;
                                                                const depth =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].depth || 1;
                                                                const total =
                                                                  no *
                                                                  length *
                                                                  breadth *
                                                                  depth;
                                                                props.setFieldValue(
                                                                  `items_data.${parentIndex}.childArray.${childIndex}.length`,
                                                                  e.target.value
                                                                );
                                                                props.setFieldValue(
                                                                  `items_data.${parentIndex}.childArray.${childIndex}.qty`,
                                                                  total
                                                                );
                                                              }}
                                                              disabled={
                                                                !checkUnits(
                                                                  parentItem?.unit?.toLowerCase()
                                                                ).includes(
                                                                  "length"
                                                                )
                                                              }
                                                            />
                                                            <ErrorMessage
                                                              name={`items_data.${parentIndex}.childArray.${childIndex}.length`}
                                                              component="small"
                                                              className="text-danger"
                                                            />
                                                          </td>
                                                          <td>
                                                            <Form.Control
                                                              value={
                                                                childItem?.breadth
                                                              }
                                                              name={`items_data.${parentIndex}.childArray.${childIndex}.breadth`}
                                                              style={{
                                                                width: "50px",
                                                              }}
                                                              type="number"
                                                              step="any"
                                                              onChange={(e) => {
                                                                const breadth =
                                                                  e.target
                                                                    .value;
                                                                const length =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].length || 1;
                                                                const no =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].no || 1;
                                                                const depth =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].depth || 1;
                                                                const total =
                                                                  no *
                                                                  length *
                                                                  breadth *
                                                                  depth;
                                                                props.setFieldValue(
                                                                  `items_data.${parentIndex}.childArray.${childIndex}.breadth`,
                                                                  e.target.value
                                                                );
                                                                props.setFieldValue(
                                                                  `items_data.${parentIndex}.childArray.${childIndex}.qty`,
                                                                  total
                                                                );
                                                              }}
                                                              disabled={
                                                                !checkUnits(
                                                                  parentItem?.unit?.toLowerCase()
                                                                ).includes(
                                                                  "breadth"
                                                                )
                                                              }
                                                            />
                                                            <ErrorMessage
                                                              name={`items_data.${parentIndex}.childArray.${childIndex}.breadth`}
                                                              component="small"
                                                              className="text-danger"
                                                            />
                                                          </td>

                                                          <td>
                                                            <Form.Control
                                                              value={
                                                                childItem?.depth
                                                              }
                                                              style={{
                                                                width: "50px",
                                                              }}
                                                              type="number"
                                                              step="any"
                                                              name={`items_data.${parentIndex}.childArray.${childIndex}.depth`}
                                                              onChange={(e) => {
                                                                const depth =
                                                                  e.target
                                                                    .value;
                                                                const length =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].length || 1;
                                                                const breadth =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].breadth ||
                                                                  1;
                                                                const no =
                                                                  props.values
                                                                    .items_data[
                                                                    parentIndex
                                                                  ].childArray[
                                                                    childIndex
                                                                  ].no || 1;
                                                                const total =
                                                                  no *
                                                                  length *
                                                                  breadth *
                                                                  depth;
                                                                props.setFieldValue(
                                                                  `items_data.${parentIndex}.childArray.${childIndex}.depth`,
                                                                  e.target.value
                                                                );
                                                                props.setFieldValue(
                                                                  `items_data.${parentIndex}.childArray.${childIndex}.qty`,
                                                                  total
                                                                );
                                                              }}
                                                              disabled={
                                                                !checkUnits(
                                                                  parentItem?.unit?.toLowerCase()
                                                                ).includes(
                                                                  "depth"
                                                                )
                                                              }
                                                            />
                                                            <ErrorMessage
                                                              name={`items_data.${parentIndex}.childArray.${childIndex}.depth`}
                                                              component="small"
                                                              className="text-danger"
                                                            />
                                                          </td>

                                                          <td>
                                                            <span>
                                                              {childItem?.qty &&
                                                                parseFloat(
                                                                  childItem?.qty
                                                                ).toFixed(2)}
                                                            </span>
                                                          </td>
                                                          <td></td>

                                                          <td></td>
                                                          <td></td>
                                                          <td>
                                                            <TooltipComponent
                                                              title={"Remove"}
                                                              align="left"
                                                            >
                                                              <BsDashLg
                                                                onClick={() =>
                                                                  removeChild(
                                                                    childIndex
                                                                  )
                                                                }
                                                                className="social-btn red-combo"
                                                              />
                                                            </TooltipComponent>
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                  </>
                                                )}
                                              </FieldArray>
                                            )
                                          )
                                        }
                                      </FieldArray>
                                    </tbody>
                                  </Table>
                                </div>
                              ) : null}
                            </Form.Group>

                            <Form.Group as={Col} md={12}>
                              <Form.Label>{t("Remark")}</Form.Label>
                              <TextareaAutosize
                                className="edit-textarea"
                                minRows={3}
                                name="remark"
                                value={props.values.remark}
                                onChange={props.handleChange}
                              />
                            </Form.Group>
                          </Row>
                          <div className="d-flex justify-content-end my-2">
                            <span className="fw-bold fs-6">
                              {t("Total")} ₹{final_amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} md={12}>
                        <div className="mt-4 text-center">
                          <button
                            type={`${edit.id ? "button" : "submit"}`}
                            onClick={() => {
                              setShowAlert(edit.id && true);
                              props.setFieldValue("amount", final_amount);
                            }}
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

export default CreateQuotation;
