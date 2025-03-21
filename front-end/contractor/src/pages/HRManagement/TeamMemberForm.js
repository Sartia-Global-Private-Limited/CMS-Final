import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import MyInput from "../../components/MyInput";
import { addTeamMemberListSchema } from "../../utils/formSchema";
import {
  getAdminUserListToAddTeams,
  postAdminUserListToAddTeams,
} from "../../services/authapi";
import { FORMAT_OPTION_LABEL } from "../../components/HelperStructure";
import CardComponent from "../../components/CardComponent";

const TeamMemberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allUserData, setAllUserData] = useState([]);

  const fetchAllUsersData = async () => {
    const res = await getAdminUserListToAddTeams();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const res = await postAdminUserListToAddTeams({
      team_id: id,
      user_id: values?.user_id,
    });
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
    fetchAllUsersData();
  }, []);

  return (
    <>
      <Col md={12}>
        <CardComponent showBackButton={true} title={"Create Team Member"}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              user_id: [],
            }}
            validationSchema={addTeamMemberListSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3">
                  <Form.Group as={Col} md={6}>
                    <MyInput
                      isRequired
                      multiple
                      name={"user_id"}
                      formikProps={props}
                      label={"Select User"}
                      customType={"select"}
                      selectProps={{
                        data: allUserData?.map((user) => ({
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
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default TeamMemberForm;
