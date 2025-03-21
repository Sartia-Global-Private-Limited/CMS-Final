import React, { useEffect, useState } from "react";
import { Col, Form, Stack } from "react-bootstrap";
import Select from "react-select";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllOfficeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { ErrorMessage, Field } from "formik";
import { useTranslation } from "react-i18next";

export const OtherRequest = ({
  main,
  props,
  id,
  managerName,
  supervisorName,
  OfficeUserName,
  supplierName,
  endUserName,
  edit,
  suppliersData,
}) => {
  const [allManagers, setAllManagers] = useState([]);
  const [allOfficeUser, setAllofficeUser] = useState([]);
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

  const fetchOfficeUser = async () => {
    const res = await getAllOfficeUser();
    if (res.status) {
      setAllofficeUser(res.data);
    } else {
      setAllofficeUser([]);
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
    fetchOfficeUser();
    if (edit?.area_manager_id?.id) {
      fetchFreeSupervisorData(edit?.area_manager_id?.id);
    }
    if (edit?.supervisor_id?.id) {
      fetchFreeUsersData(edit?.supervisor_id?.id);
    }
  }, []);
  return (
    <>
      {/* <div>{edit.requested_for_name}</div> */}
      <Form.Group as={Col} md={12}>
        {edit?.request_for && (
          <div>
            <img
              src={
                edit?.request_for_image
                  ? `${process.env.REACT_APP_API_URL}${edit?.request_for_image}`
                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
              }
              className="avatar me-2"
            />
            {`${edit?.request_for}`}
          </div>
        )}
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label className="small">{t("Office")} </Form.Label>
        <Select
          placeholder="Office"
          menuPortalTarget={document.body}
          isClearable={true}
          value={main?.office_users_id}
          options={allOfficeUser?.map((user) => ({
            label: user.name,
            value: user.id,
          }))}
          name={OfficeUserName}
          isDisabled={edit?.id || main?.area_manager_id}
          onChange={(e) => {
            props.setFieldValue(OfficeUserName, e);
            props.setFieldValue(managerName, "");
            props.setFieldValue(supervisorName, "");
            props.setFieldValue(endUserName, "");
          }}
        />
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label className="small">{t("Manager")}</Form.Label>
        <Select
          placeholder={t("Manager")}
          menuPortalTarget={document.body}
          value={main?.area_manager_id}
          isClearable={true}
          options={allManagers?.map((user) => ({
            label: user.name,
            value: user.id,
          }))}
          name={managerName}
          isDisabled={edit?.id || main.office_users_id}
          onChange={(e) => {
            handleManagerChange(e?.value);
            props.setFieldValue(managerName, e);
            props.setFieldValue(supervisorName, "");
            props.setFieldValue(endUserName, "");
            setFreeUserData([]);
          }}
        />
      </Form.Group>
      <Form.Group as={Col}>
        <Form.Label className="small">{t("Supervisor")}</Form.Label>
        <Select
          placeholder={t("Supervisor")}
          menuPortalTarget={document.body}
          value={main?.supervisor_id}
          options={freeSupervisorData?.map((user) => ({
            label: user.name,
            value: user.id,
          }))}
          isDisabled={edit?.id || main.office_users_id}
          name={supervisorName}
          onChange={(e) => {
            handleSupervisorChange(e?.value, props.setFieldValue);
            props.setFieldValue(supervisorName, e);
          }}
        />
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label className="small">{t("End User")}</Form.Label>
        <Select
          placeholder={t("End User")}
          menuPortalTarget={document.body}
          value={main?.end_users_id}
          options={freeUserData?.map((user) => ({
            label: user.name,
            value: user.id,
          }))}
          isDisabled={edit?.id || main.office_users_id}
          name={endUserName}
          onChange={(e) => {
            props.setFieldValue(endUserName, e);
          }}
        />
      </Form.Group>

      <Form.Group as={Col}>
        <Form.Label className="small">{t("Supplier Name")}</Form.Label>

        <Select
          menuPortalTarget={document.body}
          autoFocus
          placeholder={t("Supplier Name")}
          className="text-primary"
          name={supplierName}
          options={suppliersData?.map((typ) => ({
            value: typ.id,
            label: typ.supplier_name,
          }))}
          value={main.supplier_id}
          isDisabled={edit?.id}
          onChange={(val) => props.setFieldValue(supplierName, val)}
          // isDisabled={type == "approve"}
        />

        <ErrorMessage
          name={supplierName}
          component="small"
          className="text-danger"
        />
      </Form.Group>
    </>
  );
};
