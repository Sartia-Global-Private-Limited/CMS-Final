import React, { useEffect, useState } from "react";
import { Col, Form, FormText, Row, Spinner } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Select from "react-select";
import {
  AdminCreateSurveyItemMaster,
  AdminSingleSurveyItemMasterById,
  AdminUpdateSurveyItemMaster,
  postCheckItemUniqueIdExists,
} from "../../services/authapi";
import { ErrorMessage, Formik } from "formik";
import ConfirmAlert from "../../components/ConfirmAlert";
import { addSurveyItemMasterSchema } from "../../utils/formSchema";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import EditorToolbar, {
  formats,
  modules,
} from "../../components/EditorToolbar";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAllSuppliers,
  getAllUnitMasterForDropdown,
} from "../../services/contractorApi";
import ImageViewer from "../../components/ImageViewer";

const CreateSurveyItemMaster = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [suppliersData, setSuppliersData] = useState([]);
  const [unitMasterData, setUnitMasterData] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchContactsData = async () => {
    const res = await AdminSingleSurveyItemMasterById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  const fetchSuppliersData = async () => {
    const isDropdown = "false";
    const res = await getAllSuppliers({ isDropdown });
    if (res.status) {
      setSuppliersData(res.data);
    } else {
      setSuppliersData([]);
    }
  };
  const fetchUnitMasterData = async () => {
    const res = await getAllUnitMasterForDropdown();
    if (res.status) {
      setUnitMasterData(res.data);
    } else {
      setUnitMasterData([]);
    }
  };

  const handleBlur = async (value, props) => {
    const sData = {
      item_unique_id: value,
    };
    // return console.log("sData", sData);
    if (value) {
      const res = await postCheckItemUniqueIdExists(sData);
      if (res.status) {
        toast.warn(res.message);
        props.handleChange({ target: { name: "item_unique_id", value: "" } });
      }
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("supplier_id", values.supplier_id.value);
    formData.append("rate", values.rate);
    formData.append("qty", values.qty);
    formData.append("hsncode", values.hsncode);
    formData.append("rucode", values.rucode);
    formData.append("item_unique_id", values.item_unique_id);
    formData.append("unit_id", values.unit_id.value);
    formData.append("description", values.description);
    formData.append("image", values.image);

    // return console.log("formData", ...formData);

    if (edit.id) {
      formData.append("id", edit.id);
    }
    const res = edit?.id
      ? await AdminUpdateSurveyItemMaster(formData)
      : await AdminCreateSurveyItemMaster(formData);
    if (res.status) {
      toast.success(res.message);
      resetForm();
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    if (id !== "new") {
      fetchContactsData();
    }
    fetchSuppliersData();
    fetchUnitMasterData();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>
          {edit.id ? "Update Item Master" : "Add Item Master"} · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={edit.id ? "Update Item Master" : "Add Item Master"}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              supplier_id: edit?.supplier_id
                ? {
                    label: edit?.supplier_name,
                    value: edit?.supplier_id,
                  }
                : "",
              unit_id: edit?.unit_id
                ? {
                    label: edit?.unit_name,
                    value: edit?.unit_id,
                  }
                : "",
              hsncode: edit?.hsncode || "",
              rucode: edit?.rucode || "",
              item_unique_id: edit?.unique_id || "",
              description: edit?.description || "",
              name: edit?.name || "",
              rate: edit?.rate || "",
              qty: edit?.qty || "",
              image: edit.image || "",
            }}
            validationSchema={addSurveyItemMasterSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <Row className="align-items-center g-3">
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      Supplier Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      autoFocus
                      className="text-primary"
                      name="supplier_id"
                      value={props.values.supplier_id}
                      onChange={(val) =>
                        props.setFieldValue("supplier_id", val)
                      }
                      options={suppliersData?.map((typ) => ({
                        value: typ.id,
                        label: typ.supplier_name,
                      }))}
                    />
                    <ErrorMessage
                      name="supplier_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      Unit Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      menuPortalTarget={document.body}
                      autoFocus
                      className="text-primary"
                      name="unit_id"
                      value={props.values.unit_id}
                      onChange={(val) => props.setFieldValue("unit_id", val)}
                      options={unitMasterData?.map((itm) => ({
                        label: itm.name,
                        value: itm.id,
                      }))}
                    />
                    <ErrorMessage
                      name="unit_id"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      Name <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"name"}
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.name && props.errors.name
                      )}
                    />
                    <ErrorMessage
                      name="name"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      Rate <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      step="any"
                      name={"rate"}
                      value={props.values.rate}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.rate && props.errors.rate
                      )}
                    />
                    <ErrorMessage
                      name="rate"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      Qty <span className="text-danger">*</span>
                    </Form.Label>
                    <div className="d-flex h-100">
                      <div
                        className="shadow cursor-pointer d-align red-combo px-2"
                        onClick={() => {
                          if (+props.values.qty > 1) {
                            props.setFieldValue("qty", +props.values.qty - 1);
                          }
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
                        isInvalid={Boolean(
                          props.touched.qty && props.errors.qty
                        )}
                      />
                      <div
                        className="shadow cursor-pointer d-align success-combo px-2"
                        onClick={() => {
                          props.setFieldValue("qty", +props.values.qty + 1);
                        }}
                      >
                        <BsPlusLg />
                      </div>
                    </div>
                    <ErrorMessage
                      name="qty"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      hsncode <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"hsncode"}
                      value={props.values.hsncode}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.hsncode && props.errors.hsncode
                      )}
                    />
                    <ErrorMessage
                      name="hsncode"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>
                      rucode <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name={"rucode"}
                      value={props.values.rucode}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      isInvalid={Boolean(
                        props.touched.rucode && props.errors.rucode
                      )}
                    />
                    <ErrorMessage
                      name="rucode"
                      component="small"
                      className="text-danger"
                    />
                  </Form.Group>
                  <Form.Group as={Col} md={4}>
                    <Form.Label>item unique id</Form.Label>
                    <Form.Control
                      type="text"
                      name={"item_unique_id"}
                      value={props.values.item_unique_id}
                      disabled={Boolean(edit?.id)}
                      maxLength={10}
                      onChange={props.handleChange}
                      onBlur={(e) => handleBlur(e.target.value, props)}
                    />
                    {edit?.id ? null : (
                      <FormText>Note: leave empty for autogenerate.</FormText>
                    )}
                  </Form.Group>

                  <Form.Group as={Col} md={4}>
                    <Form.Label>Upload Image</Form.Label>
                    <div className={"d-flex align-items-center gap-2"}>
                      {edit.id || selectedFile ? (
                        <div
                          className="shadow p-1 success-combo"
                          style={{ borderRadius: "3px" }}
                        >
                          <ImageViewer
                            src={
                              selectedFile &&
                              selectedFile.type.startsWith("image/")
                                ? URL.createObjectURL(selectedFile)
                                : edit.image
                                ? process.env.REACT_APP_API_URL + edit.image
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <img
                              width={35}
                              height={35}
                              className="object-fit"
                              src={
                                (selectedFile &&
                                  selectedFile.type.startsWith("image/") &&
                                  URL.createObjectURL(selectedFile)) ||
                                process.env.REACT_APP_API_URL + edit?.image
                              }
                            />
                          </ImageViewer>
                        </div>
                      ) : null}
                      <Form.Control
                        type="file"
                        name="image"
                        onChange={(e) => {
                          setSelectedFile(e.currentTarget.files[0]);
                          props.setFieldValue("image", e.target.files[0]);
                        }}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group as={Col} md={12}>
                    <Form.Label>
                      {/* Description <span className="text-danger">*</span> */}
                      Description
                    </Form.Label>
                    <EditorToolbar />
                    <ReactQuill
                      style={{ height: "200px" }}
                      placeholder={"Write something awesome..."}
                      modules={modules}
                      formats={formats}
                      theme="snow"
                      name={"description"}
                      value={props.values.description}
                      onChange={(getContent) => {
                        props.setFieldValue("description", getContent);
                      }}
                    />
                    {/* <ErrorMessage
                      name="description"
                      component="small"
                      className="text-danger"
                    /> */}
                  </Form.Group>

                  <Form.Group as={Col} md={12}>
                    <div className="mt-4 text-center">
                      <button
                        type={`${edit.id ? "button" : "submit"}`}
                        onClick={() => setShowAlert(edit.id && true)}
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
                          <>{edit.id ? "UPDATE" : "CREATE"}</>
                        )}
                      </button>
                      <ConfirmAlert
                        size={"sm"}
                        deleteFunction={
                          props.isValid
                            ? props.handleSubmit
                            : setShowAlert(false)
                        }
                        hide={setShowAlert}
                        show={showAlert}
                        title={"Confirm UPDATE"}
                        description={"Are you sure you want to update this!!"}
                      />
                    </div>
                  </Form.Group>
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateSurveyItemMaster;
