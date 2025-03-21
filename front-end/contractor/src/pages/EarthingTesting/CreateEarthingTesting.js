import React, { useEffect, useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { addEarthingTestingSchema } from "../../utils/formSchema";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllComplaintList,
  getAllOutletList,
  getSingleEarthingTestingById,
  postEarthingTesting,
  updateEarthingTesting,
} from "../../services/contractorApi";
import { getAllUsers } from "../../services/authapi";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";
import { FORMAT_OPTION_LABEL } from "../../components/HelperStructure";

const CreateEarthingTesting = () => {
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [complaintList, setComplaintList] = useState([]);
  const [outletList, setOutletList] = useState([]);
  const { t } = useTranslation();

  const fetchEarthingTestingData = async () => {
    const res = await getSingleEarthingTestingById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const fetchAllComplaintList = async () => {
    const res = await getAllComplaintList();
    if (res.status) {
      setComplaintList(res.data);
    } else {
      setComplaintList([]);
    }
  };
  const fetchAllOutletList = async () => {
    const res = await getAllOutletList();
    if (res.status) {
      setOutletList(res.data);
    } else {
      setOutletList([]);
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
    fetchAllComplaintList();
    fetchAllOutletList();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (edit.id) {
      values["id"] = edit.id;
    }
    const res = edit?.id
      ? await updateEarthingTesting(values)
      : await postEarthingTesting(values);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>
          {edit?.id ? "Update" : "Create"} Earthing Testing · CMS Electricals
        </title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={`${edit?.id ? "Update" : "Create"} Earthing Testing`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              complaint_id: edit?.complaint_id || "",
              outlet_id: edit?.outlet_id || "",
              user_id: edit?.user_id || "",
              expire_date: edit?.expire_date || "",
            }}
            validationSchema={addEarthingTestingSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-2">
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      isRequired
                      name={"complaint_id"}
                      formikProps={props}
                      label={"Complaint"}
                      customType={"select"}
                      selectProps={{
                        data: complaintList?.map((itm) => ({
                          value: itm.id,
                          label: itm.complaints,
                        })),
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      multiple
                      name={"outlet_id"}
                      formikProps={props}
                      label={"Outlet"}
                      customType={"select"}
                      selectProps={{
                        data: outletList?.map((itm) => ({
                          value: itm.outlet_id,
                          label: itm.outlet,
                        })),
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      multiple
                      name={"user_id"}
                      formikProps={props}
                      label={"Users"}
                      customType={"select"}
                      selectProps={{
                        data: allUsers?.map((user) => ({
                          label: user.name,
                          value: user.id,
                          image: user.image
                            ? `${process.env.REACT_APP_API_URL}${user.image}`
                            : null,
                        })),
                      }}
                      formatOptionLabel={FORMAT_OPTION_LABEL}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <MyInput
                      isRequired
                      name={"expire_date"}
                      formikProps={props}
                      label={t("expire Date")}
                      type="date"
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
                            />{" "}
                            {t("PLEASE WAIT")}...
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

export default CreateEarthingTesting;
