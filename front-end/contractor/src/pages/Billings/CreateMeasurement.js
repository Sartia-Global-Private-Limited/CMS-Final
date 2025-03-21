import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import Select from "react-select";
import { ErrorMessage, FieldArray, Formik } from "formik";
import { BiMessageRoundedError } from "react-icons/bi";

import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  getAllFinancialYears,
  getAllItemsByPoId,
  getAllPoDetails,
  getComplainDetailsForMeasurement,
  getSingleMeasurementsById,
  postMeasurements,
  updateMeasurements,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import CardComponent from "../../components/CardComponent";
import ConfirmAlert from "../../components/ConfirmAlert";
import moment from "moment";
import { isCurrentFinancialYear } from "../../utils/helper";
import TooltipComponent from "../../components/TooltipComponent";
import { BsDashLg, BsFileEarmarkText, BsPlusLg } from "react-icons/bs";
import ViewMeasurementDetails from "./ViewMeasurementDetails";
import { Helmet } from "react-helmet";
import { addMeasurementSchema } from "../../utils/formSchema";
import ActionButton from "../../components/ActionButton";
import { Files, ReceiptText } from "lucide-react";

const CreateMeasurement = () => {
  const [edit, setEdit] = useState({});
  const location = useLocation();
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [poAllData, setPoAllData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [showAllpo, setShowAllpo] = useState(false);
  const [selectedFinYear, setSelectedFinYear] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [complainDetails, setComplainDetails] = useState({});
  const [finalSubmit, setFinalSubmit] = useState("");
  const measurementType = location?.state?.measurement_type;
  const editFrom = location?.state?.editFrom;

  const fetchMeasurementDetails = async () => {
    const res = await getSingleMeasurementsById(id);
    if (res.status) {
      setEdit(res.data?.[0]);
    } else {
      setEdit([]);
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

  const fetchComplainDetails = async () => {
    const res = await getComplainDetailsForMeasurement(id);
    if (res.status) {
      setComplainDetails(res.data);
    } else {
      setComplainDetails({});
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

  const handlePoChange = async (val, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("po_id", val);
    }
    if (!val) return false;
    fetchItemMasterData(val.value);
  };

  const getSelecteFinYear = () => {
    const finYearData = allFinancialYear.find(
      (itm) => itm.year_name === selectedFinYear
    );
    return finYearData;
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
    if (measurementType != "new") {
      fetchMeasurementDetails();
    }
    showFinancialYearApi();
    fetchAllPoData();
    fetchComplainDetails();
  }, [id]);

  useEffect(() => {
    if (edit.po_id) fetchItemMasterData(edit.po_id);
  }, [edit]);

  const fetchItemMasterData = async (id) => {
    const res = await getAllItemsByPoId(id);
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
    }
  };
  // function to check total quantity error for individual items
  const checkTotalQuantityError = (props, parentIndex) => {
    let remaining_qty;
    if (edit.id) {
      remaining_qty =
        +props.values.items_data[parentIndex].remaining_quantity +
        (+props.values.items_data[parentIndex].total_qty || 0);
    } else {
      remaining_qty = props.values.items_data[parentIndex].remaining_quantity;
    }

    const item_total_qty = props.values.items_data[
      parentIndex
    ].childArray.reduce((total, itm) => total + +itm.qty, 0);

    if (item_total_qty > remaining_qty) {
      return { item_total_qty, check: true, remaining_qty };
    } else {
      return { item_total_qty, check: false, remaining_qty };
    }
  };

  // function to check total quantity error for all items
  const checkQuantityForAllItem = (props) => {
    if (props.values.po_for == "2") return false;
    const result = props.values.items_data.map((item) => {
      const remaining_qty = edit.id
        ? +item.remaining_quantity + (+item.total_qty || 0)
        : +item.remaining_quantity;
      const item_total_qty = item.childArray.reduce(
        (total, itm) => total + +itm.qty,
        0
      );

      if (remaining_qty >= item_total_qty) return true;
      else return false;
    });
    return result.includes(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const modified_items_data = values.items_data.map((items) => {
      return {
        ...items,
        total_qty: items.childArray.reduce((total, itm) => total + +itm.qty, 0),
      };
    });

    const sData = {
      measurement_date: values.measurement_date,
      energy_company_id: complainDetails.energy_company_id,
      complaint_for: complainDetails.complaint_for,
      po_for: values.po_for,
      amount: totalAmount.toFixed(2),
      financial_year: values.financial_year.value,
      ro_office_id: !edit.id
        ? complainDetails?.regionalOffices?.[0]?.id
        : edit?.ro_office_id,
      sale_area_id: !edit.id
        ? complainDetails?.saleAreas?.[0]?.id
        : edit?.sale_area_id,
      outlet_id: !edit.id ? complainDetails?.outlets?.[0]?.id : edit?.outlet_id,
      po_id: values.po_id.value,
      status: !edit.id
        ? "3"
        : finalSubmit == "final_submit"
        ? "4"
        : finalSubmit == "ready_to_pi"
        ? "5"
        : edit?.status,
      complaint_id: !edit.id ? complainDetails?.id : edit?.complaint_id,
      items_id: values.items_id,
      items_data: modified_items_data,
      complaint_for: !edit.id
        ? complainDetails?.complaint_for
        : edit?.complaint_for,
    };

    // return console.log("sData", sData);
    if (edit.id) {
      sData["id"] = edit.id;
    }
    const res = edit?.id
      ? await updateMeasurements(sData)
      : await postMeasurements(sData);
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
          {type === "view" ? "View" : edit?.id ? "Update" : "Create"}{" "}
          Measurement · CMS Electricals
        </title>
      </Helmet>

      <CardComponent
        className={type === "view" && "after-bg-light"}
        title={`${
          type === "view" ? "View" : edit?.id ? "Update" : "Create"
        } Measurement`}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            measurement_date: edit.measurement_date
              ? moment(edit.measurement_date).format("YYYY-MM-DD")
              : moment().format("YYYY-MM-DD"),
            financial_year: edit.financial_year
              ? {
                  label: edit?.financial_year,
                  value: edit.financial_year,
                }
              : "",
            ro_office_id: complainDetails.ro_office_id
              ? {
                  label:
                    complainDetails?.regionalOffices[0].regional_office_name,
                  value: edit.ro_office_id,
                }
              : "",
            sale_area_id: edit.sale_area_id
              ? {
                  label: edit?.sales_area_name,
                  value: edit.sale_area_id,
                }
              : "",
            outlet_id: edit.outlet_id
              ? {
                  label: edit.outlet_name,
                  value: parseInt(edit.outlet_id),
                }
              : "",
            po_id: edit.po_id
              ? {
                  label: edit?.po_number,
                  value: edit.po_id,
                }
              : "",
            items_id: edit?.items_id || [],

            complaint_id: edit.complaint_id
              ? {
                  label: edit?.complaint_type_name,
                  value: parseInt(edit.complaint_id),
                }
              : "",

            status: edit.status
              ? {
                  label: edit?.status === "1" ? "Active" : "De-Active",
                  value: edit.status,
                }
              : { value: "1", label: "Active" },
            items_data: edit?.items_data || [],
            po_for: edit.po_for || "",
            amount: edit?.amount || "",
          }}
          validationSchema={addMeasurementSchema}
          onSubmit={handleSubmit}
        >
          {(props) => {
            const totalAmountValue = props?.values?.items_data.reduce(
              (total, parentItem) =>
                total +
                parentItem.childArray.reduce(
                  (total, itm) => total + +itm.qty,
                  0
                ) *
                  +parentItem.rate,
              0
            );

            let final_amount = 0;
            let po_used_amount = 0;
            let remaining_limit = 0;

            props.values.items_data.forEach((item) => {
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

            setTotalAmount(totalAmountValue);
            return (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  {type === "view" ? (
                    <ViewMeasurementDetails edit={edit} />
                  ) : (
                    <>
                      <Form.Group as={Col} md={6}>
                        <div>
                          Regional Office Name :{" "}
                          <span className="fw-bold">
                            {!edit.id
                              ? complainDetails?.regionalOffices?.[0]
                                  ?.regional_office_name
                              : edit?.regional_office_name}
                          </span>{" "}
                        </div>
                        <div>
                          Sales Area Name :{" "}
                          <span className="fw-bold">
                            {!edit.id
                              ? complainDetails?.saleAreas?.[0]?.sales_area_name
                              : edit?.sales_area_name}{" "}
                          </span>
                        </div>

                        {complainDetails?.complaint_for == "1" && (
                          <div>
                            outlet Name :{" "}
                            <span className="fw-bold">
                              {!edit.id
                                ? complainDetails?.outlets?.[0]?.outlet_name
                                : edit?.outlet_name}{" "}
                            </span>
                          </div>
                        )}
                        <div className="mb-3">
                          complaint {!edit.id ? "Number" : "Type"} :{" "}
                          <span className="fw-bold">
                            {!edit.id
                              ? complainDetails?.complaint_unique_id
                              : edit?.complaint_type_name}{" "}
                          </span>
                        </div>
                      </Form.Group>
                      <Form.Group as={Col} md={6} className="text-end">
                        <ActionButton
                          className={"justify-content-end mb-3"}
                          hideEye={"d-none"}
                          hideEdit={"d-none"}
                          hideDelete={"d-none"}
                          custom={
                            <>
                              <TooltipComponent title={"Hard Copy"}>
                                <Button
                                  className={`view-btn`}
                                  variant="light"
                                  onClick={() => {
                                    const url = `/view-measurements/${
                                      !edit.id
                                        ? complainDetails.id
                                        : edit.complaint_id
                                    }`;
                                    window.open(url, "_blank");
                                  }}
                                >
                                  <BsFileEarmarkText
                                    className={`social-btn purple-combo`}
                                  />
                                </Button>
                              </TooltipComponent>
                              <div className={`vr hr-shadow`} />
                              <TooltipComponent
                                title={
                                  <div className="text-center">
                                    Fund Amount
                                    <div className="fw-bold text-green">
                                      {complainDetails?.total_fund_amount}
                                    </div>
                                  </div>
                                }
                              >
                                <Button
                                  className={`view-btn`}
                                  variant="light"
                                  onClick={() => {
                                    const url = `/view-final-expense/${"fund"}/${
                                      !edit.id
                                        ? complainDetails?.id
                                        : edit.complaint_id
                                    }`;
                                    window.open(url, "_blank");
                                  }}
                                >
                                  <ReceiptText
                                    className={`social-btn success-combo`}
                                  />
                                </Button>
                              </TooltipComponent>
                              <div className={`vr hr-shadow`} />
                              <TooltipComponent
                                title={
                                  <div className="text-center">
                                    Stock Amount
                                    <div className="fw-bold text-green">
                                      {complainDetails?.total_stock_amount}
                                    </div>
                                  </div>
                                }
                              >
                                <Button
                                  className={`view-btn`}
                                  variant="light"
                                  onClick={() => {
                                    const url = `/view-final-expense/${"stock"}/${
                                      !edit.id
                                        ? complainDetails.id
                                        : edit.complaint_id
                                    }`;
                                    window.open(url, "_blank");
                                  }}
                                >
                                  <ReceiptText
                                    className={`social-btn danger-combo`}
                                  />
                                </Button>
                              </TooltipComponent>
                            </>
                          }
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={12}>
                        <div className="shadow p-3">
                          <Row className="g-3 align-items-center">
                            <Form.Group as={Col} md={4}>
                              <Form.Label>
                                Financial Year{" "}
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
                                  setSelectedFinYear(selectedOption.value);
                                  const finYearData = allFinancialYear.find(
                                    (itm) =>
                                      itm.year_name === selectedOption.value
                                  );

                                  props.setFieldValue(
                                    "measurement_date",
                                    isCurrentFinancialYear(finYearData)
                                      ? moment().format("YYYY-MM-DD")
                                      : finYearData.end_date
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
                                Measurement Date{" "}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                type="date"
                                name="measurement_date"
                                value={props.values.measurement_date}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                disabled={
                                  !isCurrentFinancialYear(getSelecteFinYear())
                                }
                                isInvalid={Boolean(
                                  props.touched.measurement_date &&
                                    props.errors.measurement_date
                                )}
                                min={moment(
                                  getSelecteFinYear()?.start_date
                                ).format("YYYY-MM-DD")}
                                max={moment(
                                  getSelecteFinYear()?.end_date
                                ).format("YYYY-MM-DD")}
                              />
                              <Form.Control.Feedback type="invalid">
                                {props.errors.measurement_date}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md={4}>
                              <Form.Label className="d-flex justify-content-between">
                                <div className="w-100">
                                  PO Number{" "}
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
                                    setShowAllpo(!showAllpo);
                                    setItemMasterData([]);
                                    props.setFieldValue("po_id", "");
                                  }}
                                  id={`po`}
                                  label={`Show All Po`}
                                />{" "}
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
                                  showAllpo
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

                            {props.values.po_id && (
                              <>
                                <Form.Group as={Col} md={2}>
                                  <Form.Label className="d-block">
                                    po limit
                                  </Form.Label>
                                  <Form.Control
                                    className="text-green fw-bold"
                                    value={itemMasterData?.po_limit}
                                    disabled
                                  />
                                </Form.Group>

                                <Form.Group as={Col} md={2}>
                                  <Form.Label className="d-block">
                                    po used amount
                                  </Form.Label>
                                  <Form.Control
                                    className="text-green fw-bold"
                                    value={parseFloat(po_used_amount).toFixed(
                                      2
                                    )}
                                    disabled
                                  />
                                </Form.Group>

                                <Form.Group as={Col} md={3}>
                                  <Form.Label className="d-block">
                                    Remaining Amount
                                  </Form.Label>
                                  <Form.Control
                                    className="text-green fw-bold"
                                    value={remaining_limit.toFixed(2)}
                                    disabled
                                  />
                                </Form.Group>
                              </>
                            )}

                            <Form.Group as={Col} md={12}>
                              <Form.Label>
                                Item List{" "}
                                {props.values.po_for &&
                                  (props.values.po_for == "1"
                                    ? "( With Quantity )"
                                    : "( Without Quantity )")}
                              </Form.Label>
                              <Select
                                isMulti={true}
                                menuPortalTarget={document.body}
                                closeMenuOnSelect={false}
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
                                  // ?.map((itm, idx) => ({
                                  //   label: `(${idx + 1}) ${itm.name} (${
                                  //     itm.order_line_number
                                  //   }) (${itm.unit}) (Rs. ${itm.rate})`,
                                  ?.map((itm, idx) => ({
                                    label: `(${idx + 1}) ${itm.name}`,
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
                                        {" "}
                                        <th>Order Line Number</th>
                                        <th>Hsn Code</th>
                                        <th style={{ width: "180px" }}>
                                          Item Name
                                        </th>
                                        <th style={{ width: "100px" }}>Unit</th>
                                        <th>No.</th>
                                        <th>Length</th>
                                        <th>Breadth</th>
                                        <th>Depth</th>
                                        <th>Qty</th>
                                        <th>Rate</th>
                                        <th>Total Qty</th>
                                        <th>Amount</th>
                                        <th>Action</th>
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
                                                        {props.values.po_for ==
                                                          "1" &&
                                                        checkTotalQuantityError(
                                                          props,
                                                          parentIndex
                                                        ).check ? (
                                                          <TooltipComponent
                                                            align="left"
                                                            title={`Total quantity is bigger than remaining quantity (${
                                                              checkTotalQuantityError(
                                                                props,
                                                                parentIndex
                                                              ).remaining_qty
                                                            })`}
                                                          >
                                                            <span className="text-danger">
                                                              {
                                                                checkTotalQuantityError(
                                                                  props,
                                                                  parentIndex
                                                                ).item_total_qty
                                                              }
                                                              <BiMessageRoundedError className="mx-1 fs-6" />
                                                            </span>
                                                          </TooltipComponent>
                                                        ) : (
                                                          checkTotalQuantityError(
                                                            props,
                                                            parentIndex
                                                          ).item_total_qty.toFixed(
                                                            2
                                                          )
                                                        )}
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
                          </Row>
                          <div className="d-flex justify-content-end my-2">
                            <span className="fw-bold fs-6">
                              Total ₹{final_amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} md={12}>
                        <div className="mt-4 text-center">
                          {(editFrom == "PTM" ||
                            editFrom == "draft" ||
                            editFrom == "readyToPi") && (
                            <>
                              <button
                                type={`${edit.id ? "button" : "submit"}`}
                                onClick={() => {
                                  setShowAlert(edit.id && true);
                                  setFinalSubmit("");
                                }}
                                disabled={
                                  props?.isSubmitting ||
                                  checkQuantityForAllItem(props)
                                }
                                className={`shadow border-0 ${
                                  checkQuantityForAllItem(props)
                                    ? ""
                                    : "purple-combo cursor-pointer"
                                }  px-4 py-1`}
                              >
                                {props?.isSubmitting && !finalSubmit ? (
                                  <>
                                    <Spinner
                                      animation="border"
                                      variant="primary"
                                      size="sm"
                                    />
                                    PLEASE WAIT...
                                  </>
                                ) : (
                                  <>{edit.id ? "Update" : "Create"}</>
                                )}
                              </button>
                            </>
                          )}

                          {edit.id && editFrom != "readyToPi" && (
                            <button
                              type={`${edit.id ? "button" : "submit"}`}
                              onClick={() => {
                                setFinalSubmit("final_submit");
                                setShowAlert(edit.id && true);
                              }}
                              disabled={
                                props?.isSubmitting ||
                                checkQuantityForAllItem(props)
                              }
                              className={`shadow border-0 ${
                                checkQuantityForAllItem(props)
                                  ? ""
                                  : "purple-combo cursor-pointer "
                              }  px-4 py-1 mx-3`}
                            >
                              {props?.isSubmitting &&
                              finalSubmit == "final_submit" ? (
                                <>
                                  <Spinner
                                    animation="border"
                                    variant="primary"
                                    size="sm"
                                  />
                                  PLEASE WAIT...
                                </>
                              ) : (
                                <>Final Submit</>
                              )}
                            </button>
                          )}

                          {editFrom == "final" && (
                            <button
                              type={`${edit.id ? "button" : "submit"}`}
                              onClick={() => {
                                setFinalSubmit("ready_to_pi");
                                setShowAlert(edit.id && true);
                              }}
                              // disabled={props?.isSubmitting}
                              // className="shadow border-0 purple-combo cursor-pointer px-4 py-1 mx-3"

                              disabled={
                                props?.isSubmitting ||
                                checkQuantityForAllItem(props)
                              }
                              className={`shadow border-0 ${
                                checkQuantityForAllItem(props)
                                  ? ""
                                  : "purple-combo cursor-pointer "
                              }  px-4 py-1 mx-3`}
                            >
                              {props?.isSubmitting &&
                              finalSubmit == "ready_to_pi" ? (
                                <>
                                  <Spinner
                                    animation="border"
                                    variant="primary"
                                    size="sm"
                                  />
                                  PLEASE WAIT...
                                </>
                              ) : (
                                <>Ready To PI</>
                              )}
                            </button>
                          )}
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

                          <div className="my-2">
                            {props.values.po_for == "2" &&
                              remaining_limit < 0 && (
                                <span className="text-danger">
                                  {" "}
                                  * total item amount is greater than limit
                                </span>
                              )}
                          </div>
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

export default CreateMeasurement;
