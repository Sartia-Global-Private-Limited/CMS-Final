import React, { useEffect } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { FieldArray, Formik } from "formik";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  getAllBankData,
  getSingleSuppliersById,
  postSuppliers,
  updateSuppliers,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addSupplierSchema } from "../../utils/formSchema";
import { Helmet } from "react-helmet";
import { BsPlusLg, BsTrash } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import { useTranslation } from "react-i18next";
import ViewSupplier from "../../components/ModalContent/ViewSupplier";
import MyInput from "../../components/MyInput";
import { FORMAT_OPTION_LABEL } from "../../components/HelperStructure";
import { getAllCitiesByStateId, getAllStates } from "../../services/generalApi";

const CreateSupplier = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [bankData, setBankData] = useState([]);
  const [allState, setAllState] = useState([]);
  const [allCity, setAllCity] = useState([]);

  const fetchPurchaseOrderData = async () => {
    const res = await getSingleSuppliersById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };
  const fetchBankData = async () => {
    const res = await getAllBankData();
    if (res.status) {
      setBankData(res.data);
    } else {
      setBankData([]);
    }
  };

  const fetchStateData = async () => {
    const res = await getAllStates();
    if (res.status) {
      setAllState(
        res?.data?.map((state) => {
          return { value: state.id, label: state.name };
        })
      );
    } else {
      setAllState([]);
    }
  };

  const fetchCityData = async (id) => {
    const res = await getAllCitiesByStateId(id);
    if (res.status) {
      setAllCity((prev) => ({
        ...prev,
        [id]: res?.data?.map((city) => ({
          value: city.id,
          label: city.name,
        })),
      }));
    } else {
      setAllCity((prev) => ({ ...prev, [id]: [] }));
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchPurchaseOrderData();
    }
    fetchStateData();
    fetchBankData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    for (const key in values) {
      if (key !== "address") {
        formData.append(key, values[key]);
      }
    }
    formData.append("address", JSON.stringify(values?.address));

    // return console.log("formData", formData);
    const res = edit?.id
      ? await updateSuppliers(edit?.id, formData)
      : await postSuppliers(formData);
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

  useEffect(() => {
    // Monitor changes in all states and fetch city data for each state
    edit?.supplier_addresses?.forEach((address) => {
      if (address.state) {
        fetchCityData(address.state);
      }
    });
  }, [edit?.supplier_addresses]);

  return (
    <>
      <Helmet>
        <title>
          {type === "view" ? "View" : edit?.id ? "Update" : "Create"} Suppliers
          · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${
            type === "view" ? "View" : edit?.id ? "Update" : "Create"
          } Supplier`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              supplier_name: edit?.supplier_name || "",
              owner_name: edit?.owner_name || "",
              cashier_name: edit?.cashier_name || "",
              upi_image: edit.upi_image || null,
              bank_id: edit?.bank_id || "",
              account_holder_name: edit?.account_holder_name || "",
              account_number: edit?.account_number || "",
              branch_name: edit?.branch_name || "",
              ifsc_code: edit?.ifsc_code || "",
              upi_id: edit?.upi_id || "",
              upi_image: edit?.upi_image || "",
              address: edit?.supplier_addresses || [
                {
                  shop_office_number: "",
                  street_name: "",
                  city: "",
                  state: "",
                  pin_code: "",
                  landmark: "",
                  gst_number: "",
                  is_default: "0",
                },
              ],
            }}
            validationSchema={addSupplierSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    {type === "view" ? (
                      <ViewSupplier edit={edit} />
                    ) : (
                      <>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"supplier_name"}
                            formikProps={props}
                            label={t("Supplier Name")}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"owner_name"}
                            formikProps={props}
                            label={t("Owner Name")}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"cashier_name"}
                            formikProps={props}
                            label={t("Cashier Name")}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"bank_id"}
                            formikProps={props}
                            label={t("Bank Name")}
                            customType={"select"}
                            selectProps={{
                              data: bankData?.map((itm) => ({
                                label: itm.bank_name,
                                value: itm.id,
                                image: itm.logo
                                  ? `${process.env.REACT_APP_API_URL}${itm.logo}`
                                  : null,
                              })),
                              onChange: () => {
                                [
                                  "account_holder_name",
                                  "account_number",
                                  "branch_name",
                                  "ifsc_code",
                                  "upi_id",
                                ].forEach((field) =>
                                  props.setFieldValue(`${field}`, "")
                                );
                              },
                            }}
                            formatOptionLabel={FORMAT_OPTION_LABEL}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"account_holder_name"}
                            formikProps={props}
                            label={t("account holder Name")}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"account_number"}
                            formikProps={props}
                            label={t("account number")}
                            type="number"
                            step="any"
                            onChange={(e) => {
                              if (e.target.value.length <= 18) {
                                props.handleChange(e);
                              }
                            }}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"branch_name"}
                            formikProps={props}
                            label={t("branch Name")}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"ifsc_code"}
                            formikProps={props}
                            label={t("ifsc code")}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            isRequired
                            name={"upi_id"}
                            formikProps={props}
                            label={t("upi id")}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4}>
                          <MyInput
                            name={"upi_image"}
                            formikProps={props}
                            label={t("upload qr image")}
                            customType={"fileUpload"}
                          />
                        </Form.Group>

                        <FieldArray name="address">
                          {({ remove, push }) => (
                            <>
                              {props.values.address.length > 0 &&
                                props.values.address.map((itm, index) => {
                                  return (
                                    <Form.Group key={index} as={Col} md={12}>
                                      <div className="shadow border-orange border-5 border-start rounded p-3">
                                        <Row className="g-3 align-items-end">
                                          <Form.Group as={Col} md={4}>
                                            <MyInput
                                              name={`address.${index}.shop_office_number`}
                                              formikProps={props}
                                              label={t("shop office number")}
                                            />
                                          </Form.Group>
                                          <Form.Group as={Col} md={4}>
                                            <MyInput
                                              name={`address.${index}.street_name`}
                                              formikProps={props}
                                              label={t("street name")}
                                            />
                                          </Form.Group>
                                          <Form.Group as={Col} md={4}>
                                            <MyInput
                                              isRequired
                                              name={`address.${index}.state`}
                                              formikProps={props}
                                              label={t("State")}
                                              customType={"select"}
                                              selectProps={{
                                                data: allState,
                                                onChange: (e) => {
                                                  fetchCityData(e?.value);
                                                },
                                              }}
                                            />
                                          </Form.Group>
                                          <Form.Group as={Col} md={4}>
                                            <MyInput
                                              name={`address.${index}.city`}
                                              formikProps={props}
                                              label={t("city")}
                                              customType={"select"}
                                              selectProps={{
                                                data:
                                                  allCity[
                                                    props.values?.address[index]
                                                      ?.state
                                                  ] || [],
                                              }}
                                            />
                                          </Form.Group>

                                          <Form.Group as={Col} md={4}>
                                            <MyInput
                                              name={`address.${index}.pin_code`}
                                              formikProps={props}
                                              label={t("pin code")}
                                            />
                                          </Form.Group>
                                          <Form.Group as={Col} md={4}>
                                            <MyInput
                                              name={`address.${index}.landmark`}
                                              formikProps={props}
                                              label={t("landmark")}
                                            />
                                          </Form.Group>
                                          <Form.Group as={Col} md={4}>
                                            <MyInput
                                              name={`address.${index}.gst_number`}
                                              formikProps={props}
                                              label={t("gst number")}
                                            />
                                          </Form.Group>
                                          <Form.Group
                                            as={Col}
                                            md={4}
                                          ></Form.Group>
                                        </Row>
                                      </div>

                                      <div className="d-flex align-items-center gap-2 m-2 ">
                                        <TooltipComponent title={t("Add More")}>
                                          <BsPlusLg
                                            onClick={() =>
                                              push({
                                                shop_office_number: "",
                                                street_name: "",
                                                city: "",
                                                state: "",
                                                pin_code: "",
                                                landmark: "",
                                                gst_number: "",
                                                is_default: "0",
                                              })
                                            }
                                            className="social-btn success-combo"
                                          />
                                        </TooltipComponent>
                                        {index === 0 ? null : (
                                          <TooltipComponent title={t("Delete")}>
                                            <BsTrash
                                              onClick={() =>
                                                index !== 0 && remove(index)
                                              }
                                              className="social-btn red-combo"
                                            />
                                          </TooltipComponent>
                                        )}
                                        <div className="vr hr-shadow" />
                                        <span>
                                          <Form.Label className="d-align">
                                            <Form.Check
                                              type="radio"
                                              name={`address.${index}.is_default`}
                                              id={`address.${index}.is_default`}
                                              value="1"
                                              checked={itm.is_default === "1"}
                                              onChange={() => {
                                                props.setFieldValue(
                                                  `address.${index}.is_default`,
                                                  "1"
                                                );
                                                props.values.address.forEach(
                                                  (_, i) => {
                                                    if (i !== index) {
                                                      props.setFieldValue(
                                                        `address.${i}.is_default`,
                                                        "0"
                                                      );
                                                    }
                                                  }
                                                );
                                              }}
                                            />
                                            {t("Mark Default")}
                                          </Form.Label>
                                        </span>
                                      </div>
                                    </Form.Group>
                                  );
                                })}
                            </>
                          )}
                        </FieldArray>

                        <Form.Group as={Col} md={12}>
                          <div className="mt-4 text-center">
                            <button
                              type={`${edit.id ? "button" : "submit"}`}
                              onClick={() => setShowAlert(edit.id && true)}
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
                                <>{edit.id ? t("UPDATE") : t("CREATE")}</>
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
    </>
  );
};

export default CreateSupplier;
