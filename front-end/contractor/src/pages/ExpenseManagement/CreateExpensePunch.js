import React, { useEffect, useState } from "react";
import { Col, Table, Form, Row, Spinner, Stack } from "react-bootstrap";
import { BsDashLg, BsPlusLg, BsQuestionLg } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import Select from "react-select";
import { toast } from "react-toastify";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import {
  postExpensePunch,
  getSingleExpensePunchById,
  getAllAreaManager,
  getAllComplaintIdListMangerWise,
  getAllRegionalOffice,
  getAllComplaintIdListOfficeWise,
  getItemPriceDetails,
  getApproveExpensePunchDetails,
  getUserWalletDetails,
  getAllItemMasterForDropdownUsingUserid,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import ConfirmAlert from "../../components/ConfirmAlert";
import ViewExpensePunch from "./ViewExpensePunch";
import { getAllUsers } from "../../services/authapi";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { Expense_punch_others } from "./Expense_punch_others";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";

const CreateExpensePunch = () => {
  const { user } = useSelector(selectUser);
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const Complain_id = location?.state?.Complain_id;
  const viewType = location?.state?.viewType;
  const userId = location?.state?.userId;
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [complaintData, setComplaintData] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [allManager, setAllManager] = useState([]);
  const [managerId, setManagerId] = useState({ type: "", id: "" });
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [WalletDetails, setWalletDetails] = useState({});
  const [requestFor, setRequestFor] = useState("self");

  const fetchSingleData = async () => {
    const res =
      viewType == "approveData"
        ? await getApproveExpensePunchDetails(userId, Complain_id)
        : await getSingleExpensePunchById(userId, Complain_id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const fetchUserWalletDetails = async () => {
    const res = await getUserWalletDetails(
      requestFor == "self" ? user?.id : managerId?.id
    );
    if (res.status) {
      setWalletDetails(res.data);
    } else {
      setWalletDetails({});
    }
  };

  //to filter item name if selected
  const getAllOptions = (props) => {
    const selectedItem = props.values.items.map((e) => e?.item_name?.value);
    return itemMasterData.filter(
      (value) => !selectedItem.includes(value?.item_id)
    );
  };

  const fetchAreaManager = async () => {
    const res = await getAllAreaManager();
    if (res.status) {
      setAllManager(res.data);
    } else {
      setAllManager([]);
    }
  };

  const fetchRegionalOfficeList = async () => {
    const res = await getAllRegionalOffice({});
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };

  //   submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      user_id: user?.id,
      complaint_id: values.complaint_id.value,
      items: values.items,
      area_manager_id: values.area_manager_id?.value || values.area_manager_id,
      supervisor_id: values.supervisor_id?.value || values.supervisor_id,
      end_users_id: values.end_users_id?.value || values.end_users_id,
      office_users_id: values.office_users_id?.value || values.office_users_id,
      expense_punch_for: values.fund_request_for,
      regional_office: values.regional_office?.value,
    };

    // return console.log("sData", sData);
    const res = await postExpensePunch(sData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }

    setSubmitting(false);
  };

  const fetchItemMasterData = async () => {
    const res = await getAllItemMasterForDropdownUsingUserid(
      requestFor == "self" ? user?.id : managerId?.id
    );
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
    }
  };

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      const newUserData = {
        id: user?.id,
        name: `${user?.name} (${user?.employee_id} - self)`,
        employee_id: user?.employee_id,
        image: user?.image,
      };
      res.data.unshift(newUserData);
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchComplaintData = async () => {
    const res =
      managerId.type == "manager"
        ? await getAllComplaintIdListMangerWise(managerId.id)
        : await getAllComplaintIdListOfficeWise(managerId.id);
    if (res.status) {
      setComplaintData(res.data);
    } else {
      setComplaintData([]);
    }
  };

  const handleStockRequestDetails = async (id, setFieldValue, index, props) => {
    const userId =
      props?.values?.fund_request_for == "1"
        ? user?.id
        : props?.values?.end_users_id?.value ||
          props?.values?.supervisor_id?.value ||
          props?.values?.area_manager_id?.value;

    const res = await getItemPriceDetails(id?.value, userId);

    if (res.status) {
      setFieldValue(`items.${index}.price`, res?.data[0]?.item_price);
      setFieldValue(
        `items.${index}.remaining_qty`,
        res?.data[0]?.remaining_quantity
      );
      setFieldValue(`items.${index}.fund_id`, res?.data[0]?.fund_id);
    } else {
      setFieldValue(`items.${index}.price`, 0);
      setFieldValue(`items.${index}.remaining_qty`, 0);
      setFieldValue(`items.${index}.fund_id`, "");
    }
  };

  useEffect(() => {
    fetchComplaintData();
  }, [managerId]);

  useEffect(() => {
    fetchItemMasterData();
    fetchRegionalOfficeList();
    fetchUserWalletDetails();
    fetchAreaManager();
    if (id !== "new") {
      fetchSingleData();
    }
    fetchAllUsersData();
  }, [managerId, requestFor]);

  const validate = (values) => {
    const errors = {};

    if (!values.complaint_id) {
      errors.complaint_id = "Complaint ID is required";
    }
    values.items.forEach((item, index) => {
      if (!item.item_name) {
        errors.items = errors.items || [];
        errors.items[index] = {
          ...errors.items[index],
          item_name: "is required",
        };
      }
    });

    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      setShowAlert(false);
    }
    return errors;
  };

  const formatOptionLabel = ({ label, image }) => (
    <div>
      <img src={image} className="avatar me-2" />
      {label}
    </div>
  );

  const itemFormatOptionLabel = ({ label, unique_id, image }) => (
    <div className="d-flex">
      <img src={image} className="avatar me-2" />
      <span className="small d-grid">
        <span>{label}</span>
      </span>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>
          {type === "view" ? "View" : "Create"} Expense Punch · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${type === "view" ? t("View") : t("Create")} ${t(
            "Expense Punch"
          )}`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              fund_request_for: "1",
              end_users_id: "",
              supervisor_id: "",
              office_users_id: "",
              area_manager_id: "",
              items: [
                {
                  item_name: "",
                  prev_amount: "",
                  qty: "",
                },
              ],
              user_id: "",
              complaint_id: "",
            }}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    {type === "view" ? (
                      <ViewExpensePunch edit={edit} viewType={viewType} />
                    ) : (
                      <>
                        <Form.Group className="mb-3" as={Col} md={12}>
                          <Stack
                            className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto `}
                            direction="horizontal"
                            gap={4}
                          >
                            <span className="ps-3">
                              {t("Expense punch For")} :{" "}
                            </span>
                            <label className="fw-bolder">
                              <Field
                                type="radio"
                                name="fund_request_for"
                                value={"1"}
                                checked={Boolean(
                                  props.values.fund_request_for === "1"
                                )}
                                onChange={() => {
                                  props.setFieldValue("fund_request_for", "1");
                                  props.setFieldValue(`area_manager_id`, "");
                                  props.setFieldValue("regional_office", "");
                                  setRequestFor("self");
                                  props.setFieldValue("items", [
                                    {
                                      item_name: "",
                                      prev_amount: "",
                                      qty: "",
                                      remaining_qty: "",
                                    },
                                  ]);
                                }}
                                className="form-check-input"
                              />
                              {t("Self Request")}
                            </label>
                            <div className={`vr hr-shadow`} />
                            <label className="fw-bolder">
                              <Field
                                type="radio"
                                name="fund_request_for"
                                value={"2"}
                                checked={Boolean(
                                  props.values.fund_request_for === "2"
                                )}
                                onChange={() => {
                                  props.setFieldValue("fund_request_for", "2");
                                  setRequestFor("other");
                                  props.setFieldValue(`area_manager_id`, "");

                                  setManagerId({});
                                  props.setFieldValue("items", [
                                    {
                                      item_name: "",
                                      prev_amount: "",
                                      qty: "",
                                      remaining_qty: "",
                                    },
                                  ]);
                                }}
                                className="form-check-input"
                              />
                              {t("Other Request")}
                            </label>
                          </Stack>
                        </Form.Group>
                        <FieldArray name="items ">
                          {({ remove, push }) => (
                            <div className="table-scroll p-2 my-3">
                              <div className="mb-3">
                                <span className="">
                                  {" "}
                                  {t("Wallet Limit")} : ₹{" "}
                                  <span className="text-green fw-bold">
                                    {WalletDetails?.userCreditLimit}
                                  </span>
                                </span>
                                <br />

                                <span className="">
                                  {" "}
                                  {t("transfer Amount")}: ₹{" "}
                                  <span className="text-green fw-bold">
                                    {WalletDetails?.totalTransferAmounts}
                                  </span>
                                </span>
                                <br />
                                <span className="">
                                  {" "}
                                  {t("Wallet Balance")} : ₹{" "}
                                  <span className="text-green fw-bold">
                                    {WalletDetails?.userWalletBalance}
                                  </span>
                                </span>
                                <br />
                              </div>

                              <div className="mb-3 d-flex gap-2">
                                {props.values.fund_request_for == 1 && (
                                  <>
                                    {props.values.fund_request_for == 1 ? (
                                      <Form.Group as={Col} md="3">
                                        <Form.Label>
                                          {t("Select User")}{" "}
                                          <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Select
                                          menuPortalTarget={document.body}
                                          name="user_id"
                                          disabled
                                          value={allUserData
                                            ?.map((user) => ({
                                              label: user.name,
                                              value: user.id,
                                              image:
                                                user.image == "" ||
                                                user.image == null
                                                  ? `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                  : process.env
                                                      .REACT_APP_API_URL +
                                                    user.image,
                                            }))
                                            .find(
                                              (val) => val.value == user?.id
                                            )}
                                          formatOptionLabel={formatOptionLabel}
                                        />
                                        <ErrorMessage
                                          name="user_id"
                                          component="small"
                                          className="text-danger"
                                        />
                                      </Form.Group>
                                    ) : null}

                                    <Form.Group as={Col} md="3">
                                      <Form.Label>
                                        {t("Regional Office Name")}
                                        <span className="text-danger">*</span>
                                      </Form.Label>
                                      <Select
                                        menuPortalTarget={document.body}
                                        name={`regional_office`}
                                        options={allRegionalOffice?.map(
                                          (itm) => ({
                                            label: itm.regional_office_name,
                                            value: itm.id,
                                          })
                                        )}
                                        isClearable
                                        isDisabled={
                                          props.values.area_manager_id
                                        }
                                        onChange={(e) => {
                                          setManagerId({
                                            type: "office",
                                            id: e?.value,
                                          });
                                          props.setFieldValue(
                                            `complaint_id`,
                                            ""
                                          );
                                          props.setFieldValue(
                                            `regional_office`,
                                            e
                                          );
                                        }}
                                      />
                                      <ErrorMessage
                                        name="regional_office"
                                        component="small"
                                        className="text-danger"
                                      />
                                    </Form.Group>

                                    <Form.Group as={Col} md="3">
                                      <Form.Label>
                                        {t("Area manager")}{" "}
                                        <span className="text-danger">*</span>
                                      </Form.Label>
                                      <Select
                                        menuPortalTarget={document.body}
                                        name={`area_manager_id`}
                                        options={allManager?.map((itm) => ({
                                          label: itm.name,
                                          value: itm.id,
                                        }))}
                                        isDisabled={
                                          props.values.regional_office
                                        }
                                        isClearable
                                        onChange={(e) => {
                                          setManagerId({
                                            type: "manager",
                                            id: e?.value,
                                          });
                                          props.setFieldValue(
                                            `complaint_id`,
                                            ""
                                          );
                                          props.setFieldValue(
                                            `complaint_id`,
                                            ""
                                          );
                                          props.setFieldValue(
                                            `area_manager_id`,
                                            e
                                          );
                                        }}
                                      />
                                      <ErrorMessage
                                        name="area_manager_id"
                                        component="small"
                                        className="text-danger"
                                      />
                                    </Form.Group>
                                  </>
                                )}

                                {props.values.fund_request_for == 2 && (
                                  <Expense_punch_others
                                    props={props}
                                    id={id}
                                    managerName={`area_manager_id`}
                                    OfficeUserName={`office_users_id`}
                                    supervisorName={`supervisor_id`}
                                    endUserName={`end_users_id`}
                                    setManagerId={setManagerId}
                                    edit={edit}
                                  />
                                )}
                                <Form.Group as={Col} md="2">
                                  <Form.Label>
                                    {t("Select Complaint")}{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Select
                                    menuPortalTarget={document.body}
                                    name={`complaint_id`}
                                    value={props.values.complaint_id}
                                    options={complaintData?.map((itm) => ({
                                      label: itm.complaint_unique_id,
                                      value: itm.id,
                                    }))}
                                    onChange={(e) => {
                                      props.setFieldValue(`complaint_id`, e);
                                    }}
                                  />
                                  <ErrorMessage
                                    name="complaint_id"
                                    component="small"
                                    className="text-danger"
                                  />
                                </Form.Group>
                              </div>

                              {props.values.items.length > 0 && (
                                <Table
                                  striped
                                  hover
                                  className="text-body bg-new Roles"
                                >
                                  <thead>
                                    <tr>
                                      <th>{t("Item Name")}</th>
                                      <th>{t("Remaining Qty")}</th>
                                      <th>
                                        {t("Qty")}{" "}
                                        <span className="text-danger">*</span>
                                      </th>
                                      <th>{t("Total")}</th>
                                      <th>{t("Action")}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {props.values.items.map((itm, index) => (
                                      <tr key={index}>
                                        <td>
                                          <Select
                                            className="text-start"
                                            menuPortalTarget={document.body}
                                            name={`items.${index}.item_name`}
                                            value={itm?.item_name}
                                            isClearable={true}
                                            // isDisabled={
                                            //   !props?.values?.end_users_id
                                            // }
                                            options={getAllOptions(props)?.map(
                                              (itm) => ({
                                                label:
                                                  itm?.item_name ||
                                                  itm?.new_item,
                                                value: itm?.item_id,
                                                unique_id: itm?.unique_id,
                                                rate: itm?.rate,
                                                image: itm?.item_image
                                                  ? `${process.env.REACT_APP_API_URL}${itm?.item_image}`
                                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
                                              })
                                            )}
                                            onChange={(e) => {
                                              if (e?.value) {
                                                handleStockRequestDetails(
                                                  e,
                                                  props.setFieldValue,
                                                  index,
                                                  props
                                                );

                                                props.setFieldValue(
                                                  `items.${index}.item_name`,
                                                  e
                                                );
                                                props.setFieldValue(
                                                  `items.${index}.item_id`,
                                                  e?.value
                                                );
                                              } else {
                                                props.setFieldValue(
                                                  `items.${index}`,
                                                  {
                                                    item_name: "",
                                                    prev_amount: "",
                                                    qty: "",
                                                    remaining_qty: "",
                                                  }
                                                );
                                              }
                                            }}
                                            formatOptionLabel={
                                              itemFormatOptionLabel
                                            }
                                          />
                                          <ErrorMessage
                                            name={`items.${index}.item_name`}
                                            component="span"
                                            className="text-danger"
                                          />
                                        </td>

                                        <td>
                                          <MyInput
                                            name={`items.${index}.remaining_qty`}
                                            formikProps={props}
                                            type="number"
                                            disabled
                                          />
                                        </td>

                                        <td>
                                          <MyInput
                                            name={`items.${index}.qty`}
                                            formikProps={props}
                                            type="number"
                                            disabled={!itm.remaining_qty}
                                            onChange={(e) => {
                                              const maxValue =
                                                itm.remaining_qty;

                                              if (
                                                +e.target.value <= +maxValue
                                              ) {
                                                props.handleChange(e);

                                                props.setFieldValue(
                                                  `items.${index}.sub_total`,
                                                  +itm.price * +e.target.value
                                                );
                                              } else {
                                                e.target.value = +maxValue;
                                                props.handleChange(e);

                                                props.setFieldValue(
                                                  `items.${index}.sub_total`,
                                                  +itm.price * +e.target.value
                                                );
                                              }
                                            }}
                                          />
                                        </td>

                                        <td>
                                          <MyInput
                                            name={`items.${index}.sub_total`}
                                            formikProps={props}
                                            type="number"
                                            disabled
                                          />
                                        </td>

                                        <td className="text-center">
                                          {index === 0 ? (
                                            <TooltipComponent title={"Add"}>
                                              <BsPlusLg
                                                onClick={() => {
                                                  props.setFieldValue("items", [
                                                    ...props.values.items,
                                                    {
                                                      item_name: "",
                                                      prev_amount: "",
                                                      qty: "",
                                                    },
                                                  ]);
                                                }}
                                                className={`social-btn success-combo`}
                                              />
                                            </TooltipComponent>
                                          ) : (
                                            <TooltipComponent title={"Remove"}>
                                              <BsDashLg
                                                onClick={() =>
                                                  props.setFieldValue(
                                                    "items",
                                                    props.values.items.filter(
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
                                    ))}
                                  </tbody>
                                </Table>
                              )}
                            </div>
                          )}
                        </FieldArray>
                        <div className="d-flex justify-content-end">
                          <h3>
                            {" "}
                            {t("Final Amount")} ₹
                            {props.values.items.reduce(
                              (total, itm) => itm.sub_total + total,
                              0
                            ) || 0}
                          </h3>
                        </div>

                        <Form.Group as={Col} md={12}>
                          <div className="mt-2 text-center">
                            <button
                              type={`button`}
                              onClick={() => setShowAlert(true)}
                              disabled={
                                props?.isSubmitting ||
                                (props.values.items.reduce(
                                  (total, itm) => itm.sub_total + total,
                                  0
                                ) || 0) > WalletDetails?.userWalletBalance
                              }
                              className={`shadow border-0 cursor-pointer px-4 py-1 ${
                                props.values.items.reduce(
                                  (total, itm) => itm.sub_total + total,
                                  0
                                ) > WalletDetails?.userWalletBalance
                                  ? ""
                                  : "purple-combo"
                              }`}
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
                                <>{t("CREATE")}</>
                              )}
                            </button>{" "}
                            {(props.values.items.reduce(
                              (total, itm) => itm.sub_total + total,
                              0
                            ) || 0) > WalletDetails?.userWalletBalance && (
                              <span className="text-danger">
                                * {"Wallet Balance is Low"}
                              </span>
                            )}
                            <ConfirmAlert
                              size={"sm"}
                              defaultIcon={<BsQuestionLg />}
                              deleteFunction={props.handleSubmit}
                              hide={setShowAlert}
                              show={showAlert}
                              title={"Confirm Punch"}
                              description={
                                "Are you sure you want to punch this!!"
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

export default CreateExpensePunch;
