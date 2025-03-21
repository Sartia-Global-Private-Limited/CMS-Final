import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent";
import { FieldArray, ErrorMessage, Formik, Field } from "formik";
import { Card, Col, Form, Image, Spinner, Table } from "react-bootstrap";
import TooltipComponent from "../../components/TooltipComponent";
import { BsCloudUpload, BsDashLg, BsPlusLg, BsTrash } from "react-icons/bs";
import ImageViewer from "../../components/ImageViewer";
import {
  getDetailsofComplaintsInMeasurement,
  postHardCopiesInMeasurements,
  updateHardCopiesInMeasurements,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import FormLabelText from "../../components/FormLabelText";

export default function HardCopyAttachment() {
  const location = useLocation();
  const navigate = useNavigate();
  const complaint_id = location?.state?.complaint_id;
  const type = location?.state?.type;
  const [edit, setEdit] = useState();

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const modified = !edit
      ? values.docs.map((d) => {
          return { file: d.file, title: d.title };
        })
      : values.docs.map((d) => {
          return { file: d.file, title: d.title, fileFormat: d.fileFormat };
        });
    const sData = !edit
      ? { docs: modified, complaint_id }
      : { docs: modified, id: edit.attachment_details[0]?.id };
    // return console.log(sData);
    const res = !edit
      ? await postHardCopiesInMeasurements(sData)
      : await updateHardCopiesInMeasurements(sData);
    if (res.status) {
      toast.success(res.message);
      navigate(-1);
      resetForm();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  };

  const fetchExpenseRequestData = async () => {
    const res = await getDetailsofComplaintsInMeasurement(complaint_id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit();
    }
  };

  useEffect(() => {
    if (type) fetchExpenseRequestData();
  }, []);

  const getAttachmentFormatAndLink = (files, index) => {
    const file = files[index];
    const type = files[index]?.fileDetails?.name ? "new" : "edit";

    if (type == "new") {
      const url = files[index]?.file;

      if (
        file?.fileDetails?.name.split(".")?.[1] == "png" ||
        file?.fileDetails?.name.split(".")?.[1] == "jpeg" ||
        file?.fileDetails?.name.split(".")?.[1] == "jpg" ||
        file?.fileDetails?.name.split(".")?.[1] == "jfif"
      )
        return { url, type: "image" };
      else if (file?.fileDetails?.name.split(".")?.[1] == "pdf")
        return { url, type: "pdf" };
      else if (
        file?.fileDetails?.name.split(".")?.[1] == "doc" ||
        file?.fileDetails?.name.split(".")?.[1] == "docx"
      )
        return { url, type: "document" };
    } else {
      const url = `${process.env.REACT_APP_API_URL}${file.file}`;
      if (
        file.file?.split(".")?.[1] == "png" ||
        file.file?.split(".")?.[1] == "jpeg" ||
        file.file?.split(".")?.[1] == "jpg" ||
        file.file?.split(".")?.[1] == "jfif"
      )
        return { url, type: "image" };
      else if (file.file?.split(".")?.[1] == "pdf") return { url, type: "pdf" };
      else if (
        file.file?.split(".")?.[1] == "doc" ||
        file.file?.split(".")?.[1] == "docx"
      )
        return { url, type: "document" };
    }
  };

  if (type && !edit?.attachment_details[0]?.filePath) return "loading...";
  return (
    <>
      <Col md={12}>
        <CardComponent showBackButton={"true"} title={"Attach Hard Copy"}>
          <Formik
            initialValues={{
              docs: type
                ? edit?.attachment_details[0]?.filePath
                : [
                    {
                      file: "",
                      title: "",
                    },
                  ],
            }}
            onSubmit={handleSubmit}
          >
            {(props) => (
              <form onSubmit={props.handleSubmit}>
                <FieldArray name={`docs`}>
                  {({ push: pushDocument, remove: removeDocument }) => (
                    <>
                      {props?.values?.docs?.length > 0 && (
                        <div className="table-scroll mh-100">
                          <Table
                            striped
                            hover
                            className="text-body bg-new Roles"
                          >
                            <thead>
                              <tr>
                                <th>Bill Image</th>
                                <th>Preview</th>
                                <th>Title</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {props?.values?.docs?.map((itm, index) => (
                                <tr key={index}>
                                  <td>
                                    <div
                                      style={{
                                        border:
                                          "0.1em dashed rgb(204, 204, 204)",
                                      }}
                                      className="shadow text-white text-center p-1"
                                    >
                                      <label className="bg-info cursor-pointer d-block bg-gradient py-1">
                                        <BsCloudUpload fontSize={18} /> Upload
                                        Document
                                        <Form.Control
                                          type="file"
                                          accept="image/*"
                                          className="d-none"
                                          name={`docs`}
                                          onChange={(e) => {
                                            const file = e?.target?.files[0];
                                            if (file.size > 1000000 * 5) {
                                              return toast.error(
                                                "File size Is Too Large"
                                              );
                                            }

                                            if (file) {
                                              const reader = new FileReader();

                                              props.setFieldValue(
                                                `docs[${index}].fileDetails`,
                                                file
                                              );

                                              reader.onload = async (file) => {
                                                await props.setFieldValue(
                                                  `docs[${index}].file`,
                                                  file.target.result
                                                );
                                              };
                                              reader.readAsDataURL(file);
                                            }
                                          }}
                                        />
                                      </label>

                                      <ErrorMessage
                                        name={`docs[${index}].file`}
                                        component="small"
                                        className="text-danger"
                                      />
                                    </div>
                                  </td>

                                  <td>
                                    {getAttachmentFormatAndLink(
                                      props.values.docs,
                                      index
                                    ) &&
                                      (getAttachmentFormatAndLink(
                                        props.values.docs,
                                        index
                                      )?.type == "image" ? (
                                        <div className="position-relative">
                                          <ImageViewer
                                            src={
                                              getAttachmentFormatAndLink(
                                                props.values.docs,
                                                index
                                              )?.url
                                            }
                                          >
                                            <Image
                                              style={{
                                                height: "120px",
                                                width: "100%",
                                                maxWidth: "100%",
                                              }}
                                              className="object-fit mt-1"
                                              src={
                                                getAttachmentFormatAndLink(
                                                  props.values.docs,
                                                  index
                                                )?.url
                                              }
                                            />
                                          </ImageViewer>
                                        </div>
                                      ) : getAttachmentFormatAndLink(
                                          props.values.docs,
                                          index
                                        ).type == "pdf" ? (
                                        <>
                                          <a
                                            href={
                                              getAttachmentFormatAndLink(
                                                props.values?.docs,
                                                index
                                              ).url
                                            }
                                            target="_blank"
                                            rel="noreferrer"
                                          >
                                            <Card.Img
                                              width={200}
                                              height={100}
                                              className="object-fit"
                                              src={`/assets/images/pdf.jpg`}
                                            />
                                          </a>
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          <a
                                            href={
                                              getAttachmentFormatAndLink(
                                                props.values?.docs,
                                                index
                                              ).url
                                            }
                                            download={true}
                                          >
                                            <Card.Img
                                              width={200}
                                              height={130}
                                              className="object-fit"
                                              src={`/assets/images/docs.png`}
                                            />
                                          </a>
                                        </>
                                      ))}
                                  </td>

                                  <td>
                                    <Form.Control
                                      name={`docs[${index}].title`}
                                      value={itm.title}
                                      onChange={props.handleChange}
                                      onBlur={props.handleBlur}
                                    />
                                    <ErrorMessage
                                      name={`docs[${index}].title`}
                                      component="small"
                                      className="text-danger"
                                    />
                                  </td>
                                  <td className="text-center">
                                    {props?.values?.docs?.length > 1 ? (
                                      <TooltipComponent title={"Remove"}>
                                        <BsDashLg
                                          onClick={() => removeDocument(index)}
                                          className={`social-btn red-combo`}
                                        />
                                      </TooltipComponent>
                                    ) : null}
                                  </td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={15}>
                                  <div className="text-end d-flex justify-content-between">
                                    <span>
                                      <FormLabelText
                                        info
                                        children={
                                          "Attach Documents : DOC, DOCX, PDF, PNG, JPEG, JPG"
                                        }
                                      />
                                    </span>
                                    <TooltipComponent title={"Add"}>
                                      <span
                                        className={`social-btn w-auto success-combo `}
                                        onClick={() => {
                                          pushDocument({
                                            file: null,
                                            title: "",
                                          });
                                        }}
                                      >
                                        <BsPlusLg /> Add More
                                      </span>
                                    </TooltipComponent>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      )}
                    </>
                  )}
                </FieldArray>
                <div className="mt-4 text-center">
                  <button
                    type={"submit"}
                    className={`shadow border-0  cursor-pointer px-4 py-1 purple-combo `}
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
                      <>Save</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
}
