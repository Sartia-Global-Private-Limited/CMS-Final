import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Form, Table, Row } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../components/CardComponent";
import ActionButton from "../components/ActionButton";
import ReactPagination from "../components/ReactPagination";
import Modaljs from "../components/Modal";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import Select from "react-select";
import ConfirmAlert from "../components/ConfirmAlert";
import { addCategoryNameSchema } from "../utils/formSchema";
import {
  deleteProductCategoryById,
  getAllProductCategory,
  postProductCategory,
  updateProductCategory,
} from "../services/contractorApi";

const Vendor = () => {
  const [vendorShow, setVendorShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allVendor, setAllVendor] = useState([]);
  const [edit, setEdit] = useState({});
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchVendorData = async () => {
    const res = await getAllProductCategory(search, pageSize, pageNo);
    if (res.status) {
      setAllVendor(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllVendor([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleEdit = (itm) => {
    setEdit(itm);
    setVendorShow(true);
  };

  const handleDelete = async () => {
    const res = await deleteProductCategoryById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllVendor((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchVendorData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const sData = {
      category_name: values.category_name,
      status: JSON.stringify(values.status.value),
    };

    if (edit.id) {
      sData["id"] = edit.id;
    }

    const res = edit.id
      ? await updateProductCategory(sData)
      : await postProductCategory(sData);
    if (res.status) {
      fetchVendorData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setVendorShow(false);
  };

  useEffect(() => {
    fetchVendorData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <>
      <Helmet>
        <title>Vendor · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={`
            <>
              All - Vendor <code>(don't use it now)</code>
            </>`}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          onclick={() => {
            setEdit({});
            setVendorShow(true);
          }}
          tag={"Create"}
        >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr no.",
                    "Vendor Name",
                    "Status",
                    "Created By",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={4}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : allVendor.length > 0 ? (
                  <>
                    {allVendor?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{itm?.category_name}</td>
                        <td
                          className={`text-${
                            itm?.status === "1" ? "green" : "danger"
                          }`}
                        >
                          {itm?.status === "1" ? "Active" : "InActive"}
                        </td>
                        <td>{itm?.created_by_name}</td>
                        <td>
                          <ActionButton
                            hideEye={"d-none"}
                            deleteOnclick={() => {
                              setIdToDelete(itm.id);
                              setShowAlert(true);
                            }}
                            editOnclick={() => handleEdit(itm)}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={4}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                )}
              </tbody>
            </Table>
            <ReactPagination
              pageSize={pageSize}
              prevClassName={
                pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
              }
              nextClassName={
                allVendor.length < pageSize
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
          </div>
        </CardComponent>
      </Col>
      <Formik
        enableReinitialize={true}
        initialValues={{
          category_name: edit.category_name || "",
          status: edit.status
            ? {
                label: edit.status === "1" ? "Active" : "InActive",
                value: parseInt(edit.status),
              }
            : { label: "Inactive", value: 0 },
        }}
        validationSchema={addCategoryNameSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            open={vendorShow}
            size={"sm"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "ADD"}
            close={() => setVendorShow(false)}
            title={"Vendor"}
            formikProps={props}
          >
            <Row className="g-2">
              <Form.Group md="12">
                <Form.Label>Vendor Name</Form.Label>
                <Form.Control
                  type="text"
                  name={"category_name"}
                  value={props.values.category_name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.category_name && props.errors.category_name
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.category_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group md="12">
                <Form.Label>Status</Form.Label>
                <Select
                  menuPosition="fixed"
                  name={"status"}
                  options={[
                    { label: "Active", value: 1 },
                    { label: "Inactive", value: 0 },
                  ]}
                  value={props.values.status}
                  onChange={(selectedOption) => {
                    props.setFieldValue("status", selectedOption);
                  }}
                />
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik>
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default Vendor;
