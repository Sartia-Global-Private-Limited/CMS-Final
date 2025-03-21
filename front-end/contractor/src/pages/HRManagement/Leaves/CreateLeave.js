import React, { useEffect, useState } from "react";
import { assignLeaveSchema } from "../../../utils/formSchema";
import { Helmet } from "react-helmet";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import { Formik } from "formik";
import {
  assignLeave,
  getAdminAllHREmployees,
  getAdminAllLeavesType,
} from "../../../services/authapi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import { FORMAT_OPTION_LABEL } from "../../../components/HelperStructure";
import MyInput from "../../../components/MyInput";

const CreateLeave = () => {
  const navigate = useNavigate();
  const [leavet, setLeavet] = useState([]);
  const [allHrEmployees, setAllHrEmployees] = useState([]);

  const { t } = useTranslation();
  const fetchLeaveData = async () => {
    const res = await getAdminAllLeavesType({ isDropdown: true });
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.leave_type,
        };
      });
      setLeavet(rData);
    } else {
      setLeavet([]);
    }
  };
  const fetchAllHrEmployeesData = async () => {
    const isDropdown = "false";
    const res = await getAdminAllHREmployees({ isDropdown });
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          label: itm.name,
          value: itm.id,
          employee_id: itm.employee_id,
          image: itm.image
            ? `${process.env.REACT_APP_API_URL}${itm.image}`
            : null,
        };
      });

      setAllHrEmployees(rData);
    } else {
      setAllHrEmployees([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // console.log(values);
    const bodyFormData = new FormData();
    bodyFormData.set("user_id", values.user_id);
    bodyFormData.set("leave_type_id", values.leave_type_id);
    bodyFormData.set("start_date", values.start_date);
    bodyFormData.set("end_date", values.end_date);
    bodyFormData.set("reason", values.reason);
    bodyFormData.set("image", values.image);
    bodyFormData.set("status", "approved");
    const res = await assignLeave(bodyFormData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };
  useEffect(() => {
    fetchAllHrEmployeesData();
    fetchLeaveData();
  }, []);
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
              user_id: "",
              leave_type_id: "",
              start_date: "",
              end_date: "",
              reason: "",
              image: null,
            }}
            validationSchema={assignLeaveSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Col md={12} className="mx-auto">
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>{t("Employee")}</Form.Label>
                    <Col md={8}>
                      <MyInput
                        isRequired
                        name={"user_id"}
                        formikProps={props}
                        customType={"select"}
                        selectProps={{
                          data: allHrEmployees,
                        }}
                        formatOptionLabel={FORMAT_OPTION_LABEL}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>{t("Leave Type")}</Form.Label>
                    <Col md={8}>
                      <MyInput
                        isRequired
                        name={"leave_type_id"}
                        formikProps={props}
                        customType={"select"}
                        selectProps={{
                          data: leavet,
                        }}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>{t("Start Date")}</Form.Label>
                    <Col md={8}>
                      <MyInput
                        isRequired
                        name={"start_date"}
                        formikProps={props}
                        type="date"
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>{t("End date")}</Form.Label>
                    <Col md={8}>
                      <MyInput
                        isRequired
                        name={"end_date"}
                        formikProps={props}
                        type="date"
                        min={props.values.start_date}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column>{t("reason")}</Form.Label>
                    <Col md={8}>
                      <MyInput
                        name={"reason"}
                        formikProps={props}
                        customType={"multiline"}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row}>
                    <Form.Label column>{t("Document")}</Form.Label>
                    <Col md={8}>
                      <Form.Control
                        type="file"
                        name={"image"}
                        onChange={(e) =>
                          props.setFieldValue("image", e.target.files[0])
                        }
                        onBlur={props.handleBlur}
                      />
                    </Col>
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
                </Col>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateLeave;
