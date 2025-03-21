import React, { useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { BsCheckLg } from "react-icons/bs";
import Select from "react-select";
import { useEffect } from "react";
import { ErrorMessage, Formik } from "formik";
import { addMessageSchema } from "../../utils/formSchema";
import { getAllUsers } from "../../services/authapi";
import {
  postAssignComplaint,
  postAssignMultipleComplaint,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import Modaljs from "../../components/Modal";

const StockNotAssign = ({
  module_id,
  module_type,
  notAssignData,
  setNotAssignData,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [showAssign, setShowAssign] = useState(false);
  const [checkedData, setCheckedData] = useState(false);

  const handleSelectAll = (event) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      const allIds = notAssignData?.unassigned?.map((item) => item.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (event, id) => {
    const checked = event.target.checked;
    if (checked) {
      setSelectedRows((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedRows((prevSelected) =>
        prevSelected.filter((rowId) => rowId !== id)
      );
    }
  };

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const handleSubmitAssign = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      module_ids: selectedRows,
      // module_type: "complaint",
      module_type: module_type === "sale_area" ? "outlet" : "complaint",
      assign_to: values.user_id,
      is_future_date_visible: checkedData === true ? "1" : "0",
      assign_for: "2",
    };
    const assignData = {
      module_id: module_id,
      module_type: "outlet",
      assign_to: values.user_id,
      is_future_date_visible: checkedData === true ? "1" : "0",
      assign_for: "2",
    };
    // return console.log("sData", assignData);
    const res = await postAssignMultipleComplaint(sData);
    if (res.status) {
      // return console.log( assignData", assignData);
      const resaa = await postAssignComplaint(assignData);
      setNotAssignData(resaa.data);
      toast.success(res.message);
      setSelectedRows([]);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setShowAssign(false);
    setSubmitting(false);
  };

  const UserOption = ({ innerProps, label, data }) => (
    <div {...innerProps} className="cursor-pointer">
      <img
        className="avatar ms-2 me-3"
        src={
          data.image ||
          `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
        }
        alt={data.name}
      />
      {label}
    </div>
  );

  useEffect(() => {
    if (selectedRows.length === notAssignData?.unassigned?.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
    fetchAllUsersData();
  }, [selectedRows, notAssignData?.unassigned?.length]);

  return (
    <>
      <Row className="g-2">
        <Col md={12}>
          <div className="table-scroll p-2">
            <div className="mb-2 fw-bolder text-green">
              Assigned Complaints List
            </div>
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr no.",
                    "Assign User name",
                    <>
                      {module_type === "sale_area"
                        ? "outlet name"
                        : "complaint type name"}
                    </>,
                    <>
                      {module_type === "sale_area"
                        ? "sale area name"
                        : "complaint unique id"}
                    </>,
                    "Status",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {notAssignData?.assigned?.length == [] && (
                  <tr>
                    <td colSpan={5}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="100"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
                {notAssignData?.assigned?.map((itm, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{itm?.assign_user_name}</td>
                    <td>
                      {module_type === "sale_area"
                        ? itm?.outlet_name
                        : itm?.complaint_type_name}
                    </td>
                    <td>
                      {module_type === "sale_area"
                        ? itm?.sale_area_name
                        : itm?.complaint_unique_id}
                    </td>
                    <td className="text-green">Assigned</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
        {notAssignData?.unassigned?.length > 0 && (
          <Col md={12}>
            <div className="table-scroll p-2">
              <div className="mb-2 d-align justify-content-between fw-bolder text-danger">
                UnAssigned Complaints List
                {selectedRows.length > 0 && (
                  <span
                    onClick={() => setShowAssign(true)}
                    className="social-btn me-1 w-auto h-auto px-4 success-combo position-relative"
                  >
                    <BsCheckLg /> Assign
                    <span className="position-absolute top-0 mt-1 start-100 translate-middle badge rounded-pill bg-danger">
                      {selectedRows.length}
                    </span>
                  </span>
                )}
              </div>

              <Table className="text-body bg-new Roles">
                <thead className="text-truncate">
                  <tr>
                    {[
                      <>
                        <Form.Check
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </>,
                      "Sr no.",
                      <>
                        {module_type === "sale_area"
                          ? "outlet name"
                          : "complaint type name"}
                      </>,
                      <>
                        {module_type === "sale_area"
                          ? "sale area name"
                          : "complaint unique id"}
                      </>,
                      "Status",
                    ].map((thead) => (
                      <th key={thead}>{thead}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {notAssignData?.unassigned?.map((itm, idx) => (
                    <tr key={idx}>
                      <td>
                        <Form.Check
                          type="checkbox"
                          checked={selectedRows.includes(itm.id)}
                          onChange={(event) => handleRowSelect(event, itm.id)}
                        />
                      </td>
                      <td>{idx + 1}</td>
                      <td>
                        {module_type === "sale_area"
                          ? itm?.outlet_name
                          : itm?.complaint_type_name}
                      </td>
                      <td>
                        {module_type === "sale_area"
                          ? itm?.sale_area_name
                          : itm?.complaint_unique_id}
                      </td>
                      <td className="text-danger">Unassigned</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        )}
      </Row>

      <Formik
        enableReinitialize={true}
        initialValues={{
          user_id: "",
        }}
        validationSchema={addMessageSchema}
        onSubmit={handleSubmitAssign}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={showAssign}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Assign"}
            close={() => setShowAssign(false)}
            title={"Assign Complaint"}
          >
            <Row className="g-2">
              <Col md={12}>
                <Form.Label>Select User</Form.Label>
                <Select
                  menuPosition="fixed"
                  className="text-primary w-100"
                  name="user_id"
                  options={allUserData?.map((user) => ({
                    label: user.name,
                    value: user.id,
                    image: user.image
                      ? `${process.env.REACT_APP_API_URL}${user.image}`
                      : null,
                  }))}
                  onChange={(selectedOption) =>
                    props.setFieldValue("user_id", selectedOption.value)
                  }
                  components={{ Option: UserOption }}
                />
                <ErrorMessage
                  name="user_id"
                  component="small"
                  className="text-danger"
                />
              </Col>
              <Col md={12}>
                <Form.Check
                  type="checkbox"
                  id="check"
                  name="is_future_date_visible"
                  onChange={(e) => setCheckedData(e.target.checked)}
                  label="See all future data"
                />
              </Col>
            </Row>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default StockNotAssign;
