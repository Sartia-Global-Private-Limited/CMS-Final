import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsDashLg, BsPlus, BsPlusLg } from "react-icons/bs";
import ActionButton from "../../components/ActionButton";
import CardComponent from "../../components/CardComponent";
import ImageViewer from "../../components/ImageViewer";
import Modaljs from "../../components/Modal";
import {
  AdminCreateSurveyItemMaster,
  AdminDeleteSurveyItemMaster,
  AdminUpdateSurveyItemMaster,
  getAdminAllSurveyItemMaster,
} from "../../services/authapi";
import { Formik } from "formik";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addSurveyItemMasterSchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import ReactPagination from "../../components/ReactPagination";

const SurveyItemMaster = () => {
  const [smShow, setSmShow] = useState(false);
  const [itemMasterData, setItemMasterData] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [qty, setQty] = useState(0);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchAllSurveyData = async () => {
    const res = await getAdminAllSurveyItemMaster({ search, pageSize, pageNo });
    if (res.status) {
      setItemMasterData(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setItemMasterData([]);
      setPageDetail({});
    }
  };

  const handleEdit = async (data) => {
    setEdit(data);
    setSmShow(true);
  };

  const handleDelete = async () => {
    const res = await AdminDeleteSurveyItemMaster(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setItemMasterData((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("image", e.target.files[0]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("rate", values.rate);
    formData.append("qty", values.qty);
    formData.append("image", values.image);
    if (edit.id) {
      formData.append("id", values.id);
    }
    const res = edit?.id
      ? await AdminUpdateSurveyItemMaster(formData)
      : await AdminCreateSurveyItemMaster(formData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      setSmShow(false);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
    fetchAllSurveyData();
  };

  useEffect(() => {
    fetchAllSurveyData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Item Master · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"Item Master"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          link={`/SurveyItemMaster/create-survey-item-master/new`}
          icon={<BsPlus />}
          tag={"Create"}
        >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new  Roles">
              <thead className="text-truncate">
                <tr>
                  {["S.No", "Name", "Rate", "Qty", "Item Image", "Action"].map(
                    (thead) => (
                      <th key={thead}>{thead}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {itemMasterData.length > 0 ? null : (
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
                {itemMasterData.map((data, index) => (
                  <tr key={index}>
                    <td>{serialNumber[index]}</td>
                    <td>{data.name}</td>
                    <td>₹ {data.rate}</td>
                    <td>{data.qty}</td>
                    <td>
                      <ImageViewer
                        src={`${process.env.REACT_APP_API_URL}${data.image}`}
                      >
                        <img
                          width={50}
                          height={50}
                          className="my-bg object-fit p-1 rounded"
                          src={`${process.env.REACT_APP_API_URL}${data.image}`}
                        />
                      </ImageViewer>
                    </td>
                    <td>
                      <ActionButton
                        deleteOnclick={() => {
                          setIdToDelete(data.id);
                          setShowAlert(true);
                        }}
                        hideEye={"d-none"}
                        editlink={`/SurveyItemMaster/create-survey-item-master/${data.id}`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <ReactPagination
              pageSize={pageSize}
              prevClassName={
                pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
              }
              nextClassName={
                pageSize == pageDetail?.total
                  ? itemMasterData.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : itemMasterData.length < pageSize
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
          id: edit?.id || "",
          name: edit?.name || "",
          rate: edit?.rate || "",
          qty: edit?.qty || "",
          image: edit.image || null,
        }}
        validationSchema={addSurveyItemMasterSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={smShow}
            size={"sm"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "Save"}
            close={() => setSmShow(false)}
            title={edit.id ? "Update Item Master" : "Create Item Master"}
          >
            <Row className="align-items-center g-2">
              <Form.Group as={Col} md={12}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name={"name"}
                  value={props.values.name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.name && props.errors.name)}
                />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Rate</Form.Label>
                <Form.Control
                  type="number"
                  step="any"
                  name={"rate"}
                  value={props.values.rate}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.rate && props.errors.rate)}
                />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Qty</Form.Label>
                <div className="d-flex h-100">
                  <div
                    className="shadow cursor-pointer d-align red-combo px-2"
                    onClick={() => {
                      setQty(qty - 1);
                      props.setFieldValue("qty", qty - 1);
                    }}
                  >
                    <BsDashLg />
                  </div>
                  <Form.Control
                    type="number"
                    step="any"
                    name={"qty"}
                    value={props.values.qty}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                    isInvalid={Boolean(props.touched.qty && props.errors.qty)}
                  />
                  <div
                    className="shadow cursor-pointer d-align success-combo px-2"
                    onClick={() => {
                      setQty(qty + 1);
                      props.setFieldValue("qty", qty + 1);
                    }}
                  >
                    <BsPlusLg />
                  </div>
                </div>
              </Form.Group>

              {edit.id ? (
                <Form.Group as={Col} md={3}>
                  <img
                    width={50}
                    height={50}
                    className="my-bg mb-2 object-fit p-1 rounded"
                    src={`${process.env.REACT_APP_API_URL}/${edit?.image}`}
                    alt={edit?.name}
                  />{" "}
                </Form.Group>
              ) : null}
              <Form.Group as={Col} md={edit.id ? 9 : 12}>
                {!edit.id ? <Form.Label>Upload Image</Form.Label> : null}
                <Form.Control
                  type="file"
                  name={"image"}
                  onChange={(e) => handleFileChange(e, props.setFieldValue)}
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

export default SurveyItemMaster;
