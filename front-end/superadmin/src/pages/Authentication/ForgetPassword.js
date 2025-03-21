// import React from "react";
// import {
//     Button,
//     Card,
//     Col,
//     Container,
//     Form,
//     Row,
//     Spinner,
// } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import { Formik } from "formik";
// import { BsArrowLeft } from "react-icons/bs";
// import { MdCreate } from "react-icons/md";
// import { GoVerified } from "react-icons/go";
// import { forgotPasswordSchema, otpSchema, updatePasswordSchema, } from "../../utils/formSchema";
// import { useState } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import { ForgetPasswordApi } from "../../services/authapi";

// const ForgetPassword = () => {
//     const navigate = useNavigate();
//     const notify = (message) => {
//         toast(message);
//     };
//
//     const [showotp, setShowOtp] = useState(false);
//     const [showField, setShowField] = useState(false);
//     const [apiData, setApiData] = useState({
//         id: "",
//     });
//     const handleSendOtp = async (values, setSubmitting) => {
//         setIsLoading(true);
//         const fData = {
//             fpsteps: "step_one",
//             email: values.email,
//         };
//         const res = await ForgetPasswordApi(fData);
//         if (res.status) {
//             notify(res.message);
//             setShowOtp(true);
//         } else {
//             notify(res.message);
//         }
//         setSubmitting(false);
//         setIsLoading(false);
//     };

//     const handleVerifyOtp = async (values, setSubmitting) => {
//         setIsLoading(true);
//         const oData = {
//             fpsteps: "step_two",
//             email: values.email,
//             verify_otp: values.otp,
//         };
//         const res = await ForgetPasswordApi(oData);
//         if (res.status) {
//             notify(res.message);
//             setApiData({ ...apiData, id: res.data.id });
//             setShowField(true);
//         } else {
//             notify(res.message);
//         }
//         setSubmitting(false);
//         setIsLoading(false);
//     };

