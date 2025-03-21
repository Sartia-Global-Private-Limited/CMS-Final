import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner, Stack, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import TextareaAutosize from "react-textarea-autosize";
import Select from "react-select";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CardComponent from "../../components/CardComponent";
import {
  getAllGstTypes,
  getAllItemMasterForDropdown,
  getAllPreviousItemsStockList,
  getAllSuppliers,
  getStockRequestById,
  postStockRequest,
  postStockRequestStatus,
  updateStockRequest,
} from "../../services/contractorApi";
import TooltipComponent from "../../components/TooltipComponent";
import { BsDashLg, BsPlusLg, BsTrash } from "react-icons/bs";
import { ViewStockRequestDetails } from "./ViewStockRequestDetails";
import {
  addStockRequestApproveSchema,
  addStockRequestSchema,
} from "../../utils/formSchema";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { OtherRequest } from "../FundManagement/FundRequest/OtherRequest";
import { ApprovedStockTableView } from "./ApprovedStockTableView";
import { CreateBillImages } from "./CreateBillImages";
import { NewItemTableView } from "./NewItemTableView";
import { useTranslation } from "react-i18next";
import { GroupTable } from "../../components/GroupTable";

const CreateStockRequest = () => {
  const { user } = useSelector(selectUser);
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [gstTypesData, setGstTypesData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);
  const [allOldItems, setAllOldItems] = useState([]);
  const [allBrand, setAllBrand] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchSuppliersData();
  }, []);

  const fetchSingleData = async () => {
    const res = await getStockRequestById(id);
    if (res.status) {
      setEdit(res.data);
      res.data.request_stock.request_stock.map((e, index) => {
        setAllBrand((prevData) => {
          return { ...prevData, [index]: e.item_name.rates };
        });
      });

      if (type == "approve") fetchAllPreviousItem(res.data?.requested_for);
    } else {
      setEdit([]);
    }
  };

  const fetchAllPreviousItem = async (id) => {
    const res = await getAllPreviousItemsStockList(id);
    if (res.status) {
      setAllOldItems(res.data);
    } else {
      setAllOldItems([]);
    }
  };

  const fetchSuppliersData = async () => {
    const isDropdown = "true";
    const res = await getAllSuppliers({ isDropdown });
    if (res.status) {
      setSuppliersData(res.data);
    } else {
      setSuppliersData([]);
    }
  };

  const fetchItemMasterData = async () => {
    const category = "stock";
    const res = await getAllItemMasterForDropdown(category);
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
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

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const totalPriceGst = values?.request_stock_by_user.reduce(
      (total, user) => total + +user.gst_percent,
      0
    );
    const modifiedRequest = values?.request_stock_by_user?.map((item) => {
      var RequestQty_old_items =
        item.request_stock.reduce(
          (total, itm) => total + +itm.request_quantity,
          0
        ) || 0;

      var approveQty_old_items =
        item.request_stock.reduce(
          (total, itm) => total + +itm.approve_quantity,
          0
        ) || 0;

      var RequestQty_new_items =
        item?.new_request_stock?.reduce((total, itm) => total + +itm.qty, 0) ||
        0;

      let totalPrice = item.request_stock.reduce(
        (total, itm) => total + +itm.total_price,
        0
      );
      const new_request_stock_modified =
        values?.request_stock_by_user?.[0]?.new_request_stock?.map((data) => {
          return {
            ...data,
            requested_rate: data.rate,
            requested_qty: data.qty,
            rate: data?.approved_rate,
            qty: data?.approved_qty,
            fund_amount: data?.approve_fund_amount,
          };
        });

      const totalGst = (totalPrice * totalPriceGst) / 100;
      const finalTotalPriceGst = totalGst + totalPrice;
      return {
        ...item,
        ...(type !== "approve" && {
          total_request_qty: RequestQty_old_items + RequestQty_new_items,
          office_users_id: item?.office_users_id?.value,
          total_price: totalPrice,
        }),
        new_request_stock:
          type == "approve"
            ? new_request_stock_modified
            : item.new_request_stock,
        approve_quantity: approveQty_old_items + RequestQty_new_items,
        ...(values?.request_tax_type == "2" && {
          total_price_with_gst: finalTotalPriceGst,
        }),
      };
    });

    const formData = {
      request_stock_by_user: modifiedRequest,
      request_tax_type: values?.request_tax_type,
      stock_request_for: values?.stock_request_for,
      user_id: values?.request_stock_by_user[0]?.user_id?.value,
    };

    if (type === "approve") {
      formData.status = "1";
      formData.approved_remarks = values?.approved_remarks;
      formData.approve_quantity = modifiedRequest[0]?.approve_quantity;
    }

    if (type === "reject") {
      formData.status = "0";
    }

    if (type == "reject" && edit?.approved_data.length > 0) {
      formData.status = "1";
    }

    if (edit?.id) {
      formData.id = edit?.id;
    }

    // return console.log("formData", formData);

    const res =
      type == "update" || (type == "reject" && edit?.approved_data.length < 1)
        ? await updateStockRequest(formData)
        : type == "approve" ||
          (type == "reject" && edit?.approved_data.length > 0)
        ? await postStockRequestStatus(formData)
        : await postStockRequest(formData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
      setShowAlert(false);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    fetchItemMasterData();
    fetchAllGstTypes();
  }, [refresh]);

  const gstValue = gstTypesData?.filter((itm) => itm?.id == edit?.gst_id);
  const gstFinalValue = gstValue[0]?.title;

  return (
    <>
      <Helmet>
        <title>
          {type === "view"
            ? "View"
            : type === "approve"
            ? "Approve"
            : edit?.id
            ? "Update"
            : "Create"}
          Stock Request · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${
            type === "view"
              ? t("View")
              : type === "approve"
              ? t("Approve")
              : edit?.id
              ? t("Update")
              : t("Create")
          } ${t("Stock Request")}`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              stock_request_for: edit?.stock_request_for || "1",
              request_tax_type: edit?.request_tax_type || "1",
              approved_remarks: "",
              request_stock_by_user: [
                {
                  supplier_id: edit.supplier_id || "",
                  area_manager_id: edit.area_manager_id || "",
                  supervisor_id: edit.supervisor_id || "",
                  office_users_id: edit.office_users_id || "",
                  end_users_id: edit.end_users_id || "",
                  user_id: edit.user_id
                    ? {
                        label: edit.user_name,
                        value: edit.user_id,
                        image: `${process.env.REACT_APP_API_URL}${edit.user_image}`,
                      }
                    : {
                        value: user?.id,
                        label: `${user?.name} (${user?.employee_id} - self)`,
                        image: user?.image
                          ? `${process.env.REACT_APP_API_URL}${user?.image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
                      },
                  gst_id: edit.gst_id
                    ? {
                        label: gstFinalValue,
                        value: edit.gst_id,
                      }
                    : "",

                  request_stock_images: edit?.request_stock_images || [
                    { item_image: "", title: "" },
                  ],
                  gst_percent: edit?.gst_percent || "",

                  ...(type !== "approve"
                    ? { total_request_qty: edit.total_request_qty }
                    : {}),

                  new_request_stock:
                    type == "approve" && edit?.approved_data?.length > 0
                      ? edit.approved_data?.[0]?.new_request_stock
                      : edit?.request_stock?.new_request_stock,

                  request_stock:
                    type == "approve" && edit?.approved_data?.length > 0
                      ? edit.approved_data?.[0]?.request_stock
                      : edit?.request_stock?.request_stock || [
                          {
                            item_name: "",
                            prev_item_price: "",
                            prev_user_stock: "",
                            request_quantity: "",
                            total_price: "",
                            current_item_price: "",
                            ...(type === "approve"
                              ? { approve_quantity: 0 }
                              : {}),
                          },
                        ],
                },
              ],
            }}
            validationSchema={
              type === "approve"
                ? addStockRequestApproveSchema
                : addStockRequestSchema
            }
            onSubmit={handleSubmit}
          >
            {(props) => {
              const totalAmountData =
                type === "approve"
                  ? props?.values?.request_stock_by_user?.reduce(
                      (total, user) =>
                        total +
                        user?.request_stock?.reduce((total, item) => {
                          const remaining =
                            +item?.request_quantity ===
                            +item?.only_view_approved_amount
                              ? 0
                              : +item.approve_quantity;
                          return total + remaining;
                        }, 0),
                      0
                    )
                  : props?.values?.request_stock_by_user.reduce(
                      (total, user) =>
                        total +
                        user.request_stock.reduce(
                          (userTotal, item) =>
                            userTotal + parseInt(item.request_quantity),
                          0
                        ),
                      0
                    );

              setTotalAmount(totalAmountData + +edit?.total_approved_qty);

              return (
                <Form onSubmit={props?.handleSubmit}>
                  {type === "view" ? (
                    <Row className="g-2">
                      <ViewStockRequestDetails edit={edit} />
                    </Row>
                  ) : (
                    <>
                      <FieldArray name="request_stock_by_user">
                        {({ push, remove }) => (
                          <Row className="g-3">
                            <Form.Group className="mb-3" as={Col} md={12}>
                              <Stack
                                className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto ${
                                  edit?.id ? "cursor-none" : null
                                }`}
                                direction="horizontal"
                                gap={4}
                              >
                                <span className="ps-3">
                                  {t("Stock Request For")} :{" "}
                                </span>

                                <label className="fw-bolder">
                                  <Field
                                    type="radio"
                                    name="stock_request_for"
                                    value={"1"}
                                    disabled={Boolean(edit?.id)}
                                    checked={Boolean(
                                      props.values.stock_request_for == "1"
                                    )}
                                    onChange={() => {
                                      props.setFieldValue(
                                        "stock_request_for",
                                        "1"
                                      );
                                    }}
                                    className="form-check-input"
                                  />
                                  {t("Self Request")}
                                </label>
                                <div className={`vr hr-shadow`} />
                                <label className="fw-bolder">
                                  <Field
                                    type="radio"
                                    name="stock_request_for"
                                    value={"2"}
                                    disabled={Boolean(edit?.id)}
                                    checked={Boolean(
                                      props.values.stock_request_for == "2"
                                    )}
                                    onChange={() => {
                                      props.setFieldValue(
                                        "stock_request_for",
                                        "2"
                                      );
                                    }}
                                    className="form-check-input"
                                  />
                                  {t("Other Request")}
                                </label>
                                <div className="d-flex justify-content-end fs-5  fw-bold mx-5">
                                  <span className="mx-5">
                                    {" "}
                                    {t("Final Stock Price")}{" "}
                                    {type == "approve"
                                      ? props.values.request_stock_by_user
                                          .map((data) => {
                                            return (
                                              (data?.request_stock?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item.approve_fund_amount ||
                                                  0,
                                                0
                                              ) || 0) +
                                              (data?.new_request_stock?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item?.approve_fund_amount ||
                                                  0,
                                                0
                                              ) || 0)
                                            );
                                          })
                                          .reduce((total, itm) => total + itm)
                                          .toFixed(2)
                                      : props.values.request_stock_by_user
                                          .map((data) => {
                                            return (
                                              (data?.request_stock?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item.total_price || 0,
                                                0
                                              ) || 0) +
                                              (data?.new_request_stock?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item?.fund_amount || 0,
                                                0
                                              ) || 0)
                                            );
                                          })
                                          .reduce((total, itm) => total + itm)
                                          .toFixed(2)}
                                  </span>
                                </div>
                              </Stack>
                            </Form.Group>

                            <Form.Group className="mb-3" as={Col} md={12}>
                              <Stack
                                className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto ${
                                  edit?.id ? "cursor-none" : null
                                }`}
                                direction="horizontal"
                                gap={4}
                              >
                                <span className="ps-3">
                                  {t("Stock Request tax type")} :{" "}
                                </span>
                                <label className="fw-bolder">
                                  <Field
                                    type="radio"
                                    name="request_tax_type"
                                    value={"1"}
                                    disabled={Boolean(edit?.id)}
                                    checked={Boolean(
                                      props.values.request_tax_type == "1"
                                    )}
                                    onChange={() => {
                                      // props.resetForm();
                                      props.setFieldValue(
                                        "request_tax_type",
                                        "1"
                                      );
                                    }}
                                    className="form-check-input"
                                  />
                                  {t("Item Wise")}
                                </label>
                                <div className={`vr hr-shadow`} />
                                <label className="fw-bolder">
                                  <Field
                                    type="radio"
                                    name="request_tax_type"
                                    value={"2"}
                                    disabled={Boolean(edit?.id)}
                                    checked={Boolean(
                                      props.values.request_tax_type == "2"
                                    )}
                                    onChange={() => {
                                      // props.resetForm();
                                      props.setFieldValue(
                                        "request_tax_type",
                                        "2"
                                      );
                                    }}
                                    className="form-check-input"
                                  />
                                  {t("OverAll Price")}
                                </label>
                                <div className="d-flex justify-content-end fs-5  fw-bold mx-5">
                                  <span className="mx-5">
                                    {t("Final Stock Quantity")}{" "}
                                    {type == "approve"
                                      ? props.values.request_stock_by_user
                                          .map((data) => {
                                            return (
                                              (data?.request_stock?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item.approve_quantity || 0,
                                                0
                                              ) || 0) +
                                              (data?.new_request_stock?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item?.approved_qty || 0,
                                                0
                                              ) || 0)
                                            );
                                          })
                                          .reduce((total, itm) => total + itm)
                                      : props.values.request_stock_by_user
                                          .map((data) => {
                                            return (
                                              (data?.request_stock?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item.request_quantity || 0,
                                                0
                                              ) || 0) +
                                              (data?.new_request_stock?.reduce(
                                                (userTotal, item) =>
                                                  userTotal + +item?.qty || 0,
                                                0
                                              ) || 0)
                                            );
                                          })
                                          .reduce((total, itm) => total + itm)}
                                  </span>
                                </div>
                              </Stack>
                            </Form.Group>

                            <Col md={12}>
                              <Row className="g-3">
                                {props.values.request_stock_by_user.map(
                                  (main, id) => (
                                    <Col key={id} md={12}>
                                      <div className="p-3 mb-3 shadow">
                                        <FieldArray
                                          name={`request_stock_by_user.${id}.request_stock`}
                                        >
                                          {({
                                            push: pushStock,
                                            remove: removeStock,
                                          }) => (
                                            <>
                                              <Row className="g-3 align-items-end">
                                                {props.values
                                                  .stock_request_for == 1 ? (
                                                  <>
                                                    <Form.Group as={Col} md={5}>
                                                      <div>
                                                        <img
                                                          src={
                                                            user?.image
                                                              ? `${process.env.REACT_APP_API_URL}${user?.image}`
                                                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                          }
                                                          className="avatar me-2"
                                                        />
                                                        {`${user?.name} (${user?.employee_id} - self)`}
                                                      </div>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md={3}>
                                                      <Form.Label className="small">
                                                        {t("Supplier Name")}
                                                      </Form.Label>

                                                      <Select
                                                        menuPortalTarget={
                                                          document.body
                                                        }
                                                        autoFocus
                                                        placeholder="Supplier Name"
                                                        className="text-primary"
                                                        name={`request_stock_by_user.${id}.supplier_id`}
                                                        value={main.supplier_id}
                                                        isDisabled={
                                                          type == "approve"
                                                        }
                                                        onChange={(val) =>
                                                          props.setFieldValue(
                                                            `request_stock_by_user.${id}.supplier_id`,
                                                            val
                                                          )
                                                        }
                                                        options={suppliersData?.map(
                                                          (typ) => ({
                                                            value: typ.id,
                                                            label:
                                                              typ.supplier_name,
                                                          })
                                                        )}
                                                      />

                                                      <ErrorMessage
                                                        name={`request_stock_by_user.${id}.supplier_id`}
                                                        component="small"
                                                        className="text-danger"
                                                      />
                                                    </Form.Group>
                                                  </>
                                                ) : (
                                                  <OtherRequest
                                                    main={main}
                                                    props={props}
                                                    id={id}
                                                    suppliersData={
                                                      suppliersData
                                                    }
                                                    managerName={`request_stock_by_user[${id}].area_manager_id`}
                                                    supervisorName={`request_stock_by_user[${id}].supervisor_id`}
                                                    endUserName={`request_stock_by_user[${id}].end_users_id`}
                                                    supplierName={`request_stock_by_user.${id}.supplier_id`}
                                                    OfficeUserName={`request_stock_by_user.${id}.office_users_id`}
                                                    edit={edit}
                                                  />
                                                )}
                                                {props.values
                                                  .request_tax_type !== "1" ? (
                                                  <>
                                                    <Form.Group as={Col}>
                                                      <Form.Label>
                                                        {t("Gst Type")}
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </Form.Label>
                                                      <Select
                                                        menuPortalTarget={
                                                          document.body
                                                        }
                                                        isDisabled={Boolean(
                                                          type == "approve"
                                                        )}
                                                        name={`request_stock_by_user[${id}].gst_id`}
                                                        value={main.gst_id}
                                                        options={gstTypesData?.map(
                                                          (itm) => ({
                                                            label: itm.title,
                                                            value: itm.id,
                                                            percentage:
                                                              itm.percentage,
                                                          })
                                                        )}
                                                        onChange={(e) => {
                                                          props.setFieldValue(
                                                            `request_stock_by_user[${id}].gst_percent`,
                                                            +e.percentage
                                                          );
                                                          props.setFieldValue(
                                                            `request_stock_by_user[${id}].gst_id`,
                                                            e
                                                          );
                                                        }}
                                                      />
                                                    </Form.Group>
                                                    <Form.Group as={Col}>
                                                      <Form.Label>
                                                        {t(" Gst %")}
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </Form.Label>
                                                      <Form.Control
                                                        name={`request_stock_by_user[${id}].gst_percent`}
                                                        value={main.gst_percent}
                                                        onChange={
                                                          props.handleChange
                                                        }
                                                        disabled
                                                      />
                                                    </Form.Group>
                                                  </>
                                                ) : null}
                                                {!edit.id && (
                                                  <Form.Group as={Col}>
                                                    <div className="text-end">
                                                      {id === 0 ? (
                                                        <TooltipComponent
                                                          align="left"
                                                          title={"Add New Row"}
                                                        >
                                                          <div
                                                            onClick={() => {
                                                              push({
                                                                user_id: "",
                                                                images: "",
                                                                total_request_qty:
                                                                  "",
                                                                request_stock: [
                                                                  {
                                                                    item_name:
                                                                      "",
                                                                    prev_item_price:
                                                                      "",
                                                                    prev_user_stock:
                                                                      "",
                                                                    request_quantity:
                                                                      "",
                                                                    total_price:
                                                                      "",
                                                                    current_item_price:
                                                                      "",
                                                                    approve_quantity:
                                                                      "",
                                                                  },
                                                                ],
                                                              });
                                                            }}
                                                            className={`social-btn-re w-auto h-auto px-4 success-combo`}
                                                          >
                                                            <BsPlusLg />
                                                          </div>
                                                        </TooltipComponent>
                                                      ) : (
                                                        <TooltipComponent
                                                          align="left"
                                                          title={"Remove"}
                                                        >
                                                          <div
                                                            onClick={() =>
                                                              remove(id)
                                                            }
                                                            className={`social-btn-re w-auto h-auto px-4 red-combo`}
                                                          >
                                                            <BsDashLg />
                                                          </div>
                                                        </TooltipComponent>
                                                      )}
                                                    </div>
                                                  </Form.Group>
                                                )}
                                                {type === "approve" ? (
                                                  <>
                                                    <Form.Group
                                                      as={Col}
                                                      md="12"
                                                    >
                                                      <Form.Label>
                                                        {t("Approved Remarks")}
                                                        <span className="text-danger">
                                                          *
                                                        </span>
                                                      </Form.Label>
                                                      <TextareaAutosize
                                                        className="edit-textarea"
                                                        minRows={3}
                                                        name={`approved_remarks`}
                                                        onBlur={
                                                          props.handleBlur
                                                        }
                                                        onChange={
                                                          props.handleChange
                                                        }
                                                      />

                                                      <ErrorMessage
                                                        name={`approved_remarks`}
                                                        component="span"
                                                        className="text-danger"
                                                      />
                                                    </Form.Group>{" "}
                                                  </>
                                                ) : null}
                                                <>
                                                  <ApprovedStockTableView
                                                    props={props}
                                                    main={main}
                                                    id={id}
                                                    pushStock={pushStock}
                                                    removeStock={removeStock}
                                                    edit={edit}
                                                    type={type}
                                                    itemMasterData={
                                                      itemMasterData
                                                    }
                                                    totalAmount={totalAmount}
                                                    gstTypesData={gstTypesData}
                                                    allBrand={allBrand}
                                                    setAllBrand={setAllBrand}
                                                  />

                                                  <FieldArray
                                                    name={`request_stock_by_user.${id}.new_request_stock`}
                                                  >
                                                    {({
                                                      push: pushNewFund,
                                                      remove: removePushNewFund,
                                                    }) => (
                                                      <NewItemTableView
                                                        props={props}
                                                        main={main}
                                                        id={id}
                                                        pushNewFund={
                                                          pushNewFund
                                                        }
                                                        itemMasterData={
                                                          itemMasterData
                                                        }
                                                        removePushNewFund={
                                                          removePushNewFund
                                                        }
                                                        edit={edit}
                                                        type={type}
                                                      />
                                                    )}
                                                  </FieldArray>

                                                  <FieldArray
                                                    name={`request_stock_by_user.${id}.request_stock_images`}
                                                  >
                                                    {({
                                                      push: pushStockImage,
                                                      remove: removeStockImage,
                                                    }) => (
                                                      <CreateBillImages
                                                        props={props}
                                                        main={main}
                                                        id={id}
                                                        pushStockImage={
                                                          pushStockImage
                                                        }
                                                        removeStockImage={
                                                          removeStockImage
                                                        }
                                                        edit={edit}
                                                        type={type}
                                                      />
                                                    )}
                                                  </FieldArray>
                                                </>
                                              </Row>
                                            </>
                                          )}
                                        </FieldArray>
                                      </div>
                                      {type == "approve" && (
                                        <GroupTable data={allOldItems} />
                                      )}
                                    </Col>
                                  )
                                )}
                              </Row>
                            </Col>
                          </Row>
                        )}
                      </FieldArray>
                      <Form.Group as={Col} md={12}>
                        <div className="my-4 text-center">
                          <button
                            type={`${edit?.id ? "button" : "submit"}`}
                            onClick={() => setShowAlert(edit?.id && true)}
                            disabled={
                              props?.isSubmitting ||
                              (type == "approve" &&
                                !props?.values?.request_stock_by_user[0]?.request_stock?.every(
                                  (d) => d.Old_Price_Viewed
                                ))
                            }
                            className={`shadow border-0   ${
                              (type == "approve") !=
                              props?.values?.request_stock_by_user?.[0]?.request_stock?.every(
                                (d) => d?.Old_Price_Viewed
                              )
                                ? ""
                                : "purple-combo"
                            } cursor-pointer px-4 py-1`}
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
                              <>
                                {type === "view"
                                  ? t("View")
                                  : type === "approve"
                                  ? t("Approve")
                                  : edit?.id
                                  ? t("Update")
                                  : t("Create")}
                                {/* {edit?.id ? "UPDATE" : "SAVE"} */}
                              </>
                            )}
                          </button>{" "}
                          {type == "approve" &&
                            !props?.values?.request_stock_by_user?.[0]?.request_stock?.every(
                              (d) => d?.Old_Price_Viewed
                            ) && (
                              <span className="text-danger">
                                * {t("Please View supplier previous Price")}
                              </span>
                            )}
                          <ConfirmAlert
                            size={"sm"}
                            deleteFunction={
                              props.isValid
                                ? props.handleSubmit
                                : setShowAlert(false)
                            }
                            hide={setShowAlert}
                            show={showAlert}
                            title={`Confirm ${
                              type === "approve" ? t("Approve") : t("Update")
                            }`}
                            description={`Are you sure you want to ${
                              type === "approve" ? "approve" : "update"
                            } this!!`}
                          />
                        </div>
                      </Form.Group>
                    </>
                  )}
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateStockRequest;
