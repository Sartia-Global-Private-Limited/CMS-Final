import React, { useState, useEffect } from "react";
import { Col, Form, Row, Spinner, Table } from "react-bootstrap";
import Select from "react-select";
import { ErrorMessage, FieldArray, Formik } from "formik";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  changePoNumber,
  getAllFinancialYears,
  getAllItemsOnPoNumber,
  getAllPoBasedOnRo,
  getComplainDetailsForMeasurement,
  getSingleMeasurementsById,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import CardComponent from "../../components/CardComponent";
import ConfirmAlert from "../../components/ConfirmAlert";
import moment from "moment";
import { isCurrentFinancialYear } from "../../utils/helper";
import ViewMeasurementDetails from "./ViewMeasurementDetails";
import { Helmet } from "react-helmet";
import TooltipComponent from "../../components/TooltipComponent";
import { BiMessageRoundedError } from "react-icons/bi";

const ChangePoInMeasurement = () => {
  const [edit, setEdit] = useState({});
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [poAllData, setPoAllData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedFinYear, setSelectedFinYear] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [complainDetails, setComplainDetails] = useState({});
  const [finalSubmit, setFinalSubmit] = useState("");
  const [allItems, setAllItems] = useState([]);

  const fetchMeasurementDetails = async () => {
    const res = await getSingleMeasurementsById(id);
    if (res.status) {
      setEdit(res.data?.[0]);
      setAllItems(res.data?.[0]?.items_data);
    } else {
      setEdit([]);
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

  const getSelecteFinYear = () => {
    const finYearData = allFinancialYear.find(
      (itm) => itm.year_name === selectedFinYear
    );
    return finYearData;
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

  const fetchAllPoData = async () => {
    const res = await getAllPoBasedOnRo(edit.po_id, edit.ro_office_id);
    if (res.status) {
      setPoAllData(res.data);
    } else {
      setPoAllData([]);
    }
  };

  const getItemsOnPONumber = async (po_id, props) => {
    const res = await getAllItemsOnPoNumber(po_id?.value);

    if (res.status) {
      const newItems = res.data?.po_items;
      const items = props?.values?.items_data;

      const updatedArray = items
        .map((item) => {
          const correspondingItem = newItems?.find(
            (secondItem) =>
              secondItem?.order_line_number == item?.order_line_number
          );
          if (correspondingItem) {
            return {
              ...item,
              rate: correspondingItem?.rate,
            };
          }
          return item;
        })
        .filter((itm) => itm);

      setAllItems(updatedArray);
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

  useEffect(() => {
    showFinancialYearApi();
    fetchMeasurementDetails();
    fetchComplainDetails();
  }, [id]);

  useEffect(() => {
    if (edit.po_id) fetchAllPoData();
  }, [edit]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const items_data = values.items_data.map((item) => {
      const total = item.childArray.reduce((total, itm) => +itm.qty + total, 0);
      return {
        ...item,
        total_qty: total,
      };
    });

    const totalAmount = items_data.reduce(
      (total, item) => total + +item.rate * +item.total_qty,
      0
    );

    const sData = {
      id: edit.id,
      po_id: values?.po_id.value,
      items_data: items_data,
      po_for: values.po_for,
      amount: parseFloat(totalAmount).toFixed(2),
    };
    // return console.log("sData", sData);
    const res = await changePoNumber(sData);
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
        <title>Measurement · CMS Electricals</title>
      </Helmet>

      <CardComponent
        className={type === "view" && "after-bg-light"}
        title={"change Po Number"}
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
            po_for: edit.po_for || "",
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
            items_data: allItems || [],
            amount: edit?.amount || "",
          }}
          onSubmit={handleSubmit}
        >
          {(props) => {
            return (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  {type === "view" ? (
                    <ViewMeasurementDetails edit={edit} />
                  ) : (
                    <>
                      <Form.Group as={Col} md={12}>
                        <div>
                          Regional Office Name :
                          <span className="fw-bold">
                            {!edit.id
                              ? complainDetails?.regionalOffices?.[0]
                                  ?.regional_office_name
                              : edit?.regional_office_name}
                          </span>{" "}
                        </div>
                        <div>
                          Sales Area Name :
                          <span className="fw-bold">
                            {!edit.id
                              ? complainDetails?.saleAreas?.[0]?.sales_area_name
                              : edit?.sales_area_name}{" "}
                          </span>
                        </div>
                        {complainDetails?.complaint_for == "1" && (
                          <div>
                            outlet Name :
                            <span className="fw-bold">
                              {!edit.id
                                ? complainDetails?.outlets?.[0]?.outlet_name
                                : edit?.outlet_name}{" "}
                            </span>
                          </div>
                        )}
                        <div className="">
                          complain Number :
                          <span className="fw-bold">
                            {!edit.id
                              ? complainDetails?.complaint_unique_id
                              : edit?.complaint_type_name}{" "}
                          </span>
                        </div>

                        <div className="mb-3">
                          PO Number :
                          <span className="fw-bold">{edit?.po_number}</span>
                        </div>
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
                                isDisabled={true}
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
                              </Form.Label>

                              <Select
                                placeholder="-- Select Po Number --"
                                menuPortalTarget={document.body}
                                name={"po_id"}
                                value={props.values.po_id}
                                options={poAllData?.map((itm) => ({
                                  label: itm.po_number,
                                  value: itm.purchase_order_id,
                                }))}
                                onChange={(e) => {
                                  setEdit({
                                    ...edit,
                                    po_id: e?.value,
                                    po_number: e?.label,
                                  });
                                  getItemsOnPONumber(e, props);
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
                              <Form.Label>Item List</Form.Label>

                              <Select
                                isMulti
                                closeMenuOnSelect={false}
                                name={"items_id"}
                                value={props.values.items_id}
                                isDisabled={true}
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
                                        <th>Total Qty</th>
                                        <th>Rate</th>
                                        <th>Amount</th>
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
                                                        {
                                                          <span>
                                                            ₹ {parentItem.rate}
                                                          </span>
                                                        }
                                                      </td>
                                                      <td>
                                                        ₹
                                                        {parseFloat(
                                                          parentItem.rate *
                                                            checkTotalQuantityError(
                                                              props,
                                                              parentIndex
                                                            ).item_total_qty
                                                        ).toFixed(2)}
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
                        </div>
                      </Form.Group>

                      <Form.Group as={Col} md={12}>
                        <div className="mt-4 text-center">
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
                              <>{edit.id ? "Save" : "SAVE"}</>
                            )}
                          </button>

                          <ConfirmAlert
                            size={"sm"}
                            deleteFunction={props.handleSubmit}
                            hide={setShowAlert}
                            show={showAlert}
                            title={"Confirm change po"}
                            description={
                              "Are you sure you want to change po !!"
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

export default ChangePoInMeasurement;
