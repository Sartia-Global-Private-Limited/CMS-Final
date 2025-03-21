import React, { useEffect } from "react";
import { Col, Form, Row, Spinner, InputGroup, Card } from "react-bootstrap";
import Select from "react-select";
import CardComponent from "../../../../components/CardComponent";
import { ErrorMessage, Formik } from "formik";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import ConfirmAlert from "../../../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import TextareaAutosize from "react-textarea-autosize";
import {
  getAllComplaintIdList,
  getAllExpenseCategoryForDropdown,
  getAllPaymentMethodForDropdown,
  getAllSuppliers,
  getSingleExpensesCashById,
  postExpensesCash,
  updateExpensesCash,
} from "../../../../services/contractorApi";
import ImageViewer from "../../../../components/ImageViewer";
import { addExpensesCashSchema } from "../../../../utils/formSchema";
import ViewExpensesCash from "./ViewExpensesCash";
import { getAllUsers } from "../../../../services/authapi";

const CreateExpensesCash = () => {
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [suppliersData, setSuppliersData] = useState([]);
  const [allExpenseCategory, setAllExpenseCategory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);
  const [complaintIdList, setComplaintIdList] = useState([]);
  const [allPaymentMethod, setAllPaymentMethod] = useState([]);
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;

  const fetchPurchaseOrderData = async () => {
    const res = await getSingleExpensesCashById(id);
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

  const fetchExpenseCategoryData = async () => {
    const res = await getAllExpenseCategoryForDropdown();
    if (res.status) {
      setAllExpenseCategory(res.data);
    } else {
      setAllExpenseCategory([]);
    }
  };
  const fetchPaymentMethodData = async () => {
    const res = await getAllPaymentMethodForDropdown();
    if (res.status) {
      setAllPaymentMethod(res.data);
    } else {
      setAllPaymentMethod([]);
    }
  };

  const fetchAllComplaintIdList = async () => {
    const res = await getAllComplaintIdList();
    if (res.status) {
      setComplaintIdList(res.data);
    } else {
      setComplaintIdList([]);
    }
  };

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const formatOptionLabel = ({ label, image }) => (
    <div>
      <img src={image} className="avatar me-2" />
      {label}
    </div>
  );

  useEffect(() => {
    if (id !== "new") {
      fetchPurchaseOrderData();
    }
    fetchPaymentMethodData();
    fetchAllComplaintIdList();
    fetchAllUsersData();
    fetchSuppliersData();
    fetchExpenseCategoryData();
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("expense_category", values.expense_category.value);
    formData.append("expense_amount", values.expense_amount);
    formData.append("payment_method", values.payment_method.value);
    formData.append("supplier_id", values.supplier_id.value);
    formData.append("complaint_id", values.complaint_id.value);
    formData.append("expense_description", values.expense_description);
    // formData.append("expense_date", values.expense_date);
    formData.append("user_id", values.user_id.value);
    formData.append("receipt_invoice", values.receipt_invoice);

    if (edit.id) {
      formData.append("id", edit.id);
    }

    // return console.log("formData", ...formData);
    const res = edit?.id
      ? await updateExpensesCash(formData)
      : await postExpensesCash(formData);
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
        {type === "view" ? "View" : edit?.id ? "Update" : "Create"} Expenses
        Cash · CMS Electricals
      </Helmet>
      <Col md={12}>
        <CardComponent
          className={type === "view" && "after-bg-light"}
          title={`${
            type === "view" ? "View" : edit?.id ? "Update" : "Create"
          } Expenses Cash`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              expense_category: edit.expense_category
                ? {
                    label: edit?.expense_category_name,
                    value: edit.expense_category,
                  }
                : "",
              complaint_id: edit.complaint_id
                ? {
                    label: edit?.complaint_unique_id,
                    value: edit.complaint_id,
                  }
                : "",
              user_id: edit.user_id
                ? {
                    label: edit?.user_name,
                    value: edit.user_id,
                    image: `${process.env.REACT_APP_API_URL}${edit.user_image}`,
                  }
                : "",
              supplier_id: edit.supplier_id
                ? {
                    label: edit?.supplier_name,
                    value: edit.supplier_id,
                  }
                : "",
              payment_method: edit.payment_method_id
                ? {
                    label: edit?.payment_method_name,
                    value: parseInt(edit.payment_method_id),
                  }
                : "",
              expense_amount: edit.expense_amount || "",
              // expense_date: edit.expense_date || "",
              expense_description: edit.expense_description || "",
              receipt_invoice: edit.receipt_invoice || null,
            }}
            validationSchema={addExpensesCashSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-4">
                  {type === "view" ? (
                    <ViewExpensesCash edit={edit} />
                  ) : (
                    <>
                      <Col md={4}>
                        <div className="d-grid gap-4">
                          <MyCard title={"Complaint/User Info"}>
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Select Complaint{" "}
                                <span className="text-danger fw-bold">*</span>
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                name={"complaint_id"}
                                value={props.values.complaint_id}
                                options={complaintIdList?.map((itm) => ({
                                  label: itm.complaint_unique_id,
                                  value: itm.complaint_id,
                                }))}
                                onChange={(selectedOption) => {
                                  props.setFieldValue(
                                    "complaint_id",
                                    selectedOption
                                  );
                                }}
                              />
                              <ErrorMessage
                                name="complaint_id"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                            <Form.Group>
                              <Form.Label>
                                Select User{" "}
                                <span className="text-danger fw-bold">*</span>
                              </Form.Label>
                              <Select
                                menuPortalTarget={document.body}
                                value={props?.values?.user_id}
                                name={`user_id`}
                                options={allUserData?.map((user) => ({
                                  label: user.name,
                                  value: user.id,
                                  image: user.image
                                    ? `${process.env.REACT_APP_API_URL}${user.image}`
                                    : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
                                }))}
                                onChange={(e) => {
                                  props.setFieldValue(`user_id`, e);
                                }}
                                formatOptionLabel={formatOptionLabel}
                              />
                              <ErrorMessage
                                name="user_id"
                                component="small"
                                className="text-danger"
                              />
                            </Form.Group>
                          </MyCard>
                          <MyCard title={"Invoice Info"}>
                            <Row className="g-3">
                              {/* <Form.Group as={Col} md="12">
                                <Form.Label>
                                  Expense Date{" "}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <Form.Control
                                  type="date"
                                  name="expense_date"
                                  onBlur={props.handleBlur}
                                  value={props.values.expense_date}
                                  onChange={props.handleChange}
                                />
                                <ErrorMessage
                                  name="expense_date"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group> */}
                              <Form.Group as={Col} md="12">
                                <Form.Label>Receipt Invoice Upload</Form.Label>
                                {/* <small className="text-muted d-block mb-3">
                              Only Portrait or square images, 2mb max and 200px
                              max-height
                            </small> */}
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
                                            : edit.receipt_invoice
                                            ? process.env.REACT_APP_API_URL +
                                              edit.receipt_invoice
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
                                              edit?.receipt_invoice
                                          }
                                        />
                                      </ImageViewer>
                                    </div>
                                  ) : null}
                                  <Form.Control
                                    type="file"
                                    name="receipt_invoice"
                                    onChange={(e) => {
                                      setSelectedFile(e.currentTarget.files[0]);
                                      props.setFieldValue(
                                        "receipt_invoice",
                                        e.target.files[0]
                                      );
                                    }}
                                  />
                                </div>
                              </Form.Group>
                            </Row>
                          </MyCard>
                        </div>
                      </Col>
                      <Col md={8}>
                        <div className="d-grid gap-4">
                          <MyCard title={"Basic Information"}>
                            <Row className="g-3">
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  Expense Category{" "}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <Select
                                  className="text-primary w-100"
                                  menuPortalTarget={document.body}
                                  name={"expense_category"}
                                  value={props.values.expense_category}
                                  options={allExpenseCategory?.map(
                                    (cateitm) => ({
                                      label: cateitm.category_name,
                                      value: cateitm.id,
                                    })
                                  )}
                                  onChange={(selectedOption) => {
                                    props.setFieldValue(
                                      "expense_category",
                                      selectedOption
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name="expense_category"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  Expense Amount{" "}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <InputGroup>
                                  <InputGroup.Text className="success-combo">
                                    ₹
                                  </InputGroup.Text>
                                  <Form.Control
                                    type="number"
                                    step="any"
                                    name="expense_amount"
                                    value={props.values.expense_amount}
                                    onChange={props.handleChange}
                                    onBlur={props.handleBlur}
                                    isInvalid={Boolean(
                                      props.touched.expense_amount &&
                                        props.errors.expense_amount
                                    )}
                                  />
                                </InputGroup>
                                <ErrorMessage
                                  name="expense_amount"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  Payment Method{" "}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
                                <Select
                                  className="text-primary w-100"
                                  menuPortalTarget={document.body}
                                  name={"payment_method"}
                                  value={props.values.payment_method}
                                  options={allPaymentMethod?.map((itm) => ({
                                    label: itm.method,
                                    value: itm.id,
                                  }))}
                                  onChange={(selectedOption) => {
                                    props.setFieldValue(
                                      "payment_method",
                                      selectedOption
                                    );
                                  }}
                                />
                                <ErrorMessage
                                  name="payment_method"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="6">
                                <Form.Label>
                                  Supplier{" "}
                                  <span className="text-danger fw-bold">*</span>
                                </Form.Label>
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
                                <ErrorMessage
                                  name="supplier_id"
                                  component="small"
                                  className="text-danger"
                                />
                              </Form.Group>
                              <Form.Group as={Col} md="12" className="h-100">
                                <Form.Label>Expense Description</Form.Label>
                                <TextareaAutosize
                                  minRows={5}
                                  className="edit-textarea"
                                  name={"expense_description"}
                                  value={props.values.expense_description}
                                  onChange={props.handleChange}
                                />
                                <ErrorMessage
                                  name="expense_description"
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
                                />{" "}
                                PLEASE WAIT...
                              </>
                            ) : (
                              <>{edit.id ? "UPDATE" : "CREATE"}</>
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

export default CreateExpensesCash;
