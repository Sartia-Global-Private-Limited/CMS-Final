import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../../components/CardComponent";
import Select from "react-select";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addFoodExpensePunchSchema } from "../../../utils/formSchema";
import TextareaAutosize from "react-textarea-autosize";
import ConfirmAlert from "../../../components/ConfirmAlert";

import { useNavigate } from "react-router-dom";
import {
  getAllComplaintIdList,
  getFoodExpenses,
  postPunchFoodExpenses,
} from "../../../services/contractorApi";
import { getAllUsers } from "../../../services/authapi";
import { BsArrowLeft, BsQuestionLg } from "react-icons/bs";

const FoodExpensePunch = () => {
  const [foodExpensesData, setFoodExpensesData] = useState({});
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [complaintList, setComplaintList] = useState([]);

  const fetchFoodExpensesData = async () => {
    const res = await getFoodExpenses();
    if (res.status) {
      setFoodExpensesData(res.data);
    } else {
      setFoodExpensesData({});
    }
  };

  const fetchAllComplaintList = async () => {
    const res = await getAllComplaintIdList();
    if (res.status) {
      setComplaintList(res.data);
    } else {
      setComplaintList([]);
    }
  };

  const fetchAllUsers = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUsers(res.data);
    } else {
      setAllUsers([]);
    }
  };

  const formatOptionLabel = ({ label, image }) => (
    <div>
      <img src={image} className="avatar me-2" />
      {label}
    </div>
  );

  useEffect(() => {
    fetchFoodExpensesData();
    fetchAllUsers();
    fetchAllComplaintList();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      item_id: foodExpensesData?.id,
      user_id: values.user_id.value,
      amount: foodExpensesData.max_limit,
      complaint_id: values.complaint_id.value,
      expense_description: values.expense_description,
    };
    // return console.log("sData", sData);
    const res = await postPunchFoodExpenses(sData);
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

  return (
    <>
      <Helmet>
        <title>Food Expense Punch · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          heading2={
            <>
              <BsArrowLeft
                title="back"
                fontSize={22}
                onClick={() => navigate(-1)}
                className="me-2 cursor-pointer"
              />
              Food Expense Punch
            </>
          }
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              user_id: "",
              complaint_id: "",
              expense_description: "",
            }}
            validationSchema={addFoodExpensePunchSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={12}>
                    <div className="d-grid">
                      <span>
                        item name: <b>{foodExpensesData?.name}</b>
                      </span>
                      <span>
                        max limit:{" "}
                        <b className="text-green">
                          ₹{foodExpensesData?.max_limit}
                        </b>
                      </span>
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      Select User <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name="user_id"
                      onChange={(val) => props.setFieldValue("user_id", val)}
                      options={allUsers?.map((user) => ({
                        value: user.id,
                        label: user.name,
                        image: user.image
                          ? `${process.env.REACT_APP_API_URL}${user.image}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`,
                      }))}
                      formatOptionLabel={formatOptionLabel}
                    />
                    <ErrorMessage
                      name="user_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      Select Complaint{" "}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name="complaint_id"
                      onChange={(val) =>
                        props.setFieldValue("complaint_id", val)
                      }
                      options={complaintList?.map((user) => ({
                        value: user.complaint_id,
                        label: user.complaint_unique_id,
                      }))}
                    />
                    <ErrorMessage
                      name="complaint_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <TextareaAutosize
                      minRows={4}
                      className="edit-textarea"
                      placeholder="expense description..."
                      name="expense_description"
                      onChange={props.handleChange}
                    />
                  </Form.Group>
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
                          <>Punch</>
                        )}
                      </button>
                      <ConfirmAlert
                        defaultIcon={<BsQuestionLg />}
                        size={"sm"}
                        deleteFunction={
                          props.isValid
                            ? props.handleSubmit
                            : setShowAlert(false)
                        }
                        hide={setShowAlert}
                        show={showAlert}
                        title={"Confirm Punch"}
                        description={"Are you sure you want to Punch this!!"}
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

export default FoodExpensePunch;
