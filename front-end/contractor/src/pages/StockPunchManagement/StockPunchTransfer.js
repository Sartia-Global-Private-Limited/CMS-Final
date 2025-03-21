import React, { useEffect, useState } from "react";
import { Col, Table, Form, Row, Spinner, Stack } from "react-bootstrap";
import { BsDashLg, BsPlusLg, BsQuestionLg } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import Select from "react-select";
import { toast } from "react-toastify";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import { BiTransfer } from "react-icons/bi";

import {
  getAllEndUserBySupervisorId,
  getAllItemMasterForStockPunch,
  getAllManagersUser,
  getAllOfficeUser,
  getItemPriceDetailsStockPunch,
  getSupervisorListWithTotalFreeUserByManagerId,
  postStockPunchTransfer,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import OtpInput from "react-otp-input";
import { useTranslation } from "react-i18next";

const StockPunchTransfer = () => {
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [showAlert, setShowAlert] = useState(false);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [transferById, setTransferById] = useState(user?.id);
  const [requestFor, setRequestFor] = useState("self");
  const [allManagers, setAllManagers] = useState([]);
  const [supervisoForTransferFrom, setSupervisorForTransferFrom] = useState([]);
  const [supervisoForTransferTo, setSupervisorForTransferTo] = useState([]);
  const [endUserForTransferFrom, SetEndUserForTransferFrom] = useState([]);
  const [endUserForTransferTo, SetEndUserForTransferTo] = useState([]);
  const [allOfficeUser, setAllofficeUser] = useState([]);
  const [otp, setOtp] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    fetchManagers();
    fetchOfficeUser();
  }, []);

  //   submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const modified_data = values.transfer_items.map((data) => {
      return {
        item_id: data.item_id,
        id: data.id,
        remaining_item_qty: data.remaining_item_qty,
        transfer_item_qty: data.transfer_item_qty,
        approved_price: data.approved_price,
        transfer_amount: data.transfer_amount,
      };
    });

    const sData = {
      transfer_items: modified_data,
      transfered_by: values.transfered_by.value,
      transfered_to: values.transfered_to.value,
      stock_transfer_for: values.stock_transfer_from,
      otp,
    };

    // return console.log("sData", sData);
    const res = await postStockPunchTransfer(sData);

    if (res.status && res.message === "Otp send successfully.") {
      toast.success(res.message);
      if (!otp) setShowAlert(true);
    } else if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }

    setSubmitting(false);
  };

  const fetchItemMasterData = async () => {
    const res = await getAllItemMasterForStockPunch(transferById);
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
    }
  };

  const fetchManagers = async () => {
    const res = await getAllManagersUser();
    if (res.status) {
      setAllManagers(res.data);
    } else {
      setAllManagers([]);
    }
  };

  const fetchOfficeUser = async () => {
    const res = await getAllOfficeUser();
    if (res.status) {
      setAllofficeUser(res.data);
    } else {
      setAllofficeUser([]);
    }
  };

  const handleManagerChange = async (value, type) => {
    if (!value) {
      setSupervisorForTransferTo([]);
      return setSupervisorForTransferFrom([]);
    }
    fetchsupervisoForTransferFrom(value, type);
  };

  //All Supervisors By Manager Id
  const fetchsupervisoForTransferFrom = async (id, type) => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(id);
    if (res.status) {
      if (type == "transfer_from") {
        setSupervisorForTransferFrom(res.data);
      } else {
        setSupervisorForTransferTo(res.data);
      }
    } else {
      setSupervisorForTransferFrom([]);
      setSupervisorForTransferTo([]);
      toast.error(res.message);
    }
  };

  const handleSupervisorChange = async (value, type) => {
    if (!value) return SetEndUserForTransferTo([]);
    fetchFreeUsersData(value, type);
  };

  //All End Users By Supervisor Id
  const fetchFreeUsersData = async (id, type) => {
    const res = await getAllEndUserBySupervisorId(id);
    if (res.status) {
      if (type == "transfer_from") {
        SetEndUserForTransferFrom(res.data);
      } else {
        SetEndUserForTransferTo(res.data);
      }
    } else {
      SetEndUserForTransferFrom([]);
      SetEndUserForTransferTo([]);
      toast.error(res.message);
    }
  };

  //function is used to filter out selected items
  const getAllOptions = (props) => {
    const selectedItem = props?.values?.transfer_items.map((e) => e?.item_id);
    return itemMasterData.filter(
      (value) => !selectedItem.includes(value.product_id)
    );
  };

  const handleStockRequestDetails = async (id, setFieldValue, index, props) => {
    const res = await getItemPriceDetailsStockPunch(
      id.value,
      props.values.transfered_by.value
    );

    if (res.status) {
      setFieldValue(
        `transfer_items.${index}.approved_quantity`,
        res.data[0].remaining_quantity
      );

      setFieldValue(`transfer_items.${index}.id`, res.data[0].stock_id);
      setFieldValue(
        `transfer_items.${index}.approved_price`,
        res.data[0].item_price
      );
      setFieldValue(
        `transfer_items.${index}.supplier_name`,
        res.data[0].supplier_name
      );
    } else {
      setFieldValue(`transfer_items.${index}.approved_quantity`, 0);
      setFieldValue(`transfer_items.${index}.id`, "");
      setFieldValue(`transfer_items.${index}.approved_price`, 0);
      setFieldValue(`transfer_items.${index}.supplier_name`, "");
    }
  };

  useEffect(() => {
    fetchItemMasterData();
  }, [transferById]);

  const itemFormatOptionLabel = ({ label, image }) => (
    <div className="d-flex">
      <img src={image} className="avatar me-2" />
      <span>{label}</span>
    </div>
  );

  const ResetField = (props) => {
    props.setFieldValue("transfer_items", [
      {
        id: "",
        item_name: "",
        item_id: "",
        transfer_item_qty: "",
        remaining_item_qty: "",
        approvedPrice: 0,
        transfer_item_qty: "",
      },
    ]);
    props.setFieldValue(`transfer_items[${0}].approved_price`, 0);
    props.setFieldValue(`transfer_items[${0}].approved_quantity`, 0);
    props.setFieldValue(`transfer_items[${0}].transfer_amount`, 0);
  };

  return (
    <>
      <Helmet>
        <title> Stock Punch Transfer · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            transfered_by: { label: "", value: user.id },
            transfered_to: "",
            stock_transfer_from: "1",
            transfer_items: [
              {
                id: "",
                item_name: "",
                item_id: "",
                transfer_item_qty: "",
                remaining_item_qty: "",
                approvedPrice: "",
                transfer_item_qty: "",
              },
            ],
          }}
          // validationSchema={addStockPunchSchema}
          onSubmit={handleSubmit}
        >
          {(props) => {
            return (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <FieldArray name="transfer_items ">
                    {({ remove, push }) => (
                      <div className=" ">
                        <Form.Group className="mb-3" as={Col} md={12}>
                          <Stack
                            className={`text-truncate px-0 mt-3 after-bg-light social-btn-re w-auto h-auto `}
                            direction="horizontal"
                            gap={4}
                          >
                            <span className="ps-3">
                              {t("Stock punch Transfer From")} :{" "}
                            </span>
                            <label className="fw-bolder">
                              <Field
                                type="radio"
                                name="stock_transfer_from"
                                value={"1"}
                                checked={Boolean(
                                  props.values.stock_transfer_from === "1"
                                )}
                                onChange={() => {
                                  props.setFieldValue(
                                    "stock_transfer_from",
                                    "1"
                                  );
                                  setRequestFor("self");
                                  props.setFieldValue("transfered_by", {
                                    label: "",
                                    value: user.id,
                                  });

                                  ResetField(props);
                                }}
                                className="form-check-input"
                              />
                              {t("Self Request")}
                            </label>
                            <div className={`vr hr-shadow`} />
                            <label className="fw-bolder">
                              <Field
                                type="radio"
                                name="stock_transfer_from"
                                value={"2"}
                                checked={Boolean(
                                  props.values.stock_transfer_from === "2"
                                )}
                                onChange={() => {
                                  props.setFieldValue(
                                    "stock_transfer_from",
                                    "2"
                                  );
                                  props.setFieldValue("transfered_by", {
                                    label: "",
                                    value: "",
                                  });
                                  setRequestFor("other");
                                  ResetField(props);
                                }}
                                className="form-check-input"
                              />
                              {t("Other Request")}
                            </label>
                          </Stack>
                        </Form.Group>
                        <div className="my-3">
                          {" "}
                          {requestFor == "self" ? (
                            <Form.Group as={Col} md={5} className="mx-2">
                              <span className="fw-bold">
                                {" "}
                                <img
                                  width={30}
                                  height={30}
                                  className="my-bg object-fit p-1 rounded-circle"
                                  src={
                                    user?.image
                                      ? `${process.env.REACT_APP_API_URL}${user?.image}`
                                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                  }
                                />{" "}
                                {`${user?.name} (${user?.employee_id} - self)`}
                              </span>
                            </Form.Group>
                          ) : (
                            <div className="d-flex">
                              <Form.Group as={Col} md="3">
                                <Form.Label className="small">
                                  {t("Office")}
                                </Form.Label>
                                <Select
                                  placeholder={t("Office")}
                                  menuPortalTarget={document.body}
                                  isClearable={true}
                                  isDisabled={
                                    props.values.manager_in_transfer_from
                                  }
                                  options={allOfficeUser?.map((user) => ({
                                    label: user.name,
                                    value: user.id,
                                  }))}
                                  onChange={(e) => {
                                    if (e) {
                                      setTransferById(e?.value);
                                      props.setFieldValue("transfered_by", e);
                                      props.setFieldValue(
                                        "office_in_transfer_from",
                                        e
                                      );
                                    } else {
                                      props.setFieldValue(
                                        "office_in_transfer_from",
                                        ""
                                      );
                                    }
                                    props.setFieldValue(
                                      "manager_in_transfer_from",
                                      ""
                                    );
                                    props.setFieldValue(
                                      "supervisor_in_transfer_from",
                                      ""
                                    );
                                    ResetField(props);
                                  }}
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="3" className="mx-1">
                                <Form.Label className="small">
                                  {t("Manager")}
                                </Form.Label>
                                <Select
                                  placeholder={t("Manager")}
                                  name="manager_in_transfer_from"
                                  menuPortalTarget={document.body}
                                  isClearable={true}
                                  options={allManagers?.map((user) => ({
                                    label: user.name,
                                    value: user.id,
                                  }))}
                                  isDisabled={
                                    props.values.office_in_transfer_from
                                  }
                                  onChange={(e) => {
                                    if (e) {
                                      handleManagerChange(
                                        e?.value,
                                        "transfer_from"
                                      );
                                      props.setFieldValue("transfered_by", e);
                                      props.setFieldValue(
                                        "manager_in_transfer_from",
                                        e
                                      );
                                      setTransferById(e?.value);
                                      props.setFieldValue("transfered_by", e);
                                    } else {
                                      setSupervisorForTransferFrom([]);
                                      props.setFieldValue(
                                        "manager_in_transfer_from",
                                        ""
                                      );
                                    }
                                    ResetField(props);
                                  }}
                                />
                                <ErrorMessage
                                  name="area_manager_id"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>

                              <Form.Group as={Col} md="3">
                                <Form.Label className="small">
                                  {t("Supervisor")}
                                </Form.Label>
                                <Select
                                  placeholder={t("Supervisor")}
                                  menuPortalTarget={document.body}
                                  // value={main?.supervisor_id}

                                  isClearable={true}
                                  options={supervisoForTransferFrom?.map(
                                    (user) => ({
                                      label: user.name,
                                      value: user.id,
                                    })
                                  )}
                                  onChange={(e) => {
                                    if (e?.value) {
                                      handleSupervisorChange(
                                        e?.value,

                                        "transfer_from"
                                      );
                                      props.setFieldValue(
                                        "supervisor_in_transfer_from",
                                        e
                                      );
                                      props.setFieldValue("transfered_by", e);
                                      setTransferById(e?.value);
                                    } else {
                                      props.setFieldValue(
                                        "supervisor_in_transfer_from",
                                        ""
                                      );
                                      props.setFieldValue(
                                        "transfered_by",
                                        props.values.manager_in_transfer_from
                                      );

                                      setTransferById(
                                        props.values.manager_in_transfer_from
                                          .value
                                      );

                                      SetEndUserForTransferFrom([]);
                                    }
                                    ResetField(props);
                                  }}
                                />
                              </Form.Group>

                              <Form.Group as={Col} md="3">
                                <Form.Label className="small">
                                  {t("End User")}
                                </Form.Label>
                                <Select
                                  placeholder={t("End User")}
                                  menuPortalTarget={document.body}
                                  isClearable={true}
                                  options={endUserForTransferFrom?.map(
                                    (user) => ({
                                      label: user.name,
                                      value: user.id,
                                    })
                                  )}
                                  onChange={(e) => {
                                    if (e) {
                                      setTransferById(e?.value);
                                      props.setFieldValue(
                                        "enduser_in_transfer_from",
                                        e
                                      );
                                      props.setFieldValue("transfered_by", e);
                                    } else {
                                      setTransferById(
                                        props.values.supervisor_in_transfer_from
                                          .value
                                      );
                                      props.setFieldValue(
                                        "enduser_in_transfer_from",
                                        ""
                                      );

                                      props.setFieldValue(
                                        "transfered_by",
                                        props.values.supervisor_in_transfer_from
                                      );
                                    }

                                    ResetField(props);
                                  }}
                                />
                              </Form.Group>
                            </div>
                          )}
                        </div>

                        <div className="d-flex justify-content-center">
                          <BiTransfer
                            className=" view-btn px-1 text-orange "
                            fontSize={50}
                            color="primary"
                          />
                        </div>

                        <div className="mb-4">
                          <h5 className="m-3">{t("Transfer To")}</h5>
                          <div className="d-flex">
                            <Form.Group as={Col} md="3">
                              <Form.Label className="small">
                                {t("Office")}
                              </Form.Label>
                              <Select
                                placeholder={t("Office")}
                                menuPortalTarget={document.body}
                                isClearable={true}
                                isDisabled={props.values.manager_in_transfer_to}
                                options={allOfficeUser
                                  ?.filter(
                                    (user) =>
                                      user.id !=
                                      props.values?.office_in_transfer_from
                                        ?.value
                                  )
                                  .map((user) => ({
                                    label: user.name,
                                    value: user.id,
                                  }))}
                                onChange={(e) => {
                                  if (e) {
                                    props.setFieldValue("transfered_to", e);
                                    props.setFieldValue(
                                      "office_in_transfer_to",
                                      e
                                    );
                                  } else {
                                    props.setFieldValue("transfered_to", "");
                                    props.setFieldValue(
                                      "office_in_transfer_to",
                                      ""
                                    );
                                  }
                                }}
                              />
                            </Form.Group>
                            <Form.Group as={Col} md="3">
                              <Form.Label className="small">
                                {t("Manager")}
                              </Form.Label>
                              <Select
                                placeholder={t("Manager")}
                                menuPortalTarget={document.body}
                                // value={props.values?.area_manager_id}
                                isClearable={true}
                                isDisabled={props.values.office_in_transfer_to}
                                options={allManagers
                                  ?.filter(
                                    (user) =>
                                      user.id !=
                                      props.values?.manager_in_transfer_from
                                        ?.value
                                  )
                                  ?.map((user) => ({
                                    label: user.name,
                                    value: user.id,
                                  }))}
                                // name={managerName}
                                onChange={(e) => {
                                  if (e) {
                                    handleManagerChange(
                                      e?.value,
                                      "transfer_to"
                                    );
                                    props.setFieldValue("transfered_to", e);
                                    props.setFieldValue(
                                      "manager_in_transfer_to",
                                      e
                                    );
                                  } else {
                                    props.setFieldValue(
                                      "manager_in_transfer_to",
                                      ""
                                    );
                                    props.setFieldValue("transfered_to", "");
                                    setSupervisorForTransferTo([]);
                                  }
                                }}
                              />
                              <ErrorMessage
                                name="area_manager_id"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group as={Col} md="3">
                              <Form.Label className="small">
                                {t("Supervisor")}
                              </Form.Label>
                              <Select
                                placeholder={t("Supervisor")}
                                menuPortalTarget={document.body}
                                // value={main?.supervisor_id}
                                isClearable={true}
                                options={supervisoForTransferTo?.map(
                                  (user) => ({
                                    label: user.name,
                                    value: user.id,
                                  })
                                )}
                                onChange={(e) => {
                                  if (e?.value) {
                                    handleSupervisorChange(
                                      e?.value,
                                      "transfer_to"
                                    );
                                    // setTransferById(e?.value);

                                    props.setFieldValue(
                                      "supervisor_in_transfer_to",
                                      e
                                    );

                                    props.setFieldValue("transfered_to", e);
                                  } else {
                                    props.setFieldValue(
                                      "transfered_to",
                                      props.values.supervisoForTransferTo
                                    );

                                    props.setFieldValue(
                                      "supervisor_in_transfer_to",
                                      ""
                                    );

                                    props.setFieldValue(
                                      "transfered_to",
                                      props.values.manager_in_transfer_to
                                    );

                                    SetEndUserForTransferTo([]);
                                  }
                                }}
                              />
                            </Form.Group>

                            <Form.Group as={Col} md="3">
                              <Form.Label className="small">
                                {t("End User")}
                              </Form.Label>
                              <Select
                                placeholder={t("End User")}
                                menuPortalTarget={document.body}
                                isClearable={true}
                                options={endUserForTransferTo?.map((user) => ({
                                  label: user.name,
                                  value: user.id,
                                }))}
                                onChange={(e) => {
                                  if (e) {
                                    props.setFieldValue("transfered_to", e);
                                  } else {
                                    props.setFieldValue(
                                      "transfered_to",
                                      props.values.supervisor_in_transfer_to
                                    );
                                  }
                                }}
                              />
                            </Form.Group>
                          </div>
                        </div>
                        {props.values.transfer_items.length > 0 && (
                          <Table
                            striped
                            hover
                            className="text-body bg-new Roles"
                          >
                            <thead>
                              <tr>
                                <th>{t("Item Name")}</th>
                                <th>{t("Item Price")}</th>
                                <th>{t("Remaining Quantity")}</th>
                                <th>{t("Transfer Quantity")}</th>
                                <th>{t("Total")}</th>
                                <th>{t("Supplier Name")}</th>
                                <th>{t("Action")}</th>
                              </tr>
                            </thead>

                            <tbody>
                              {props.values?.transfer_items.map(
                                (itm, index) => (
                                  <tr key={index}>
                                    <td width={"190px"}>
                                      <Select
                                        className="text-start"
                                        menuPortalTarget={document.body}
                                        name={`transfer_items.${index}.item_name`}
                                        value={
                                          props?.values?.transfer_items[index]
                                            ?.item_name
                                        }
                                        options={getAllOptions(props)?.map(
                                          (itm) => ({
                                            label: itm.item_name,
                                            value: itm.product_id,
                                            unique_id: itm.unique_id,
                                            rate: itm.rate,
                                            image: itm.item_image
                                              ? `${process.env.REACT_APP_API_URL}${itm.item_image}`
                                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
                                          })
                                        )}
                                        onChange={(e) => {
                                          handleStockRequestDetails(
                                            e,
                                            props.setFieldValue,
                                            index,
                                            props
                                          );

                                          props.setFieldValue(
                                            `transfer_items.${index}.item_name`,
                                            e
                                          );
                                          props.setFieldValue(
                                            `transfer_items.${index}.item_id`,
                                            e.value
                                          );
                                          props.setFieldValue(
                                            `transfer_items.${index}.transfer_item_qty`,
                                            0
                                          );
                                        }}
                                        formatOptionLabel={
                                          itemFormatOptionLabel
                                        }
                                      />
                                      <ErrorMessage
                                        name={`transfer_items.${index}.item_name`}
                                        component="span"
                                        className="text-danger"
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        name={`transfer_items.${index}.approvedPrice`}
                                        placeholder="0"
                                        disabled
                                        value={itm?.approved_price}
                                        onChange={props.handleChange}
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        name={`transfer_items.${index}.qty`}
                                        placeholder="0"
                                        disabled
                                        value={itm?.approved_quantity}
                                        onChange={props.handleChange}
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        name={`transfer_items.${index}.transfer_item_qty`}
                                        value={itm?.transfer_item_qty}
                                        onChange={(e) => {
                                          const maxValue =
                                            itm.approved_quantity;
                                          if (+e.target.value <= +maxValue) {
                                            props.handleChange(e);

                                            props.setFieldValue(
                                              `transfer_items.${index}.remaining_item_qty`,
                                              +maxValue - +e.target.value
                                            );
                                            props.setFieldValue(
                                              `transfer_items.${index}.transfer_amount`,
                                              +e.target.value *
                                                itm?.approved_price
                                            );
                                          } else {
                                            e.target.value = +maxValue;
                                            props.handleChange(e);

                                            props.setFieldValue(
                                              `transfer_items.${index}.remaining_item_qty`,
                                              0
                                            );

                                            props.setFieldValue(
                                              `transfer_items.${index}.transfer_amount`,
                                              +e.target.value *
                                                itm?.approved_price
                                            );
                                          }
                                        }}
                                      />
                                      <ErrorMessage
                                        name={`transfer_items.${index}.transfer_item_qty`}
                                        component="span"
                                        className="text-danger"
                                      />
                                    </td>

                                    <td>
                                      <Form.Control
                                        name={`transfer_items.${index}.total_price`}
                                        placeholder="0"
                                        disabled
                                        value={itm?.transfer_amount}
                                        onChange={props.handleChange}
                                      />
                                    </td>

                                    <td>{itm?.supplier_name ?? "--"}</td>

                                    <td className="text-center">
                                      {index === 0 ? (
                                        <TooltipComponent title={t("Add")}>
                                          <BsPlusLg
                                            onClick={() => {
                                              props.setFieldValue(
                                                "transfer_items",
                                                [
                                                  ...props.values
                                                    .transfer_items,
                                                  {
                                                    id: "",
                                                    item_id: "",
                                                    transfer_item_qty: "",
                                                    remaining_item_qty: "",
                                                  },
                                                ]
                                              );
                                            }}
                                            className={`social-btn success-combo`}
                                          />
                                        </TooltipComponent>
                                      ) : (
                                        <TooltipComponent title={t("Remove")}>
                                          <BsDashLg
                                            onClick={() =>
                                              props.setFieldValue(
                                                "transfer_items",
                                                props.values.transfer_items.filter(
                                                  (_, idx) => idx !== index
                                                )
                                              )
                                            }
                                            className={`social-btn red-combo`}
                                          />
                                        </TooltipComponent>
                                      )}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </Table>
                        )}
                        <div className="mt-2 text-end fs-6 fw-bold">
                          {t("Total Transfer Quantity")}
                          {props.values?.transfer_items.reduce(
                            (total, item) => total + +item?.transfer_item_qty,
                            0
                          ) || 0}
                        </div>
                      </div>
                    )}
                  </FieldArray>

                  <Form.Group as={Col} md={12}>
                    <div className="mt-2 text-center">
                      <button
                        type={`button`}
                        onClick={() => {
                          props.handleSubmit();
                          setOtp("");
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
                          <>{t("Transfer")}</>
                        )}
                      </button>

                      <ConfirmAlert
                        size={"sm"}
                        defaultIcon={<BsQuestionLg />}
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={"Verify Otp"}
                        description={"Please Enter the Otp !!"}
                        children={
                          <Row>
                            <Col md={1}></Col>
                            <Col md={8} className="position-relative mx-5">
                              <OtpInput
                                className="fs-5 mx-1"
                                value={otp}
                                isInputNum={true}
                                onChange={setOtp}
                                numInputs={6}
                                renderInput={(props) => <input {...props} />}
                              />
                            </Col>
                          </Row>
                        }
                      />
                    </div>
                  </Form.Group>
                </Row>
              </Form>
            );
          }}
        </Formik>
      </Col>
    </>
  );
};

export default StockPunchTransfer;
