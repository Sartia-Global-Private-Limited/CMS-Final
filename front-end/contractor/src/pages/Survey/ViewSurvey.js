import { useEffect, useState } from "react";
import { Col, Form, Spinner } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { FieldArray, Formik } from "formik";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import Select from "react-select";
import {
  getAdminSingleSurvey,
  postOtpSurvey,
  postOtpVerifySurvey,
  postQuestionsSurvey,
} from "../../services/authapi";
import { addSurveyOtpSchema } from "../../utils/formSchema";

const ViewSurvey = () => {
  const { id } = useParams();
  const [otpData, setOtpData] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [otpArray, setOtpArray] = useState(new Array(6).fill(""));
  const navigate = useNavigate();
  const handelChange = (element, index, e) => {
    if (isNaN(element?.value)) return false;
    if (e.key === "Backspace") {
      if (element?.previousSibling != null) {
        element?.previousSibling?.focus();
      }
      if (index === otpArray.length - 1) {
        setOtpArray([
          ...otpArray?.map((item, currentIndex) =>
            index === currentIndex ? "" : item
          ),
        ]);
      } else {
        setOtpArray([
          ...otpArray?.map((item, currentIndex) =>
            index === currentIndex ? element?.value : item
          ),
        ]);
      }
    } else {
      setOtpArray([
        ...otpArray?.map((item, currentIndex) =>
          index === currentIndex ? element?.value : item
        ),
      ]);
      if (element?.nextSibling != null && element?.value) {
        element?.nextSibling?.focus();
      }
    }
  };
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      id: id,
    };
    if (otpData === false) {
      sData["mobile"] = values.mobile;
    }
    if (otpData === true) {
      sData["otp"] = otpArray?.join("");
    }
    // return console.log('form-Data', sData)
    const res =
      otpData == false
        ? await postOtpSurvey(sData)
        : await postOtpVerifySurvey(sData);
    if (res.status) {
      toast.success(res.message);
      setOtpData(true);
      if (otpData == true) {
        setVerifyOtp(true);
      }
      if (otpData == true) {
        const response = await getAdminSingleSurvey(id);
        if (response.status) {
          setResponseData(response.data);
        } else {
          setResponseData({});
        }
      }
      // navigate(-1);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };

  const handleFormSubmit = async (values, { setSubmitting, resetForm }) => {
    const questionId = responseData?.survey_questions?.map((itm) => {
      return itm?.question_id;
    });
    const sData = {
      response: values.response,
      survey_id: responseData?.survey_id,
      question_id: questionId,
    };
    // return console.log('form-Data', sData)
    const res = await postQuestionsSurvey(sData);
    if (res.status) {
      toast.success(res.message);
      // navigate(-1);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
  };
  // console.log('responseData', responseData?.survey_questions?.map((itm) => { return itm?.question_id }))

  // const fetch = async () => {
  //     const response = await getAdminSingleSurvey(id);
  //     if (response.status) {
  //         setResponseData(response.data)
  //     } else {
  //         setResponseData({})
  //     }
  // }

  // useEffect(() => {
  //     fetch()
  // }, [])

  return (
    // ${ verifyOtp == true && 'd-none' }
    <div className="survey-area">
      <Col
        md={3}
        className={`mx-auto align-items-center d-grid vh-100 ${
          verifyOtp == true && "d-none"
        }`}
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            mobile: "",
            otp: "",
          }}
          validationSchema={otpData == false ? addSurveyOtpSchema : null}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit} className="d-grid gap-2">
              <div className="d-grid gap-2 px-3 p-1">
                {otpData == false ? (
                  <div
                    className={
                      "bg-new p-3 border-secondary border-5 border-top"
                    }
                  >
                    <Form.Label>Enter Mobile Number</Form.Label>
                    <Form.Control
                      value={props.values.mobile}
                      type="text"
                      name="mobile"
                      onChange={props.handleChange}
                      maxLength={10}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.mobile && props.errors.mobile
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {props.errors.mobile}
                    </Form.Control.Feedback>
                  </div>
                ) : (
                  <div
                    className={
                      "bg-new p-3 border-orange text-center border-5 border-start"
                    }
                  >
                    <Form.Label className="lh-1">One-Time Password</Form.Label>
                    <Form.Text className="mt-0 mb-2 text-muted d-block">
                      Input the code sent at 76****8104
                    </Form.Text>
                    <div className="d-align gap-2 myotp1">
                      {otpArray?.length > 0 &&
                        otpArray?.map((item, index) => {
                          return (
                            <Form.Control
                              key={index}
                              type="text"
                              className="fs-4 text-center fw-bold"
                              maxLength={1}
                              name="otp"
                              // value={item}
                              onChange={(e) => handelChange(e.target, index, e)}
                              onFocus={(e) => e.target.select()}
                              onKeyDown={(e) =>
                                handelChange(e.target, index, e)
                              }
                            />
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>
              {/* {console.log('otpData', otpArray?.join(""))} */}
              <button
                type="submit"
                disabled={props?.isSubmitting}
                className="shadow border-0 mx-3 purple-combo cursor-pointer px-4 py-1"
              >
                {props?.isSubmitting ? (
                  <>
                    <Spinner animation="border" variant="info" size="sm" />{" "}
                    PLEASE WAIT...
                  </>
                ) : otpData == false ? (
                  "Send OTP"
                ) : (
                  "Submit"
                )}
              </button>
              {/* <div className='social-btn mx-3 text-center w-auto h-auto purple-combo'>Send OTP</div> */}
            </Form>
          )}
        </Formik>
      </Col>
      {verifyOtp == true && (
        <Col md={6} className="mx-auto">
          <div className="d-grid gap-2 py-4">
            <div
              className={
                "shadow rounded-top p-3 border-secondary mx-3 border-5 border-top"
              }
            >
              <h4>{responseData?.title}</h4>
              <small>{responseData?.description}</small>
            </div>
            <Formik
              enableReinitialize={true}
              initialValues={{
                response: [
                  {
                    answer: [""],
                  },
                ],
              }}
              // validationSchema={addEnergySchema}
              onSubmit={handleFormSubmit}
            >
              {(props) => (
                <Form onSubmit={props?.handleSubmit}>
                  <FieldArray name="response">
                    <SimpleBar className="area">
                      <div className="d-grid gap-2 px-3 pt-1 pb-3">
                        {responseData?.survey_questions?.map((data, index) => {
                          const questionData = data.question;
                          // console.log(questionData?.question);
                          return (
                            <div
                              className="border-orange border-5 border-start shadow p-3"
                              key={index}
                            >
                              <Form.Label>
                                {index + 1}. {questionData?.question?.title}
                              </Form.Label>
                              {questionData?.question?.type.value == "select" ||
                              questionData?.question?.type.value ==
                                "mselect" ? (
                                <Select
                                  className="w-100 text-primary"
                                  isMulti={
                                    questionData?.question?.type.value ==
                                    "mselect"
                                      ? true
                                      : false
                                  }
                                  menuPortalTarget={document.body}
                                  name={`response.${index}.answer`}
                                  options={questionData?.question?.answers.map(
                                    (ques) => ({
                                      label: ques,
                                      value: ques,
                                    })
                                  )}
                                  onChange={(selectedOption) => {
                                    props.setFieldValue(
                                      `response.${index}.answer`,
                                      selectedOption.value
                                    );
                                  }}
                                />
                              ) : questionData?.question?.type.value ==
                                  "checkbox" ||
                                questionData?.question?.type.value ==
                                  "radio" ? (
                                <>
                                  {questionData?.question?.answers.map(
                                    (option, idx) => (
                                      <Form.Check
                                        id={
                                          questionData?.question?.type.value ==
                                          "radio"
                                            ? `option-${idx}`
                                            : `option2-${idx}`
                                        }
                                        name={
                                          questionData?.question?.type.value ==
                                          "radio"
                                            ? `response[${index}].answer[${0}]`
                                            : `response[${index}].answer[${idx}]`
                                        }
                                        // name={`response[${index}].answer[${idx}]`}
                                        className="text-gray"
                                        label={option}
                                        value={option}
                                        onChange={(e) =>
                                          props.setFieldValue(
                                            questionData?.question?.type
                                              .value == "radio"
                                              ? `response[${index}].answer[${0}]`
                                              : `response[${index}].answer[${idx}]`,
                                            e.target.value
                                          )
                                        }
                                        type={`${
                                          questionData?.question?.type.value ===
                                          "checkbox"
                                            ? "checkbox"
                                            : "radio"
                                        }`}
                                      />
                                    )
                                  )}
                                </>
                              ) : questionData?.question?.type.value ==
                                  "shorttext" ||
                                questionData?.question?.type.value ==
                                  "longtext" ? (
                                <TextareaAutosize
                                  onChange={props.handleChange}
                                  name={`response.${index}.answer`}
                                  className="edit-textarea"
                                />
                              ) : (
                                <Form.Control
                                  onChange={props.handleChange}
                                  name={`response.${index}.answer`}
                                  type={
                                    questionData?.question?.type.value ==
                                      "checkbox" ||
                                    questionData?.question?.type.value ==
                                      "radio"
                                      ? "text"
                                      : questionData?.question?.type.value
                                  }
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </SimpleBar>
                  </FieldArray>
                  <button
                    type="submit"
                    // disabled={props?.isSubmitting}
                    className="shadow border-0 mx-3 mt-3 purple-combo cursor-pointer px-4 py-1"
                  >
                    {/* {props?.isSubmitting ? (
                            <>
                                <Spinner
                                    animation="border"
                                    variant="info"
                                    size="sm"
                                /> PLEASE WAIT...
                            </>
                        ) : ( */}
                    SUBMIT
                    {/* )} */}
                  </button>
                  {/* <div className='social-btn-re success-combo d-align gap-2 mx-3 px-3 w-auto justify-content-between'>
                        Submit
                    </div> */}
                </Form>
              )}
            </Formik>
          </div>
        </Col>
      )}
    </div>
  );
};

export default ViewSurvey;
