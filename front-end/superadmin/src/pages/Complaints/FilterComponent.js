import React, { useEffect, useState, useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import {
  getAllApprovedAssignComplaints,
  getAllApprovedUnAssignComplaints,
  getAllComplaints,
  getAllComplaintsForMeasurement,
  getApprovedComplaints,
  getRejectedComplaints,
  getRequestComplaints,
  getResolvedComplaints,
} from "../../services/contractorApi";
import { useTranslation } from "react-i18next";
import FormLabelText from "../../components/FormLabelText";

export const FilterComponent = ({
  setSalesAreaId,
  setCompanyId,
  setComplaintFor,
  setOutletId,
  setRegionalOfficeId,
  setOrderById,
  className = "pb-3",
  children,
  status,
  statusFilter = false,
  setStatus,
  setUniqueId,
}) => {
  const [allCompaniesData, setAllCompaniesData] = useState([]);
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [allOutletArea, setAllOutletArea] = useState([]);
  const [allRoOffice, setAllRoOffice] = useState([]);
  const [allOrderBy, setAllOrderBy] = useState([]);
  const { t } = useTranslation();

  const allStatus = [
    { label: "resolved", value: 0 },
    { label: "hardCopy", value: 1 },
    { label: "draft", value: 3 },
    { label: "final", value: 4 },
    { label: "readyToPI", value: 5 },
  ];

  const fetchAllComplaints = async () => {
    let res;

    switch (status) {
      case 0:
        res = await getAllComplaints({ isDropdown: true });
        break;
      case 1:
        res = await getRequestComplaints({ isDropdown: true });
        break;
      case 2:
        res = await getAllApprovedUnAssignComplaints({ isDropdown: true });
        break;
      case 3:
        res = await getAllApprovedAssignComplaints({ isDropdown: true });
        break;
      case 4:
        res = await getRejectedComplaints({ isDropdown: true });
        break;
      case 5:
        res = await getResolvedComplaints({ isDropdown: true });
        break;
      case 6:
        res = await getApprovedComplaints({ isDropdown: true });
        break;
      case "resolved-complaint-in-billing":
        res = await getAllComplaintsForMeasurement({ isDropdown: true });
        break;
      default:
        return;
    }

    if (res?.status) {
      const data = res.data || [];
      setAllCompaniesData(data);
      setAllSalesArea(data);
      setAllOutletArea(data);
      setAllRoOffice(data);
      setAllOrderBy(data);
    } else {
      setAllCompaniesData([]);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, [status]);

  const uniqueCompanies = useMemo(() => {
    return allCompaniesData?.filter(
      (complaint, index, self) =>
        index ===
        self.findIndex(
          (c) => c.company_unique_id === complaint.company_unique_id
        )
    );
  }, [allCompaniesData]);

  const uniqueOutlets = useMemo(() => {
    return allOutletArea?.filter(
      (complaint, index, self) =>
        complaint?.outlet?.[0]?.id &&
        index ===
          self.findIndex((c) => c.outlet?.[0]?.id === complaint.outlet?.[0]?.id)
    );
  }, [allOutletArea]);

  const uniqueRo = useMemo(() => {
    return allRoOffice?.filter(
      (complaint, index, self) =>
        complaint?.regionalOffice?.[0]?.id &&
        index ===
          self.findIndex(
            (c) =>
              c?.regionalOffice?.[0]?.id === complaint?.regionalOffice?.[0]?.id
          )
    );
  }, [allRoOffice]);

  const uniqueSalesArea = useMemo(() => {
    return allSalesArea?.filter(
      (complaint, index, self) =>
        complaint?.saleAreaDetails?.[0]?.id &&
        index ===
          self.findIndex(
            (c) =>
              c.saleAreaDetails?.[0]?.id === complaint.saleAreaDetails?.[0]?.id
          )
    );
  }, [allSalesArea]);

  const uniqueOrderBy = useMemo(() => {
    return allOrderBy?.filter(
      (complaint, index, self) =>
        index ===
        self.findIndex((c) => c.order_by_details === complaint.order_by_details)
    );
  }, [allOrderBy]);

  return (
    <div className={className}>
      <div className="shadow p-2 rounded mx-2">
        <Row className="g-2 align-items-end">
          <Col md={3}>
            <FormLabelText>{t("company name")}</FormLabelText>
            <Select
              menuPortalTarget={document.body}
              options={uniqueCompanies?.map((itm) => ({
                label: `${itm.energy_company_name} (${
                  itm.complaint_for == 1 ? "Ec" : "Oc"
                })`,
                value: itm.company_unique_id,
                complaint_for: itm.complaint_for,
                company_id: itm.energy_company_id,
              }))}
              onChange={(e) => {
                setCompanyId(e ? e.company_id : null);
                setComplaintFor(e ? e.complaint_for : null);
                setUniqueId(e ? e.value : null);
              }}
              isClearable
            />
          </Col>

          <Col md={3}>
            <FormLabelText>{t("regional_office")}</FormLabelText>
            <Select
              menuPortalTarget={document.body}
              options={uniqueRo?.map((user) => ({
                label: user?.regionalOffice?.[0]?.regional_office_name,
                value: user?.regionalOffice?.[0]?.id,
              }))}
              onChange={(e) => setRegionalOfficeId(e ? e.value : null)}
              isClearable
            />
          </Col>

          <Col md={3}>
            <FormLabelText>{t("Sales Area")}</FormLabelText>
            <Select
              menuPortalTarget={document.body}
              options={uniqueSalesArea?.map((user) => ({
                label: user?.saleAreaDetails?.[0]?.sales_area_name,
                value: user?.saleAreaDetails?.[0]?.id,
              }))}
              onChange={(e) => setSalesAreaId(e ? e.value : null)}
              isClearable
            />
          </Col>

          <Col md={3}>
            <FormLabelText>{t("ORDER BY")}</FormLabelText>
            <Select
              menuPortalTarget={document.body}
              options={uniqueOrderBy?.map((user) => ({
                label: user.order_by_details,
                value: user.order_by_id ?? user.order_by_details,
              }))}
              onChange={(e) => setOrderById(e ? e.value : null)}
              isClearable
            />
          </Col>

          <Col md={3}>
            <FormLabelText>{t("outlet area")}</FormLabelText>
            <Select
              menuPortalTarget={document.body}
              options={uniqueOutlets?.map((user) => ({
                label: user?.outlet?.[0]?.outlet_name,
                value: user?.outlet?.[0]?.id,
              }))}
              onChange={(e) => setOutletId(e ? e.value : null)}
              isClearable
            />
          </Col>

          {statusFilter && (
            <Col md={3}>
              <FormLabelText>{t("status")}</FormLabelText>
              <Select
                menuPortalTarget={document.body}
                options={allStatus}
                onChange={(e) => setStatus(e ? e.value : null)}
                isClearable
              />
            </Col>
          )}
          {children}
        </Row>
      </div>
    </div>
  );
};
