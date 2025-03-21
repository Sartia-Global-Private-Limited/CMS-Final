import React, { useEffect, useState } from "react";
import { Col, Form, FormText, Row, Spinner, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Select from "react-select";
import {
  AdminCreateSurveyItemMaster,
  AdminSingleSurveyItemMasterById,
  AdminUpdateSurveyItemMaster,
  getAdminAllSurveyItemMaster,
  postCheckItemUniqueIdExists,
} from "../../services/authapi";
import { ErrorMessage, FieldArray, Formik } from "formik";
import ConfirmAlert from "../../components/ConfirmAlert";
import CreatableSelect from "react-select/creatable";
import { addItemMasterSchema } from "../../utils/formSchema";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, {
  formats,
  modules,
} from "../../components/EditorToolbar";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllBrandName,
  getAllSubCategory,
  getAllSuppliers,
  getAllUnitMasterForDropdown,
} from "../../services/contractorApi";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";
import TooltipComponent from "../TooltipComponent";
import MyInput from "../MyInput";

const AddItemMaster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [suppliersData, setSuppliersData] = useState([]);
  const [unitMasterData, setUnitMasterData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [allBrand, setAllBrand] = useState([]);
  const [allCategory, setAllCategory] = useState([]);

  const [itemMasterData, setItemMasterData] = useState([]);
  const { t } = useTranslation();

  const fetchContactsData = async () => {
    const res = await AdminSingleSurveyItemMasterById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
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
  const fetchUnitMasterData = async () => {
    const res = await getAllUnitMasterForDropdown();
    if (res.status) {
      setUnitMasterData(res.data);
    } else {
      setUnitMasterData([]);
    }
  };

  const fetchAllBrandNames = async () => {
    const res = await getAllBrandName();
    if (res.status) {
      setAllBrand(res.data);
    } else {
      setAllBrand([]);
    }
  };
  const fetchAllSubCategory = async () => {
    const isDropdown = "true";
    const res = await getAllSubCategory({ isDropdown });
    if (res.status) {
      setAllCategory(res.data);
    } else {
      setAllCategory([]);
    }
  };

  const fetchAllItemsData = async () => {
    const isDropdown = "true";
    const res = await getAdminAllSurveyItemMaster({ isDropdown });
    if (res.status) {
      setItemMasterData(res.data);
    } else {
      setItemMasterData([]);
    }
  };

  const handleBlur = async (value, props) => {
    const sData = {
      item_unique_id: value,
    };
    if (value) {
      const res = await postCheckItemUniqueIdExists(sData);
      if (res.status) {
        toast.warn(res.message);
        props.handleChange({ target: { name: "item_unique_id", value: "" } });
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const rates = values.rates.map((data) => {
      return {
        brand: data.brand.label,
        brand_id: data.brand.value,
        rate: data.rate,
      };
    });
    const formData = new FormData();
    formData.append("name", values.name.value);
    formData.append("supplier_id", Array.of(values.supplier_id.value));
    formData.append("hsncode", values.hsncode);
    formData.append("rucode", values.rucode);
    formData.append("item_unique_id", values.item_unique_id);
    formData.append("unit_id", Array.of(values.unit_id.value));
    formData.append("description", values.description);
    formData.append("image", values.image || null);
    formData.append("category", Array.of(values.category.value));
    formData.append("sub_category", Array.of(values.sub_category.value));
    formData.append("rates", JSON.stringify(rates));

    if (edit.id) {
      formData.append("id", edit.id);
    }
    const res = edit?.id
      ? await AdminUpdateSurveyItemMaster(formData)
      : await AdminCreateSurveyItemMaster(formData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchContactsData();
    }
    fetchSuppliersData();
    fetchUnitMasterData();
    fetchAllBrandNames();
    fetchAllItemsData();
    fetchAllSubCategory();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>
          {edit.id ? "Update Item Master" : "Add Item Master"} · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={edit.id ? "Update Item Master" : "Add Item Master"}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              supplier_id: edit?.supplier_id
                ? {
                    label: edit?.supplier_name,
                    value: edit?.supplier_id,
                  }
                : "",
              unit_id: edit?.unit_id
                ? {
                    label: edit?.unit_name,
                    value: edit?.unit_id,
                  }
                : "",
              hsncode: edit?.hsncode || "",
              rucode: edit?.rucode || "",
              item_unique_id: edit?.unique_id || "",
              description: edit?.description || "",
              name: edit?.name
                ? {
                    label: edit?.name,
                    value: edit?.name,
                  }
                : "",
              category: edit?.category
                ? {
                    label: edit?.category,
                    value: edit?.category,
                  }
                : "",
              sub_category: edit?.sub_category
                ? {
                    label: edit?.sub_category,
                    value: edit?.sub_category,
                  }
                : "",

              image: edit.image || "",
              rates: (edit?.rates?.length > 0 &&
                edit?.rates.map((data) => {
                  return {
                    brand: { label: data.brand, value: data.item_rates_id },
                    rate: data.rate,
                  };
                })) || [{ brand: "", rate: "" }],
            }}
            validationSchema={addItemMasterSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="align-items-center g-3">
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      {t("Name")} <span className="text-danger">*</span>
                    </Form.Label>
                    <CreatableSelect
                      placeholder="create item..."
                      isClearable
                      className="text-primary w-100"
                      menuPortalTarget={document.body}
                      name={"name"}
                      value={props.values.name}
                      options={itemMasterData?.map((itm) => ({
                        label: itm.name,
                        value: itm.id,
                        // isDisabled: true,
                      }))}
                      onChange={(val) => {
                        if (val && val.value) {
                          const selectedUser = itemMasterData.find(
                            (user) => user.id == val.value
                          );
                          if (selectedUser) {
                            toast.error("Already Exists");
                          } else {
                            props.setFieldValue("name", val);
                          }
                        }
                      }}
                      onBlur={props.handleBlur}
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
                      {t("Supplier Name")}{" "}
                      {/* <span className="text-danger">*</span> */}
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
                      disabled={Boolean(edit?.id)}
                      maxLength={10}
                      onChange={props.handleChange}
                      onBlur={(e) => handleBlur(e.target.value, props)}
                      isInvalid={Boolean(
                        props.touched.item_unique_id &&
                          props.errors.item_unique_id
                      )}
                    />
                    {edit?.id ? null : (
                      <FormText>
                        {t("Note: leave empty for autogenerate")}
                      </FormText>
                    )}
                    <ErrorMessage
                      name="item_unique_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>

                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      {t("Item category")}{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      autoFocus
                      placeholder="--select--"
                      className="text-primary"
                      name="category"
                      value={props.values.category}
                      onChange={(val) => props.setFieldValue("category", val)}
                      options={[
                        { label: "fund", value: "fund" },
                        { label: "stock", value: "stock" },
                      ]}
                      isInvalid={Boolean(
                        props.touched.category && props.errors.category
                      )}
                    />
                    <ErrorMessage
                      name="category"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      {t("Item Sub category")}{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      autoFocus
                      placeholder="--select--"
                      className="text-primary"
                      name="sub_category"
                      value={props.values.sub_category}
                      onChange={(val) =>
                        props.setFieldValue("sub_category", val)
                      }
                      options={allCategory?.map((itm) => ({
                        label: itm.name,
                        value: itm.id,
                      }))}
                      isInvalid={Boolean(
                        props.touched.sub_category && props.errors.sub_category
                      )}
                    />
                    <ErrorMessage
                      name="sub_category"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>{t("Upload Image")}</Form.Label>
                    <div className={"d-flex align-items-center gap-2"}>
                      {edit.id || selectedFile ? (
                        <div
                          className="shadow p-1 success-combo"
                          style={{ borderRadius: "3px" }}
                        >
                          <ImageViewer
                            src={
                              selectedFile &&
                              selectedFile.type.startsWith("image/")
                                ? URL.createObjectURL(selectedFile)
                                : edit.image
                                ? process.env.REACT_APP_API_URL + edit.image
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <img
                              width={35}
                              height={35}
                              className="object-fit"
                              src={
                                (selectedFile &&
                                  selectedFile.type.startsWith("image/") &&
                                  URL.createObjectURL(selectedFile)) ||
                                process.env.REACT_APP_API_URL + edit?.image
                              }
                            />
                          </ImageViewer>
                        </div>
                      ) : null}
                      <Form.Control
                        type="file"
                        name="image"
                        onChange={(e) => {
                          setSelectedFile(e.currentTarget.files[0]);
                          props.setFieldValue("image", e.target.files[0]);
                        }}
                      />
                    </div>
                  </Form.Group>

                  <FieldArray name={`rates`}>
                    {({ push: pushStockImage, remove: removeStockImage }) => (
                      <div className="table-scroll p-3 my-3">
                        <Table striped hover className="text-body  Roles">
                          <thead>
                            <tr>
                              <th>{t("Brand")}</th>
                              <th>{t("rate")}</th>
                              <th>{t("Action")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {props?.values.rates?.map((itm, index) => (
                              <tr key={index}>
                                <td>
                                  <Form.Group>
                                    <Select
                                      menuPortalTarget={document.body}
                                      autoFocus
                                      className="text-primary"
                                      name={`rates[${index}].brand`}
                                      value={itm.brand}
                                      onChange={(e) => {
                                        props.setFieldValue(
                                          `rates[${index}].brand`,
                                          e
                                        );
                                      }}
                                      options={allBrand?.map((itm) => ({
                                        label: itm.brand_name,
                                        value: itm.id,
                                      }))}
                                    />
                                    <ErrorMessage
                                      name="brand"
                                      component="small"
                                      className="text-danger"
                                    />
                                  </Form.Group>
                                </td>
                                <td>
                                  <Form.Control
                                    name={`rates[${index}].rate`}
                                    value={itm.rate}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                  />
                                  <ErrorMessage
                                    name={`rates[${index}].rate`}
                                    component="small"
                                    className="text-danger"
                                  />
                                </td>

                                <td className="text-center">
                                  {index === 0 ? (
                                    <TooltipComponent title={"Add"}>
                                      <BsPlusLg
                                        onClick={() => {
                                          pushStockImage({
                                            brand: {},
                                            rate: null,
                                          });
                                        }}
                                        className={`social-btn success-combo`}
                                      />
                                    </TooltipComponent>
                                  ) : (
                                    <TooltipComponent title={"Remove"}>
                                      <BsDashLg
                                        onClick={() => removeStockImage(index)}
                                        className={`social-btn red-combo`}
                                      />
                                    </TooltipComponent>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </FieldArray>

                  <MyInput
                    name={"description"}
                    formikProps={props}
                    label={t("Description")}
                    customType={"multiline"}
                  />

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
                            />
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
                        description={"Are you sure you want to update this!!"}
                      />
                    </div>
                  </Form.Group>
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default AddItemMaster;
