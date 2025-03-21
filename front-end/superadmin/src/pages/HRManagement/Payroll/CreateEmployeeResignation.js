import React, { useEffect, useState } from "react";
import {
  getAdminAllHREmployees,
  getSingleEmployeeResignationById,
} from "../../../services/authapi";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  CreateResignations,
  UpdateResignations,
} from "../../../services/authapi";
import MyInput from "../../../components/MyInput";
import { addResignationSchema } from "../../../utils/formSchema";
import moment from "moment";

const CreateEmployeeResignation = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [edit, setEdit] = useState({});
  const [allUserData, setAllUserData] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();

  const fetchAllUsersData = async () => {
    const isDropdown = true;
    const res = await getAdminAllHREmployees({ isDropdown });
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchSingleData = async () => {
    const res = await getSingleEmployeeResignationById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  useEffect(() => {
    if (id !== "new") {
      fetchSingleData();
    }
    fetchAllUsersData();
  }, []);

  const calculateNoticePeriod = (data) => {
    if (data?.resignation_date && data?.last_working_day) {
      return moment(data?.last_working_day).diff(
        moment(data?.resignation_date),
        "days"
      );
    }
    return "";
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    values["notice_period_day"] = calculateNoticePeriod(values);
    if (edit.id) {
      values["id"] = edit.id;
    }
    // return console.log("values", values);
    const res = edit.id
      ? await UpdateResignations(values)
      : await CreateResignations(values);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Helmet>
        <title>
          {t(`${edit.id ? "Update" : "Create"} Employee Resignation`)} · CMS
          Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos="fade-up" data-aos-delay={200}>
        <CardComponent
          title={`${edit.id ? t("Update") : t("Create")} Employee Resignation `}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              user_id: edit.user_id || "",
              resignation_date: edit?.resignation_date || "",
              last_working_day: edit?.last_working_day || "",
              notice_period_day: edit?.notice_period_day || "",
              reason: edit?.reason || "",
            }}
            validationSchema={addResignationSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Row className="g-2">
                  <Col md={12}>
                    <MyInput
                      isRequired
                      name={"user_id"}
                      formikProps={props}
                      label={t("Select User")}
                      customType={"select"}
                      selectProps={{
                        data: allUserData?.map((user) => ({
                          label: user.name,
                          value: user.id,
                        })),
                      }}
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      isRequired
                      name={"resignation_date"}
                      formikProps={props}
                      label={t("Resignation Date")}
                      min={moment().format("YYYY-MM-DD")}
                      type="date"
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      name={"last_working_day"}
                      formikProps={props}
                      label={t("last working day")}
                      min={props.values.resignation_date}
                      type="date"
                    />
                  </Col>
                  <Col md={4}>
                    <MyInput
                      disabled
                      className="fw-bold"
                      value={calculateNoticePeriod(props.values)}
                      name={"notice_period_day"}
                      formikProps={props}
                      label={t("notice period days")}
                    />
                  </Col>
                  <Col md={12}>
                    <MyInput
                      name={"reason"}
                      formikProps={props}
                      label={t("Resignation Reason")}
                      customType={"multiline"}
                    />
                  </Col>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit.id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit.id)}
                        disabled={props.isSubmitting}
                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1"
                      >
                        {props.isSubmitting ? (
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
                        size="sm"
                        deleteFunction={props.handleSubmit}
                        hide={setShowAlert}
                        show={showAlert}
                        title={t("Confirm UPDATE")}
                        description={t(
                          "Are you sure you want to update this!!"
                        )}
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

export default CreateEmployeeResignation;
