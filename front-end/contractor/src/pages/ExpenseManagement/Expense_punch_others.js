import React, { useEffect, useState } from "react";
import { Col, Form } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  getAllManagersUser,
  getAllEndUserBySupervisorId,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../../services/contractorApi";
import { ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";

export const Expense_punch_others = ({
  main,
  props,
  id,
  managerName,
  supervisorName,
  endUserName,
  setManagerId,
  edit,
}) => {
  const [allManagers, setAllManagers] = useState([]);
  const [freeSupervisorData, setFreeSupervisorData] = useState([]);
  const [freeUserData, setFreeUserData] = useState([]);
  const { t } = useTranslation();

  const fetchManagers = async () => {
    const res = await getAllManagersUser();
    if (res.status) {
      setAllManagers(res.data);
    } else {
      setAllManagers([]);
    }
  };

  const handleManagerChange = async (value) => {
    if (!value) return setFreeSupervisorData([]);
    fetchFreeSupervisorData(value);
  };

  //All Supervisors By Manager Id
  const fetchFreeSupervisorData = async (id) => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(id);
    if (res.status) {
      setFreeSupervisorData(res.data);
    } else {
      setFreeSupervisorData([]);
      toast.error(res.message);
    }
  };

  const handleSupervisorChange = async (value, setvalue) => {
    if (setvalue) {
      setvalue(`request_data[${id}].supervisor_id`, value);
      setvalue(`request_data[${id}].end_users_id`, "");
    }
    if (!value) return setFreeUserData([]);
    fetchFreeUsersData(value);
  };

  //All End Users By Supervisor Id
  const fetchFreeUsersData = async (id) => {
    const res = await getAllEndUserBySupervisorId(id);
    if (res.status) {
      setFreeUserData(res.data);
    } else {
      setFreeUserData([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchManagers();
    if (edit?.area_manager_id?.id) {
      fetchFreeSupervisorData(edit?.area_manager_id?.id);
    }
    if (edit?.supervisor_id?.id) {
      fetchFreeUsersData(edit?.supervisor_id?.id);
    }
  }, []);
  return (
    <>
      <Form.Group as={Col} md="3">
        <Form.Label className="small">{t("Manager")}</Form.Label>
        <Select
          placeholder={t("Manager")}
          menuPortalTarget={document.body}
          value={props.values?.area_manager_id}
          isClearable={true}
          options={allManagers?.map((user) => ({
            label: user.name,
            value: user.id,
          }))}
          name={managerName}
          isDisabled={props.values.office_users_id}
          onChange={(e) => {
            handleManagerChange(e?.value);
            setManagerId({
              type: "manager",
              id: e?.value,
            });
            props.setFieldValue(managerName, e);
            props.setFieldValue(supervisorName, "");
            props.setFieldValue(endUserName, "");
            props.setFieldValue(`complaint_id`, "");
          }}
        />
        <ErrorMessage
          name="area_manager_id"
          component="small"
          className="text-danger"
        />
      </Form.Group>
      <Form.Group as={Col} md="3">
        <Form.Label className="small">{t("Supervisor")}</Form.Label>
        <Select
          placeholder={t("Supervisor")}
          menuPortalTarget={document.body}
          value={props.values.supervisor_id}
          isClearable
          options={freeSupervisorData?.map((user) => ({
            label: user.name,
            value: user.id,
          }))}
          name={supervisorName}
          onChange={(e) => {
            if (e?.value) {
              handleSupervisorChange(e?.value, props.setFieldValue);
              props.setFieldValue(supervisorName, e);
              setManagerId({
                type: "manager",
                id: e?.value,
              });
              props.setFieldValue(endUserName, "");
              props.setFieldValue(`complaint_id`, "");
            } else {
              setManagerId({
                type: "manager",
                id: props?.values?.area_manager_id?.value,
              });
              props.setFieldValue(supervisorName, null);
            }
          }}
        />
      </Form.Group>

      <Form.Group as={Col} md="3">
        <Form.Label className="small">{t("End User")}</Form.Label>
        <Select
          placeholder={t("End User")}
          menuPortalTarget={document.body}
          isClearable={true}
          value={props.values.end_users_id}
          options={freeUserData?.map((user) => ({
            label: user.name,
            value: user.id,
          }))}
          name={endUserName}
          onChange={(e) => {
            if (e?.value) {
              props.setFieldValue(endUserName, e);
              setManagerId({
                type: "manager",
                id: e?.value,
              });
              props.setFieldValue(`complaint_id`, "");
            } else {
              setManagerId({
                type: "manager",
                id: props?.values?.supervisor_id?.value,
              });

              props.setFieldValue(endUserName, "");
            }
          }}
        />
      </Form.Group>
    </>
  );
};