//     const handleResetPassword = async (values, setSubmitting) => {
//         setIsLoading(true);
//         const rData = {
//             fpsteps: "step_three",
//             id: apiData.id,
//             password: values.new_password,
//         };
//         const res = await ForgetPasswordApi(rData);
//         if (res.status) {
//             notify(res.message);
//             navigate("/", res.data);
//         } else {
//             notify(res.message);
//         }
//         setSubmitting(false);
//         setIsLoading(false);
//     };
//     return (
//         <>
//             <Container>
//                 <ToastContainer />
//                 <Row className="justify-content-center align-items-center min-vh-100">
//                     <Col md={11}>
//                         <Row className="gx-0">
//                             <Col md={5} className="mx-auto">
//                                 <Card
//                                     className="h-100 border-0 shadow rounded-0 flex-row-reverse align-items-center rounded-end"
//                                     data-aos={"fade-up"}>
//                                     <Card.Body>
//                                         <div spacing={5}>
//                                             {showField ? (
//                                                 <Formik
//                                                     initialValues={{
//                                                         email: "",
//                                                         new_password: "",
//                                                         confirm_password: "",
//                                                     }}
//                                                     validationSchema={updatePasswordSchema}
//                                                     onSubmit={(values, { setSubmitting }) => {
//                                                         handleResetPassword(values, setSubmitting);
//                                                     }}>
//                                                     {({
//                                                         values,
//                                                         errors,
//                                                         touched,
//                                                         handleChange,
//                                                         handleBlur,
//                                                         handleSubmit,
//                                                         isSubmitting,
//                                                     }) => (
//                                                         <>
//                                                             <div className="text-center">
//                                                                 <h3 className="mb-2 fw-bold">
//                                                                     Create Password{" "}
//                                                                     <MdCreate className="text-secondary" />
//                                                                 </h3>
//                                                                 <p className="small">
//                                                                     Your New Password must be diffrent from
//                                                                     Previously Used Passwords
//                                                                 </p>
//                                                             </div>
//                                                             <Form onSubmit={handleSubmit} className="myform">
//                                                                 <Row>
//                                                                     <Col>
//                                                                         <Form.Group className="mb-3">
//                                                                             <Form.Label>New Password</Form.Label>
//                                                                             <Form.Control
//                                                                                 type="password"
//                                                                                 placeholder="Enter Password"
//                                                                                 name="new_password"
//                                                                                 onChange={handleChange}
//                                                                                 onBlur={handleBlur}
//                                                                             />
//                                                                             <small className="text-danger">
//                                                                                 {errors.new_password &&
//                                                                                     touched.new_password &&
//                                                                                     errors.new_password}
//                                                                             </small>
//                                                                         </Form.Group>
//                                                                     </Col>
//                                                                 </Row>
//                                                                 <Row>
//                                                                     <Col>
//                                                                         <Form.Group className="mb-3">
//                                                                             <Form.Label>Confirm Password</Form.Label>
//                                                                             <Form.Control
//                                                                                 type="password"
//                                                                                 placeholder="Enter Password"
//                                                                                 name="confirm_password"
//                                                                                 onChange={handleChange}
//                                                                                 onBlur={handleBlur}
//                                                                             />
//                                                                             <small className="text-danger">
//                                                                                 {errors.confirm_password &&
//                                                                                     touched.confirm_password &&
//                                                                                     errors.confirm_password}
//                                                                             </small>
//                                                                         </Form.Group>
//                                                                     </Col>
//                                                                 </Row>
//                                                                 <Button
//                                                                     type="submit"
//                                                                     className="mb-3 text-uppercase w-100 btn-shadow"
//                                                                     variant="primary">
//                                                                     {isLoading ? (
//                                                                         <>
//                                                                             <Spinner
//                                                                                 animation="border"
//                                                                                 variant="light"
//                                                                                 size="sm"
//                                                                             />
//                                                                         </>
//                                                                     ) : (
//                                                                         "Save"
//                                                                     )}
//                                                                 </Button>
//                                                                 <p className="text-center">
//                                                                     <span
//                                                                         onClick={() => setShowField(false)}
//                                                                         className="mb-0 back-text text-danger cursor-pointer">
//                                                                         <BsArrowLeft className="fs-4" /> Go Back
//                                                                     </span>
//                                                                 </p>
//                                                             </Form>
//                                                         </>
//                                                     )}
//                                                 </Formik>
//                                             ) : (
//                                                 <>
//                                                     {showotp ? (
//                                                         <Formik
//                                                             initialValues={{
//                                                                 email: "",
//                                                                 otp: "",
//                                                             }}
//                                                             validationSchema={otpSchema}
//                                                             onSubmit={(values, { setSubmitting }) => {
//                                                                 handleVerifyOtp(values, setSubmitting);
//                                                             }}>
//                                                             {({
//                                                                 values,
//                                                                 errors,
//                                                                 touched,
//                                                                 handleChange,
//                                                                 handleBlur,
//                                                                 handleSubmit,
//                                                                 isSubmitting,
//                                                             }) => (
//                                                                 <>
//                                                                     <div className="text-center">
//                                                                         <h3 className="mb-2 fw-bold">
//                                                                             Verification{" "}
//                                                                             <GoVerified className="text-success" />
//                                                                         </h3>
//                                                                         <p className="small">
//                                                                             Enter the verification code we just sent
//                                                                             you on - {values.email}
//                                                                         </p>
//                                                                     </div>
//                                                                     <Form
//                                                                         onSubmit={handleSubmit}
//                                                                         className="myform">
//                                                                         <Row>
//                                                                             <Col>
//                                                                                 <Form.Group className="mb-3">
//                                                                                     <Form.Label>OTP</Form.Label>
//                                                                                     <Form.Control
//                                                                                         type="text"
//                                                                                         placeholder="Enter Otp"
//                                                                                         name="otp"
//                                                                                         maxLength={6}
//                                                                                         onChange={handleChange}
//                                                                                         onBlur={handleBlur}
//                                                                                     />
//                                                                                     <small className="text-danger">
//                                                                                         {errors.otp &&
//                                                                                             touched.otp &&
//                                                                                             errors.otp}
//                                                                                     </small>
//                                                                                 </Form.Group>
//                                                                             </Col>
//                                                                         </Row>
//                                                                         <Button
//                                                                             type="submit"
//                                                                             className="mb-3 text-uppercase w-100 btn-shadow"
//                                                                             variant="primary">
//                                                                             {isLoading ? (
//                                                                                 <>
//                                                                                     <Spinner
//                                                                                         animation="border"
//                                                                                         variant="light"
//                                                                                         size="sm"
//                                                                                     />
//                                                                                 </>
//                                                                             ) : (
//                                                                                 "Verify"
//                                                                             )}
//                                                                         </Button>
//                                                                         <p className="text-center">
//                                                                             <span
//                                                                                 onClick={() => setShowOtp(false)}
//                                                                                 className="mb-0 back-text text-danger cursor-pointer">
//                                                                                 <BsArrowLeft className="fs-4" /> Go Back
//                                                                             </span>
//                                                                         </p>
//                                                                     </Form>
//                                                                 </>
//                                                             )}
//                                                         </Formik>
//                                                     ) : (
//                                                         <Formik
//                                                             initialValues={{
//                                                                 email: "",
//                                                             }}
//                                                             validationSchema={forgotPasswordSchema}
//                                                             onSubmit={(values, { setSubmitting }) => {
//                                                                 handleSendOtp(values, setSubmitting);
//                                                             }}>
//                                                             {({
//                                                                 values,
//                                                                 errors,
//                                                                 touched,
//                                                                 handleChange,
//                                                                 handleBlur,
//                                                                 handleSubmit,
//                                                                 isSubmitting,
//                                                             }) => (
//                                                                 <>
//                                                                     <div className="text-center">
//                                                                         <h3 className="mb-3 fw-bold">
//                                                                             Forgot Password? 🔒
//                                                                         </h3>
//                                                                         <p className="small">
//                                                                             Enter your email and we'll send you an OTP
//                                                                             to reset your password
//                                                                         </p>
//                                                                     </div>
//                                                                     <Form
//                                                                         onSubmit={handleSubmit}
//                                                                         className="myform">
//                                                                         <Row>
//                                                                             <Col>
//                                                                                 <Form.Group className="mb-3">
//                                                                                     <Form.Label>Enter Email</Form.Label>
//                                                                                     <Form.Control
//                                                                                         type="email"
//                                                                                         name="email"
//                                                                                         onChange={handleChange}
//                                                                                         onBlur={handleBlur}
//                                                                                     />
//                                                                                     <small className="text-danger">
//                                                                                         {errors.email &&
//                                                                                             touched.email &&
//                                                                                             errors.email}
//                                                                                     </small>
//                                                                                 </Form.Group>
//                                                                             </Col>
//                                                                         </Row>
//                                                                         <Button type="submit" className="social-btn bg-secondary border-0 w-100 d-align gap-2 mb-3">
//                                                                             {isLoading ? (
//                                                                                 <>
//                                                                                     <Spinner
//                                                                                         animation="border"
//                                                                                         variant="light"
//                                                                                         size="sm"
//                                                                                     />
//                                                                                 </>
//                                                                             ) : (
//                                                                                 "Generate OTP"
//                                                                             )}
//                                                                         </Button>
//                                                                         <p className="text-center mb-0">
//                                                                             <span
//                                                                                 onClick={() => navigate(-1)}
//                                                                                 className="back-text text-danger cursor-pointer">
//                                                                                 <BsArrowLeft className="fs-4" /> Back to login
//                                                                             </span>
//                                                                         </p>
//                                                                     </Form>
//                                                                 </>
//                                                             )}
//                                                         </Formik>
//                                                     )}
//                                                 </>
//                                             )}
//                                         </div>
//                                     </Card.Body>
//                                 </Card>
//                             </Col>
//                         </Row>
//                     </Col>
//                 </Row>
//             </Container>
//         </>
//     );
// };

// export default ForgetPassword;
