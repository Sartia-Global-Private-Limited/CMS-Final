import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CardComponent from "../components/CardComponent";
import MyInput from "../components/MyInput";
import { addMessageUserSchema } from "../utils/formSchema";
import { AddnewUsertoChat, getAllUsersCompanyWise } from "../services/authapi";
import { FORMAT_OPTION_LABEL } from "../components/HelperStructure";
import { CONTACTS_TYPE } from "../data/StaticData";

const AddMessagesUser = () => {
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);
  const [companyType, setCompanyType] = useState("");

  const fetchAllUsersData = async () => {
    const res = await getAllUsersCompanyWise({ type: companyType });
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
      toast.error(res.message);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const res = await AddnewUsertoChat(values?.user_id);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (companyType) {
      fetchAllUsersData();
    }
  }, [companyType]);

  return (
    <>
      <Col md={12}>
        <CardComponent showBackButton={true} title={"ADD User"}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              company_type: "",
              user_id: "",
            }}
            validationSchema={addMessageUserSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"company_type"}
                        formikProps={props}
                        label={"Company Contact Type"}
                        customType={"select"}
                        selectProps={{
                          data: CONTACTS_TYPE,
                          onChange: (e) => setCompanyType(e?.value),
                        }}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"user_id"}
                        formikProps={props}
                        label={"Select User"}
                        customType={"select"}
                        selectProps={{
                          data: allUserData?.map((user) => ({
                            label: user.name,
                            value: user.id,
                            employee_id: user.employee_id,
                            image: user.image
                              ? `${process.env.REACT_APP_API_URL}${user.image}`
                              : null,
                          })),
                        }}
                        formatOptionLabel={FORMAT_OPTION_LABEL}
                      />
                    </Form.Group>

                    <Form.Group as={Col} md={12}>
                      <div className="mt-4 text-center">
                        <button
                          type={"submit"}
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
                            <>{"SAVE"}</>
                          )}
                        </button>
                      </div>
                    </Form.Group>
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

export default AddMessagesUser;
