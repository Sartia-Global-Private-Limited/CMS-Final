import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { ErrorMessage, Field, FieldArray, Formik } from "formik";
import Select from "react-select";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getAllBankListForDropdown,
  getSingleAccountDetailsById,
  postAccountDetails,
  updateAccountDetails,
} from "../../../services/contractorApi";
import TooltipComponent from "../../../components/TooltipComponent";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import { addAccountManagementSchema } from "../../../utils/formSchema";
import CardComponent from "../../../components/CardComponent";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { ViewTransaction } from "./ViewTransaction";
import { useTranslation } from "react-i18next";

const CreateAccountManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [allBankData, setAllBankData] = useState([]);
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleAccountDetailsById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const fetchAllBank = async () => {
    const res = await getAllBankListForDropdown();
    if (res.status) {
      setAllBankData(res.data);
    } else {
      setAllBankData([]);
    }
  };

  const formatOptionLabel = ({ label, logo }) => (
    <div>
      <img src={logo} className="avatar me-2" />
      {label}
    </div>
  );

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!values) return [];

    const modifiedData = values?.banks?.map((val) => {
      const modifiedValue = val?.accounts?.map((val2, index) => {
        return {
          account_holder_name: val2.account_holder_name,
          account_number: val2.account_number,
          ifsc_code: val2.ifsc_code,
          account_type: val2.account_type,
          branch: val2.branch,
          is_default: val2.is_default == "1" ? true : false,
          ...(edit?.account_id && {
            bank_id: val?.bank_id?.value,
          }),
          ...(edit?.account_id &&
            index == 0 && {
              id: edit?.account_id,
            }),
        };
      });
      if (edit?.account_id) {
        return modifiedValue[0];
      } else {
        return {
          bank_id: val?.bank_id?.value,
          accounts: modifiedValue,
        };
      }
    });

    const sData = edit?.account_id
      ? modifiedData[0]
      : {
          banks: modifiedData,
        };

    // return console.log("sData", sData);
    const res = edit?.account_id
      ? await updateAccountDetails(sData)
      : await postAccountDetails(sData);

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
    fetchAllBank();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {edit?.account_id ? "Update" : "Create New"} Account · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          className={type === "details" && "after-bg-light"}
          title={`${
            type == "details"
              ? t("View")
              : edit?.account_id
              ? t("Update")
              : t("Create New")
          } ${t("Account")}`}
        >
          {type == "details" ? (
            <ViewTransaction edit={edit} />
          ) : (
            <Formik
              enableReinitialize={true}
              initialValues={{
                banks: [
                  {
                    bank_id: edit.bank_id
                      ? {
                          label: edit.bank_name,
                          value: edit.bank_id,
                          logo: `${process.env.REACT_APP_API_URL}${edit.bank_logo}`,
                        }
                      : "",
                    accounts: edit?.accounts || [
                      {
                        account_number: "",
                        ifsc_code: "",
                        branch: "",
                        is_default: false,
                        account_holder_name: "",
                        account_type: "",
                      },
                    ],
                  },
                ],
              }}
              validationSchema={addAccountManagementSchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form onSubmit={props?.handleSubmit}>
                  <FieldArray name="banks">
                    {({ push, remove }) => (
                      <Row className="g-3">
                        <Col md={12}>
                          <Row className="g-3">
                            {props.values.banks.map((main, id) => (
                              <Col key={id} md={12}>
                                <div className="p-3 shadow">
                                  <FieldArray name={`banks.${id}.accounts`}>
                                    {({
                                      push: pushStock,
                                      remove: removeStock,
                                    }) => (
                                      <>
                                        <Row className="g-3 align-items-end">
                                          <Form.Group as={Col} md={4}>
                                            <Form.Label>
                                              {t("Select Bank")}{" "}
                                              <span className="text-danger">
                                                *
                                              </span>
                                            </Form.Label>
                                            <Select
                                              menuPortalTarget={document.body}
                                              name={`banks[${id}].bank_id`}
                                              value={main.bank_id}
                                              options={allBankData?.map(
                                                (itm) => ({
                                                  label: itm.bank_name,
                                                  value: itm.id,
                                                  logo: `${process.env.REACT_APP_API_URL}${itm.logo}`,
                                                })
                                              )}
                                              onChange={(e) => {
                                                props.setFieldValue(
                                                  `banks[${id}].bank_id`,
                                                  e
                                                );
                                              }}
                                              formatOptionLabel={
                                                formatOptionLabel
                                              }
                                            />
                                            <ErrorMessage
                                              name={`banks[${id}].bank_id`}
                                              component="small"
                                              className="text-danger"
                                            />
                                          </Form.Group>
                                          <Form.Group as={Col}>
                                            <div className="text-end">
                                              {edit?.account_id ? null : id ===
                                                0 ? (
                                                <TooltipComponent
                                                  align="left"
                                                  title={"Add New Row"}
                                                >
                                                  <div
                                                    onClick={() => {
                                                      push({
                                                        bank_id: "",
                                                        accounts: [
                                                          {
                                                            account_number: "",
                                                            ifsc_code: "",
                                                            branch: "",
                                                            is_default: false,
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
                                                    onClick={() => remove(id)}
                                                    className={`social-btn-re w-auto h-auto px-4 red-combo`}
                                                  >
                                                    <BsDashLg />
                                                  </div>
                                                </TooltipComponent>
                                              )}
                                            </div>
                                          </Form.Group>

                                          <Form.Group as={Col} md="12">
                                            {main.accounts.length > 0 && (
                                              <div className="table-scroll">
                                                <Table
                                                  striped
                                                  hover
                                                  className="text-body bg-new Roles"
                                                >
                                                  <thead>
                                                    <tr>
                                                      <th>
                                                        {t("Holder Name")}
                                                      </th>
                                                      <th>
                                                        {t("Account Number")}
                                                      </th>
                                                      <th>{t("Ifsc Code")}</th>
                                                      <th>{t("Branch")}</th>
                                                      <th>
                                                        {t("Account Type")}
                                                      </th>
                                                      <th>{t("Primary")}</th>
                                                      {edit?.account_id ? null : (
                                                        <th>{t("Action")}</th>
                                                      )}
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {main?.accounts?.map(
                                                      (itm, index) => (
                                                        <tr key={index}>
                                                          <td>
                                                            <Form.Control
                                                              name={`banks[${id}].accounts[${index}].account_holder_name`}
                                                              value={
                                                                itm.account_holder_name
                                                              }
                                                              onChange={
                                                                props.handleChange
                                                              }
                                                              onBlur={
                                                                props.handleBlur
                                                              }
                                                            />

                                                            <ErrorMessage
                                                              name={`banks[${id}].accounts[${index}].account_holder_name`}
                                                              component="small"
                                                              className="text-danger"
                                                            />
                                                          </td>
                                                          <td>
                                                            <Form.Control
                                                              name={`banks[${id}].accounts[${index}].account_number`}
                                                              value={
                                                                itm.account_number
                                                              }
                                                              maxLength={18}
                                                              onChange={
                                                                props.handleChange
                                                              }
                                                              onBlur={
                                                                props.handleBlur
                                                              }
                                                            />

                                                            <ErrorMessage
                                                              name={`banks[${id}].accounts[${index}].account_number`}
                                                              component="small"
                                                              className="text-danger"
                                                            />
                                                          </td>
                                                          <td>
                                                            <Form.Control
                                                              name={`banks[${id}].accounts[${index}].ifsc_code`}
                                                              maxLength={11}
                                                              value={
                                                                itm.ifsc_code
                                                              }
                                                              onChange={
                                                                props.handleChange
                                                              }
                                                              onBlur={
                                                                props.handleBlur
                                                              }
                                                            />

                                                            <ErrorMessage
                                                              name={`banks[${id}].accounts[${index}].ifsc_code`}
                                                              component="small"
                                                              className="text-danger"
                                                            />
                                                          </td>
                                                          <td>
                                                            <Form.Control
                                                              name={`banks[${id}].accounts[${index}].branch`}
                                                              value={itm.branch}
                                                              onChange={
                                                                props.handleChange
                                                              }
                                                              onBlur={
                                                                props.handleBlur
                                                              }
                                                            />

                                                            <ErrorMessage
                                                              name={`banks[${id}].accounts[${index}].branch`}
                                                              component="small"
                                                              className="text-danger"
                                                            />
                                                          </td>

                                                          <td>
                                                            <Form.Control
                                                              name={`banks[${id}].accounts[${index}].account_type`}
                                                              value={
                                                                itm.account_type
                                                              }
                                                              onChange={
                                                                props.handleChange
                                                              }
                                                              onBlur={
                                                                props.handleBlur
                                                              }
                                                            />

                                                            <ErrorMessage
                                                              name={`banks[${id}].accounts[${index}].account_type`}
                                                              component="small"
                                                              className="text-danger"
                                                            />
                                                          </td>

                                                          <td>
                                                            <label>
                                                              <Field
                                                                type="radio"
                                                                name={`banks[${id}].accounts[${index}].is_default`}
                                                                className="form-check-input"
                                                                checked={
                                                                  itm.is_default ==
                                                                  "1"
                                                                }
                                                                onChange={() => {
                                                                  props.setFieldValue(
                                                                    `banks[${id}].accounts[${index}].is_default`,
                                                                    "1"
                                                                  );
                                                                  props.values.phone?.forEach(
                                                                    (_, i) => {
                                                                      if (
                                                                        i !==
                                                                        index
                                                                      ) {
                                                                        props.setFieldValue(
                                                                          `banks[${id}].accounts[${index}].is_default`,
                                                                          "0"
                                                                        );
                                                                      }
                                                                    }
                                                                  );
                                                                }}
                                                              />
                                                              {t("Is Default")}
                                                            </label>
                                                          </td>

                                                          {edit?.account_id ? null : (
                                                            <td className="text-center">
                                                              {index === 0 ? (
                                                                <TooltipComponent
                                                                  title={"Add"}
                                                                >
                                                                  <BsPlusLg
                                                                    onClick={() => {
                                                                      pushStock(
                                                                        {
                                                                          account_number:
                                                                            "",
                                                                          ifsc_code:
                                                                            "",
                                                                          branch:
                                                                            "",
                                                                          is_default: false,
                                                                        }
                                                                      );
                                                                    }}
                                                                    className={`social-btn success-combo`}
                                                                  />
                                                                </TooltipComponent>
                                                              ) : (
                                                                <TooltipComponent
                                                                  title={
                                                                    "Remove"
                                                                  }
                                                                >
                                                                  <BsDashLg
                                                                    onClick={() =>
                                                                      removeStock(
                                                                        index
                                                                      )
                                                                    }
                                                                    className={`social-btn red-combo`}
                                                                  />
                                                                </TooltipComponent>
                                                              )}
                                                            </td>
                                                          )}
                                                        </tr>
                                                      )
                                                    )}
                                                  </tbody>
                                                </Table>
                                              </div>
                                            )}
                                          </Form.Group>
                                        </Row>
                                      </>
                                    )}
                                  </FieldArray>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </Col>
                      </Row>
                    )}
                  </FieldArray>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit?.account_id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit?.account_id && true)}
                        disabled={props?.isSubmitting}
                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
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
                              : edit?.account_id
                              ? t("Update")
                              : t("Create")}
                            {/* {edit?.account_id ? "UPDATE" : "SAVE"} */}
                          </>
                        )}
                      </button>
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
                          type === "approve" ? "Approve" : "Update"
                        }`}
                        description={`Are you sure you want to ${
                          type === "approve" ? "approve" : "update"
                        } this!!`}
                      />
                    </div>
                  </Form.Group>
                </Form>
              )}
            </Formik>
          )}
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateAccountManagement;
