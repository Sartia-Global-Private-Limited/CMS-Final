import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Col, Form, Row } from "react-bootstrap";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllOfficeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../services/contractorApi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import FormLabelText from "./FormLabelText";
import { Filter } from "lucide-react";

export default function LevelWiseSelect({ onChange }) {
  const { t } = useTranslation();
  const [allOfficeUser, setAllofficeUser] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [freeSupervisorData, setFreeSupervisorData] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);

  // Track selected values
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedEndUser, setSelectedEndUser] = useState(null);

  useEffect(() => {
    fetchOfficeUser();
    fetchManagers();
  }, []);

  const fetchOfficeUser = async () => {
    const res = await getAllOfficeUser();
    if (res.status) setAllofficeUser(res.data);
  };

  const fetchManagers = async () => {
    const res = await getAllManagersUser();
    if (res.status) setAllManagers(res.data);
  };

  const fetchFreeSupervisorData = async (managerId) => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(managerId);
    if (res.status) setFreeSupervisorData(res.data);
    else {
      setFreeSupervisorData([]);
      toast.error(res.message);
    }
  };

  const fetchFreeUsersData = async (supervisorId) => {
    const res = await getAllEndUserBySupervisorId(supervisorId);
    if (res.status) setFreeUserData(res.data);
    else {
      setFreeUserData([]);
      toast.error(res.message);
    }
  };

  return (
    <div className="d-flex p-2 gap-1 mt-3">
      <Filter />
      <Row className="g-3 w-100">
        {/* Office */}
        <Form.Group as={Col} md={3}>
          <FormLabelText>{t("Office")}</FormLabelText>
          <Select
            value={selectedOffice}
            isClearable
            isDisabled={selectedManager}
            menuPortalTarget={document.body}
            options={allOfficeUser.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            onChange={(option) => {
              setSelectedOffice(option);
              setSelectedManager(null);
              setSelectedSupervisor(null);
              setSelectedEndUser(null);
              setFreeSupervisorData([]);
              setFreeUserData([]);
              onChange?.({ id: option?.value || "", type: "office" });
            }}
          />
        </Form.Group>

        {/* Manager */}
        <Form.Group as={Col} md={3}>
          <FormLabelText>{t("Manager")}</FormLabelText>
          <Select
            value={selectedManager}
            isClearable
            isDisabled={selectedOffice}
            menuPortalTarget={document.body}
            options={allManagers.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            onChange={(option) => {
              setSelectedManager(option);
              setSelectedOffice(null);
              setSelectedSupervisor(null);
              setSelectedEndUser(null);
              setFreeUserData([]);

              if (option) {
                fetchFreeSupervisorData(option.value);
              } else {
                setFreeSupervisorData([]);
              }

              onChange?.({ id: option?.value || "", type: "manager" });
            }}
          />
        </Form.Group>

        {/* Supervisor */}
        <Form.Group as={Col} md={3}>
          <FormLabelText>{t("Supervisor")}</FormLabelText>
          <Select
            value={selectedSupervisor}
            isClearable
            isDisabled={selectedOffice}
            menuPortalTarget={document.body}
            options={freeSupervisorData.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            onChange={(option) => {
              setSelectedSupervisor(option);
              setSelectedEndUser(null);

              if (option) {
                fetchFreeUsersData(option.value);
              } else {
                setFreeUserData([]);
              }

              onChange?.({ id: option?.value || "", type: "supervisor" });
            }}
          />
        </Form.Group>

        {/* End User */}
        <Form.Group as={Col} md={3}>
          <FormLabelText>{t("End User")}</FormLabelText>
          <Select
            value={selectedEndUser}
            isClearable
            isDisabled={selectedOffice}
            menuPortalTarget={document.body}
            options={freeUserData.map((user) => ({
              label: user.name,
              value: user.id,
            }))}
            onChange={(option) => {
              setSelectedEndUser(option);
              onChange?.({ id: option?.value || "", type: "endUser" });
            }}
          />
        </Form.Group>
      </Row>
    </div>
  );
}

// example for type
// const handleLevelChange = ({ id, type }) => {
//     if (type === "office") {
//       setOfficeId(id);
//       setManagerId("");
//       setSupervisorId("");
//       setEndUserId("");
//     } else if (type === "manager") {
//       setManagerId(id);
//       setOfficeId("");
//       setSupervisorId("");
//       setEndUserId("");
//     } else if (type === "supervisor") {
//       setSupervisorId(id);
//       setEndUserId("");
//     } else if (type === "endUser") {
//       setEndUserId(id);
//     }
//   };
