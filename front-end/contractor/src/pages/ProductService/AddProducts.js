import React, { useEffect } from "react";
import { Col, Form, Row, Spinner, InputGroup, Card } from "react-bootstrap";
import Select from "react-select";
import CardComponent from "../../components/CardComponent";
import { ErrorMessage, Formik } from "formik";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, {
  formats,
  modules,
} from "../../components/EditorToolbar";
import {
  getAllProductCategory,
  getAllSuppliers,
  getSingleProductById,
  postProductDetails,
  updateProductDetails,
} from "../../services/contractorApi";
import ImageViewer from "../../components/ImageViewer";
import moment from "moment/moment";
import { addProductSchema } from "../../utils/formSchema";
import ViewProductDetails from "./ViewProductDetails";
import { useTranslation } from "react-i18next";

const AddProducts = () => {
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [suppliersData, setSuppliersData] = useState([]);
  const [allCategory, setAllCategory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const { t } = useTranslation();

  const fetchPurchaseOrderData = async () => {
    const res = await getSingleProductById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };
  const fetchSuppliersData = async () => {
    const isDropdown = "false";
    const res = await getAllSuppliers({ isDropdown });
    if (res.status) {
      setSuppliersData(res.data);
    } else {
      setSuppliersData([]);
    }
  };

  const fetchCategoryData = async () => {
    const isDropdown = "false";
    const res = await getAllProductCategory({ isDropdown });
    if (res.status) {
      setAllCategory(res.data);
    } else {
      setAllCategory([]);
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchPurchaseOrderData();
    }
    fetchSuppliersData();
    fetchCategoryData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("category_id", values.category_id.value);
    formData.append("product_name", values.product_name);
    formData.append("price", values.price);
    formData.append("quantity", values.quantity);
    formData.append("alert_quantity", values.alert_quantity);
    formData.append("supplier_id", values.supplier_id.value);
    formData.append("manufacturing_date", values.manufacturing_date);
    formData.append("expiry_date", values.expiry_date);
    formData.append("availability_status", values.availability_status);
    formData.append("is_published", values.is_published);
    formData.append("description", values.description);
    formData.append("image_url", values.image_url);

    if (edit.id) {
      formData.append("id", edit.id);
    }

    // return console.log("formData", ...formData);
    const res = edit?.id
      ? await updateProductDetails(formData)
      : await postProductDetails(formData);
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

  function MyCard({ children, title }) {
    return (
      <Card className="card-bg">
        <Card.Header className="fw-bold bg-transparent border-0">
          {title}
        </Card.Header>
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }
  return (
    <>
      <Helmet>
        {type === "view" ? "View" : edit?.id ? "Update" : "Create"} Product ·
        CMS Electricals
      </Helmet>
      <Col md={12}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${
            type === "view" ? "View" : edit?.id ? "Update" : "Create"
          } Product`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              category_id: edit.category_id
                ? {
                    label: edit?.category_name,
                    value: edit.category_id,
                  }
                : "",
              product_name: edit.product_name || "",
              price: edit.price || "",
              quantity: edit.quantity || "",
              alert_quantity: edit.alert_quantity || "",
              supplier_id: edit.supplier_id
                ? {
                    label: edit?.supplier_name,
                    value: edit.supplier_id,
                  }
                : "",
              manufacturing_date: edit.manufacturing_date
                ? moment(edit?.manufacturing_date).format("YYYY-MM-DD")
                : "",
              expiry_date: edit.expiry_date
                ? moment(edit?.expiry_date).format("YYYY-MM-DD")
                : "",
              availability_status: edit.availability_status || "1",
              is_published: edit.is_published || "0",
              description: edit.description || "",
              image_url: edit.image_url || null,
            }}
            validationSchema={addProductSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-4">
                  {type === "view" ? (
                    <ViewProductDetails edit={edit} />
                  ) : (
                    <>
                      <Col md={4}>
                        <div className="d-grid gap-4">
                          <MyCard title={t("Images")}>
                            <Form.Label>
                              {t("Product Images Upload")}
                            </Form.Label>
                            <small className="text-muted d-block mb-3">
                              Only Portrait or square images, 2mb max and 200px
                              max-height
                            </small>
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
                                        : edit.image_url
                                        ? process.env.REACT_APP_API_URL +
                                          edit.image_url
                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                    }
                                  >
                                    <img
                                      width={35}
                                      height={35}
                                      className="object-fit"
                                      // src={`${process.env.REACT_APP_API_URL}${edit?.image_url}`}
                                      src={
                                        (selectedFile &&
                                          selectedFile.type.startsWith(
                                            "image/"
                                          ) &&
                                          URL.createObjectURL(selectedFile)) ||
                                        process.env.REACT_APP_API_URL +
                                          edit?.image_url
                                      }
                                    />
                                  </ImageViewer>
                                </div>
                              ) : null}
                              <Form.Control
                                type="file"
                                name="image_url"
                                onChange={(e) => {
                                  setSelectedFile(e.currentTarget.files[0]);
                                  props.setFieldValue(
                                    "image_url",
                                    e.target.files[0]
                                  );
                                }}
                              />
                            </div>
                          </MyCard>
                          <MyCard title={t("Inventory Info")}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                {t("Quantity")}{" "}
                                <span className="text-danger fw-bold">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="quantity"
                                value={props.values.quantity}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.quantity &&
                                    props.errors.quantity
                                )}
                              />
                              <ErrorMessage
                                name="quantity"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>
                                {t("Alert Quantity")}{" "}
                                <span className="text-danger fw-bold">*</span>
                              </Form.Label>
                              <Form.Control
                                type="text"
                                name="alert_quantity"
                                value={props.values.alert_quantity}
                                onChange={props.handleChange}
                                onBlur={props.handleBlur}
                                isInvalid={Boolean(
                                  props.touched.alert_quantity &&
                                    props.errors.alert_quantity
                                )}
                              />
                              <ErrorMessage
                                name="alert_quantity"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                          </MyCard>
                          <MyCard title={t("Availability Status")}>
                            <Form.Group className="d-grid gap-2">
                              <Form.Check
                                type="radio"
                                label={t("In Stock")}
                                id="in-stock"
                                name="availability_status"
                                value={props.values.availability_status}
                                checked={
                                  edit?.id
                                    ? Boolean(
                                        props.values.availability_status == "1"
                                      )
                                    : props.values.availability_status === "1"
                                }
                                onChange={() => {
                                  props.setFieldValue(
                                    "availability_status",
                                    "1"
                                  );
                                }}
                              />
                              <Form.Check
                                type="radio"
                                label={t("Out Stock")}
                                id="out-stock"
                                name="availability_status"
                                value={props.values.availability_status}
                                checked={
                                  edit?.id
                                    ? Boolean(
                                        props.values.availability_status == "2"
                                      )
                                    : props.values.availability_status === "2"
                                }
                                onChange={() => {
                                  props.setFieldValue(
                                    "availability_status",
                                    "2"
                                  );
                                }}
                              />
                            </Form.Group>
                          </MyCard>
                          <MyCard title={t("Publish Schedule")}>
                            <Form.Group className="d-grid gap-2">
                              <Form.Check
                                type="radio"
                                label={t("Not published")}
                                id="not-published"
                                name="is_published"
                                value={props.values.is_published}
                                checked={
                                  edit?.id
                                    ? Boolean(props.values.is_published == "0")
                                    : props.values.is_published === "0"
                                }
                                onChange={() => {
                                  props.setFieldValue("is_published", "0");
                                }}
                              />
                              <Form.Check
                                type="radio"
                                label={t("Published")}
                                id="published"
                                name="is_published"
                                value={props.values.is_published}
                                checked={
                                  edit?.id
                                    ? Boolean(props.values.is_published == "1")
                                    : props.values.is_published === "1"
                                }
                                onChange={() => {
                                  props.setFieldValue("is_published", "1");
                                }}
                              />
                            </Form.Group>
                          </MyCard>
                        </div>
                      </Col>
                      <Col md={8}>
                        <div className="d-grid gap-4">
                          <MyCard title={t("Basic Information")}>
                            <Row className="g-4">
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  {t("category name")}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <Select
                                  className="text-primary w-100"
                                  menuPortalTarget={document.body}
                                  name={"category_id"}
                                  value={props.values.category_id}
                                  options={allCategory?.map((cateitm) => ({
                                    label: cateitm.category_name,
                                    value: cateitm.id,
                                  }))}
                                  onChange={(selectedOption) => {
                                    props.setFieldValue(
                                      "category_id",
                                      selectedOption
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name="category_id"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  {t("Product name")}{" "}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="product_name"
                                  value={props.values.product_name}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.product_name &&
                                      props.errors.product_name
                                  )}
                                />
                                <ErrorMessage
                                  name="product_name"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  {t("Price")}{" "}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <InputGroup>
                                  <InputGroup.Text className="success-combo">
                                    ₹
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="number"
                                    name="price"
                                    value={props.values.price}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    isInvalid={Boolean(
                                      props.touched.price && props.errors.price
                                    )}
                                  />
                                </InputGroup>
                                <ErrorMessage
                                  name="price"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="6">
                                <Form.Label>{t("Supplier")}</Form.Label>
                                <Select
                                  className="text-primary w-100"
                                  menuPortalTarget={document.body}
                                  name={"supplier_id"}
                                  value={props.values.supplier_id}
                                  options={suppliersData?.map((itm) => ({
                                    label: itm.supplier_name,
                                    value: itm.id,
                                  }))}
                                  onChange={(selectedOption) => {
                                    props.setFieldValue(
                                      "supplier_id",
                                      selectedOption
                                    );
                                  }}
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="12" className="h-100">
                                <Form.Label>
                                  {t("Product Description")}
                                </Form.Label>
                                <EditorToolbar />
                                <ReactQuill
                                  style={{ height: "200px" }}
                                  placeholder={"Write something awesome..."}
                                  modules={modules}
                                  formats={formats}
                                  theme="snow"
                                  name={"description"}
                                  value={props.values.description}
                                  onChange={(getContent) => {
                                    props.setFieldValue(
                                      "description",
                                      getContent
                                    );
                                  }}
                                />
                              </Form.Group>
                            </Row>
                          </MyCard>
                          <MyCard title={t("Product Date")}>
                            <Row className="g-4">
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  {t("Manufacturing Date")}
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="manufacturing_date"
                                  onBlur={props.handleBlur}
                                  value={props.values.manufacturing_date}
                                  onChange={props.handleChange}
                                />
                                <ErrorMessage
                                  name="manufacturing_date"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="6">
                                <Form.Label>{t("Expiry Date")}</Form.Label>
                                <Form.Control
                                  type="date"
                                  name="expiry_date"
                                  onBlur={props.handleBlur}
                                  value={props.values.expiry_date}
                                  onChange={props.handleChange}
                                />
                                <ErrorMessage
                                  name="expiry_date"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                            </Row>
                          </MyCard>
                        </div>
                      </Col>
                      <Col md={12}>
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
                                PLEASE WAIT...
                              </>
                            ) : (
                              <>{edit.id ? t("UPDATE") : t("CREATE")}</>
                            )}
                          </button>
                          <ConfirmAlert
                            size={"sm"}
                            deleteFunction={props.handleSubmit}
                            hide={setShowAlert}
                            show={showAlert}
                            title={"Confirm UPDATE"}
                            description={
                              "Are you sure you want to update this!!"
                            }
                          />
                        </div>
                      </Col>{" "}
                    </>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default AddProducts;
