import React, { useEffect, useState } from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Button, Col, Form, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import Allowances from "./Allowances";
import Deductions from "./Deductions";
import { BsPencilSquare, BsPlus } from "react-icons/bs";
import { Formik } from "formik";
import {
  UpdatePayrollMaster,
  getAllRolesForDropDown,
  getAllPayrollMaster,
  getAdminAllHREmployees,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import TooltipComponent from "../../../components/TooltipComponent";
import { useNavigate } from "react-router-dom";
import NotAllowed from "../../Authentication/NotAllowed";

const PayrollMaster = ({ checkPermission }) => {
  const [masterData, setMasterData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const navigate = useNavigate();

  const fetchAllUsersData = async () => {
    const isDropdown = true;
    const res = await getAdminAllHREmployees({ isDropdown });
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchRolesData = async () => {
    const res = await getAllRolesForDropDown();
    if (res.status) {
      setRoles(res.data);
    } else {
      setRoles([]);
    }
  };

  useEffect(() => {
    fetchRolesData();
    fetchAllUsersData();
  }, []);

  const tabs = [
    { title: "Payroll Master", className: "fw-bold px-0 pe-none" },
    {
      title: "Settings",
      className: "ms-auto",
      page: <Settings checkPermission={checkPermission} />,
    },
    {
      title: "Allowances",
      page: (
        <Allowances
          allUserData={allUserData}
          roles={roles}
          checkPermission={checkPermission}
        />
      ),
    },
    {
      title: "Deductions",
      page: (
        <Deductions
          allUserData={allUserData}
          roles={roles}
          checkPermission={checkPermission}
        />
      ),
    },
  ];

  const fetchPayrollMasterData = async () => {
    const res = await getAllPayrollMaster();
    if (res.status) {
      setMasterData(res.data);
    } else {
      setMasterData([]);
    }
  };

  function Settings() {
    const handleSettingUpdate = async (
      values,
      { setSubmitting, resetForm }
    ) => {
      const sData = {
        id: values.id,
      };

      // return console.log('sData', sData)
      const res = await UpdatePayrollMaster(sData);
      if (res.status) {
        fetchPayrollMasterData();
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
      resetForm();
      setSubmitting(false);
    };

    return (
      <>
        <div className="d-flex mb-4 justify-content-end">
          {checkPermission?.create && (
            <Button
              variant="light"
              className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
              onClick={() => navigate("/PayrollMaster/create/new")}
            >
              <BsPlus />
              Create
            </Button>
          )}
        </div>
        <Formik
          enableReinitialize={true}
          initialValues={{
            id: masterData?.filter((d) => +d.active_setting === 1)[0]?.id || "",
          }}
          onSubmit={handleSettingUpdate}
        >
          {(props) => (
            <Form onSubmit={props?.handleSubmit}>
              {masterData?.map((data, index) => (
                <div className="bg-primary-light1 d-flex gap-3 mb-2 px-2 py-1">
                  <Form.Check
                    type="radio"
                    name="id"
                    id={`id_${data.id}`}
                    value={data?.id}
                    checked={props.values.id === data.id ? true : false}
                    onChange={() => {
                      // console.log(data.id);
                      props.setFieldValue("id", data.id);
                    }}
                  />
                  <TextareaAutosize
                    minRows={1}
                    className="edit-textarea resize-none"
                    name="label"
                    value={data.label}
                    disabled
                  />
                  {checkPermission?.update && (
                    <TooltipComponent title={"Edit"}>
                      <BsPencilSquare
                        onClick={() =>
                          navigate(`/PayrollMaster/create/${data.id}`)
                        }
                        className={`social-btn danger-combo`}
                      />
                    </TooltipComponent>
                  )}
                </div>
              ))}
              {checkPermission?.create && (
                <Form.Group as={Col} md={12}>
                  <div className="text-center mt-4">
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
                        <>SAVE</>
                      )}
                    </button>
                  </div>
                </Form.Group>
              )}
            </Form>
          )}
        </Formik>
      </>
    );
  }

  useEffect(() => {
    fetchPayrollMasterData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Payroll Master · CMS Electricals</title>
      </Helmet>

      {checkPermission?.view ? (
        <Tabs
          activeTab="2"
          ulClassName="border-primary border-bottom"
          activityClassName="bg-secondary"
        >
          {tabs.map((tab, idx) => (
            <Tab key={idx} title={tab.title} className={tab.className}>
              <div className="mt-3">{tab.page}</div>
            </Tab>
          ))}
        </Tabs>
      ) : (
        <NotAllowed />
      )}
    </>
  );
};

export default PayrollMaster;
