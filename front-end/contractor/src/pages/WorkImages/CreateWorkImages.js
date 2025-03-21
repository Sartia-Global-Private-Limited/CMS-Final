import React, { useEffect, useState } from "react";
import { Formik, FieldArray, Field, ErrorMessage } from "formik";
import { Row, Col, Form, Table, Spinner, Image } from "react-bootstrap";
import ImageViewer from "../../components/ImageViewer";
import Select from "react-select";
import TextareaAutosize from "react-textarea-autosize";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import CardComponent from "../../components/CardComponent";
import {
  getAllComplaintIdList,
  getSingleWorkImagesById,
  postWorkImages,
  updateWorkImages,
} from "../../services/contractorApi";
import { addWorkImagesSchema } from "../../utils/formSchema";
import { BsCloudUpload, BsDashLg, BsPlusLg } from "react-icons/bs";
import TooltipComponent from "../../components/TooltipComponent";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useTranslation } from "react-i18next";

const CreateWorkImages = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || null;
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [complaintData, setComplaintData] = useState([]);
  const [edit, setEdit] = useState({});

  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleWorkImagesById(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  const fetchComplaints = async () => {
    const res = await getAllComplaintIdList();
    if (res.status) {
      setComplaintData(res.data);
    } else {
      setComplaintData([]);
    }
  };

  useEffect(() => {
    fetchComplaints();
    if (id !== "new") {
      fetchSingleData();
    }
  }, [id]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = {
      ...values,
      complaint_id: values.complaint_id.value,
    };

    if (edit?.id) {
      formData.id = edit?.id;
    }

    const res = edit?.id
      ? await updateWorkImages(formData)
      : await postWorkImages(formData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  const renderImageSection = (name, data, index, props) => {
    return (
      <Col md={12}>
        <div className="shadow p-2">
          <span className="fw-bold">{name.replace("_", " ")}</span>
          <div
            style={{
              border: "0.1em dashed rgb(204, 204, 204)",
            }}
            className="form-shadow text-white text-center p-1"
          >
            {data.file && (
              <ImageViewer
                src={
                  data?.file?.startsWith("/complaint_images")
                    ? process.env.REACT_APP_API_URL + data.file
                    : data.file
                }
              >
                <Image
                  style={{
                    height: "300px",
                    width: "100%",
                    maxWidth: "100%",
                  }}
                  className="object-fit"
                  src={
                    data?.file?.startsWith("/complaint_images")
                      ? process.env.REACT_APP_API_URL + data.file
                      : data.file
                  }
                />
              </ImageViewer>
            )}

            {type !== "View" && (
              <div>
                <label className="bg-info cursor-pointer d-block bg-gradient py-1">
                  <BsCloudUpload fontSize={18} /> {t("Upload Files")}
                  <input
                    type="file"
                    className="d-none"
                    name={`main_image[${index}].${name}.file`}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (file) => {
                          props.setFieldValue(
                            `main_image[${index}].${name}.file`,
                            file.target.result
                          );
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <ErrorMessage
                  name={`main_image[${index}].${name}.file`}
                  component="small"
                  className="text-danger"
                />
              </div>
            )}
          </div>
          <TextareaAutosize
            value={data.title}
            disabled={type === "View" ? true : false}
            className="edit-textarea mt-2"
            maxLength={50}
            placeholder="Image Title"
            name={`main_image[${index}].${name}.title`}
            onChange={props.handleChange}
          />
          <ErrorMessage
            name={`main_image[${index}].${name}.title`}
            component="small"
            className="text-danger"
          />
          <span className="d-flex my-2 gap-2 align-items-center">
            <Form.Control
              disabled={type === "View" ? true : false}
              type="color"
              name={`main_image[${index}].${name}.title_bg_color`}
              value={data.title_bg_color}
              onChange={props.handleChange}
            />
            {t("Title Background Color")}
          </span>
          <span className="d-flex gap-2 align-items-center">
            <Form.Control
              disabled={type === "View" ? true : false}
              type="color"
              name={`main_image[${index}].${name}.title_text_color`}
              value={data.title_text_color}
              onChange={props.handleChange}
            />
            {t("Title Text Color")}
          </span>
          <TextareaAutosize
            value={data.description}
            disabled={type === "View" ? true : false}
            className="edit-textarea mt-2"
            rows={2}
            maxLength={75}
            placeholder="Image Description"
            name={`main_image[${index}].${name}.description`}
            onChange={props.handleChange}
          />
          <ErrorMessage
            name={`main_image[${index}].${name}.description`}
            component="small"
            className="text-danger"
          />
          <span className="d-flex mt-2 gap-2 align-items-center">
            <Form.Control
              disabled={type === "View" ? true : false}
              type="color"
              name={`main_image[${index}].${name}.description_text_color`}
              value={data.description_text_color}
              onChange={props.handleChange}
            />
            {t("Description Text Color")}
          </span>
        </div>
      </Col>
    );
  };

  return (
    <>
      <Helmet>
        <title>
          {edit.id ? `${type === "View" ? "View" : "Update"}` : "Create"} Work
          Image · CMS Electricals
        </title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          className={type === "View" && "after-bg-light"}
          title={`${
            edit.id ? `${type === "View" ? "View" : "Update"}` : "Create"
          } Work Image ${edit?.id ? `by ${edit?.image_upload_by_name}` : ""}`}
        >
          <Formik
            enableReinitialize={true}
            initialValues={{
              main_image: edit?.main_image || [
                {
                  row_title: "",
                  row_title_color: "#5200ff",
                  before_image: {
                    title: "",
                    title_bg_color: "#5200ff",
                    title_text_color: "#ffffff",
                    description: "",
                    description_text_color: "#000000",
                    file: "",
                  },
                  progress_image: {
                    title: "",
                    title_bg_color: "#5200ff",
                    title_text_color: "#ffffff",
                    description: "",
                    description_text_color: "#000000",
                    file: "",
                  },
                  after_image: {
                    title: "",
                    title_bg_color: "#5200ff",
                    title_text_color: "#ffffff",
                    description: "",
                    description_text_color: "#000000",
                    file: "",
                  },
                },
              ],
              complaint_id: edit?.complaint_id
                ? {
                    label: edit?.complaint_unique_id,
                    value: edit?.complaint_id,
                  }
                : "",
              heading_text_color: edit?.heading_text_color || "#CA0707",
              full_slide_color: edit?.full_slide_color || "#000000",
              presentation_title: edit?.presentation_title || "",
            }}
            validationSchema={addWorkImagesSchema}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <Form onSubmit={props?.handleSubmit}>
                <Row className="g-3 align-items-end justify-content-center">
                  <Col md={6}>
                    <p className="mb-1">
                      {type !== "View" && t("Select")} {t("Complaint Id")}
                    </p>
                    <Select
                      isDisabled={type === "View" ? true : false}
                      menuPortalTarget={document.body}
                      autoFocus
                      className="text-primary"
                      name="complaint_id"
                      value={props.values.complaint_id}
                      onChange={(val) => {
                        props.setFieldValue("complaint_id", val);
                      }}
                      options={complaintData?.map((typ) => ({
                        value: typ.complaint_id,
                        label: typ.complaint_unique_id,
                      }))}
                    />
                    <ErrorMessage
                      name="complaint_id"
                      component="small"
                      className="text-danger"
                    />
                  </Col>
                  <Col md={3}>
                    <span className="d-flex gap-2 align-items-center">
                      <Form.Control
                        disabled={type === "View" ? true : false}
                        type="color"
                        name="full_slide_color"
                        value={props.values.full_slide_color}
                        onChange={props.handleChange}
                      />
                      {t("slide Bg Color")}
                    </span>
                  </Col>
                  <Col md={3}>
                    <span className="d-flex gap-2 align-items-center">
                      <Form.Control
                        disabled={type === "View" ? true : false}
                        type="color"
                        name="heading_text_color"
                        value={props.values.heading_text_color}
                        onChange={props.handleChange}
                      />
                      {t("Heading Text Color")}
                    </span>
                  </Col>
                  <Col md={12}>
                    <p className="mb-1">{t("Presentation title")}</p>
                    <Form.Control
                      placeholder="type here..."
                      isDisabled={type === "View" ? true : false}
                      name="presentation_title"
                      value={props.values.presentation_title}
                      onChange={props.handleChange}
                    />
                  </Col>
                  <Col md={12}>
                    <FieldArray name={"main_image"}>
                      {({ push, remove }) => (
                        <div className="border-info border-5 border-top border-bottom shadow">
                          <Table
                            striped
                            hover
                            className="text-body bg-new Roles"
                          >
                            <thead>
                              <tr>
                                <th>{t("No.")}</th>
                                <th className="text-center">
                                  {t("Work Images")}
                                </th>
                                {type !== "View" && <th>{t("Action")}</th>}
                              </tr>
                            </thead>
                            <tbody>
                              {props.values.main_image.map((data, idx) => (
                                <tr key={idx}>
                                  <td className="fw-bold">{idx + 1}</td>
                                  <td>
                                    <span className="d-flex gap-2 align-items-center">
                                      <Field
                                        value={data.row_title}
                                        name={`main_image[${idx}].row_title`}
                                        placeholder={t("Row title")}
                                        type="text"
                                        disabled={
                                          type === "View" ? true : false
                                        }
                                        className="form-control my-2"
                                      />
                                      <Form.Control
                                        value={data.row_title_color}
                                        disabled={
                                          type === "View" ? true : false
                                        }
                                        name={`main_image[${idx}].row_title_color`}
                                        type="color"
                                      />
                                    </span>
                                    <ErrorMessage
                                      name={`main_image[${idx}].row_title`}
                                      component="small"
                                      className="text-danger"
                                    />
                                    <div className="p-1">
                                      <Row className="g-3">
                                        {renderImageSection(
                                          t("before_image"),
                                          data.before_image,
                                          idx,
                                          props
                                        )}
                                        {renderImageSection(
                                          t("progress_image"),
                                          data.progress_image,
                                          idx,
                                          props
                                        )}
                                        {renderImageSection(
                                          t("after_image"),
                                          data.after_image,
                                          idx,
                                          props
                                        )}
                                      </Row>
                                    </div>
                                  </td>
                                  {type !== "View" && (
                                    <td className="text-center">
                                      {idx === 0 ? (
                                        <TooltipComponent title={"Add"}>
                                          <BsPlusLg
                                            onClick={() =>
                                              push({
                                                row_title: "",
                                                row_title_color: "#5200ff",
                                                before_image: {
                                                  title: "",
                                                  title_bg_color: "#5200ff",
                                                  title_text_color: "#ffffff",
                                                  description: "",
                                                  description_text_color:
                                                    "#000000",
                                                  file: "",
                                                },
                                                progress_image: {
                                                  title: "",
                                                  title_bg_color: "#5200ff",
                                                  title_text_color: "#ffffff",
                                                  description: "",
                                                  description_text_color:
                                                    "#000000",
                                                  file: "",
                                                },
                                                after_image: {
                                                  title: "",
                                                  title_bg_color: "#5200ff",
                                                  title_text_color: "#ffffff",
                                                  description: "",
                                                  description_text_color:
                                                    "#000000",
                                                  file: "",
                                                },
                                              })
                                            }
                                            className={`social-btn success-combo`}
                                          />
                                        </TooltipComponent>
                                      ) : (
                                        <TooltipComponent title={"Remove"}>
                                          <BsDashLg
                                            onClick={() => remove(idx)}
                                            className={`social-btn red-combo`}
                                          />
                                        </TooltipComponent>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      )}
                    </FieldArray>
                  </Col>

                  {type !== "View" && (
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
                              />
                              {t("PLEASE WAIT")}...
                            </>
                          ) : (
                            <>{edit.id ? t("UPDATE") : t("CREATE")}</>
                          )}
                        </button>
                        <ConfirmAlert
                          size={"sm"}
                          deleteFunction={props.handleSubmit}
                          hide={setShowAlert}
                          show={showAlert}
                          title={"Confirm UPDATE"}
                          description={"Are you sure you want to update this!!"}
                        />
                      </div>
                    </Form.Group>
                  )}
                </Row>
              </Form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default CreateWorkImages;
