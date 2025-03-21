import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import {
  getAllSalesAreaNameForMeasurement,
  getAllOutletNameForPTM,
  getAllRegionalNameForPTM,
  getAllOrderByForPTM,
  getAllSalesAreaNameForBilling,
  getAllOutletNameForBilling,
  getAllRegionalNameForBilling,
  getAllOrderByForBilling,
  getAllCompanyForPTM,
  getAllCompanyForBilling,
  getAllComplaintTypeForPTM,
  getAllComplaintTypeForBilling,
  getAllPoNumberForBilling,
} from "../../services/contractorApi";
import FormLabelText from "../../components/FormLabelText";
import { useTranslation } from "react-i18next";

export const FilterComponentInMeasurement = ({
  setSalesAreaId,
  setOutletId,
  setComplaintId,
  setPoId,
  setCompanyId,
  setComplaintFor,
  setRegionalOfficeId,
  setOrderById,
  className = "pb-3",
  children,
  status,
  filterFor,
  po_number,
}) => {
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [allOutletArea, setAllOutletArea] = useState([]);
  const [allRoOffice, setAllRoOffice] = useState([]);
  const [allsetOrderBy, setAllsetOrderBy] = useState([]);
  const [allsetCompany, setAllsetCompany] = useState([]);
  const [allComplaint, setAllComplaint] = useState([]);
  const [poNumber, setPoNumber] = useState([]);
  const { t } = useTranslation();

  const fetchSalesArea = async () => {
    const res =
      filterFor == "PTM"
        ? await getAllSalesAreaNameForMeasurement(status)
        : await getAllSalesAreaNameForBilling(status);
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };
  const fetchOutletArea = async () => {
    const res =
      filterFor == "PTM"
        ? await getAllOutletNameForPTM(status)
        : await getAllOutletNameForBilling(status);
    if (res.status) {
      setAllOutletArea(res.data);
    } else {
      setAllOutletArea([]);
    }
  };
  const fetchRoOffice = async () => {
    const res =
      filterFor == "PTM"
        ? await getAllRegionalNameForPTM(status)
        : await getAllRegionalNameForBilling(status);
    if (res.status) {
      setAllRoOffice(res.data);
    } else {
      setAllRoOffice([]);
    }
  };

  const fetchOrderBy = async () => {
    const res =
      filterFor == "PTM"
        ? await getAllOrderByForPTM(status)
        : await getAllOrderByForBilling({ status });
    if (res.status) {
      setAllsetOrderBy(res.data);
    } else {
      setAllsetOrderBy([]);
    }
  };
  const fetchAllCompany = async () => {
    const res =
      filterFor == "PTM"
        ? await getAllCompanyForPTM(status)
        : await getAllCompanyForBilling(status);
    if (res.status) {
      setAllsetCompany(res.data);
    } else {
      setAllsetCompany([]);
    }
  };
  const fetchAllComplaintType = async () => {
    const res =
      filterFor == "PTM"
        ? await getAllComplaintTypeForPTM(status)
        : await getAllComplaintTypeForBilling(status);
    if (res.status) {
      setAllComplaint(res.data);
    } else {
      setAllComplaint([]);
    }
  };
  const fetchAllPo = async () => {
    const res = await getAllPoNumberForBilling(status);
    if (res.status) {
      setPoNumber(res.data);
    } else {
      setPoNumber([]);
    }
  };
  useEffect(() => {
    fetchSalesArea();
    fetchOutletArea();
    fetchRoOffice();
    fetchOrderBy();
    fetchAllCompany();
    fetchAllComplaintType();
    if (po_number) {
      fetchAllPo();
    }
  }, []);
  return (
    <div className={className}>
      <div className="shadow p-2 rounded">
        <Row className="g-2 align-items-end">
          <Col md={3}>
            <FormLabelText children={t("all company")} />
            <Select
              menuPortalTarget={document.body}
              options={allsetCompany?.map((user) => ({
                label: `${user.company_name} (${
                  user.complaint_for == 1 ? "Ec" : "Oc"
                })`,
                value: `${user.id}-${user.complaint_for}`,
                complaint_for: user.complaint_for,
                id: user.id,
              }))}
              onChange={(e) => {
                setCompanyId(e ? e.id : null);
                setComplaintFor(e ? e.complaint_for : null);
              }}
              isClearable
            />
          </Col>

          <Col md={3}>
            <FormLabelText children={t("regional_office")} />
            <Select
              menuPortalTarget={document.body}
              options={allRoOffice?.map((user) => ({
                label: user.regional_office_name,
                value: user.id,
              }))}
              onChange={(e) => {
                setRegionalOfficeId(e ? e.value : null);
              }}
              isClearable
            />
          </Col>
          <Col md={3}>
            <FormLabelText children={t("Sales Area")} />
            <Select
              menuPortalTarget={document.body}
              options={allSalesArea?.map((user) => ({
                label: user.sales_area_name,
                value: user.id,
              }))}
              onChange={(e) => {
                setSalesAreaId(e ? e.value : null);
              }}
              isClearable
            />
          </Col>
          <Col md={3}>
            <FormLabelText children={t("ORDER BY")} />
            <Select
              menuPortalTarget={document.body}
              options={allsetOrderBy?.map((user) => ({
                label: user.name,
                value: user.id ? user.id : user.name,
              }))}
              onChange={(e) => {
                setOrderById(e ? e.value : null);
              }}
              isClearable
            />
          </Col>
          <Col md={3}>
            <FormLabelText children={t("outlet area")} />
            <Select
              menuPortalTarget={document.body}
              options={allOutletArea?.map((user) => ({
                label: user.outlet_name,
                value: user.id,
              }))}
              onChange={(e) => {
                setOutletId(e ? e.value : null);
              }}
              isClearable
            />
          </Col>
          {po_number && (
            <Col md={3}>
              <FormLabelText children={t("PO number")} />
              <Select
                menuPortalTarget={document.body}
                options={poNumber?.map((user) => ({
                  label: user.po_number,
                  value: user.id,
                }))}
                onChange={(e) => {
                  setPoId(e ? e.value : null);
                }}
                isClearable
              />
            </Col>
          )}
          <Col md={3}>
            <FormLabelText children={t("Complaint Type")} />
            <Select
              menuPortalTarget={document.body}
              options={allComplaint?.map((user) => ({
                label: user.complaint_type_name,
                value: user.id,
              }))}
              onChange={(e) => {
                setComplaintId(e ? e.value : null);
              }}
              isClearable
            />
          </Col>

          {children}
        </Row>
      </div>
    </div>
  );
};
