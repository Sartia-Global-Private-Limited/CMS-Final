import React, { useEffect, useState } from "react";
import { Accordion, Col, Form, FormText, Row, Spinner } from "react-bootstrap";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import Select from "react-select";
import {
  postByNameToHsncode,
  postCheckItemUniqueIdExists,
  postItemViaFundRequest,
} from "../../../services/authapi";
import { ErrorMessage, Formik } from "formik";
import { addSurveyItemMasterSchema } from "../../../utils/formSchema";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, {
  formats,
  modules,
} from "../../../components/EditorToolbar";
import { toast } from "react-toastify";
import {
  getAllSuppliers,
  getAllUnitMasterForDropdown,
} from "../../../services/contractorApi";
import ImageViewer from "../../../components/ImageViewer";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";
import MyInput from "../../../components/MyInput";

const CreateItemFund = ({
  setRefresh,
  refresh,
  newItemList,
  setNewItemList,
}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [suppliersData, setSuppliersData] = useState([]);
  const [unitMasterData, setUnitMasterData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { t } = useTranslation();

  const fetchSuppliersData = async () => {
    const isDropdown = "false";
    const res = await getAllSuppliers({ isDropdown });
    if (res.status) {
      setSuppliersData(res.data);
    } else {
      setSuppliersData([]);
    }
  };
  const fetchUnitMasterData = async () => {
    const res = await getAllUnitMasterForDropdown();
    if (res.status) {
      setUnitMasterData(res.data);
    } else {
      setUnitMasterData([]);
    }
  };

  const handleBlurByNameToHsncode = async (value, props) => {
    const sData = {
      name: value,
    };
    if (value) {
      const res = await postByNameToHsncode(sData);
      if (res.status) {
        toast.warn(res.message);
        // props.handleChange({ target: { name: "name", value: "" } });
        props.setFieldValue("hsncode", res?.data?.hsncode);
      }
    }
  };

  const handleBlur = async (value, props) => {
    const sData = {
      item_unique_id: value,
    };
    // return console.log("sData", sData);
    if (value) {
      const res = await postCheckItemUniqueIdExists(sData);
      if (res.status) {
        toast.warn(res.message);
        props.handleChange({ target: { name: "item_unique_id", value: "" } });
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("supplier_id", values.supplier_id.value);
    formData.append("rate", values.rate);
    formData.append("qty", values.qty);
    formData.append("hsncode", values.hsncode);
    formData.append("rucode", values.rucode);
    formData.append("item_unique_id", values.item_unique_id);
    formData.append("unit_id", values.unit_id.value);
    formData.append("description", values.description);
    formData.append("image", values.image);
    formData.append("quantity", "");

    setNewItemList((oldArray) => [...oldArray, formData]);
    toast.success("item added successfully");

    setShowAlert(false);
    setSubmitting(false);
  };

  useEffect(() => {
    fetchSuppliersData();
    fetchUnitMasterData();
  }, []);

  return (
    <div>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>{t("Add New Item")}</Accordion.Header>
          <Accordion.Body>
            <Formik
              enableReinitialize={true}
              initialValues={{
                supplier_id: "",
                unit_id: "",
                hsncode: "",
                rucode: "",
                item_unique_id: "",
                description: "",
                name: "",
                rate: "",
                qty: "",
                image: "",
                req_description: "",
                request_quantity: 0,
                fund_amount: 0,
              }}
              // validationSchema={addSurveyItemMasterSchema}
              onSubmit={handleSubmit}
            >
              {(props) => (
                <Form onSubmit={props.handleSubmit}>
                  <Row className="align-items-center g-3">
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Supplier Name")}{" "}
                        <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        menuPortalTarget={document.body}
                        autoFocus
                        className="text-primary"
                        name="supplier_id"
                        value={props.values.supplier_id}
                        onChange={(val) =>
                          props.setFieldValue("supplier_id", val)
                        }
                        options={suppliersData?.map((typ) => ({
                          value: typ.id,
                          label: typ.supplier_name,
                        }))}
                      />
                      <ErrorMessage
                        name="supplier_id"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Unit Name")} <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        menuPortalTarget={document.body}
                        autoFocus
                        className="text-primary"
                        name="unit_id"
                        value={props.values.unit_id}
                        onChange={(val) => props.setFieldValue("unit_id", val)}
                        options={unitMasterData?.map((itm) => ({
                          label: itm.name,
                          value: itm.id,
                        }))}
                      />
                      <ErrorMessage
                        name="unit_id"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Name")} <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"name"}
                        value={props.values.name}
                        onChange={props.handleChange}
                        onBlur={(e) =>
                          handleBlurByNameToHsncode(e.target.value, props)
                        }
                        isInvalid={Boolean(
                          props.touched.name && props.errors.name
                        )}
                      />
                      <ErrorMessage
                        name="name"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("rate")} <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        step="any"
                        name={"rate"}
                        value={props.values.rate}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.rate && props.errors.rate
                        )}
                      />
                      <ErrorMessage
                        name="rate"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("Qty")} <span className="text-danger">*</span>
                      </Form.Label>
                      <div className="d-flex h-100">
                        <div
                          className="shadow cursor-pointer d-align red-combo px-2"
                          onClick={() => {
                            if (+props.values.qty > 1) {
                              props.setFieldValue("qty", +props.values.qty - 1);
                            }
                          }}
                        >
                          <BsDashLg />
                        </div>
                        <Form.Control
                          type="number"
                          step="any"
                          name={"qty"}
                          value={props.values.qty}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.qty && props.errors.qty
                          )}
                        />
                        <div
                          className="shadow cursor-pointer d-align success-combo px-2"
                          onClick={() => {
                            props.setFieldValue("qty", +props.values.qty + 1);
                          }}
                        >
                          <BsPlusLg />
                        </div>
                      </div>
                      <ErrorMessage
                        name="qty"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("hsncode")} <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"hsncode"}
                        value={props.values.hsncode}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.hsncode && props.errors.hsncode
                        )}
                      />
                      <ErrorMessage
                        name="hsncode"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        {t("rucode")} <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name={"rucode"}
                        value={props.values.rucode}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.rucode && props.errors.rucode
                        )}
                      />
                      <ErrorMessage
                        name="rucode"
                        component="small"
                        className="text-danger"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>{t("item unique id")}</Form.Label>
                      <Form.Control
                        type="text"
                        name={"item_unique_id"}
                        value={props.values.item_unique_id}
                        maxLength={10}
                        onChange={props.handleChange}
                        onBlur={(e) => handleBlur(e.target.value, props)}
                      />
                      <FormText>
                        {t("Note: leave empty for autogenerate.")}
                      </FormText>
                    </Form.Group>

                    <Form.Group as={Col} md={4}>
                      <Form.Label>{t("Upload Image")}</Form.Label>
                      <div className={"d-flex align-items-center gap-2"}>
                        {selectedFile ? (
                          <div
                            className="shadow p-1 success-combo"
                            style={{ borderRadius: "3px" }}
                          >
                            <ImageViewer
                              src={
                                selectedFile &&
                                selectedFile.type.startsWith("image/")
                                  ? URL.createObjectURL(selectedFile)
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            >
                              <img
                                width={35}
                                height={35}
                                className="object-fit"
                                src={
                                  selectedFile &&
                                  selectedFile.type.startsWith("image/") &&
                                  URL.createObjectURL(selectedFile)
                                }
                              />
                            </ImageViewer>
                          </div>
                        ) : null}
                        <Form.Control
                          type="file"
                          name="image"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (file) => {
                                props.setFieldValue(
                                  `image`,
                                  file.target.result
                                );
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group as={Col} md={12}>
                      <MyInput
                        name={"description"}
                        formikProps={props}
                        label={t("Description")}
                        customType={"multiline"}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={12}>
                      <div className="mt-4 text-center">
                        <button
                          type="button"
                          onClick={() => setShowAlert(true)}
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
                            <>{t("CREATE")}</>
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
                          description={"Are you sure you want to update this!!"}
                        />
                      </div>
                    </Form.Group>
                  </Row>
                </Form>
              )}
            </Formik>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default CreateItemFund;
