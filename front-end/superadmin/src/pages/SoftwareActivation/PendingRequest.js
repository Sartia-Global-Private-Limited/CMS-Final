import React, { useEffect, useState } from "react";
import { Form, Col, Table, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsCheckLg, BsEyeFill, BsXLg, BsTrash, BsSearch } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import {
  getAdminAllSoftwareActivation,
  getAdminApprovedSoftwareActivation,
  getAdminDeleteSoftwareActivation,
  getAdminRejectedSoftwareActivation,
} from "../../services/authapi";
import TextareaAutosize from "react-textarea-autosize";
import moment from "moment";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { Formik } from "formik";
import Modaljs from "../../components/Modal";

const PendingRequest = ({ refresh, setRefresh }) => {
  const [softwareActivation, setSoftwareActivation] = useState([]);
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [approvedRemarks, setApprovedRemarks] = useState(false);
  const [rejectedRemarks, setRejectedRemarks] = useState(false);
  const [edit, setEdit] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchSoftwareActivationData = async () => {
    const res = await getAdminAllSoftwareActivation(search, pageSize, pageNo);
    if (res.status) {
      setSoftwareActivation(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setSoftwareActivation([]);
      setPageDetail({});
    }
  };

  // Approved Software Activation
  const handleApproved = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    // formData.append('id', edit)
    formData.append("remark", values.remark);
    formData.append("image", values.image);
    const res = await getAdminApprovedSoftwareActivation(edit, formData);
    if (res.status) {
      toast.success(res.message);
      fetchSoftwareActivationData();
      setApprovedRemarks(false);
    } else {
      toast.error(res.message);
    }
    setRefresh(!refresh);
    resetForm();
    setSubmitting(false);
  };

  // Rejected Software Activation
  const handleRejected = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    // formData.append('id', edit)
    formData.append("remark", values.remark);
    const res = await getAdminRejectedSoftwareActivation(edit, formData);
    if (res.status) {
      toast.success(res.message);
      fetchSoftwareActivationData();
    } else {
      toast.error(res.message);
    }
    setRejectedRemarks(false);
    setRefresh(!refresh);
    resetForm();
    setSubmitting(false);
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteSoftwareActivation(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setSoftwareActivation((prev) =>
        prev.filter((itm) => itm.id !== +idToDelete)
      );
      fetchSoftwareActivationData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchSoftwareActivationData();
  }, [refresh, search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const handleRejectedRemarks = (id) => {
    setEdit(id);
    setRejectedRemarks(true);
  };
  const handleApprovedRemarks = (id) => {
    setEdit(id);
    setApprovedRemarks(true);
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("image", e.target.files[0]);
    }
  };

  return (
    <>
      <div className="position-relative float-end mb-3">
        <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
        <Form.Control
          type="text"
          placeholder="Search..."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="me-2"
          aria-label="Search"
        />
      </div>
      <Table className="text-body bg-new Roles">
        <thead className="text-truncate">
          <tr>
            {[
              "Sr No.",
              "User Name",
              "Company Name",
              "Title",
              "Requested Date",
              "Status",
              "Action",
            ].map((thead) => (
              <th key={thead}>{thead}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {softwareActivation.length > 0 ? null : (
            <tr>
              <td colSpan={7}>
                <img
                  className="p-3"
                  alt="no-result"
                  width="250"
                  src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                />
              </td>
            </tr>
          )}
          {softwareActivation.map((software, id1) => (
            <tr key={id1}>
              <td>{id1 + 1}</td>
              <td>{software.user_name}</td>
              <td>{software.name}</td>
              <td>{software.title}</td>
              <td>
                {moment(software.requested_date).format(
                  "DD/MM/YYYY | h:mm:ss a"
                )}
              </td>
              <td
                className={`text-${
                  +software.status === 0 ? "warning" : "danger"
                }`}
              >
                {+software.status === 0 ? "Pending" : "Approved"}
              </td>
              <td>
                <span className="d-align gap-2">
                  <TooltipComponent title={"View Details"}>
                    <Link
                      to={`/SoftwareActivation/ViewSoftwareDetails/${software.id}`}
                    >
                      <span className="social-btn-re d-align gap-2 px-3 w-auto success-combo">
                        <BsEyeFill />
                      </span>
                    </Link>
                  </TooltipComponent>
                  <div className="vr hr-shadow"></div>
                  <TooltipComponent title={"Reject"}>
                    <span
                      onClick={() => handleRejectedRemarks(software.id)}
                      className="social-btn-re d-align gap-2 px-3 w-auto red-combo"
                    >
                      <BsXLg />
                    </span>
                  </TooltipComponent>
                  <div className="vr hr-shadow"></div>
                  <TooltipComponent title={"Approve"}>
                    <span
                      onClick={() => handleApprovedRemarks(software.id)}
                      className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
                    >
                      <BsCheckLg />
                    </span>
                  </TooltipComponent>
                  <div className="vr hr-shadow"></div>
                  <TooltipComponent title={"Delete"}>
                    <span
                      onClick={() => {
                        setIdToDelete(`${software.id}`);
                        setShowAlert(true);
                      }}
                      className="social-btn-re d-align gap-2 px-3 w-auto red-combo"
                    >
                      <BsTrash />
                    </span>
                  </TooltipComponent>
                </span>
              </td>
            </tr>
          ))}
        </tbody>

        <ConfirmAlert
          size={"sm"}
          deleteFunction={handleDelete}
          hide={setShowAlert}
          show={showAlert}
          title={"Confirm Delete"}
          description={"Are you sure you want to delete this!!"}
        />
      </Table>
      <ReactPagination
        pageSize={pageSize}
        prevClassName={
          pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
        }
        nextClassName={
          softwareActivation.length < pageSize
            ? "danger-combo-disable pe-none"
            : "success-combo"
        }
        title={`Showing ${pageDetail?.pageStartResult || 0} to ${
          pageDetail?.pageEndResult || 0
        } of ${pageDetail?.total || 0}`}
        handlePageSizeChange={handlePageSizeChange}
        prevonClick={() => setPageNo(pageNo - 1)}
        nextonClick={() => setPageNo(pageNo + 1)}
      />

      <Formik
        enableReinitialize={true}
        initialValues={{
          remarks: "",
        }}
        // validationSchema={addRolesSchema}
        onSubmit={handleApproved}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={approvedRemarks}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setApprovedRemarks(false)}
            title={"Add Remark"}
          >
            <Row className="g-3">
              <Form.Group as={Col} md={12}>
                <Form.Label>Upload Screenshot</Form.Label>
                <Form.Control
                  type="file"
                  name={"image"}
                  onChange={(e) => handleFileChange(e, props.setFieldValue)}
                />
              </Form.Group>
              <Form.Group>
                {/* <Form.Label>Remarks</Form.Label> */}
                <TextareaAutosize
                  minRows={3}
                  placeholder="type remarks..."
                  onChange={props.handleChange}
                  name="remark"
                  className="edit-textarea"
                />
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
      <Formik
        enableReinitialize={true}
        initialValues={{
          remarks: "",
        }}
        // validationSchema={addRolesSchema}
        onSubmit={handleRejected}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={rejectedRemarks}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setRejectedRemarks(false)}
            title={"Add Remark"}
          >
            <Form.Group>
              <TextareaAutosize
                minRows={3}
                placeholder="type remarks..."
                onChange={props.handleChange}
                name="remark"
                className="edit-textarea"
              />
            </Form.Group>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default PendingRequest;
