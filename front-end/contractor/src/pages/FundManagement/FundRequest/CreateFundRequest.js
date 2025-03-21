import React, { useEffect, useState } from "react";
import { Col, Form, Spinner, Row, Stack, Table } from "react-bootstrap";
import { BsDashLg, BsPlusLg, BsThreeDotsVertical } from "react-icons/bs";
import TooltipComponent from "../../../components/TooltipComponent";
import Select from "react-select";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { Field, FieldArray, Formik } from "formik";
import {
  getAllItemMasterForDropdown,
  getAllPreviousItemsList,
  getAllSuppliers,
  getFundRequestById,
  postFundRequest,
  postFundRequestStatus,
  updateFundRequest,
} from "../../../services/contractorApi";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ViewFundRequest } from "./ViewFundRequest";
import ImageViewer from "../../../components/ImageViewer";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { OtherRequest } from "./OtherRequest";
import ActionButton from "../../../components/ActionButton";
import { ApprovedTableView } from "./ApprovedTableView";
import { NewItemTableView } from "./NewItemTableView";
import {
  addFundRequestSchema,
  approveFundRequestSchema,
} from "../../../utils/formSchema";
import { useTranslation } from "react-i18next";
import { GroupTable } from "../../../components/GroupTable";

const CreateFundRequest = () => {
  const { id } = useParams();
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [suppliersData, setSuppliersData] = useState([]);
  const [allOldItems, setAllOldItems] = useState([]);
  const [allBrand, setAllBrand] = useState([]);
  const [allUserManagerAndSupervisor, setAllUserManagerAndSupervisor] =
    useState([]);
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getFundRequestById(id);
    if (res.status) {
      setEdit(res.data);
      fetchAllPreviousItem(res.data?.request_for_id);
      res.data.request_fund.request_fund.map((e, index) => {
        setAllBrand((prevData) => {
          return { ...prevData, [index]: e.item_name.rates };
        });
      });
    } else {
      setEdit({});
    }
  };

  useEffect(() => {
    fetchSuppliersData();
  }, []);

  const fetchAllPreviousItem = async (id) => {
    const res = await getAllPreviousItemsList(id);
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

  //   submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const modifiedRequest = values?.request_data?.map((item) => {
      const totalRequest_amount_oldItems =
        item?.request_fund.reduce(
          (total, itm) => total + +itm?.fund_amount,
          0
        ) || 0;

      const totalRequest_amount_newItems =
        item?.new_request_fund?.reduce(
          (total, itm) => total + +itm?.fund_amount,
          0
        ) || 0;

      const new_request_fund_modified =
        values?.request_data?.[0].new_request_fund.map((data) => {
          return {
            ...data,
            requested_rate: data.rate,
            requested_qty: data?.qty,
            rate: data?.approved_rate,
            qty: data?.approved_qty,
            fund_amount: data?.approve_fund_amount,
          };
        });

      const request_fund = item?.request_fund
        .map((d) => {
          if (d.item_name) return d;
        })
        .filter((a) => a);
      const totalApproveQty = item?.request_fund.reduce(
        (userTotal, item) =>
          edit?.approved_data
            ? userTotal +
              +item?.quantity * +item?.price +
              item?.total_approved_amount
            : userTotal + +item?.quantity * +item?.price,
        0
      );

      return {
        ...item,
        ...(type === "approve" && {
          total_approve_amount: totalApproveQty,
        }),

        request_fund: request_fund,
        new_request_fund:
          type == "approve" ? new_request_fund_modified : item.new_request_fund,
        total_request_amount:
          totalRequest_amount_oldItems + totalRequest_amount_newItems,
        user_id: item?.user_id?.value,
        area_manager_id: item?.area_manager_id?.value,
        supervisor_id: item?.supervisor_id?.value,
        end_users_id: item?.end_users_id?.value,
        office_users_id: item?.office_users_id?.value,
      };
    });

    const sData = {
      fund_request_for: +values?.fund_request_for,
      user_id: values?.request_data[0]?.user_id?.value,
      request_data: modifiedRequest,
    };

    // {
    //   return console.log(sData, "request data");
    // }

    if (type === "approve") {
      sData["status"] = "1";
    }

    if (edit?.id) {
      sData["id"] = edit?.id;
    }

    // return console.log("sData ", sData);
    const res =
      type === "edit" || type === "reject"
        ? await updateFundRequest(sData)
        : type === "approve"
        ? await postFundRequestStatus(sData)
        : await postFundRequest(sData);

    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
      setShowAlert(false);
    }
    setSubmitting(false);
  };

  const fetchItemMasterData = async () => {
    const category = "fund";
    const res = await getAllItemMasterForDropdown(category);
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    fetchItemMasterData();
  }, [refresh]);

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
          Fund Request · CMS Electricals
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
          } ${t("Fund Request")}`}
          heading2={
            edit?.id ? (
              <div>
                &nbsp;{t("For")} :{" "}
                <ImageViewer
                  src={
                    edit.request_for_image
                      ? `${process.env.REACT_APP_API_URL}${edit.request_for_image}`
                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                  }
                >
                  <img
                    width={35}
                    height={35}
                    className="my-bg object-fit p-1 rounded-circle"
                    src={
                      edit.request_for_image
                        ? `${process.env.REACT_APP_API_URL}${edit.request_for_image}`
                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                    }
                  />{" "}
                </ImageViewer>{" "}
                {edit?.request_for} - {edit?.employee_id}
              </div>
            ) : null
          }
        >
          {type == "view" ? (
            <ViewFundRequest edit={edit} />
          ) : (
            <>
              <Formik
                enableReinitialize={true}
                initialValues={{
                  request_data: [
                    {
                      supplier_id: edit?.supplier_id || {},
                      user_id: edit?.user_id
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
                      area_manager_id: edit?.area_manager_id?.id
                        ? {
                            label: edit?.area_manager_id?.name,
                            value: edit?.area_manager_id?.id,
                            image: `${process.env.REACT_APP_API_URL}${edit?.area_manager_id?.image}`,
                          }
                        : "",
                      office_users_id: edit?.office_users_id?.id
                        ? {
                            label: edit?.office_users_id?.name,
                            value: edit?.office_users_id?.id,
                            image: `${process.env.REACT_APP_API_URL}${edit?.office_users_id?.image}`,
                          }
                        : "",
                      supervisor_id: edit?.supervisor_id?.id
                        ? {
                            label: edit.supervisor_id?.name,
                            value: edit.supervisor_id?.id,
                            image: `${process.env.REACT_APP_API_URL}${edit.supervisor_id?.image}`,
                          }
                        : "",
                      end_users_id: edit?.end_users_id?.id
                        ? {
                            label: edit.end_users_id?.name,
                            value: edit.end_users_id?.id,
                            image: `${process.env.REACT_APP_API_URL}${edit.end_users_id?.image}`,
                          }
                        : "",
                      request_fund: edit?.approved_data
                        ? edit?.approved_data?.request_fund
                        : edit?.request_fund?.request_fund || [
                            {
                              item_name: "",
                              description: "",
                              current_user_stock: "",
                              previous_price: "",
                              current_price: "",
                              request_quantity: "",
                              fund_amount: "",
                              request_transfer_fund: 0,
                              total_approve_amount: 0,
                            },
                          ],
                      new_request_fund: edit?.approved_data
                        ? edit?.approved_data?.new_request_fund
                        : edit?.request_fund?.new_request_fund || [],
                    },
                  ],
                  fund_request_for: edit?.fund_request_for?.toString() || "1",
                }}
                validationSchema={
                  type == "approve"
                    ? approveFundRequestSchema
                    : addFundRequestSchema
                }
                onSubmit={handleSubmit}
              >
                {(props) => {
                  return (
                    <Form onSubmit={props?.handleSubmit}>
                      <FieldArray name="request_data">
                        {({ push, remove }) => (
                          <div>
                            <Form.Group className="mb-3" as={Col} md={12}>
                              <Stack
                                className={`text-truncate px-0 after-bg-light social-btn-re w-auto h-auto ${
                                  edit?.id ? "cursor-none" : null
                                }`}
                                direction="horizontal"
                                gap={4}
                              >
                                <span className="ps-3">
                                  {t("Fund Request For")} :
                                </span>
                                <label className="fw-bolder">
                                  <Field
                                    type="radio"
                                    name="fund_request_for"
                                    value={"1"}
                                    disabled={Boolean(edit?.id)}
                                    checked={Boolean(
                                      props.values.fund_request_for === "1"
                                    )}
                                    onChange={() => {
                                      props.resetForm();
                                      props.setFieldValue(
                                        "fund_request_for",
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
                                    name="fund_request_for"
                                    value={"2"}
                                    disabled={Boolean(edit?.id)}
                                    checked={Boolean(
                                      props.values.fund_request_for === "2"
                                    )}
                                    onChange={() => {
                                      props.resetForm();
                                      props.setFieldValue(
                                        "fund_request_for",
                                        "2"
                                      );
                                    }}
                                    className="form-check-input"
                                  />
                                  {t("Other Request")}
                                </label>
                                <div className="d-flex justify-content-end fs-5 fw-bold mx-2">
                                  <span className="mx-5">
                                    {t("Final Fund Amount")} ₹
                                    {type == "approve"
                                      ? props.values.request_data
                                          .map((data) => {
                                            return (
                                              (data?.request_fund?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item.price *
                                                      +item.quantity || 0,
                                                0
                                              ) || 0) +
                                              (data?.new_request_fund?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item?.approve_fund_amount ||
                                                  0,
                                                0
                                              ) || 0)
                                            );
                                          })
                                          .reduce((total, itm) => total + itm)
                                      : props.values.request_data
                                          .map((data) => {
                                            return (
                                              (data?.request_fund?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item.fund_amount || 0,
                                                0
                                              ) || 0) +
                                              (data?.new_request_fund?.reduce(
                                                (userTotal, item) =>
                                                  userTotal +
                                                    +item?.fund_amount || 0,
                                                0
                                              ) || 0)
                                            );
                                          })
                                          .reduce((total, itm) => total + itm)}
                                  </span>
                                </div>
                              </Stack>
                            </Form.Group>
                            {props.values.request_data.map((main, id) => (
                              <div key={id} className="p-1 mb-2 shadow">
                                <FieldArray
                                  name={`request_data.${id}.request_fund`}
                                >
                                  {({ push: pushFund, remove: removeFund }) => (
                                    <div className="p-2">
                                      <Row className="g-3">
                                        {props.values.fund_request_for == 1 ? (
                                          <>
                                            <Form.Group as={Col} md={5}>
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

                                            <Form.Group as={Col} md={3}>
                                              <Form.Label className="small">
                                                {t("Supplier Name")}
                                              </Form.Label>

                                              <Select
                                                menuPortalTarget={document.body}
                                                autoFocus
                                                placeholder="Supplier Name"
                                                className="text-primary"
                                                name={`request_data[${id}].supplier_id`}
                                                options={suppliersData?.map(
                                                  (typ) => ({
                                                    value: typ.id,
                                                    label: typ.supplier_name,
                                                  })
                                                )}
                                                value={main.supplier_id}
                                                onChange={(e) =>
                                                  props.setFieldValue(
                                                    `request_data[${id}].supplier_id`,
                                                    e
                                                  )
                                                }
                                                isDisabled={type == "approve"}
                                              />
                                            </Form.Group>
                                          </>
                                        ) : (
                                          <OtherRequest
                                            main={main}
                                            props={props}
                                            id={id}
                                            managerName={`request_data[${id}].area_manager_id`}
                                            OfficeUserName={`request_data[${id}].office_users_id`}
                                            supervisorName={`request_data[${id}].supervisor_id`}
                                            endUserName={`request_data[${id}].end_users_id`}
                                            supplierName={`request_data[${id}].supplier_id`}
                                            suppliersData={suppliersData}
                                            edit={edit}
                                          />
                                        )}
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
                                                        request_fund: [
                                                          {
                                                            item_name: "",
                                                            current_user_stock:
                                                              "",
                                                            previous_price: "",
                                                            current_price: "",
                                                            request_quantity:
                                                              "",
                                                            fund_amount: "",
                                                            price: 0,
                                                            quantity: 0,
                                                            supplier_id: 0,
                                                          },
                                                        ],
                                                      });
                                                    }}
                                                    className={`social-btn w-auto py-1 px-3 h-auto success-combo`}
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
                                                    onClick={() => remove(id)}
                                                    className={`social-btn w-auto py-1 px-3 h-auto red-combo`}
                                                  >
                                                    <BsDashLg />
                                                  </div>
                                                </TooltipComponent>
                                              )}
                                            </div>
                                          </Form.Group>
                                        )}
                                        {type === "approve" ? (
                                          <Form.Group as={Col}>
                                            <ActionButton
                                              className="justify-content-end"
                                              hideDelete={"d-none"}
                                              hideEye={"d-none"}
                                              editlink={`/fund-request/create-fund-request/${edit?.id}?type=edit`}
                                            />
                                          </Form.Group>
                                        ) : null}
                                        {allUserManagerAndSupervisor[id]
                                          ?.manager_name ? (
                                          <Form.Group as={Col} md={6}>
                                            <ImageViewer
                                              src={
                                                allUserManagerAndSupervisor[id]
                                                  ?.manager_image
                                                  ? `${process.env.REACT_APP_API_URL}${allUserManagerAndSupervisor[id]?.manager_image}`
                                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                              }
                                            >
                                              <img
                                                width={30}
                                                height={30}
                                                className="my-bg object-fit p-1 rounded-circle"
                                                src={
                                                  allUserManagerAndSupervisor[
                                                    id
                                                  ]?.manager_image
                                                    ? `${process.env.REACT_APP_API_URL}${allUserManagerAndSupervisor[id]?.manager_image}`
                                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                }
                                              />{" "}
                                              {
                                                allUserManagerAndSupervisor[id]
                                                  ?.manager_name
                                              }{" "}
                                              {allUserManagerAndSupervisor[id]
                                                ?.manager_employee_id
                                                ? `- ${allUserManagerAndSupervisor[id]?.manager_employee_id}`
                                                : null}{" "}
                                              <small className="text-gray">
                                                {t("Manager")}
                                              </small>
                                            </ImageViewer>
                                          </Form.Group>
                                        ) : null}
                                        {allUserManagerAndSupervisor[id]
                                          ?.supervisor_name ? (
                                          <Form.Group as={Col} md={6}>
                                            <ImageViewer
                                              src={
                                                allUserManagerAndSupervisor[id]
                                                  ?.supervisor_image
                                                  ? `${process.env.REACT_APP_API_URL}${allUserManagerAndSupervisor[id]?.supervisor_image}`
                                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                              }
                                            >
                                              <img
                                                width={30}
                                                height={30}
                                                className="my-bg object-fit p-1 rounded-circle"
                                                src={
                                                  allUserManagerAndSupervisor[
                                                    id
                                                  ]?.supervisor_image
                                                    ? `${process.env.REACT_APP_API_URL}${allUserManagerAndSupervisor[id]?.supervisor_image}`
                                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                                }
                                              />{" "}
                                              {
                                                allUserManagerAndSupervisor[id]
                                                  ?.supervisor_name
                                              }{" "}
                                              {allUserManagerAndSupervisor[id]
                                                ?.supervisor_employee_id
                                                ? `- ${allUserManagerAndSupervisor[id]?.supervisor_employee_id}`
                                                : null}{" "}
                                              <small className="text-gray">
                                                {t("Supervisor")}
                                              </small>
                                            </ImageViewer>
                                          </Form.Group>
                                        ) : null}

                                        <ApprovedTableView
                                          props={props}
                                          main={main}
                                          id={id}
                                          pushFund={pushFund}
                                          removeFund={removeFund}
                                          edit={edit}
                                          type={type}
                                          itemMasterData={itemMasterData}
                                          allBrand={allBrand}
                                          setAllBrand={setAllBrand}
                                        />
                                        <FieldArray
                                          name={`request_data.${id}.new_request_fund`}
                                        >
                                          {({
                                            push: pushNewFund,
                                            remove: removePushNewFund,
                                          }) => (
                                            <NewItemTableView
                                              props={props}
                                              main={main}
                                              itemMasterData={itemMasterData}
                                              id={id}
                                              pushNewFund={pushNewFund}
                                              removePushNewFund={
                                                removePushNewFund
                                              }
                                              edit={edit}
                                              type={type}
                                            />
                                          )}
                                        </FieldArray>

                                        <ConfirmAlert
                                          size={"sm"}
                                          deleteFunction={props.handleSubmit}
                                          hide={setShowAlert}
                                          show={showAlert}
                                          title={`Confirm ${
                                            type === "approve"
                                              ? "Approve"
                                              : "Update"
                                          }`}
                                          description={`Are you sure you want to ${
                                            type === "approve"
                                              ? "approve"
                                              : "update"
                                          } this!!`}
                                        ></ConfirmAlert>
                                      </Row>
                                    </div>
                                  )}
                                </FieldArray>
                              </div>
                            ))}
                          </div>
                        )}
                      </FieldArray>

                      {type == "approve" && <GroupTable data={allOldItems} />}

                      <Form.Group as={Col} md={12}>
                        <div className="my-4 text-center">
                          <button
                            type={`${edit?.id ? "button" : "submit"}`}
                            onClick={() => setShowAlert(edit?.id && true)}
                            disabled={
                              props?.isSubmitting ||
                              (type == "approve" &&
                                !props.values?.request_data[0]?.request_fund?.every(
                                  (d) => d.Old_Price_Viewed
                                ))
                            }
                            className={`shadow border-0   ${
                              (type == "approve") !=
                              props.values?.request_data[0]?.request_fund?.every(
                                (d) => d.Old_Price_Viewed
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
                                />
                                {t("PLEASE WAIT")}...
                              </>
                            ) : (
                              <>
                                {type === "approve"
                                  ? "approve"
                                  : type === "edit"
                                  ? t("UPDATE")
                                  : t("CREATE")}
                              </>
                            )}
                          </button>
                          {type == "approve" &&
                            !props.values?.request_data[0]?.request_fund?.every(
                              (d) => d.Old_Price_Viewed
                            ) && (
                              <span className="text-danger">
                                {" "}
                                * {t("Please View supplier previous Price")}
                              </span>
                            )}
                        </div>
                      </Form.Group>
                    </Form>
                  );
                }}
              </Formik>
            </>
          )}
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateFundRequest;
