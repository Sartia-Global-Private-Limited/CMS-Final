import React, { useEffect, useState } from "react";
import { Col, Form, Spinner, Row, Table } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { ErrorMessage, FieldArray, Formik } from "formik";
import {
  getAllBankListForDropdown,
  getAllItemMasterForDropdown,
  getFundRequestById,
  getAllAccountByBankId,
  postRejectFundRequest,
  getPreviousFundRequestById,
  getAllPaymentModes,
  getAllPreviousItemsList,
} from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { TransferFundSchema } from "../../../utils/formSchema";
import FundTableView from "./FundTableView";
import {
  postFundTransferRequest,
  postRescheduledTransferFund,
} from "../../../services/contractoApi2";
import { BsQuestionLg, BsThreeDotsVertical } from "react-icons/bs";
import ReactTextareaAutosize from "react-textarea-autosize";
import TextareaAutosize from "react-textarea-autosize";
import { addRemarkSchema } from "../../../utils/formSchema";
import ImageViewer from "../../../components/ImageViewer";
import { ViewFundRequest } from "../FundRequest/ViewFundRequest";
import { useTranslation } from "react-i18next";
import { GroupTable } from "../../../components/GroupTable";

const CreateFundTransfer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [showRescheduled, setShowRescheduled] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [allBanksData, setAllBanksData] = useState([]);
  const [allAccountByBankId, setAllAccountByBankId] = useState([]);
  const [accountBalance, setAccountBalance] = useState({ balance: 0 });
  const [showRejectAlert, setShowRejectAlert] = useState(false);
  const [storeId, setStoreId] = useState({});
  const [finalRequestAmount, setFinalRequestAmount] = useState(0);
  const [previousFundAmount, setPreviousFundAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState([]);
  const [allOldItems, setAllOldItems] = useState([]);
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getFundRequestById(id);
    if (res.status) {
      setEdit(res.data);
      getPreviousFundRequestDetails(res.data?.request_for_id);
      fetchAllPreviousItem(res.data?.request_for_id);
    } else {
      setEdit({});
    }
  };

  const fetchAllPreviousItem = async (id) => {
    const res = await getAllPreviousItemsList(id);
    if (res.status) {
      setAllOldItems(res.data);
    } else {
      setEdit({});
    }
  };

  const fetchPaymentModes = async () => {
    const res = await getAllPaymentModes();
    if (res.status) {
      const rData = res.data.map((d) => {
        return { label: d.method, value: d.method };
      });

      setPaymentMode(rData);
    } else {
      setPaymentMode([]);
    }
  };

  const getPreviousFundRequestDetails = async (id) => {
    const res = await getPreviousFundRequestById(id);
    if (res.status) {
      setPreviousFundAmount(res?.finalBalance);
    } else {
      setPreviousFundAmount(0);
    }
  };

  //   submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values.transfer_data[0].transfer_fund.map((e, index) => {
      e.price = edit.approved_data.request_fund[index].price;
      e.quantity = edit.approved_data.request_fund[index].quantity;
    });

    const modifiedRequest = values?.transfer_data?.map((item) => {
      const totalRequestQty = item?.transfer_fund.reduce(
        (total, itm) => total + +itm.fund_amount,
        0
      );

      return {
        // ...item,
        // total_transfer_amount:finalRequestAmount,
        transfer_fund: item.transfer_fund,
        new_transfer_fund: item.new_transfer_fund,
      };
    });

    const sData = {
      id: edit?.id,
      remark: values?.remark,
      payment_mode: values.payment_mode,
      transaction_id: values?.transaction_id,
      account_id: values?.account_id?.value,
      transfer_data: modifiedRequest,
    };

    // return console.log("values === ", sData);

    const res = showRescheduled
      ? await postRescheduledTransferFund(edit?.id, values?.rescheduled_date)
      : await postFundTransferRequest(sData);

    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  const fetchItemMasterData = async () => {
    const res = await getAllItemMasterForDropdown();
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
    }
  };

  const fetchAllBanksData = async () => {
    const res = await getAllBankListForDropdown();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm?.id,

          label: itm?.bank_name,
          logo: itm?.logo,
        };
      });
      setAllBanksData(rData);
    } else {
      setAllBanksData([]);
    }
  };

  const handleUpdate = (data) => {
    setStoreId(data);
    setShowRejectAlert(true);
  };

  const handleRejected = async (values, { setSubmitting, resetForm }) => {
    const module = "fund-transfer";
    const sData = {
      remarks: storeId.id,
    };
    const res = await postRejectFundRequest(storeId.id, module, sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }

    resetForm();
    setSubmitting(false);
    setShowRejectAlert(false);
  };

  const handleAccountByBankIdChange = async (val, id, setFieldValue) => {
    if (setFieldValue) {
      setFieldValue("bank_id", val);
      setFieldValue(`account_id`, null);
      setAccountBalance({ balance: 0 });
    }
    if (!val) return false;
    setAllAccountByBankId([]);
    fetchAllAccountByBankId(val);
  };

  const fetchAllAccountByBankId = async (id) => {
    const res = await getAllAccountByBankId(id);
    if (res.status) {
      const rData = res?.data?.map((itm) => {
        return {
          value: itm.id,
          label: itm.account_number,
          account_holder_name: itm?.account_holder_name,
          account_type: itm?.account_type,
          logo: itm.res?.data?.bank_logo,
          balance: itm.balance,
        };
      });
      setAllAccountByBankId(rData);
    } else {
      setAllAccountByBankId([]);
    }
  };

  const userFormatOptionLabel = ({ label, logo }) => (
    <div>
      {logo ? (
        <img
          src={process.env.REACT_APP_API_URL + logo}
          className="avatar me-2"
        />
      ) : null}
      {label}
    </div>
  );

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    fetchItemMasterData();
    fetchAllBanksData();
    fetchPaymentModes();
  }, [refresh]);

  return (
    <>
      <Helmet>
        <title>Transfer Fund Request · CMS Electricals </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`Transfer Fund Request `}
          heading2={
            edit?.id ? (
              <div>
                &nbsp;For :{" "}
                <ImageViewer
                  src={
                    edit?.request_for_image
                      ? `${process.env.REACT_APP_API_URL}${edit?.request_for_image}`
                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                  }
                >
                  <img
                    width={35}
                    height={35}
                    className="my-bg object-fit p-1 rounded-circle"
                    src={
                      edit?.request_for_image
                        ? `${process.env.REACT_APP_API_URL}${edit?.request_for_image}`
                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                    }
                  />{" "}
                </ImageViewer>{" "}
                {edit?.request_for} - {edit?.request_for_employee_id}
              </div>
            ) : null
          }
        >
          {type == "view" ? (
            <ViewFundRequest edit={edit} />
          ) : (
            <Formik
              enableReinitialize={true}
              initialValues={{
                rescheduled_date: "",
                remark: "",
                payment_mode: "",
                user_id: "",
                transaction_id: "",
                account_id: "",

                transfer_data: [
                  {
                    new_transfer_fund: edit?.approved_data
                      ?.new_request_fund || [
                      {
                        item_name: "",
                        description: "",
                        current_user_stock: "",
                        previous_price: "",
                        current_price: "",
                        request_quantity: "",
                        fund_amount: "",
                        price: 0,
                        quantity: 0,
                        transfer_quantity: 0,
                        request_transfer_fund: 0,
                        remaining_quantity: "",
                      },
                    ],
                    transfer_fund: edit?.approved_data?.request_fund || [
                      {
                        item_name: "",
                        description: "",
                        current_user_stock: "",
                        previous_price: "",
                        current_price: "",
                        request_quantity: "",
                        fund_amount: "",
                        price: 0,
                        quantity: 0,
                        transfer_quantity: "0",
                        request_transfer_fund: 0,
                        remaining_quantity: "",
                      },
                    ],
                  },
                ],
              }}
              // validationSchema={!showRescheduled && TransferFundSchema}
              onSubmit={handleSubmit}
            >
              {(props) => {
                return (
                  <Form onSubmit={props?.handleSubmit}>
                    <Row className="g-3">
                      <Form.Group className="mb-3" as={Col} md={3}>
                        <Form.Label>{t("Payment Mode")}</Form.Label>
                        <Select
                          menuPortalTarget={document.body}
                          // value={props.values?.payment_mode}
                          placeholder="Payment Mode"
                          name={`payment_mode`}
                          options={paymentMode}
                          onChange={(e) => {
                            props.setFieldValue(`payment_mode`, e.value);
                          }}
                          // formatOptionLabel={userFormatOptionLabel}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={3}>
                        <Form.Label> {t("Bank")}</Form.Label>

                        <Select
                          menuPortalTarget={document.body}
                          value={props.values.user_id}
                          placeholder="Select Bank"
                          name={`user_id`}
                          options={allBanksData}
                          isDisabled={props.values.payment_mode == "Cash"}
                          onChange={(e) => {
                            handleAccountByBankIdChange(
                              e.value,
                              id,
                              props.setFieldValue
                            );
                            props.setFieldValue(`user_id`, e);
                          }}
                          formatOptionLabel={userFormatOptionLabel}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={3}>
                        <Form.Label> {t("Account No")}.</Form.Label>
                        <Select
                          menuPortalTarget={document.body}
                          // value={main?.account_id}
                          placeholder="Select Account"
                          name={`account_id`}
                          options={allAccountByBankId}
                          isDisabled={props.values.payment_mode == "Cash"}
                          onChange={(e) => {
                            setAccountBalance(e);
                            props.setFieldValue(`account_id`, e);
                          }}
                          formatOptionLabel={userFormatOptionLabel}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" as={Col} md={1}></Form.Group>

                      <Form.Group className="mb-3" as={Col} md={3}>
                        <Form.Label> {t("Remarks")}</Form.Label>
                        <ReactTextareaAutosize
                          minRows={0}
                          placeholder="type remarks..."
                          onChange={props.handleChange}
                          value={props.values.remark}
                          name={"remark"}
                          className="edit-textarea"
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.remark && props.errors.remark
                          )}
                        />
                        <ErrorMessage
                          name="remark"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" as={Col} md={3}>
                        <Form.Label> {t("Transactions Id")}</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Transaction Id"
                          name={`transaction_id`}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.transaction_id &&
                              props.errors.transaction_id
                          )}
                        />
                        <ErrorMessage
                          name="transaction_id"
                          component="small"
                          className="text-danger"
                        />
                      </Form.Group>
                      {/* <div Col={3}></div> */}

                      <Form.Group as={Col} md={2}></Form.Group>
                      <Form.Group
                        as={Col}
                        md={4}
                        className="text-end text-gray"
                      >
                        {props.values.payment_mode != "Cash" && (
                          <>
                            {t("A/c Holder")} :{" "}
                            <b className="text-green">
                              {accountBalance?.account_holder_name || "-"}
                            </b>
                            <br />
                            {t("Bank balance")}{" "}
                            <b
                              className={` ${
                                finalRequestAmount < accountBalance?.balance
                                  ? "text-green"
                                  : "text-danger"
                              }  `}
                            >
                              : ₹ {accountBalance?.balance || "0.00"}
                            </b>
                          </>
                        )}
                        <br />
                        {t("Previous Fund balance")} :
                        <b className="text-green">
                          {" "}
                          ₹ {previousFundAmount || "0.00"}
                        </b>
                        <br />
                        {t("Fund Limit")} :
                        <b> ₹ {edit?.request_for_credit_limt} </b>
                      </Form.Group>
                    </Row>
                    <FieldArray name="transfer_data">
                      {() => (
                        <div>
                          {props?.values?.transfer_data?.map((main, id) => (
                            <div key={id} className="p-1 my-2 shadow">
                              <FieldArray name={`transfer_data`}>
                                {({ push: pushFund, remove: removeFund }) => (
                                  <div className="p-2">
                                    <Row className="g-3">
                                      <FundTableView
                                        props={props}
                                        main={main}
                                        id={id}
                                        pushFund={pushFund}
                                        removeFund={removeFund}
                                        edit={edit}
                                        type={type}
                                        itemMasterData={itemMasterData}
                                        setFinalRequestAmount={
                                          setFinalRequestAmount
                                        }
                                      />

                                      <ConfirmAlert
                                        size={"sm"}
                                        defaultIcon={<BsQuestionLg />}
                                        deleteFunction={props.handleSubmit}
                                        hide={setShowAlert}
                                        show={showAlert}
                                        title={`Confirm Transfer`}
                                        description={`Are you sure you want to transfer this!!`}
                                      />
                                      <ConfirmAlert
                                        size={"sm"}
                                        defaultIcon={<BsQuestionLg />}
                                        deleteFunction={props.handleSubmit}
                                        hide={setShowRescheduled}
                                        show={showRescheduled}
                                        title={`Confirm Rescheduled`}
                                        description={`Are you sure you want to rescheduled this!!`}
                                        children={
                                          <Row>
                                            <Col md={2}></Col>
                                            <Col
                                              md={8}
                                              className="position-relative"
                                            >
                                              <Form.Control
                                                type="date"
                                                // value={props.values.rescheduled_date}
                                                onChange={(e) =>
                                                  props.setFieldValue(
                                                    "rescheduled_date",
                                                    e.target.value
                                                  )
                                                }
                                              />
                                            </Col>
                                          </Row>
                                        }
                                      />
                                    </Row>
                                  </div>
                                )}
                              </FieldArray>
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                    <GroupTable data={allOldItems} />

                    <Form.Group as={Col} md={12}>
                      <div className="my-4 text-center">
                        {/* {type === "approve" ? ( */}
                        <button
                          type={`button`}
                          onClick={() => setShowRescheduled(true)}
                          className="shadow me-3 border-0 danger-combo cursor-pointer px-4 py-1"
                        >
                          Re-schedule
                        </button>
                        {/* ) : null} */}

                        {edit?.id && (
                          <button
                            type={`${edit?.id ? "button" : "submit"}`}
                            onClick={() => setShowAlert(edit?.id)}
                            className={`shadow border-0 purple-combo  cursor-pointer px-4 py-1`}
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
                              <>{edit?.id ? "Transfer" : "SAVE"}</>
                            )}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleUpdate(edit)}
                          className="shadow border-0 red-combo cursor-pointer px-4 py-1 mx-3"
                        >
                          reject
                        </button>
                      </div>
                    </Form.Group>
                  </Form>
                );
              }}
            </Formik>
          )}

          <Formik
            enableReinitialize={true}
            initialValues={{
              remark: "",
            }}
            validationSchema={addRemarkSchema}
            onSubmit={handleRejected}
          >
            {(props) => (
              <ConfirmAlert
                formikProps={props}
                size={"md"}
                hide={setShowRejectAlert}
                show={showRejectAlert}
                type="submit"
                title={"Confirm Reject"}
                description={
                  <Row className="g-3 py-1">
                    <Col md={12}>
                      <TextareaAutosize
                        minRows={3}
                        placeholder="type remarks..."
                        onChange={props.handleChange}
                        name="remark"
                        className="edit-textarea"
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.remark && props.errors.remark
                        )}
                      />
                      <small className="text-danger">
                        {props.errors.remark}
                      </small>
                    </Col>

                    <Col md={12}>
                      <div className="table-scroll">
                        {storeId?.request_fund?.request_fund.length > 0 && (
                          <>
                            <h6 className="my-2">Request Fund</h6>
                            <Table className="table-sm table Roles">
                              <thead>
                                <tr>
                                  <th>Unique Id</th>
                                  <th>Item Name</th>
                                  <th>Item rate</th>
                                  <th>request qty</th>
                                  <th>request amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {storeId?.request_fund?.request_fund?.map(
                                  (itm, idx) => (
                                    <tr key={idx}>
                                      <td>{storeId?.unique_id}</td>
                                      <td>
                                        <div className="d-flex">
                                          <ImageViewer
                                            src={
                                              itm?.item_name?.image
                                                ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
                                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                            }
                                          >
                                            <img
                                              width={35}
                                              height={35}
                                              className="my-bg object-fit p-1 rounded-circle"
                                              src={
                                                itm?.item_name?.image
                                                  ? `${process.env.REACT_APP_API_URL}${itm?.item_name?.image}`
                                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                              }
                                            />
                                          </ImageViewer>{" "}
                                          <span className="small d-grid">
                                            <span>{itm.item_name?.label}</span>
                                            <span className="text-gray">
                                              {itm.item_name?.unique_id
                                                ? `(${itm.item_name?.unique_id})`
                                                : "-"}
                                            </span>
                                          </span>
                                        </div>
                                      </td>
                                      <td>₹ {itm.item_name?.rate}</td>
                                      <td>{itm.request_quantity}</td>
                                      <td>₹ {itm.fund_amount}</td>
                                    </tr>
                                  )
                                )}
                                <tr>
                                  <td colSpan={2}></td>
                                  <td colSpan={2}>total request amt.</td>
                                  <td className="text-start text-green">
                                    <b>₹ {storeId?.total_request_amount}</b>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </>
                        )}

                        {storeId?.request_fund?.new_request_fund.length > 0 && (
                          <>
                            <h6 className="my-2">New Request Fund</h6>
                            <Table className="table-sm table Roles">
                              <thead>
                                <tr>
                                  <th>Unique Id</th>
                                  <th>Item Name</th>
                                  <th>Item rate</th>
                                  <th>request qty</th>
                                  <th>request amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {storeId?.request_fund?.new_request_fund?.map(
                                  (itm, idx) => (
                                    <tr key={idx}>
                                      <td>{storeId?.unique_id}</td>
                                      <td>
                                        <div className="d-flex">
                                          <ImageViewer
                                            src={
                                              itm?.item_image
                                                ? itm?.item_image
                                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                            }
                                          >
                                            <img
                                              width={35}
                                              height={35}
                                              className="my-bg object-fit p-1 rounded-circle"
                                              src={
                                                itm?.item_image
                                                  ? itm?.item_image
                                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                              }
                                            />
                                          </ImageViewer>{" "}
                                          <span className="small d-grid">
                                            <span>{itm.title?.label}</span>
                                            <span className="text-gray">
                                              {itm.item_name?.unique_id
                                                ? `(${itm.item_name?.unique_id})`
                                                : "-"}
                                            </span>
                                          </span>
                                        </div>
                                      </td>
                                      <td>₹ {itm?.rate}</td>
                                      <td>{itm?.qty}</td>
                                      <td>₹ {itm?.fund_amount}</td>
                                    </tr>
                                  )
                                )}
                                <tr>
                                  <td colSpan={2}></td>
                                  <td colSpan={2}>total request amt.</td>
                                  <td className="text-start text-green">
                                    <b>₹ {storeId?.total_request_amount}</b>
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                }
              />
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateFundTransfer;
