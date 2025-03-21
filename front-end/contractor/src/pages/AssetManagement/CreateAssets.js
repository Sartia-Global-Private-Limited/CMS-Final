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
import {
  getAllSuppliers,
  getSingleAssetsById,
  postAssets,
  updateAssets,
} from "../../services/contractorApi";
import { addAssetSchema } from "../../utils/formSchema";
import ImageViewer from "../../components/ImageViewer";
import ViewAsset from "./ViewAsset";
import { useTranslation } from "react-i18next";

const CreateAssets = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [suppliersData, setSuppliersData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { t } = useTranslation();

  const fetchPurchaseOrderData = async () => {
    const res = await getSingleAssetsById(id);
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

  useEffect(() => {
    if (id !== "new") {
      fetchPurchaseOrderData();
    }
    fetchSuppliersData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("asset_name", values.asset_name);
    formData.append("asset_model_number", values.asset_model_number);
    formData.append("asset_uin_number", values.asset_uin_number);
    formData.append("asset_price", values.asset_price);
    formData.append("asset_purchase_date", values.asset_purchase_date);

    formData.append(
      "asset_warranty_guarantee_start_date",
      values.asset_warranty_guarantee_start_date
    );
    formData.append(
      "asset_warranty_guarantee_end_date",
      values.asset_warranty_guarantee_end_date
    );
    formData.append(
      "asset_warranty_guarantee_value",
      values.asset_warranty_guarantee_value
    );
    formData.append("asset_supplier_id", values.asset_supplier_id.value);
    formData.append("asset_status", values.asset_status);
    formData.append("asset_image", values.asset_image);

    if (edit.id) {
      formData.append("id", edit.id);
    }

    // return console.log("formData", ...formData);
    const res = edit?.id
      ? await updateAssets(formData)
      : await postAssets(formData);
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
        {type === "view" ? "View" : edit?.id ? "Update" : "Create"} Asset · CMS
        Electricals
      </Helmet>
      <Col md={12}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${
            type === "view" ? "View" : edit?.id ? "Update" : "Create"
          } Asset`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              asset_name: edit.asset_name || "",
              asset_model_number: edit.asset_model_number || "",
              asset_uin_number: edit.asset_uin_number || "",
              asset_price: edit.asset_price || "",
              asset_purchase_date: edit.asset_purchase_date || "",

              asset_warranty_guarantee_start_date:
                edit.asset_warranty_guarantee_start_date || "",
              asset_warranty_guarantee_end_date:
                edit.asset_warranty_guarantee_end_date || "",
              asset_warranty_guarantee_value:
                edit.asset_warranty_guarantee_value || "1",
              asset_supplier_id: edit.asset_supplier_id
                ? {
                    label: edit?.supplier_name,
                    value: edit.asset_supplier_id,
                  }
                : "",
              asset_status: edit.asset_status || 1,
              asset_image: edit.asset_image || null,
            }}
            validationSchema={addAssetSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-4">
                  {type === "view" ? (
                    <ViewAsset edit={edit} />
                  ) : (
                    <>
                      <Col md={12}>
                        <div className="d-grid gap-4">
                          <MyCard title={t("Basic Information")}>
                            <Row className="g-3">
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  {t("asset name")}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="asset_name"
                                  value={props.values.asset_name}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.asset_name &&
                                      props.errors.asset_name
                                  )}
                                />
                                <ErrorMessage
                                  name="asset_name"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  {t("asset model number")}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="asset_model_number"
                                  value={props.values.asset_model_number}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.asset_model_number &&
                                      props.errors.asset_model_number
                                  )}
                                />
                                <ErrorMessage
                                  name="asset_model_number"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="3">
                                <Form.Label>
                                  {t("asset uin no")}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  name="asset_uin_number"
                                  value={props.values.asset_uin_number}
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                  isInvalid={Boolean(
                                    props.touched.asset_uin_number &&
                                      props.errors.asset_uin_number
                                  )}
                                />
                                <ErrorMessage
                                  name="asset_uin_number"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="3">
                                <Form.Label>
                                  {t("asset Price")}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <InputGroup>
                                  <InputGroup.Text className="py-0 success-combo">
                                    ₹
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="number"
                                    step="any"
                                    name="asset_price"
                                    value={props.values.asset_price}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    isInvalid={Boolean(
                                      props.touched.asset_price &&
                                        props.errors.asset_price
                                    )}
                                  />
                                </InputGroup>
                                <ErrorMessage
                                  name="asset_price"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="6">
                                <Form.Label>{t("Supplier")}</Form.Label>
                                <Select
                                  className="text-primary w-100"
                                  menuPortalTarget={document.body}
                                  name={"asset_supplier_id"}
                                  value={props.values.asset_supplier_id}
                                  options={suppliersData?.map((itm) => ({
                                    label: itm.supplier_name,
                                    value: itm.id,
                                  }))}
                                  onChange={(selectedOption) => {
                                    props.setFieldValue(
                                      "asset_supplier_id",
                                      selectedOption
                                    );
                                  }}
                                />
                              </Form.Group>
                            </Row>
                          </MyCard>
                          <Col md={7}>
                            <MyCard title={t("image")}>
                              <Form.Label>{t("Asset Image Upload")}</Form.Label>
                              <small className="text-muted d-block mb-3">
                                {t(
                                  " Only Portrait or square images, 2mb max and 200px max-height"
                                )}
                              </small>
                              <div
                                className={"d-flex align-items-center gap-2"}
                              >
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
                                          : edit.asset_image
                                          ? process.env.REACT_APP_API_URL +
                                            edit.asset_image
                                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                      }
                                    >
                                      <img
                                        width={35}
                                        height={35}
                                        className="object-fit"
                                        src={
                                          (selectedFile &&
                                            selectedFile.type.startsWith(
                                              "image/"
                                            ) &&
                                            URL.createObjectURL(
                                              selectedFile
                                            )) ||
                                          process.env.REACT_APP_API_URL +
                                            edit?.asset_image
                                        }
                                      />
                                    </ImageViewer>
                                  </div>
                                ) : null}
                                <Form.Control
                                  type="file"
                                  name="asset_image"
                                  onChange={(e) => {
                                    setSelectedFile(e.currentTarget.files[0]);
                                    props.setFieldValue(
                                      "asset_image",
                                      e.target.files[0]
                                    );
                                  }}
                                />
                              </div>
                            </MyCard>
                          </Col>
                          <MyCard title={t("Warranty/Guarantee Date")}>
                            <Row className="g-3">
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  {t("asset purchase Date")}
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="asset_purchase_date"
                                  onBlur={props.handleBlur}
                                  value={props.values.asset_purchase_date}
                                  onChange={props.handleChange}
                                />
                                <ErrorMessage
                                  name="asset_purchase_date"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>

                              <MyCard title={t("asset warranty/guarantee")}>
                                <Form.Group className="d-flex gap-2">
                                  <Form.Check
                                    className="w-100"
                                    type="radio"
                                    label={t("Warranty")}
                                    id="warranty"
                                    name="asset_warranty_guarantee_value"
                                    value={
                                      props.values
                                        .asset_warranty_guarantee_value
                                    }
                                    checked={
                                      edit?.id
                                        ? Boolean(
                                            props.values
                                              .asset_warranty_guarantee_value ==
                                              "1"
                                          )
                                        : props.values
                                            .asset_warranty_guarantee_value ===
                                          "1"
                                    }
                                    onChange={() => {
                                      props.setFieldValue(
                                        "asset_warranty_guarantee_value",
                                        "1"
                                      );
                                    }}
                                  />
                                  <Form.Check
                                    className="w-100"
                                    type="radio"
                                    label={t("Guarantee")}
                                    id="guarantee"
                                    name="asset_warranty_guarantee_value"
                                    value={
                                      props.values
                                        .asset_warranty_guarantee_value
                                    }
                                    checked={
                                      edit?.id
                                        ? Boolean(
                                            props.values
                                              .asset_warranty_guarantee_value ==
                                              "2"
                                          )
                                        : props.values
                                            .asset_warranty_guarantee_value ===
                                          "2"
                                    }
                                    onChange={() => {
                                      props.setFieldValue(
                                        "asset_warranty_guarantee_value",
                                        "2"
                                      );
                                    }}
                                  />
                                </Form.Group>
                              </MyCard>

                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  {t("warranty guarantee start Date")}
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="asset_warranty_guarantee_start_date"
                                  value={
                                    props.values
                                      .asset_warranty_guarantee_start_date
                                  }
                                  onChange={props.handleChange}
                                  onBlur={props.handleBlur}
                                />
                                <ErrorMessage
                                  name="asset_warranty_guarantee_start_date"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  {t("warranty guarantee end Date")}
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="asset_warranty_guarantee_end_date"
                                  onBlur={props.handleBlur}
                                  value={
                                    props.values
                                      .asset_warranty_guarantee_end_date
                                  }
                                  onChange={props.handleChange}
                                />
                                <ErrorMessage
                                  name="asset_warranty_guarantee_end_date"
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
                                {t("PLEASE WAIT")}...
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
                      </Col>
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

export default CreateAssets;
