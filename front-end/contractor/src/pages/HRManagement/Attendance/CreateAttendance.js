import React, { useEffect, useState } from "react";
import { createManuallySchema } from "../../../utils/formSchema";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { ErrorMessage, Formik } from "formik";
import {
  getAdminCreateMarkManually,
  getAllUsers,
} from "../../../services/authapi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import ConfirmAlert from "../../../components/ConfirmAlert";
import MyInput from "../../../components/MyInput";

const CreateAttendance = () => {
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const { t } = useTranslation();

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  useEffect(() => {
    fetchAllUsersData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      user_ids: values.user_ids,
      in_time: values.is_default_time == true ? "" : values.in_time,
      out_time: values.is_default_time == true ? "" : values.out_time,
      is_default_time: values.is_default_time,
      note: values.note,
      attendance_status: values.attendance_status.value,
    };
    // return console.log("sData", sData);
    const res = await getAdminCreateMarkManually(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };
  const options = [
    { label: "Absent", value: 1 },
    { label: "Present", value: 2 },
    { label: "Half Day", value: 3 },
  ];

  const defaultOption = options.find((option) => option.value === 1);

  return (
    <>
      <Helmet>
        <title>Task Category · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos="fade-up" data-aos-delay={200}>
        <CardComponent showBackButton={true} title={`Create Manually`}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              user_ids: "",
              in_time: moment().format(`YYYY-MM-DD 09:00`) || "",
              out_time: moment().format(`YYYY-MM-DD 18:00`) || "",
              is_default_time: false,
              note: "",
              attendance_status: defaultOption,
            }}
            validationSchema={createManuallySchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={12}>
                    <MyInput
                      multiple
                      isRequired
                      name={"user_ids"}
                      formikProps={props}
                      label={t("User Name")}
                      customType={"select"}
                      selectProps={{
                        data: allUserData?.map((user) => ({
                          value: user.id,
                          label: user.name,
                        })),
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      {t("Attendance Status")}
                      <span className="text-danger fw-bold">*</span>
                    </Form.Label>
                    <Select
                      name="attendance_status"
                      options={options}
                      onChange={(selectedOption) => {
                        props.setFieldValue(
                          "attendance_status",
                          selectedOption
                        );
                        props.setFieldValue(
                          "out_time",
                          moment().format(
                            `YYYY-MM-DD ${
                              selectedOption.value === 3 ? "14:00" : "18:00"
                            }`
                          )
                        );
                      }}
                      value={props.values.attendance_status}
                    />
                    <ErrorMessage
                      name="attendance_status"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Check
                      id="is_default_time"
                      type="checkbox"
                      label="Is Default Time"
                      name={"is_default_time"}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                  {!props.values.is_default_time && (
                    <>
                      <Form.Group as={Col} md={6}>
                        <Form.Label>{t("In Time")}</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name={"in_time"}
                          value={props.values.in_time}
                          onChange={props.handleChange}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={6}>
                        <Form.Label>{t("Out Time")}</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name={"out_time"}
                          value={props.values.out_time}
                          onChange={props.handleChange}
                        />
                      </Form.Group>
                    </>
                  )}
                  <Form.Group as={Col} md={12}>
                    <Form.Label>{t("Note")}</Form.Label>
                    <TextareaAutosize
                      minRows={2}
                      className="edit-textarea"
                      name={"note"}
                      value={props.values.note}
                      onChange={props.handleChange}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={"submit"}
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
                          <>{t("CREATE")}</>
                        )}
                      </button>
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

export default CreateAttendance;
