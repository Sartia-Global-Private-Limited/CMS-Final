import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import TextareaAutosize from "react-textarea-autosize";
import Select from "react-select";
import { toast } from "react-toastify";
import { ErrorMessage, Formik } from "formik";
import { addFundsSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useNavigate, useParams } from "react-router-dom";
import {
  getSingleEarthingTestingById,
  postAddFunds,
  postEarthingTesting,
} from "../../services/contractorApi";
import { getAllUsers } from "../../services/authapi";
import { BsArrowLeft } from "react-icons/bs";

const AddFunds = () => {
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  const fetchEarthingTestingData = async () => {
    const res = await getSingleEarthingTestingById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
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

  useEffect(() => {
    if (id !== "new") {
      fetchEarthingTestingData();
    }
    fetchAllUsers();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      user_id: values.user_id.value,
      amount: values.amount,
      remark: values.remark,
    };

    // return console.log("sData", sData);
    const res = await postAddFunds(sData);
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

  const formatOptionLabel = ({ label, image }) => (
    <div>
      <img
        src={
          image
            ? `${process.env.REACT_APP_API_URL}${image}`
            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
        className="avatar me-2"
      />
      {label}
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Add Fund · CMS Electricals</title>
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
              Add Fund
            </>
          }
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              user_id: "",
              amount: "",
              remark: "",
            }}
            validationSchema={addFundsSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      Select User <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      name="user_id"
                      value={props.values.user_id}
                      onChange={(val) => props.setFieldValue("user_id", val)}
                      options={allUsers?.map((user) => ({
                        value: user.id,
                        label: user.name,
                        image: user.image,
                      }))}
                      formatOptionLabel={formatOptionLabel}
                    />
                    <ErrorMessage
                      name="user_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={6}>
                    <Form.Label>
                      Amount <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Form.Control
                      value={props.values.amount}
                      type="number"
                      step="any"
                      name={`amount`}
                      onChange={props.handleChange}
                    />
                    <ErrorMessage
                      name="amount"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      Remark <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <TextareaAutosize
                      value={props.values.remark}
                      className="edit-textarea"
                      minRows={3}
                      name={`remark`}
                      onChange={props.handleChange}
                    />
                    <ErrorMessage
                      name="remark"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>

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
                            PLEASE WAIT...
                          </>
                        ) : (
                          <>{edit.id ? "UPDATE" : "Save"}</>
                        )}
                      </button>
                      <ConfirmAlert
                        size={"sm"}
                        deleteFunction={props.handleSubmit}
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

export default AddFunds;
