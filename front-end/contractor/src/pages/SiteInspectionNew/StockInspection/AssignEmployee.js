import React, { useEffect, useState } from "react";
import CardComponent from "../../../components/CardComponent";
import {
  getAllEndUserBySupervisorId,
  getAllManagersUser,
  getAllOfficeUser,
  getSupervisorListWithTotalFreeUserByManagerId,
  postAssignEmployee,
  postAssignEmployeeforFund,
  postStockPunchTransfer,
} from "../../../services/contractorApi";
import { toast } from "react-toastify";
import { Col, Form, Spinner } from "react-bootstrap";
import Select from "react-select";
import { Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";

export default function AssignEmployee() {
  const location = useLocation();
  const navigate = useNavigate();
  const complaint_id = location?.state?.complaint_id;
  const type = location?.state?.type;

  const [allOfficeUser, setAllofficeUser] = useState([]);
  const [allManagers, setAllManagers] = useState([]);
  const [supervisoForTransferFrom, setSupervisorForTransferFrom] = useState([]);
  const [endUserForTransferFrom, SetEndUserForTransferFrom] = useState([]);

  const fetchOfficeUser = async () => {
    const res = await getAllOfficeUser();
    if (res.status) {
      setAllofficeUser(res.data);
    } else {
      setAllofficeUser([]);
    }
  };

  const fetchManagers = async () => {
    const res = await getAllManagersUser();
    if (res.status) {
      setAllManagers(res.data);
    } else {
      setAllManagers([]);
    }
  };

  const handleManagerChange = async (value, type) => {
    if (!value) {
      return setSupervisorForTransferFrom([]);
    }
    fetchsupervisoForTransferFrom(value, type);
  };

  //All Supervisors By Manager Id
  const fetchsupervisoForTransferFrom = async (id, type) => {
    const res = await getSupervisorListWithTotalFreeUserByManagerId(id);
    if (res.status) {
      setSupervisorForTransferFrom(res.data);
    } else {
      setSupervisorForTransferFrom([]);
      toast.error(res.message);
    }
  };

  const handleSupervisorChange = async (value, type) => {
    if (value) {
      fetchFreeUsersData(value, type);
    }
  };

  //All End Users By Supervisor Id
  const fetchFreeUsersData = async (id, type) => {
    const res = await getAllEndUserBySupervisorId(id);
    if (res.status) {
      SetEndUserForTransferFrom(res.data);
    } else {
      SetEndUserForTransferFrom([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchOfficeUser();
    fetchManagers();
  }, []);

  const handleSubmit = async (values) => {
    const sdata = {
      complaint_id,
      area_manager_id: values?.area_manager_id?.value,
      supervisor_id: values?.supervisor_id?.value,
      end_users_id: values?.enduser_id?.value,
      office_users_id: values?.officeUser_id?.value,
    };

    // return console.log(sdata, "sData");
    const res =
      type == "stock "
        ? await postAssignEmployee(sdata)
        : await postAssignEmployeeforFund(sdata);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div>
      <CardComponent title={`Assign Employee`} showBackButton={true}>
        <Formik
          initialValues={{
            area_manager_id: "",
            supervisor_id: "",
            end_users_id: "",
            officeUser_id: "",
          }}
          onSubmit={handleSubmit}
        >
          {(props) => {
            return (
              <Form onSubmit={props.handleSubmit}>
                <div className="d-flex">
                  <Form.Group as={Col} md={4}>
                    <Form.Label className="small">Manager</Form.Label>
                    <Select
                      placeholder="Manager"
                      menuPortalTarget={document.body}
                      isClearable={true}
                      options={allManagers?.map((user) => ({
                        label: user.name,
                        value: user.id,
                      }))}
                      isDisabled={props.values.officeUser_id}
                      onChange={(e) => {
                        props.setFieldValue("area_manager_id", e);
                        handleManagerChange(e?.value, "transfer_from");
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label className="small">Supervisor</Form.Label>
                    <Select
                      placeholder="Supervisor"
                      menuPortalTarget={document.body}
                      options={supervisoForTransferFrom?.map((user) => ({
                        label: user.name,
                        value: user.id,
                      }))}
                      isClearable={true}
                      onChange={(e) => {
                        props.setFieldValue("supervisor_id", e);
                        handleSupervisorChange(e?.value, "transfer_from");
                      }}
                    />
                  </Form.Group>
                  <Form.Group as={Col}>
                    <Form.Label className="small">End User</Form.Label>
                    <Select
                      placeholder="End User"
                      menuPortalTarget={document.body}
                      isClearable={true}
                      options={endUserForTransferFrom?.map((user) => ({
                        label: user.name,
                        value: user.id,
                      }))}
                      onChange={(e) => {
                        props.setFieldValue("enduser_id", e);
                      }}
                    />
                  </Form.Group>
                </div>
                <span className="d-flex justify-content-center my-3">OR</span>
                <Form.Group as={Col} md={4}>
                  <Form.Label className="small">Office User</Form.Label>
                  <Select
                    placeholder="Office"
                    menuPortalTarget={document.body}
                    isClearable={true}
                    isDisabled={props.values.area_manager_id}
                    options={allOfficeUser?.map((user) => ({
                      label: user.name,
                      value: user.id,
                    }))}
                    onChange={(e) => props.setFieldValue("officeUser_id", e)}
                  />
                </Form.Group>

                <Form.Group as={Col} md={12}>
                  <div className="mt-2 text-center">
                    <button
                      type={`button`}
                      onClick={() => {
                        props.handleSubmit();
                      }}
                      disabled={props?.isSubmitting}
                      className="shadow border-0 danger-combo cursor-pointer px-4 py-1"
                    >
                      {props?.isSubmitting ? (
                        <>
                          <Spinner
                            animation="border"
                            variant="primary"
                            size="sm"
                          />
                          PLEASE WAIT...
                        </>
                      ) : (
                        <>Assign</>
                      )}
                    </button>
                  </div>
                </Form.Group>
              </Form>
            );
          }}
        </Formik>
      </CardComponent>
    </div>
  );
}
