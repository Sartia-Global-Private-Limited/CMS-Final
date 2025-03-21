import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import TextareaAutosize from "react-textarea-autosize";
import { getAdminSaleCompanies } from "../../../services/authapi";
import { ErrorMessage } from "formik";
import Select from "react-select";

const CreateOtherComplaint = ({ props, allOrderVia, complaintType }) => {
  const [companyData, setCompanyData] = useState([]);
  const [companyDataById, setCompanyDataById] = useState({});

  //   get other Company Data
  const handleCompanyChange = async (value, setvalue) => {
    const isDropdown = true;

    const res = await getAdminSaleCompanies({ isDropdown });
    if (res.status) {
      const data = res?.data?.filter((company) => company?.company_id == value);
      setCompanyDataById(data[0]);
    } else {
      setCompanyDataById({});
      // toast.error(res.message);
    }
  };

  const fetchCompanyData = async () => {
    const isDropdown = true;

    const res = await getAdminSaleCompanies({ isDropdown });
    // console.log(res.data, "company dtatabhjbj");
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.company_id,
          label: itm.company_name,
        };
      });
      setCompanyData(rData);
    } else {
      setCompanyData([]);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Complaint Types · CMS Electricals</title>
      </Helmet>

      <Form.Group as={Col} md="4">
        <Form.Label>
          Company Name <span className="text-danger fw-bold">*</span>
        </Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="energy_company_id"
          value={props?.values.energy_company_id}
          onChange={(val) => {
            handleCompanyChange(val.value, props.setFieldValue);
            props.setFieldValue("energy_company_id", val);
          }}
          onBlur={props?.handleBlur}
          options={companyData}
          isInvalid={Boolean(
            props?.touched.energy_company_id && props.errors.energy_company_id
          )}
        />
        <ErrorMessage
          name="energy_company_id"
          component="small"
          className="text-danger"
        />
      </Form.Group>
      {companyDataById?.company_contact_person ? (
        <Form.Group as={Col} md="4">
          <Form.Label>Company Contact Person Name</Form.Label>
          <Form.Control
            type="text"
            disabled
            value={companyDataById?.company_contact_person}
          />
        </Form.Group>
      ) : null}
      {companyDataById?.company_email ? (
        <Form.Group as={Col} md="4">
          <Form.Label>Company Email</Form.Label>
          <Form.Control
            type="text"
            disabled
            value={companyDataById?.company_email}
          />
        </Form.Group>
      ) : null}
      {companyDataById?.company_contact ? (
        <Form.Group as={Col} md="4">
          <Form.Label>Company Contact</Form.Label>
          <Form.Control
            type="text"
            disabled
            value={companyDataById?.company_contact}
          />
        </Form.Group>
      ) : null}
      {companyDataById?.company_address ? (
        <Form.Group as={Col} md="4">
          <Form.Label>Company Address</Form.Label>
          <TextareaAutosize
            disabled={true}
            className="edit-textarea"
            value={companyDataById?.company_address}
          />
        </Form.Group>
      ) : null}

      <Form.Group as={Col} md="4">
        <Form.Label>
          Order By <span className="text-danger fw-bold">*</span>
        </Form.Label>
        <Form.Control
          type="text"
          name={"order_by"}
          value={props.values.order_by}
          onChange={props.handleChange}
        />
        <ErrorMessage
          name="order_by"
          component="small"
          className="text-danger"
        />
      </Form.Group>
      <Form.Group as={Col} md="4">
        <Form.Label>
          Order Via <span className="text-danger fw-bold">*</span>
        </Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="order_via_id"
          value={props?.values.order_via_id}
          onChange={(val) => {
            props.setFieldValue("order_via_id", val);
          }}
          options={allOrderVia}
        />
        <ErrorMessage
          name="order_via_id"
          component="small"
          className="text-danger"
        />
      </Form.Group>

      <Form.Group as={Col} md="4">
        <Form.Label>Complaint Type</Form.Label>
        <Select
          menuPortalTarget={document.body}
          className="text-primary"
          name="complaint_type"
          value={props?.values.complaint_type}
          onChange={(val) => {
            props.setFieldValue("complaint_type", val);
          }}
          options={complaintType}
        />
      </Form.Group>
      <Form.Group as={Col} md="4">
        <Form.Label>Work Permit</Form.Label>
        <Form.Control
          type="text"
          name={"work_permit"}
          value={props?.values.work_permit}
          onChange={props?.handleChange}
        />
      </Form.Group>

      <Form.Group as={Col} md="12">
        <Form.Label>Description</Form.Label>
        <TextareaAutosize
          minRows={3}
          className="edit-textarea"
          placeholder="Description..."
          name={"description"}
          value={props?.values.description}
          onChange={props?.handleChange}
        />
      </Form.Group>
    </>
  );
};

export default CreateOtherComplaint;
