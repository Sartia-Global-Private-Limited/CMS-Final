import React from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../CardComponent";
import { FieldArray, Formik } from "formik";
import { addEmployeeSchema } from "../../utils/formSchema";
import { Helmet } from "react-helmet";
import TooltipComponent from "../TooltipComponent";
import { BsEye, BsEyeSlash, BsPlusLg, BsXLg } from "react-icons/bs";
import {
  addEmplyee,
  getAdminAllHRTeams,
  getAllRolesForDropDown,
  getAllUsersInEmployee,
  updateEmployee,
  viewSingleEmployee,
} from "../../services/authapi";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react";
import ConfirmAlert from "../ConfirmAlert";
import { useTranslation } from "react-i18next";
import MyInput from "../MyInput";
import ImageViewer from "../ImageViewer";
import { getImageSrc } from "../../utils/helper";

const AddEmployee = () => {
  const { id } = useParams();
  const [edit, setEdit] = useState({});
  const [allRoles, setAllRoles] = useState([]);
  const [allHRTeams, setAllHRTeams] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [roleName, setRoleName] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  function MyCard({ children, className }) {
    return (
      <Card className={`card-bg h-100 ${className}`}>
        <Card.Body>{children}</Card.Body>
      </Card>
    );
  }

  const fetchEmployeesData = async () => {
    const res = await viewSingleEmployee(id);
    if (res.status) {
      setEdit(res.data);
      setRoleName(res?.data?.role_name);
      fetchHRTeamsEmployee(res?.data?.role_name);
    } else {
      setEdit({});
    }
  };

  const fetchAllRolesData = async () => {
    const res = await getAllRolesForDropDown();
    if (res.status) {
      const rData = res.data
        .filter((itm) => itm.id !== 1)
        .map((itm) => {
          return {
            value: itm.id,
            label: itm.name,
          };
        });
      setAllRoles(rData);
    } else {
      setAllRoles([]);
    }
  };

  const fetchHRTeamsEmployee = async (roleName) => {
    let res;

    if (roleName === "Sub user") {
      res = await getAllUsersInEmployee("Supervisor");
    } else if (roleName === "SUPERVISOR") {
      res = await getAllUsersInEmployee("Manager");
    } else {
      res = await getAdminAllHRTeams({ isDropdown: "true" });
    }

    if (res?.status) {
      const rData = res.data.map((itm) => ({
        value:
          roleName === "Sub user" || roleName === "SUPERVISOR"
            ? itm.id
            : itm.team_id,
        label:
          roleName === "Sub user" || roleName === "SUPERVISOR"
            ? itm.name
            : itm.team_name,
        role_id: itm.team_head_role_id,
      }));
      setAllHRTeams(rData);
    } else {
      setAllHRTeams([]);
    }
  };

  const employementOptions = [
    { value: "Permanent", label: "Permanent" },
    { value: "Part-Time", label: "Part-Time" },
  ];

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("status", 1);
    formData.append("department", "");
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("mobile", values.mobile);
    formData.append("joining_date", values.joining_date);
    formData.append("role_id", values.role_id);
    formData.append("address", values.address);
    formData.append("skills", values.skills);
    formData.append("employment_status", values.employment_status);
    formData.append("pan", values.pan);
    formData.append("aadhar", values.aadhar);
    formData.append("epf_no", values.epf_no);
    formData.append("esi_no", values.esi_no);
    formData.append("bank_name", values.bank_name);
    formData.append("ifsc_code", values.ifsc_code);
    formData.append("account_number", values.account_number);
    formData.append("family_info", JSON?.stringify(values.family_info));
    formData.append("team_id", values.team_id || "");
    formData.append("manager_id", values.manager_id || "");
    formData.append("supervisor_id", values.supervisor_id || "");
    formData.append("salary", values.salary);
    formData.append("salary_term", values.salary_term);
    formData.append("image", values.image);
    formData.append("graduation", values.graduation);
    formData.append("post_graduation", values.post_graduation);
    formData.append("doctorate", values.doctorate);
    formData.append("upload_pan_card", values.upload_pan_card);
    formData.append("credit_limit", values.credit_limit);
    formData.append(
      "upload_aadhar_card_image1",
      values.upload_aadhar_card_image1
    );
    formData.append(
      "upload_aadhar_card_image2",
      values.upload_aadhar_card_image2
    );
    formData.append("upload_bank_documents", values.upload_bank_documents);

    if (edit.id) {
      formData.append("employee_id", edit.id);
    }

    // return console.log("formData", ...formData);
    const res = edit?.id
      ? await updateEmployee(formData)
      : await addEmplyee(formData);

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
    if (id) {
      fetchEmployeesData();
    }
    fetchAllRolesData();
  }, []);

  return (
    <Col md={12}>
      <Helmet>
        <title>AddEmployee · CMS Electricals</title>
      </Helmet>
      <CardComponent title={edit?.id ? t("Edit Employee") : t("Add Employee")}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            name: edit.name || "",
            email: edit.email || "",
            password: edit.password || "",
            mobile: edit.mobile || "",
            joining_date: edit.joining_date || "",
            role_id: edit.role_id || "",
            address: edit.address || "",
            graduation: edit.graduation || null,
            post_graduation: edit.post_graduation || null,
            doctorate: edit.doctorate || null,
            image: edit.image || null,
            skills: edit.skills || "",
            credit_limit: edit.credit_limit || "",
            team_id: edit.team_id || "",
            manager_id: edit.manager_id || "",
            supervisor_id: edit.supervisor_id || "",
            employment_status: edit.employment_status || "",
            salary: edit.salary || "",
            salary_term: edit.salary_term || "",
            pan: edit.pan || "",
            upload_pan_card: edit.pan_card_image || "",
            epf_no: edit.epf_no || "",
            aadhar: edit.aadhar || "",
            upload_aadhar_card_image1: edit.aadhar_card_front_image || "",
            upload_aadhar_card_image2: edit.aadhar_card_back_image || "",
            esi_no: edit.esi_no || "",
            bank_name: edit.bank_name || "",
            ifsc_code: edit.ifsc_code || "",
            account_number: edit.account_number || "",
            upload_bank_documents: edit.bank_documents || "",
            family_info: edit.family_info || [
              {
                member_name: "",
                member_relation: "",
              },
            ],
          }}
          validationSchema={addEmployeeSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-3 align-items-center">
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"name"}
                    formikProps={props}
                    label={t("Name")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"mobile"}
                    formikProps={props}
                    label={t("Phone Number")}
                    customType={"phone"}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"email"}
                    formikProps={props}
                    label={t("Email")}
                    type="email"
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"address"}
                    formikProps={props}
                    label={t("Address")}
                    customType={"multiline"}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"joining_date"}
                    formikProps={props}
                    label={t("Joining Date")}
                    type="date"
                  />
                </Form.Group>
                {/* <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"graduation"}
                    formikProps={props}
                    label={t("Graduation")}
                    customType={"fileUpload"}
                    multiple={false}
                    onChange={(e) =>
                      props.setFieldValue("graduation", e.target.files[0])
                    }
                  />
                </Form.Group> */}

                <Form.Group as={Col} md={4}>
                  <Form.Label>{t("Upload Profile Photo")}</Form.Label>

                  <div className="d-flex gap-2">
                    <ImageViewer
                      downloadIcon
                      href={getImageSrc(props.values.image, edit?.image)}
                      src={getImageSrc(props.values.image, edit?.image)}
                    >
                      <img
                        src={getImageSrc(props.values.image, edit?.image)}
                        className="my-btn object-fit"
                      />
                    </ImageViewer>
                    <Form.Control
                      type="file"
                      name={"image"}
                      accept="image/*"
                      onChange={(e) =>
                        props.setFieldValue("image", e.target.files[0])
                      }
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} md={4}>
                  <Form.Label>{t("Graduation")}</Form.Label>

                  <div className="d-flex gap-2">
                    {edit.id && (
                      <ImageViewer
                        downloadIcon
                        href={`${process.env.REACT_APP_API_URL}/${edit?.graduation}`}
                        src={`${process.env.REACT_APP_API_URL}/${edit?.graduation}`}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${edit?.graduation}`}
                          className="my-btn object-fit"
                        />
                      </ImageViewer>
                    )}
                    <Form.Control
                      type="file"
                      name={"graduation"}
                      onChange={(e) =>
                        props.setFieldValue("graduation", e.target.files[0])
                      }
                    />
                  </div>
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <Form.Label>{t("Post-Graduation")}</Form.Label>

                  <div className="d-flex gap-2">
                    {edit.id && (
                      <ImageViewer
                        downloadIcon
                        href={`${process.env.REACT_APP_API_URL}/${edit?.post_graduation}`}
                        src={`${process.env.REACT_APP_API_URL}/${edit?.post_graduation}`}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${edit?.post_graduation}`}
                          className="my-btn object-fit"
                        />
                      </ImageViewer>
                    )}
                    <Form.Control
                      type="file"
                      name={"post_graduation"}
                      onChange={(e) =>
                        props.setFieldValue(
                          "post_graduation",
                          e.target.files[0]
                        )
                      }
                    />
                  </div>
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <Form.Label>{t("Doctorate")}</Form.Label>

                  <div className="d-flex gap-2">
                    {edit.id && (
                      <ImageViewer
                        downloadIcon
                        href={`${process.env.REACT_APP_API_URL}/${edit?.doctorate}`}
                        src={`${process.env.REACT_APP_API_URL}/${edit?.doctorate}`}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${edit?.doctorate}`}
                          className="my-btn object-fit"
                        />
                      </ImageViewer>
                    )}
                    <Form.Control
                      type="file"
                      name={"doctorate"}
                      onChange={(e) =>
                        props.setFieldValue("doctorate", e.target.files[0])
                      }
                    />
                  </div>
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"skills"}
                    formikProps={props}
                    label={t("Skills")}
                    customType={"select"}
                    selectProps={{
                      data: [
                        { value: "Skilled", label: "Skilled" },
                        {
                          value: "Non Skilled",
                          label: "Non Skilled",
                        },
                      ],
                    }}
                  />
                </Form.Group>

                <Form.Group as={Col} md="4">
                  <MyInput
                    isRequired
                    label={t("Role")}
                    name={"role_id"}
                    customType={"select"}
                    formikProps={props}
                    selectProps={{
                      data: allRoles,
                      onChange: (e) => {
                        setRoleName(e?.label);
                        fetchHRTeamsEmployee(e?.label);
                      },
                    }}
                  />
                </Form.Group>

                <Form.Group as={Col} md={4}>
                  {roleName == "Sub user" ? (
                    <MyInput
                      name={"supervisor_id"}
                      formikProps={props}
                      label={"Supervisor"}
                      customType="select"
                      selectProps={{ data: allHRTeams }}
                    />
                  ) : roleName == "SUPERVISOR" ? (
                    <MyInput
                      name={"manager_id"}
                      formikProps={props}
                      label={"Manager"}
                      customType="select"
                      selectProps={{ data: allHRTeams }}
                    />
                  ) : (
                    <MyInput
                      name={"team_id"}
                      formikProps={props}
                      label={"Team"}
                      customType="select"
                      selectProps={{ data: allHRTeams }}
                    />
                  )}
                </Form.Group>

                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"employment_status"}
                    formikProps={props}
                    label={t("Employment Status")}
                    customType={"select"}
                    selectProps={{
                      data: employementOptions,
                    }}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"salary"}
                    formikProps={props}
                    label={t("Salary")}
                    type="number"
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"salary_term"}
                    formikProps={props}
                    label={t("Salary Term")}
                    customType={"select"}
                    selectProps={{
                      data: [
                        { value: "weekly", label: "Weekly" },
                        { value: "monthly", label: "Monthly" },
                      ],
                    }}
                  />
                </Form.Group>

                <div className="hr-border2 mt-4 mb-2" />

                <Form.Group as={Col} md={12}>
                  <Row className="g-3">
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"pan"}
                        formikProps={props}
                        label={t("Pan No")}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        isRequired
                        name={"aadhar"}
                        formikProps={props}
                        label={t("Aadhar No")}
                        type="number"
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"epf_no"}
                        formikProps={props}
                        label={t("Epf No")}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <MyInput
                        name={"esi_no"}
                        formikProps={props}
                        label={t("Esi No")}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>{t("Upload Pan Card")}</Form.Label>
                      <div className="d-flex gap-2">
                        <ImageViewer
                          downloadIcon
                          href={getImageSrc(
                            props.values.upload_pan_card,
                            edit?.pan_card_image
                          )}
                          src={getImageSrc(
                            props.values.upload_pan_card,
                            edit?.pan_card_image
                          )}
                        >
                          <img
                            src={getImageSrc(
                              props.values.upload_pan_card,
                              edit?.pan_card_image
                            )}
                            className="my-btn object-fit"
                          />
                        </ImageViewer>
                        <Form.Control
                          type="file"
                          name={"upload_pan_card"}
                          onChange={(e) =>
                            props.setFieldValue(
                              "upload_pan_card",
                              e.target.files[0]
                            )
                          }
                        />
                      </div>
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>{t("Aadhar Card Front Image")}</Form.Label>

                      <div className="d-flex gap-2">
                        {edit.id && (
                          <ImageViewer
                            downloadIcon
                            href={getImageSrc(
                              props.values.upload_aadhar_card_image1,
                              edit?.aadhar_card_front_image
                            )}
                            src={getImageSrc(
                              props.values.upload_aadhar_card_image1,
                              edit?.aadhar_card_front_image
                            )}
                          >
                            <img
                              src={getImageSrc(
                                props.values.upload_aadhar_card_image1,
                                edit?.aadhar_card_front_image
                              )}
                              className="my-btn object-fit"
                            />
                          </ImageViewer>
                        )}
                        <Form.Control
                          type="file"
                          name={"upload_aadhar_card_image1"}
                          onChange={(e) =>
                            props.setFieldValue(
                              "upload_aadhar_card_image1",
                              e.target.files[0]
                            )
                          }
                        />
                      </div>
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>{t("Aadhar Card Back Image")}</Form.Label>

                      <div className="d-flex gap-2">
                        {edit.id && (
                          <ImageViewer
                            downloadIcon
                            href={`${process.env.REACT_APP_API_URL}/${edit?.aadhar_card_back_image}`}
                            src={`${process.env.REACT_APP_API_URL}/${edit?.aadhar_card_back_image}`}
                          >
                            <img
                              src={`${process.env.REACT_APP_API_URL}/${edit?.aadhar_card_back_image}`}
                              className="my-btn object-fit"
                            />
                          </ImageViewer>
                        )}
                        <Form.Control
                          type="file"
                          name={"upload_aadhar_card_image2"}
                          onChange={(e) =>
                            props.setFieldValue(
                              "upload_aadhar_card_image2",
                              e.target.files[0]
                            )
                          }
                        />
                      </div>
                    </Form.Group>
                  </Row>
                </Form.Group>

                <div className="hr-border2 mt-4 mb-2" />

                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"bank_name"}
                    formikProps={props}
                    label={t("Bank Name")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"ifsc_code"}
                    formikProps={props}
                    label={t("Ifsc Code")}
                  />
                </Form.Group>
                <Form.Group as={Col} md={4}>
                  <MyInput
                    name={"account_number"}
                    formikProps={props}
                    label={t("Account Number")}
                  />
                </Form.Group>

                <Form.Group as={Col} md={4}>
                  <Form.Label>{t("Upload Bank Documents")}</Form.Label>

                  <div className="d-flex gap-2">
                    {edit.id && (
                      <ImageViewer
                        downloadIcon
                        href={`${process.env.REACT_APP_API_URL}/${edit?.bank_documents}`}
                        src={`${process.env.REACT_APP_API_URL}/${edit?.bank_documents}`}
                      >
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${edit?.bank_documents}`}
                          className="my-btn object-fit"
                        />
                      </ImageViewer>
                    )}
                    <Form.Control
                      type="file"
                      name={"upload_bank_documents"}
                      onChange={(e) =>
                        props.setFieldValue(
                          "upload_bank_documents",
                          e.target.files[0]
                        )
                      }
                    />
                  </div>
                </Form.Group>

                <Form.Group as={Col} md={4}>
                  <MyInput
                    isRequired
                    name={"credit_limit"}
                    formikProps={props}
                    label={t("Fund & Stock Limit")}
                  />
                </Form.Group>

                <div className="hr-border2 mt-4 mb-2" />
                <Form.Group as={Col} md={12}>
                  <Form.Label className="fw-bold pb-2">
                    {t("Employee Login Credentials")}
                  </Form.Label>
                  <MyCard>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>{t("User Name")}</Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="email"
                          value={props.values.email}
                          onChange={props.handleChange}
                          name={"email"}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>{t("Password")}</Form.Label>
                      <Col sm={8}>
                        <div className="position-relative pass">
                          <Form.Control
                            type={passwordShown ? "text" : "password"}
                            value={props.values.password}
                            onChange={props.handleChange}
                            name="password"
                          />
                          <div
                            className="float-end text-gray cursor-pointer pass-icon"
                            style={{
                              top: "20%",
                              zIndex: 99,
                            }}
                            onClick={togglePassword}
                          >
                            {passwordShown ? <BsEye /> : <BsEyeSlash />}
                          </div>
                        </div>
                      </Col>
                    </Form.Group>
                  </MyCard>
                </Form.Group>

                <div className="hr-border2 mt-4 mb-2" />

                <Form.Group as={Col} md={12}>
                  <Form.Label className="fw-bold pb-2">
                    {t("Add Family")} ({t("optional")})
                  </Form.Label>
                  <MyCard>
                    <FieldArray name="family_info">
                      {({ remove, push }) => (
                        <>
                          <Row className="align-items-center g-3">
                            {props.values.family_info.length > 0 &&
                              props.values.family_info.map((ele, index) => (
                                <Fragment key={index}>
                                  <Form.Group as={Col} md={6}>
                                    <MyInput
                                      name={`family_info.${index}.member_name`}
                                      formikProps={props}
                                      label={t("Name")}
                                    />
                                  </Form.Group>
                                  <Form.Group as={Col} md={6}>
                                    <div className="d-flex align-items-end gap-2">
                                      <MyInput
                                        name={`family_info[${index}].member_relation`}
                                        formikProps={props}
                                        label={t("Relation")}
                                        customType={"select"}
                                        selectProps={{
                                          data: [
                                            {
                                              label: "Mother",
                                              value: "Mother",
                                            },
                                            {
                                              label: "Father",
                                              value: "Father",
                                            },
                                            {
                                              label: "Brother",
                                              value: "Brother",
                                            },
                                            {
                                              label: "Sister",
                                              value: "Sister",
                                            },
                                            {
                                              label: "husband",
                                              value: "husband",
                                            },
                                            {
                                              label: "Wife",
                                              value: "Wife",
                                            },
                                            {
                                              label: "Son",
                                              value: "Son",
                                            },
                                            {
                                              label: "Daughter",
                                              value: "Daughter",
                                            },
                                            {
                                              label: "Other",
                                              value: "Other",
                                            },
                                          ],
                                        }}
                                        containerStyle={{
                                          width: "100%",
                                        }}
                                      />

                                      <TooltipComponent
                                        align="left"
                                        title={"Remove"}
                                      >
                                        <BsXLg
                                          onClick={() =>
                                            index !== 0 && remove(index)
                                          }
                                          className="social-btn red-combo"
                                        />
                                      </TooltipComponent>
                                    </div>
                                  </Form.Group>
                                  <div className="hr-border2 mt-3" />
                                </Fragment>
                              ))}
                          </Row>
                          <Form.Group as={Col} md={12} className="mt-3 d-grid">
                            <TooltipComponent title={"Add Family"}>
                              <div
                                onClick={() =>
                                  push({
                                    member_name: "",
                                    member_relation: "",
                                  })
                                }
                                className="social-btn-re w-auto success-combo d-align gap-2"
                              >
                                <BsPlusLg /> {t("Add")}
                              </div>
                            </TooltipComponent>
                          </Form.Group>
                        </>
                      )}
                    </FieldArray>
                  </MyCard>
                </Form.Group>

                <Form.Group as={Col} md={12}>
                  <div className="text-center">
                    <button
                      type={`${edit?.id ? "button" : "submit"}`}
                      onClick={() => setShowAlert(edit?.id && true)}
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
                        <>{edit?.id ? t("UPDATE") : t("CREATE")}</>
                      )}
                    </button>
                    <ConfirmAlert
                      size={"sm"}
                      deleteFunction={
                        props.isValid ? props.handleSubmit : setShowAlert(false)
                      }
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
  );
};

export default AddEmployee;
