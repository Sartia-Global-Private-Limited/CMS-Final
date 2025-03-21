import { Formik } from "formik";
import React, { useState } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsEye, BsEyeSlash, BsShieldLockFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Switch from "../../components/Switch";
import { login } from "../../features/auth/authSlice";
import { adminLogin } from "../../services/authapi";
import { loginSchema } from "../../utils/formSchema";

const SignIn = () => {
  const dispatch = useDispatch();
  const [passwordShown, setPasswordShown] = useState(false);
  const [checked, setChecked] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (values) => {
    // const res = checked && await adminLogin(values);
    const res = await adminLogin(values);
    if (res.status) {
      localStorage.setItem("cms-sa-token", res.token);
      dispatch(login(res.data));
      // toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <section className="overflow-hidden login">
      <Helmet>
        <title>Sign In · CMS Electricals</title>
      </Helmet>
      <div className="w-100">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <Row className="g-0 vh-100 overflow-hidden">
                <Col md={6} className="bg-img d-none d-md-block">
                  <div className="login-text text-white">
                    <h1 className="mb-3 text-shadow-1">
                      Welcome CMS Electricals
                    </h1>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the industry's
                      standard dummy text ever since the 1500s, when an unknown
                      printer took a galley of type and.
                    </p>
                  </div>
                </Col>
                <Col
                  md={6}
                  data-aos="flip-left"
                  data-aos-easing="ease-out-cubic"
                  data-aos-duration="1000"
                >
                  <div className="bg-blue h-100 p-80 d-align">
                    <Row className="g-4 w-75 shadow py-3 px-2">
                      <h3 className="fs-20 mt-0 mb-4 fw-bold">
                        <span className="pb-3 text-secondary hr-border2">
                          Log In
                        </span>
                      </h3>
                      <Form.Group>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name={"email"}
                          value={props.values.email}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          isInvalid={Boolean(
                            props.touched.email && props.errors.email
                          )}
                        />
                        <Form.Control.Feedback type="invalid">
                          {props.errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>Enter Password</Form.Label>
                        <span className="position-relative pass">
                          <Form.Control
                            type={passwordShown ? "text" : "password"}
                            name={"password"}
                            value={props.values.password}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.password && props.errors.password
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.password}
                          </Form.Control.Feedback>
                          <span
                            className="float-end text-gray cursor-pointer pass-icon"
                            onClick={togglePassword}
                          >
                            {passwordShown ? <BsEye /> : <BsEyeSlash />}
                          </span>
                        </span>
                      </Form.Group>
                      {/* <Form.Group className="d-flex justify-content-between mb-3">
                        <Switch onClick={() => setChecked(!checked)} checked={checked} idFor='rem' title={"Remember Me"} />
                        <Link to='/ForgetPassword' className='nav-link text-secondary'>Forget Password</Link>
                      </Form.Group> */}
                      <Form.Group>
                        <Button
                          disabled={props.isSubmitting}
                          type="Submit"
                          className="btn-shadow rounded-1 bg-secondary border-0 w-100 d-align gap-2"
                        >
                          {props.isSubmitting ? (
                            <>
                              <Spinner
                                animation="border"
                                variant="light"
                                size="sm"
                              />{" "}
                              PLEASE WAIT...
                            </>
                          ) : (
                            <>
                              <BsShieldLockFill /> LOG IN
                            </>
                          )}
                        </Button>
                      </Form.Group>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default SignIn;
