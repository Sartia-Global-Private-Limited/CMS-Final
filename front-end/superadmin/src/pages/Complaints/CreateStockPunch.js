import React, { useEffect, useState } from "react";
import { Col, Table, Form, Spinner, Row } from "react-bootstrap";
import { BsDashLg, BsPlusLg, BsQuestionLg } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import Select from "react-select";
import { toast } from "react-toastify";
import { ErrorMessage, FieldArray, Formik } from "formik";
import {
  getAllComplaintIdList,
  getAllItemMasterForDropdown,
  getAreaManagerOfUser,
  getSingleStockPunchById,
  getStockRequestDetailsOnItemId,
  getUserDetailsByComplaintId,
  postStockPunch,
} from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ViewStockPunch from "./ViewStockPunch";
import { addStockPunchSchema } from "../../utils/formSchema";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import ImageViewer from "../../components/ImageViewer";

const CreateStockPunch = () => {
  const { user } = useSelector(selectUser);
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const [complaintData, setComplaintData] = useState([]);
  const [userId, setUserId] = useState("");
  const [allUserData, setAllUserData] = useState([]);
  const [allAreaManeger, setAllAreaManeger] = useState({});
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [itemMasterData, setItemMasterData] = useState([]);

  const fetchSingleData = async () => {
    const res = await getSingleStockPunchById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  //   submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      user_id: values.user_id.value,
      complaint_id: values.complaint_id.value,
      stock_punch_detail: values.stock_punch_detail,
    };

    // return console.log("sData", sData);
    const res = await postStockPunch(sData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    resetForm();
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

  const fetchComplaintData = async () => {
    const res = await getAllComplaintIdList();
    if (res.status) {
      setComplaintData(res.data);
    } else {
      setComplaintData([]);
    }
  };

  const handleStockRequestDetails = async (id, setFieldValue, index) => {
    const res = await getStockRequestDetailsOnItemId(id, userId);
    if (res.status) {
      setFieldValue(
        `stock_punch_detail.${index}.prev_qty`,
        // res.data.request_qty
        res.data.quantity
      );
    } else {
      setFieldValue(`stock_punch_detail.${index}.prev_qty`, 0);
    }
  };

  // Get User Details By Complaint Id
  const handleUserDetails = async (value, setFieldValue) => {
    const res = await getUserDetailsByComplaintId(value);
    setFieldValue("user_id", "");
    if (res.status) {
      // const newUserData = {
      //   user_id: user?.id,
      //   name: `${user?.name} (${user?.employee_id} - self)`,
      //   employee_id: user?.employee_id,
      //   image: user?.image,
      // };
      // res.data.unshift(newUserData);
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
      toast.error(res.message);
    }
  };
  const handleAreaManegerDetails = async (value) => {
    const res = await getAreaManagerOfUser(value);
    if (res.status) {
      setAllAreaManeger(res.data);
    } else {
      setAllAreaManeger({});
      // toast.error(res.message);
    }
    setUserId(value);
  };

  useEffect(() => {
    fetchItemMasterData();
    fetchComplaintData();
    if (id !== "new") {
      fetchSingleData();
    }
  }, []);

  const formatOptionLabel = ({ label, image }) => (
    <div>
      <img src={image} className="avatar me-2" />
      {label}
    </div>
  );

  const itemFormatOptionLabel = ({ label, unique_id, image }) => (
    <div className="d-flex">
      <img src={image} className="avatar me-2" />
      <span className="small d-grid">
        <span>{label}</span>
        <span className="text-gray">({unique_id})</span>
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
          title={`${type === "view" ? "View" : "Create"} Stock Punch`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              stock_punch_detail: [
                {
                  item_name: "",
                  prev_qty: "",
                  item_qty: "",
                },
              ],
              user_id: "",
              complaint_id: "",
            }}
            // validate={validate}
            validationSchema={addStockPunchSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    {type === "view" ? (
                      <ViewStockPunch edit={edit} />
                    ) : (
                      <>
                        <FieldArray name="stock_punch_detail">
                          {({ remove, push }) => (
                            <div className="table-scroll p-2">
                              <Row className="g-3 align-items-end">
                                <Form.Group as={Col} md="4">
                                  <Form.Label>
                                    Select Complaint{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Select
                                    menuPortalTarget={document.body}
                                    name={`complaint_id`}
                                    value={props.values.complaint_id}
                                    options={complaintData?.map((itm) => ({
                                      label: itm.complaint_unique_id,
                                      value: itm.complaint_id,
                                    }))}
                                    onChange={(e) => {
                                      handleUserDetails(
                                        e.value,
                                        props.setFieldValue
                                      );
                                      props.setFieldValue(`complaint_id`, e);
                                    }}
                                  />
                                  <ErrorMessage
                                    name="complaint_id"
                                    component="small"
                                    className="text-danger"
                                  />
                                </Form.Group>
                                <Form.Group as={Col} md="4">
                                  <Form.Label>
                                    Select User{" "}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <Select
                                    menuPortalTarget={document.body}
                                    name="user_id"
                                    value={props.values.user_id}
                                    options={allUserData?.map((user) => ({
                                      label: user.name,
                                      value: user.user_id,
                                      image:
                                        user.image == "" || user.image == null
                                          ? `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                          : process.env.REACT_APP_API_URL +
                                            user.image,
                                    }))}
                                    onChange={(e) => {
                                      handleAreaManegerDetails(e?.value);
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
                                {allAreaManeger?.name ? (
                                  <Form.Group as={Col} md={4}>
                                    <ImageViewer
                                      src={
                                        allAreaManeger?.image
                                          ? `${process.env.REACT_APP_API_URL}${allAreaManeger?.image}`
                                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                      }
                                    >
                                      <img
                                        width={30}
                                        height={30}
                                        className="my-bg object-fit p-1 rounded-circle"
                                        src={
                                          allAreaManeger?.image
                                            ? `${process.env.REACT_APP_API_URL}${allAreaManeger?.image}`
                                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                                        }
                                      />{" "}
                                      {allAreaManeger?.name}{" "}
                                      {allAreaManeger?.employee_id
                                        ? `- ${allAreaManeger?.employee_id}`
                                        : null}{" "}
                                      <small className="text-gray">
                                        (Area Manager)
                                      </small>
                                    </ImageViewer>
                                  </Form.Group>
                                ) : null}
                                <Col md={12}>
                                  {props.values.stock_punch_detail.length >
                                    0 && (
                                    <Table
                                      striped
                                      hover
                                      className="text-body bg-new Roles"
                                    >
                                      <thead>
                                        <tr>
                                          <th>
                                            Item Name{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </th>
                                          <th>Previous Qty</th>
                                          <th>
                                            Item Qty{" "}
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {props.values.stock_punch_detail.map(
                                          (itm, index) => (
                                            <tr key={index}>
                                              <td>
                                                <Select
                                                  className="text-start"
                                                  menuPortalTarget={
                                                    document.body
                                                  }
                                                  name={`stock_punch_detail.${index}.item_name`}
                                                  value={itm.item_name}
                                                  options={itemMasterData?.map(
                                                    (itm) => ({
                                                      label: itm.name,
                                                      value: itm.id,
                                                      unique_id: itm.unique_id,
                                                      rate: itm.rate,
                                                      image: itm.image
                                                        ? `${process.env.REACT_APP_API_URL}${itm.image}`
                                                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
                                                    })
                                                  )}
                                                  onChange={(e) => {
                                                    handleStockRequestDetails(
                                                      e.value,
                                                      props.setFieldValue,
                                                      index
                                                    );
                                                    props.setFieldValue(
                                                      `stock_punch_detail.${index}.item_name`,
                                                      e
                                                    );
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
                                                <Form.Control
                                                  name={`stock_punch_detail.${index}.prev_qty`}
                                                  placeholder="0"
                                                  value={itm.prev_qty}
                                                  disabled
                                                  onChange={props.handleChange}
                                                />
                                                <ErrorMessage
                                                  name={`stock_punch_detail.${index}.prev_qty`}
                                                  component="span"
                                                  className="text-danger"
                                                />
                                              </td>
                                              <td>
                                                <Form.Control
                                                  name={`stock_punch_detail.${index}.item_qty`}
                                                  placeholder="0"
                                                  value={itm.item_qty}
                                                  onChange={props.handleChange}
                                                />
                                                <ErrorMessage
                                                  name={`stock_punch_detail.${index}.item_qty`}
                                                  component="span"
                                                  className="text-danger"
                                                />
                                              </td>

                                              <td className="text-center">
                                                {index === 0 ? (
                                                  <TooltipComponent
                                                    title={"Add"}
                                                  >
                                                    <BsPlusLg
                                                      onClick={() => {
                                                        push({
                                                          item_name: "",
                                                          prev_qty: "",
                                                          item_qty: "",
                                                        });
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
                                                        remove(index)
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
                                </Col>
                              </Row>
                            </div>
                          )}
                        </FieldArray>
                        <Form.Group as={Col} md={12}>
                          <div className="mt-4 text-center">
                            <button
                              type={`button`}
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
                                  />
                                  PLEASE WAIT...
                                </>
                              ) : (
                                <>Submit</>
                              )}
                            </button>
                            <ConfirmAlert
                              size={"sm"}
                              defaultIcon={<BsQuestionLg />}
                              deleteFunction={props.handleSubmit}
                              hide={setShowAlert}
                              show={showAlert}
                              title={"Confirm Punch"}
                              description={
                                "Are you sure you want to punch this!!"
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
