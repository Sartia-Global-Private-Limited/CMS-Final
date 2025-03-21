import React, { useEffect, useState } from "react";
import "react-best-tabs/dist/index.css";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import Modaljs from "../../../components/Modal";
import ActionButton from "../../../components/ActionButton";
import {
  getAllInsuranceCompany,
  CreateInsuranceCompany,
  DeleteInsuranceCompany,
  UpdateInsuranceCompany,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { Formik } from "formik";
import Select from "react-select";
import { addInsuranceCompanySchema } from "../../../utils/formSchema";
import ConfirmAlert from "../../../components/ConfirmAlert";
import moment from "moment";

const InsuranceCompany = () => {
  const [insuranceCompanyData, setInsuranceCompanyData] = useState(false);
  const [insuranceCompany, setInsuranceCompany] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const fetchInsuranceCompanyData = async () => {
    const res = await getAllInsuranceCompany();
    if (res.status) {
      setInsuranceCompany(res.data);
    } else {
      setInsuranceCompany([]);
    }
  };

  const handleEdit = async (company) => {
    setEdit(company);
    setInsuranceCompanyData(true);
  };
  // console.log('edit.id', edit.id)

  const handleDelete = async () => {
    const res = await DeleteInsuranceCompany(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setInsuranceCompany((prev) =>
        prev.filter((itm) => itm.id !== +idToDelete)
      );
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchInsuranceCompanyData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    // return console.log('values', values)
    const sData = {
      company_name: values.company_name,
      company_code: values.company_code,
      status: values.status.value,
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log('sData', sData)
    const res = edit.id
      ? await UpdateInsuranceCompany(sData)
      : await CreateInsuranceCompany(sData);
    if (res.status) {
      fetchInsuranceCompanyData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setInsuranceCompanyData(false);
  };

  return (
    <>
      <Helmet>
        <title>All Insurance Company · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"All Insurance Company"}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setInsuranceCompanyData(true);
          }}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr No.",
                    "Company Name",
                    "Company Code",
                    "Date",
                    "Status",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {insuranceCompany?.length > 0 ? null : (
                  <tr>
                    <td colSpan={7}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
                {insuranceCompany?.map((company, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{company?.company_name}</td>
                    <td>{company?.company_code}</td>
                    <td>{moment(company.created_at).format("DD-MM-YYYY")}</td>
                    <td
                      className={`text-${
                        company?.status == 1 ? "green" : "danger"
                      }`}
                    >
                      {company?.status == 1 ? "Active" : "Inactive"}
                    </td>
                    <td>
                      <ActionButton
                        deleteOnclick={() => {
                          setIdToDelete(company.id);
                          setShowAlert(true);
                        }}
                        hideEye={"d-none"}
                        editOnclick={() => handleEdit(company)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardComponent>
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit?.id || "",
          company_name: edit?.company_name || "",
          company_code: edit?.company_code || "",
          status: edit.status
            ? {
                label: edit.status == 1 ? "Active" : "Inactive",
                value: edit.status == 1 ? "Active" : "Inactive",
              }
            : {},
        }}
        validationSchema={addInsuranceCompanySchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={insuranceCompanyData}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "Save"}
            close={() => setInsuranceCompanyData(false)}
            title={
              edit.id ? "Update Insurance Company" : "Create Insurance Company"
            }
          >
            <Row className="g-2">
              <Form.Group as={Col} md={12}>
                <Form.Label>Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name={"company_name"}
                  value={props.values.company_name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.company_name && props.errors.company_name
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.company_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Company Code</Form.Label>
                <Form.Control
                  type="text"
                  name={"company_code"}
                  value={props.values.company_code}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.company_code && props.errors.company_code
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.company_code}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Select Status</Form.Label>
                <Select
                  menuPosition="fixed"
                  name={"status"}
                  options={[
                    { value: "1", label: "active" },
                    { value: "0", label: "inactive" },
                  ]}
                  value={props.values.status}
                  onChange={(selectedOption) => {
                    props.setFieldValue("status", selectedOption);
                  }}
                />
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default InsuranceCompany;
