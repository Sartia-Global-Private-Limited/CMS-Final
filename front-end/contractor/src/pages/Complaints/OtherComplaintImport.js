import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import { Helmet } from "react-helmet";
import TextareaAutosize from "react-textarea-autosize";
import { getAdminSaleCompanies } from "../../services/authapi";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";

const OtherComplaintImport = ({ props, allOrderVia, complaintType }) => {
  const [companyData, setCompanyData] = useState([]);
  const [companyDataById, setCompanyDataById] = useState({});
  const { t } = useTranslation();

  const handleCompanyChange = async (id) => {
    const res = await getAdminSaleCompanies({ isDropdown: true });
    if (res.status) {
      const data = res?.data?.filter((company) => company?.company_id == id);
      setCompanyDataById(data[0]);
    } else {
      setCompanyDataById({});
    }
  };

  const fetchCompanyData = async () => {
    const res = await getAdminSaleCompanies({ isDropdown: true });
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

      <Form.Group as={Col} md={4}>
        <MyInput
          isRequired
          name={"energy_company_id"}
          formikProps={props}
          label={t("Other Company")}
          customType={"select"}
          selectProps={{
            data: companyData,
            onChange: (e) => {
              handleCompanyChange(e?.value);
            },
          }}
        />
      </Form.Group>
      {companyDataById?.company_contact_person ? (
        <Form.Group as={Col} md={4}>
          <Form.Label>{t("Company Contact Person")}</Form.Label>
          <Form.Control
            type="text"
            disabled
            value={companyDataById?.company_contact_person}
          />
        </Form.Group>
      ) : null}
      {companyDataById?.company_email ? (
        <Form.Group as={Col} md={4}>
          <Form.Label>{t("Company Email")}</Form.Label>
          <Form.Control
            type="text"
            disabled
            value={companyDataById?.company_email}
          />
        </Form.Group>
      ) : null}
      {companyDataById?.company_contact ? (
        <Form.Group as={Col} md={4}>
          <Form.Label>{t("Company Contact")}</Form.Label>
          <Form.Control
            type="text"
            disabled
            value={companyDataById?.company_contact}
          />
        </Form.Group>
      ) : null}
      {companyDataById?.company_address ? (
        <Form.Group as={Col} md={4}>
          <Form.Label>{t("Company Address")}</Form.Label>
          <TextareaAutosize
            disabled
            className="edit-textarea"
            value={companyDataById?.company_address}
          />
        </Form.Group>
      ) : null}

      <Form.Group as={Col} md={4}>
        <MyInput
          isRequired
          name={"order_by"}
          formikProps={props}
          label={t("Order By")}
        />
      </Form.Group>
      <Form.Group as={Col} md={4}>
        <MyInput
          isRequired
          name={"order_via_id"}
          formikProps={props}
          label={t("Order Via")}
          customType={"select"}
          selectProps={{
            data: allOrderVia,
          }}
        />
      </Form.Group>

      <Form.Group as={Col} md={4}>
        <MyInput
          isRequired
          name={"complaint_type"}
          formikProps={props}
          label={t("Complaint Type")}
          customType={"select"}
          selectProps={{
            data: complaintType,
          }}
        />
      </Form.Group>
    </>
  );
};

export default OtherComplaintImport;
