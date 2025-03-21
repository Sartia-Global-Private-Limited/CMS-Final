import React, { useEffect, useState } from "react";
import { Col, Table, Form, Row, Spinner, Stack } from "react-bootstrap";
import { BsDashLg, BsPlusLg, BsQuestionLg } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import Select from "react-select";
import { toast } from "react-toastify";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import OtpInput from "react-otp-input";
import {
  getAllComplaintIdListMangerWise,
  getUserWalletDetails,
  getItemPriceDetailsStockPunch,
  postStockPunch,
  getStockPunchFullDetails,
  getApproveStockPunchDetails,
  getAllItemMasterForStockPunch,
  getAllBrandForStockPunch,
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
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { Expense_punch_others } from "../ExpenseManagement/Expense_punch_others";
import ViewStockPunchData from "./ViewStockPunchData";
import {
  addFundRequestSchema,
  addStockPunchSchema,
} from "../../utils/formSchema";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";

const CreateStockPunch = () => {
  const { user } = useSelector(selectUser);
  const { id } = useParams();
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
  const [itemMasterData, setItemMasterData] = useState([]);
  const [managerId, setManagerId] = useState({ type: "", id: "" });
  const [WalletDetails, setWalletDetails] = useState({});
  const [allBrand, setAllBrand] = useState([]);
  const [BrandId, setBrandId] = useState([]);
  const [otp, setOtp] = useState("");

  const { t } = useTranslation();

  // const fetchSingleData = async () => {
  //   const res = await getStockRequestById(id);
  //   if (res.status) {
  //     setEdit(res.data);
  //     res.data.request_stock.request_stock.map((e, index) => {
  //       setAllBrand((prevData) => {
  //         return { ...prevData, [index]: e.item_name.rates };
  //       });
  //     });

  //     if (type == "approve") fetchAllPreviousItem(res.data?.requested_for);
  //   } else {
  //     setEdit([]);
  //   }
  // };

  const fetchSingleData = async () => {
    const res =
      viewType == "approveData"
        ? await getApproveStockPunchDetails(userId, Complain_id)
        : await getStockPunchFullDetails(userId, Complain_id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const fetchUserWalletDetails = async () => {
    const res = await getUserWalletDetails(managerId?.id);
    if (res.status) {
      setWalletDetails(res.data);
    } else {
      setWalletDetails({});
    }
  };

  //   submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      area_manager_id: values.area_manager_id?.value || values.area_manager_id,
      supervisor_id: values.supervisor_id?.value || values.supervisor_id,
      end_users_id: values.end_users_id?.value || values.end_users_id,
      complaint_id: values.complaint_id.value,
      stock_punch_detail: values.stock_punch_detail,
      otp,
    };
    const res = await postStockPunch(sData);

    if (res.status && res.message === "Otp send successfully.") {
      setShowAlert(true);
      toast.success(res.message);
    } else if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      setShowAlert(false);
      toast.error(res.message);
    }

    setSubmitting(false);
  };

  const fetchItemMasterData = async () => {
    const res = await getAllItemMasterForStockPunch(managerId.id);
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
    }
  };
  const fetchAllBrandData = async (itemId) => {
    const res = await getAllBrandForStockPunch(itemId);
    if (res.status) {
      setAllBrand(res.data);
    } else {
      setAllBrand([]);
    }
  };

  const fetchComplaintData = async () => {
    const res = await getAllComplaintIdListMangerWise(managerId.id);
    if (res.status) {
      setComplaintData(res.data);
    } else {
      setComplaintData([]);
    }
  };

  //to filter item name if selected
  const getAllOptions = (props) => {
    const selectedItem = props.values.stock_punch_detail.map((e) => e?.item_id);
    return itemMasterData.filter(
      (value) => !selectedItem.includes(value?.product_id)
    );
  };

  const handleStockRequestDetails = async (id, setFieldValue, index, props) => {
    const userId =
      props?.values?.end_users_id?.value ||
      props?.values?.supervisor_id?.value ||
      props?.values?.area_manager_id?.value;

    const res = await getItemPriceDetailsStockPunch(id.value, userId);

    if (res.status) {
      setFieldValue(
        `stock_punch_detail.${index}.price`,
        res.data[0].item_price
      );
      setFieldValue(
        `stock_punch_detail.${index}.stock_id`,
        res.data[0].stock_id
      );
      setFieldValue(
        `stock_punch_detail.${index}.remaining_qty`,
        res.data[0].remaining_quantity
      );
    } else {
      setFieldValue(`stock_punch_detail.${index}.price`, 0);
      setFieldValue(`stock_punch_detail.${index}.stock_id`, "");
      setFieldValue(`stock_punch_detail.${index}.remaining_qty`, 0);
    }
  };

  useEffect(() => {
    fetchComplaintData();
    fetchItemMasterData();
  }, [managerId]);

  useEffect(() => {
    fetchUserWalletDetails();
    if (id !== "new") {
      fetchSingleData();
    }
  }, [managerId]);

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
          {type === "view" ? "View" : "Create"} Stock Punch · CMS Electricals
        </title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${type === "view" ? t("View") : t("Create")} ${t(
            "stock punch"
          )}`}
          showBackButton={true}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              end_users_id: "",
              supervisor_id: "",
              area_manager_id: "",
              complaint_id: "",
              stock_punch_detail: [
                {
                  stock_id: "",
                  brand_id: "",
                  item_id: "",
                  item_qty: "",
                },
              ],
            }}
            validationSchema={addStockPunchSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    {type == "view" ? (
                      <ViewStockPunchData edit={edit} viewType={viewType} />
                    ) : (
                      <>
                        <FieldArray name="stock_punch_detail ">
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
                                <Expense_punch_others
                                  props={props}
                                  id={id}
                                  managerName={`area_manager_id`}
                                  supervisorName={`supervisor_id`}
                                  endUserName={`end_users_id`}
                                  setManagerId={setManagerId}
                                  edit={edit}
                                />

                                <Form.Group as={Col} md="2">
                                  <Form.Label>
                                    {t("Select Complaint")}
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

                              {props.values.stock_punch_detail.length > 0 && (
                                <Table
                                  striped
                                  hover
                                  className="text-body bg-new Roles"
                                >
                                  <thead>
                                    <tr>
                                      <th>{t("Item Name")}</th>
                                      <th>{t("Brand Name")}</th>
                                      <th>{t("Remaining Qty")}</th>
                                      <th>
                                        {t("Quantity")}
                                        <span className="text-danger">*</span>
                                      </th>
                                      <th>{t("Total")}</th>
                                      <th>{t("Action")}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {props.values.stock_punch_detail.map(
                                      (itm, index) => (
                                        <tr key={index}>
                                          <td width={"190px"}>
                                            <Select
                                              className="text-start"
                                              menuPortalTarget={document.body}
                                              name={`stock_punch_detail.${index}.item_name`}
                                              value={itm.item_name}
                                              isClearable={true}
                                              isDisabled={
                                                !props?.values?.end_users_id
                                              }
                                              options={getAllOptions(
                                                props
                                              )?.map((itm) => ({
                                                label:
                                                  itm?.item_name ||
                                                  itm?.new_item,
                                                value: itm?.product_id,

                                                image: itm?.item_image
                                                  ? `${process.env.REACT_APP_API_URL}${itm.item_image}`
                                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
                                              }))}
                                              onChange={(e) => {
                                                if (e?.value) {
                                                  handleStockRequestDetails(
                                                    e,
                                                    props.setFieldValue,
                                                    index,
                                                    props
                                                  );
                                                  props.setFieldValue(
                                                    `stock_punch_detail.${index}.item_id`,
                                                    e?.value
                                                  );
                                                  props.setFieldValue(
                                                    `stock_punch_detail.${index}.item_qty`,
                                                    0
                                                  );

                                                  fetchAllBrandData(e?.value);
                                                } else {
                                                  props.setFieldValue(
                                                    `stock_punch_detail.${index}.remaining_qty`,
                                                    0
                                                  );
                                                  props.setFieldValue(
                                                    `stock_punch_detail.${index}`,
                                                    {}
                                                  );
                                                }
                                              }}
                                              formatOptionLabel={
                                                itemFormatOptionLabel
                                              }
                                            />
                                            <ErrorMessage
                                              name={`stock_punch_detail.${index}.item_name`}
                                              component="span"
                                              className="text-danger"
                                            />
                                          </td>

                                          <td>
                                            <Select
                                              className="text-start"
                                              menuPortalTarget={document.body}
                                              name={`stock_punch_detail.${index}.brand_id`}
                                              // value={itm.brand_id}
                                              isDisabled={!itm.item_id}
                                              options={allBrand?.map(
                                                (data) => ({
                                                  label: data?.brand_name,
                                                  value: data?.brand_id,
                                                })
                                              )}
                                              onChange={(e) => {
                                                props.setFieldValue(
                                                  `stock_punch_detail.${index}.brand_id`,
                                                  e?.value
                                                );
                                              }}
                                              isClearable
                                            />
                                          </td>

                                          <td>
                                            <MyInput
                                              name={`stock_punch_detail.${index}.remaining_qty`}
                                              formikProps={props}
                                              type="number"
                                              disabled
                                            />
                                          </td>

                                          <td>
                                            <MyInput
                                              name={`stock_punch_detail.${index}.item_qty`}
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
                                                    `stock_punch_detail.${index}.total_price`,
                                                    +itm.price * +e.target.value
                                                  );
                                                } else {
                                                  e.target.value = +maxValue;
                                                  props.handleChange(e);

                                                  props.setFieldValue(
                                                    `stock_punch_detail.${index}.total_price`,
                                                    +itm.price * +e.target.value
                                                  );
                                                }
                                              }}
                                            />
                                          </td>

                                          <td>
                                            <MyInput
                                              name={`stock_punch_detail.${index}.total_price`}
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
                                                    props.setFieldValue(
                                                      "stock_punch_detail",
                                                      [
                                                        ...props.values
                                                          .stock_punch_detail,
                                                        {
                                                          brand_id: "",
                                                          stock_id: "",
                                                          item_id: "",
                                                          item_qty: "",
                                                        },
                                                      ]
                                                    );
                                                  }}
                                                  className={`social-btn success-combo`}
                                                />
                                              </TooltipComponent>
                                            ) : (
                                              <TooltipComponent
                                                title={"Remove"}
                                              >
                                                <BsDashLg
                                                  onClick={() =>
                                                    props.setFieldValue(
                                                      "stock_punch_detail",
                                                      props.values.stock_punch_detail.filter(
                                                        (_, idx) =>
                                                          idx !== index
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
                            </div>
                          )}
                        </FieldArray>
                        <div className="d-flex justify-content-end">
                          <h3>
                            {" "}
                            {t("Final Amount")} ₹
                            {props.values.stock_punch_detail.reduce(
                              (total, itm) => itm.total_price + total,
                              0
                            ) || 0}
                          </h3>
                        </div>

                        <Form.Group as={Col} md={12}>
                          <div className="mt-2 text-center">
                            <button
                              type={`button`}
                              onClick={() => {
                                props.handleSubmit();
                                setOtp("");
                              }}
                              disabled={
                                props?.isSubmitting ||
                                (props.values.stock_punch_detail.reduce(
                                  (total, itm) => itm.total_price + total,
                                  0
                                ) || 0) > WalletDetails?.userWalletBalance
                              }
                              className={`shadow border-0 cursor-pointer px-4 py-1 ${
                                props.values.stock_punch_detail.reduce(
                                  (total, itm) => itm.total_price + total,
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
                            {(props.values.stock_punch_detail.reduce(
                              (total, itm) => itm.total_price + total,
                              0
                            ) || 0) > WalletDetails?.userWalletBalance && (
                              <span className="text-danger">
                                * {t("Wallet Balance is Low")}
                              </span>
                            )}
                            <ConfirmAlert
                              size={"sm"}
                              defaultIcon={<BsQuestionLg />}
                              deleteFunction={props.handleSubmit}
                              hide={setShowAlert}
                              show={showAlert}
                              title={"Verify OTP"}
                              description={"Please Enter The OTP!!"}
                              children={
                                <Row>
                                  <Col md={1}></Col>
                                  <Col
                                    md={8}
                                    className="position-relative mx-5"
                                  >
                                    <OtpInput
                                      className=" fs-5 mx-1 "
                                      value={otp}
                                      isInputNum={true}
                                      onChange={setOtp}
                                      numInputs={6}
                                      renderInput={(props) => (
                                        <input {...props} />
                                      )}
                                    />
                                  </Col>
                                </Row>
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

export default CreateStockPunch;
