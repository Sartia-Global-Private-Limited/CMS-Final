import React from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";
import CardComponent from "../CardComponent";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import TextareaAutosize from "react-textarea-autosize";
import { FieldArray, Formik } from "formik";
import { addEmployeeSchema, editEmployeeSchema } from "../../utils/formSchema";
import { Helmet } from "react-helmet";
import TooltipComponent from "../TooltipComponent";
import { BsPlusLg, BsXLg } from "react-icons/bs";
import {
  addEmplyee,
  getAdminAllHRTeams,
  getAdminAllRoles,
  updateEmployee,
  viewSingleEmployee,
} from "../../services/authapi";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const ViewProfile = () => {
  const { id } = useParams();
  const [edit, setEdit] = useState({});
  const [allTeam, setAllTeam] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const navigate = useNavigate();
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
    } else {
      setEdit({});
    }
  };
  const fetchAllHrTeamsData = async () => {
    const res = await getAdminAllHRTeams({ isDropdown: "true" });
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.team_id,
          label: itm.team_name,
        };
      });
      setAllTeam(rData);
    } else {
      setAllTeam([]);
    }
  };

  const fetchAllRolesData = async () => {
    const res = await getAdminAllRoles();
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

  const employementOptions = [
    { value: "permanent", label: "Permanent" },
    { value: "part-Time", label: "Part-Time" },
  ];

  const getSkills = edit?.skills;
  const allSkills = getSkills?.split(",");

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const myArray =
      values.skills.length > 0 && values?.skills?.map((e) => e.value).join(",");
    // return console.log(values);
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("mobile", values.mobile);
    formData.append("email", values.email);
    formData.append("address", values.address);
    formData.append("joining_date", values.joining_date);
    formData.append("graduation", values.graduation);
    formData.append("post_graduation", values.post_graduation);
    formData.append("doctorate", values.doctorate);
    formData.append("image", values.image);
    formData.append("skills", myArray);
    formData.append("role_id", values.role_id.value);
    formData.append("team_id", values.team_id.value);
    formData.append("employment_status", values.employment_status.label);
    formData.append("pan", values.pan);
    formData.append("upload_pan_card", values.upload_pan_card);
    formData.append("epf_no", values.epf_no);
    formData.append("aadhar", values.aadhar);
    formData.append(
      "upload_aadhar_card_image1",
      values.upload_aadhar_card_image1
    );
    formData.append(
      "upload_aadhar_card_image2",
      values.upload_aadhar_card_image2
    );
    formData.append("esi_no", values.esi_no);
    formData.append("bank_name", values.bank_name);
    formData.append("ifsc_code", values.ifsc_code);
    formData.append("account_number", values.account_number);
    formData.append("upload_bank_documents", values.upload_bank_documents);

    formData.append("password", values.password);
    formData.append("status", 1);
    formData.append("family_info", values.family_info);
    if (edit.id) {
      formData.append("employee_id", edit.id);
    }
    // for (let i = 0; i < values.family_info.length; i++) {
    //   formData.append("family_info", JSON.stringify(values.family_info[i]));
    // }
    // return console.log("data", ...formData);
    const res = edit?.id
      ? await updateEmployee(formData)
      : await addEmplyee(formData);

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
    if (id) {
      fetchEmployeesData();
    }
    fetchAllHrTeamsData();
    fetchAllRolesData();
  }, []);

  return (
    <Col md={12}>
      <Helmet>
        <title>AddEmployee · CMS Electricals</title>
      </Helmet>
      <CardComponent title={edit?.id ? "Edit Employee" : "Add Employee"}>
        <Formik
          enableReinitialize={true}
          initialValues={{
            name: edit.name || "",
            mobile: edit.mobile || "",
            email: edit.email || "",
            address: edit.address || "",
            joining_date: edit.joining_date || "",
            graduation: edit.graduation || null,
            post_graduation: edit.post_graduation || null,
            doctorate: edit.doctorate || null,
            image: edit.image || null,
            skills: edit.skills
              ? allSkills.map((e) => ({
                  label: e,
                  value: e,
                  __isNew__: true,
                }))
              : [],
            role_id: edit.role_id
              ? { label: edit.role_name, value: edit.role_id }
              : {},
            team_id: edit.team_id
              ? { label: edit.team_name, value: edit.team_id }
              : {},
            employment_status: edit.employment_status
              ? { label: edit.employment_status, value: edit.employment_status }
              : {},
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
            password: edit.password || "",
            family_info: [
              {
                name: "",
                relation: "",
                addhar_card_front_image: "",
                addhar_card_back_image: "",
                pan_card: "",
              },
            ],
          }}
          validationSchema={addEmployeeSchema}
          onSubmit={handleSubmit}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              <Row className="g-3 align-items-center">
                <Form.Group as={Col} md="4">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name={"name"}
                    value={props.values.name}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(props.touched.name && props.errors.name)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={10}
                    name={"mobile"}
                    value={props.values.mobile}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.mobile && props.errors.mobile
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.mobile}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Email</Form.Label>
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
                <Form.Group as={Col} md="6">
                  <Form.Label>Address</Form.Label>
                  <TextareaAutosize
                    minRows={2}
                    className="edit-textarea"
                    name={"address"}
                    value={props.values.address}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.address && props.errors.address
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Form.Label>Joining Date</Form.Label>
                  <Form.Control
                    type="date"
                    name={"joining_date"}
                    value={props.values.joining_date}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.joining_date && props.errors.joining_date
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.joining_date}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Graduation</Form.Label>

                  {edit.id ? (
                    <>
                      <Form.Control
                        type="file"
                        name={"graduation"}
                        // onChange={}
                        onBlur={props.handleBlur}
                        onChange={(e) =>
                          props.setFieldValue("graduation", e.target.files[0])
                        }
                        isInvalid={Boolean(
                          props.touched.graduation && props.errors.graduation
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.graduation}
                      </Form.Control.Feedback>
                      <Form.Group as={Col} md={2}>
                        <img
                          width={100}
                          className="my-bg mt-2 p-1 rounded"
                          src={`${process.env.REACT_APP_API_URL}/${edit?.graduation}`}
                        />{" "}
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Form.Control
                        type="file"
                        name={"graduation"}
                        // onChange={}
                        onBlur={props.handleBlur}
                        onChange={(e) =>
                          props.setFieldValue("graduation", e.target.files[0])
                        }
                        isInvalid={Boolean(
                          props.touched.graduation && props.errors.graduation
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.graduation}
                      </Form.Control.Feedback>
                    </>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Post-Graduation</Form.Label>

                  {edit.id ? (
                    <>
                      <Form.Control
                        type="file"
                        name={"post_graduation"}
                        onChange={(e) =>
                          props.setFieldValue(
                            "post_graduation",
                            e.target.files[0]
                          )
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.post_graduation &&
                            props.errors.post_graduation
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.post_graduation}
                      </Form.Control.Feedback>
                      <Form.Group as={Col} md={2}>
                        <img
                          width={100}
                          className="my-bg mt-2 p-1 rounded"
                          src={`${process.env.REACT_APP_API_URL}/${edit?.post_graduation}`}
                        />{" "}
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Form.Control
                        type="file"
                        name={"post_graduation"}
                        onChange={(e) =>
                          props.setFieldValue(
                            "post_graduation",
                            e.target.files[0]
                          )
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.post_graduation &&
                            props.errors.post_graduation
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.post_graduation}
                      </Form.Control.Feedback>
                    </>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Doctorate</Form.Label>
                  {edit.id ? (
                    <>
                      <Form.Control
                        type="file"
                        name={"doctorate"}
                        onChange={(e) =>
                          props.setFieldValue("doctorate", e.target.files[0])
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.doctorate && props.errors.doctorate
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.doctorate}
                      </Form.Control.Feedback>
                      <Form.Group as={Col} md={2}>
                        <img
                          width={100}
                          className="my-bg mt-2 p-1 rounded"
                          src={`${process.env.REACT_APP_API_URL}/${edit?.doctorate}`}
                        />{" "}
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Form.Control
                        type="file"
                        name={"doctorate"}
                        onChange={(e) =>
                          props.setFieldValue("doctorate", e.target.files[0])
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.doctorate && props.errors.doctorate
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.doctorate}
                      </Form.Control.Feedback>
                    </>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="3">
                  <Form.Label>Upload Photo</Form.Label>
                  {edit.id ? (
                    <>
                      <Form.Control
                        type="file"
                        name={"image"}
                        onChange={(e) =>
                          props.setFieldValue("image", e.target.files[0])
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.image && props.errors.image
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.image}
                      </Form.Control.Feedback>
                      <Form.Group as={Col} md={2}>
                        <img
                          width={100}
                          className="my-bg mt-2 p-1 rounded"
                          src={`${process.env.REACT_APP_API_URL}/${edit?.image}`}
                        />{" "}
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Form.Control
                        type="file"
                        name={"image"}
                        onChange={(e) =>
                          props.setFieldValue("image", e.target.files[0])
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.image && props.errors.image
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.image}
                      </Form.Control.Feedback>
                    </>
                  )}
                </Form.Group>
                <Form.Group as={Col} md="8">
                  <Form.Label>Skills</Form.Label>
                  <CreatableSelect
                    menuPosition="fixed"
                    isMulti
                    className="text-primary"
                    value={props.values.skills}
                    onChange={(val) => props.setFieldValue("skills", val)}
                    // options={}
                    name={"skills"}
                  />
                  {/* {console.log(props.values.skills)} */}
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Role</Form.Label>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    options={allRoles}
                    name={"role_id"}
                    value={props.values.role_id}
                    onChange={(val) => props.setFieldValue("role_id", val)}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Team</Form.Label>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    options={allTeam}
                    name={"team_id"}
                    value={props.values.team_id}
                    onChange={(val) => props.setFieldValue("team_id", val)}
                  />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Employment Status</Form.Label>
                  <Select
                    menuPosition="fixed"
                    className="text-primary"
                    options={employementOptions}
                    name={"employment_status"}
                    value={props.values.employment_status}
                    onChange={(val) =>
                      props.setFieldValue("employment_status", val)
                    }
                  />
                </Form.Group>

                <div className="hr-border2 mt-4 mb-2" />

                <Form.Group as={Col} md="6" className="hr-border">
                  <Row className="g-3">
                    <Form.Group as={Col} md="12">
                      <Form.Label>Pan No</Form.Label>
                      <Form.Control
                        type="text"
                        name={"pan"}
                        value={props.values.pan}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.pan && props.errors.pan
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.pan}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="12">
                      <Form.Label>Aadhar No</Form.Label>
                      <Form.Control
                        type="text"
                        maxLength={12}
                        name={"aadhar"}
                        value={props.values.aadhar}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.aadhar && props.errors.aadhar
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.aadhar}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="12">
                      <Form.Label>Epf No</Form.Label>
                      <Form.Control
                        type="text"
                        name={"epf_no"}
                        value={props.values.epf_no}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.epf_no && props.errors.epf_no
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.epf_no}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="12">
                      <Form.Label>Esi No</Form.Label>
                      <Form.Control
                        type="text"
                        name={"esi_no"}
                        value={props.values.esi_no}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.esi_no && props.errors.esi_no
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.esi_no}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                </Form.Group>
                <Form.Group as={Col} md="6">
                  <Row className="g-3">
                    <Form.Group as={Col} md="6">
                      {edit.id ? (
                        <>
                          <Form.Label>Upload Pan Card</Form.Label>
                          <Form.Control
                            type="file"
                            name={"upload_pan_card"}
                            onChange={(e) =>
                              props.setFieldValue(
                                "upload_pan_card",
                                e.target.files[0]
                              )
                            }
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.upload_pan_card &&
                                props.errors.upload_pan_card
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.upload_pan_card}
                          </Form.Control.Feedback>
                          <Form.Group as={Col} md={2}>
                            <img
                              width={100}
                              className="my-bg mt-2 p-1 rounded"
                              src={`${process.env.REACT_APP_API_URL}/${edit?.pan_card_image}`}
                            />{" "}
                          </Form.Group>
                        </>
                      ) : (
                        <>
                          <Form.Label>Upload Pan Card</Form.Label>
                          <Form.Control
                            type="file"
                            name={"upload_pan_card"}
                            onChange={(e) =>
                              props.setFieldValue(
                                "upload_pan_card",
                                e.target.files[0]
                              )
                            }
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.upload_pan_card &&
                                props.errors.upload_pan_card
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.upload_pan_card}
                          </Form.Control.Feedback>
                        </>
                      )}
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Aadhar Card Front Image</Form.Label>

                      {edit.id ? (
                        <>
                          <Form.Control
                            type="file"
                            name={"upload_aadhar_card_image1"}
                            onChange={(e) =>
                              props.setFieldValue(
                                "upload_aadhar_card_image1",
                                e.target.files[0]
                              )
                            }
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.upload_aadhar_card_image1 &&
                                props.errors.upload_aadhar_card_image1
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.upload_aadhar_card_image1}
                          </Form.Control.Feedback>

                          <Form.Group as={Col} md={2}>
                            <img
                              width={100}
                              className="my-bg mt-2 p-1 rounded"
                              src={`${process.env.REACT_APP_API_URL}/${edit?.aadhar_card_front_image}`}
                            />{" "}
                          </Form.Group>
                        </>
                      ) : (
                        <>
                          <Form.Control
                            type="file"
                            name={"upload_aadhar_card_image1"}
                            onChange={(e) =>
                              props.setFieldValue(
                                "upload_aadhar_card_image1",
                                e.target.files[0]
                              )
                            }
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.upload_aadhar_card_image1 &&
                                props.errors.upload_aadhar_card_image1
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.upload_aadhar_card_image1}
                          </Form.Control.Feedback>
                        </>
                      )}
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Aadhar Card Back Image</Form.Label>

                      {edit.id ? (
                        <>
                          <Form.Control
                            type="file"
                            name={"upload_aadhar_card_image2"}
                            onChange={(e) =>
                              props.setFieldValue(
                                "upload_aadhar_card_image2",
                                e.target.files[0]
                              )
                            }
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.upload_aadhar_card_image2 &&
                                props.errors.upload_aadhar_card_image2
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.upload_aadhar_card_image2}
                          </Form.Control.Feedback>
                          <Form.Group as={Col} md={2}>
                            <img
                              width={100}
                              className="my-bg mt-2 p-1 rounded"
                              src={`${process.env.REACT_APP_API_URL}/${edit?.aadhar_card_back_image}`}
                            />{" "}
                          </Form.Group>
                        </>
                      ) : (
                        <>
                          <Form.Control
                            type="file"
                            name={"upload_aadhar_card_image2"}
                            onChange={(e) =>
                              props.setFieldValue(
                                "upload_aadhar_card_image2",
                                e.target.files[0]
                              )
                            }
                            onBlur={props.handleBlur}
                            isInvalid={Boolean(
                              props.touched.upload_aadhar_card_image2 &&
                                props.errors.upload_aadhar_card_image2
                            )}
                          />
                          <Form.Control.Feedback type="invalid">
                            {props.errors.upload_aadhar_card_image2}
                          </Form.Control.Feedback>
                        </>
                      )}
                    </Form.Group>
                  </Row>
                </Form.Group>

                <div className="hr-border2 mt-4 mb-2" />

                <Form.Group as={Col} md="4">
                  <Form.Label>Bank Name</Form.Label>
                  <Form.Control
                    type="text"
                    name={"bank_name"}
                    value={props.values.bank_name}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.bank_name && props.errors.bank_name
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.bank_name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Ifsc Code</Form.Label>
                  <Form.Control
                    type="text"
                    name={"ifsc_code"}
                    value={props.values.ifsc_code}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.ifsc_code && props.errors.ifsc_code
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.ifsc_code}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Account Number</Form.Label>
                  <Form.Control
                    type="text"
                    name={"account_number"}
                    value={props.values.account_number}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(
                      props.touched.account_number &&
                        props.errors.account_number
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {props.errors.account_number}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Upload Bank Documents</Form.Label>

                  {edit.id ? (
                    <>
                      <Form.Control
                        type="file"
                        name={"upload_bank_documents"}
                        onChange={(e) =>
                          props.setFieldValue(
                            "upload_bank_documents",
                            e.target.files[0]
                          )
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.upload_bank_documents &&
                            props.errors.upload_bank_documents
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.upload_bank_documents}
                      </Form.Control.Feedback>
                      <Form.Group as={Col} md={2}>
                        <img
                          width={100}
                          className="my-bg mt-2 p-1 rounded"
                          src={`${process.env.REACT_APP_API_URL}/${edit?.bank_documents}`}
                        />{" "}
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Form.Control
                        type="file"
                        name={"upload_bank_documents"}
                        onChange={(e) =>
                          props.setFieldValue(
                            "upload_bank_documents",
                            e.target.files[0]
                          )
                        }
                        onBlur={props.handleBlur}
                        isInvalid={Boolean(
                          props.touched.upload_bank_documents &&
                            props.errors.upload_bank_documents
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {props.errors.upload_bank_documents}
                      </Form.Control.Feedback>
                    </>
                  )}
                </Form.Group>

                <div className="hr-border2 mt-4 mb-2" />

                <Form.Group as={Col} md={12}>
                  <Form.Label>Employee Login Credentials</Form.Label>
                  <MyCard>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>User Name</Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="email"
                          value={props.values.email}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          name={"email"}
                          isInvalid={Boolean(
                            props.touched.email && props.errors.email
                          )}
                        />
                      </Col>
                      <Form.Control.Feedback type="invalid">
                        {props.errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column>Password</Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="password"
                          value={props.values.password}
                          onChange={props.handleChange}
                          onBlur={props.handleBlur}
                          name="password"
                          isInvalid={Boolean(
                            props.touched.password && props.errors.password
                          )}
                        />
                      </Col>
                      <Form.Control.Feedback type="invalid">
                        {props.errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                    {/* <Form.Group as={Row} className="mb-3">
                      <Form.Label column>Status</Form.Label>
                      <Col sm={8}>
                        <Form.Check inline label="1" id={1} name="group1" />
                        <Form.Check inline label="2" id={2} name="group1" />
                      </Col>
                      <Form.Control.Feedback type="invalid">
                        {props.errors.password}
                      </Form.Control.Feedback>
                    </Form.Group> */}
                  </MyCard>
                </Form.Group>

                <div className="hr-border2 mt-4 mb-2" />

                <Form.Group as={Col} md={12}>
                  <Form.Label>Add Family (Optional)</Form.Label>
                  <MyCard>
                    <FieldArray name="family_info">
                      {({ remove, push }) => (
                        <>
                          {props.values.family_info.length > 0 &&
                            props.values.family_info.map((ele, index) => (
                              <Row
                                key={index}
                                className="align-items-center g-3"
                              >
                                <div className="hr-border2 my-3" />
                                <Form.Group as={Row} className="mb-3">
                                  <Form.Label column>Name</Form.Label>
                                  <Col sm={8}>
                                    <Form.Control
                                      type="text"
                                      name={`family_info.${index}.name`}
                                      value={ele.name}
                                      onChange={props.handleChange}
                                      onBlur={props.handleBlur}
                                    />
                                  </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                  <Form.Label column>Relation</Form.Label>
                                  <Col sm={8}>
                                    <Select
                                      menuPosition="fixed"
                                      className="text-primary"
                                      options={[
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
                                      ]}
                                      name={`family_info.${index}.relation`}
                                      value={{
                                        label: ele.relation,
                                        value: ele.relation,
                                      }}
                                      onChange={(val) => {
                                        props.setFieldValue(
                                          `family_info.${index}.relation`,
                                          val.value
                                        );
                                      }}
                                    />
                                  </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                  <Form.Label column>
                                    Upload Aadhar Card Front Image
                                  </Form.Label>
                                  <Col sm={8}>
                                    {edit.id ? (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.addhar_card_front_image`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.addhar_card_front_image`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                        <Form.Group as={Col} md={2}>
                                          <img
                                            width={100}
                                            className="my-bg mt-2 p-1 rounded"
                                            src={`${process.env.REACT_APP_API_URL}/${edit?.addhar_card_front_image}`}
                                          />{" "}
                                        </Form.Group>
                                      </>
                                    ) : (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.addhar_card_front_image`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.addhar_card_front_image`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                      </>
                                    )}
                                  </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                  <Form.Label column>
                                    Upload Aadhar Card Back Image
                                  </Form.Label>

                                  <Col sm={8}>
                                    {edit.id ? (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.addhar_card_back_image`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.addhar_card_back_image`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                        <Form.Group as={Col} md={2}>
                                          <img
                                            width={100}
                                            className="my-bg mt-2 p-1 rounded"
                                            src={`${process.env.REACT_APP_API_URL}/${edit?.addhar_card_back_image}`}
                                          />{" "}
                                        </Form.Group>
                                      </>
                                    ) : (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.addhar_card_back_image`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.addhar_card_back_image`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                      </>
                                    )}
                                  </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                  <Form.Label column>
                                    Upload Pan Card
                                  </Form.Label>
                                  <Col sm={8}>
                                    {edit.id ? (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.pan_card`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.pan_card`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                        <Form.Group as={Col} md={2}>
                                          <img
                                            width={100}
                                            className="my-bg mt-2 p-1 rounded"
                                            src={`${process.env.REACT_APP_API_URL}/${edit?.pan_card}`}
                                          />{" "}
                                        </Form.Group>
                                      </>
                                    ) : (
                                      <>
                                        <Form.Control
                                          type="file"
                                          name={`family_info.${index}.pan_card`}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `family_info.${index}.pan_card`,
                                              e.target.files[0]
                                            )
                                          }
                                          onBlur={props.handleBlur}
                                        />
                                      </>
                                    )}
                                  </Col>
                                </Form.Group>

                                {index === 0 ? null : (
                                  <Form.Group
                                    as={Col}
                                    style={{
                                      right: " -440px",
                                      bottom: "48px",
                                      position: "relative",
                                    }}
                                    md="1"
                                    className="text-end mb-2 m-auto"
                                  >
                                    <TooltipComponent
                                      align="left"
                                      title={"Delete Row"}
                                    >
                                      <BsXLg
                                        onClick={() => remove(index)}
                                        className="social-btn red-combo"
                                      />
                                    </TooltipComponent>
                                  </Form.Group>
                                )}
                              </Row>
                            ))}
                          <Form.Group as={Col} md={3} className="ms-auto">
                            <div
                              onClick={() =>
                                push({
                                  name: "",
                                  relation: "",
                                  addhar_card_front_image: null,
                                  addhar_card_back_image: null,
                                  pan_card: null,
                                })
                              }
                              className="shadow py-1 px-3 success-combo cursor-pointer d-align gap-1"
                            >
                              <BsPlusLg className="cursor-pointer" /> Add
                            </div>
                          </Form.Group>
                        </>
                      )}
                    </FieldArray>
                  </MyCard>
                </Form.Group>

                <Form.Group as={Col} md={12}>
                  <div className="text-center">
                    <button
                      type="submit"
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
                          PLEASE WAIT...
                        </>
                      ) : (
                        // <>{edit.company_id ? 'UPDATE' : 'SAVE'}</>
                        "SAVE"
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
  );
};

export default ViewProfile;
