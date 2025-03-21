import React, { Fragment, useEffect, useState } from "react";
import { Col, Form, Image, Row, Spinner } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { IoCameraOutline, IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { useParams } from "react-router-dom";
import {
  getAdminAllTaskComment,
  getAdminCreateTaskComment,
  getAdminTaskStatus,
  getAdminUpdateTaskComment,
} from "../../services/authapi";
import Select from "react-select";
import moment from "moment";
import { toast } from "react-toastify";
import TextareaAutosize from "react-textarea-autosize";
import { Formik } from "formik";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import ImageViewer from "../../components/ImageViewer";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { UserDetail, UserDetails } from "../../components/ItemDetail";
import { getDateValue } from "../../utils/helper";
import { BsChatRightText } from "react-icons/bs";

const TaskView = () => {
  const { id } = useParams();
  const { user } = useSelector(selectUser);
  const [edit, setEdit] = useState({});
  const [taskData, setTaskData] = useState([]);
  const [expandedIds, setExpandedIds] = useState([]);
  const { t } = useTranslation();

  const fetchAllTaskCommentData = async () => {
    const res = await getAdminAllTaskComment(id);
    if (res?.status) setTaskData(res.data);
    else setTaskData([]);
  };

  const fetchTaskStatusData = async (task_id, status) => {
    const res = await getAdminTaskStatus(task_id, status);
    toast[res?.status ? "success" : "error"](res.message);
    if (res.status) fetchAllTaskCommentData();
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => formData.append(key, values[key]));
    const res = edit.task_comments_id
      ? await getAdminUpdateTaskComment(formData)
      : await getAdminCreateTaskComment(formData);
    toast[res?.status ? "success" : "error"](res.message);
    if (res.status) fetchAllTaskCommentData();
    resetForm();
    setEdit({});
    setSubmitting(false);
  };

  const toggleReadMore = (id) =>
    setExpandedIds((prevIds) =>
      prevIds.includes(id)
        ? prevIds.filter((prevId) => prevId !== id)
        : [...prevIds, id]
    );

  useEffect(() => {
    fetchAllTaskCommentData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Task Manager · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <CardComponent title={t("View Task")} className="after-bg-light">
          <Row className="g-3">
            <Col md={7}>
              <Row className="g-3">
                <Col md={12}>
                  <div className="d-grid shadow rounded gap-3 p-2">
                    <div className="border-top border-3 rounded-top border-orange p-2">
                      <div className="d-flex justify-content-between align-items-center">
                        <UserDetail
                          img={taskData?.assign_user_image}
                          id={taskData?.assign_to}
                          name={taskData?.assign_user_name}
                          unique_id={taskData?.assign_employee_id}
                          login_id={user?.id}
                        />

                        <Select
                          menuPosition="fixed"
                          name="status"
                          options={[
                            { value: "assign", label: "Assign" },
                            { value: "in progress", label: "In Progress" },
                            { value: "completed", label: "Completed" },
                          ]}
                          value={{
                            value: taskData.status,
                            label: taskData.status,
                          }}
                          onChange={(selectedOption) =>
                            selectedOption?.value !== "assign" &&
                            fetchTaskStatusData(id, selectedOption.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="p-2">
                      <table className="table-sm table">
                        <tbody className="text-wrap">
                          {[
                            { label: t("Task Name"), value: taskData.title },
                            {
                              label: t("Project Name"),
                              value: taskData.project_name,
                            },
                            {
                              label: t("Task Category"),
                              value: taskData.task_category_name,
                            },
                            {
                              label: t("Start Date"),
                              value: getDateValue(taskData.start_date),
                            },
                            {
                              label: t("Deadline"),
                              value: getDateValue(taskData.end_date),
                            },
                            {
                              label: t("Task Collaborators"),
                              value: (
                                <div className="d-grid gap-2">
                                  {taskData?.collaborators_list?.map(
                                    (list, idx) => (
                                      <Fragment key={idx}>
                                        <UserDetail
                                          img={list?.image}
                                          id={list?.id}
                                          name={list?.name}
                                          unique_id={list?.employee_id}
                                          login_id={user?.id}
                                        />
                                      </Fragment>
                                    )
                                  )}
                                </div>
                              ),
                            },
                          ].map((item, idx) => (
                            <tr key={idx}>
                              <th className="align-middle">{item?.label} :</th>
                              <td className="align-middle">
                                {item?.value || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <Formik
                        enableReinitialize
                        initialValues={{
                          task_id: id,
                          user_id: user?.id || "",
                          remark: edit.remark || "",
                          status: edit.status
                            ? { label: edit.status, value: edit.status }
                            : "",
                          attachment: edit.attachment || null,
                        }}
                        onSubmit={handleSubmit}
                      >
                        {({
                          handleSubmit,
                          handleChange,
                          setFieldValue,
                          values,
                          isSubmitting,
                        }) => (
                          <Form onSubmit={handleSubmit}>
                            <Form.Group as={Col} md={12} className="my-4">
                              <div className="form-shadow position-relative">
                                <TextareaAutosize
                                  onChange={handleChange}
                                  minRows={4}
                                  className="shadow-none edit-textarea resize-none"
                                  name="remark"
                                  value={values.remark}
                                  placeholder={t("Write a Comment...")}
                                  required
                                />
                                <div className="p-3 d-flex justify-content-between">
                                  <Form.Label
                                    htmlFor="filedata"
                                    className="cursor-pointer"
                                  >
                                    <span className="shadow purple-combo px-3 py-1">
                                      <IoCameraOutline /> {t("Upload File")}
                                    </span>
                                    <Form.Control
                                      id="filedata"
                                      className="d-none"
                                      type="file"
                                      accept="image/png, image/jpeg"
                                      name="attachment"
                                      onChange={(e) =>
                                        setFieldValue(
                                          "attachment",
                                          e.target.files[0]
                                        )
                                      }
                                    />
                                  </Form.Label>
                                  <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="shadow border-0 success-combo px-3 py-1"
                                  >
                                    {isSubmitting ? (
                                      <>
                                        <Spinner
                                          animation="border"
                                          variant="primary"
                                          size="sm"
                                        />{" "}
                                        {t("PLEASE WAIT")}...
                                      </>
                                    ) : (
                                      <>
                                        <IoSend /> {t("Send")}
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </Form.Group>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>

            <Col md={5} className="sidebar">
              <SimpleBar className="shadow rounded area">
                <div className="last-child-none d-grid align-items-center px-3">
                  {taskData?.comments?.length ? (
                    taskData.comments.map((activity, id1) => (
                      <div key={id1} className="py-3 hr-border2">
                        <div className="d-flex justify-content-between">
                          <UserDetail
                            img={activity?.user_image}
                            id={activity?.user_id}
                            name={activity?.user_name}
                            unique_id={activity?.user_employee_id}
                            login_id={user?.id}
                          />
                          <small className="text-muted">
                            {moment(activity.task_comment_date).format(
                              "DD-MM-YYYY | h:mm:ss a"
                            )}
                          </small>
                        </div>

                        <div className="ms-2 d-grid gap-2">
                          <div>
                            <BsChatRightText />{" "}
                            <span className="fs-11 text-gray">
                              {expandedIds.includes(id1)
                                ? activity.remark
                                : `${activity.remark.slice(0, 150)}...`}
                            </span>
                            {activity.remark.length > 150 && (
                              <div className="text-center mt-2">
                                <span
                                  className={`social-btn-re px-3 w-auto ${
                                    expandedIds.includes(id1)
                                      ? "danger-combo"
                                      : "success-combo"
                                  }`}
                                  onClick={() => toggleReadMore(id1)}
                                >
                                  {expandedIds.includes(id1)
                                    ? t("READ LESS")
                                    : t("READ MORE")}
                                </span>
                              </div>
                            )}
                          </div>
                          {activity.attachment && (
                            <div className="d-flex justify-content-between">
                              <ImageViewer
                                downloadIcon
                                href={
                                  process.env.REACT_APP_API_URL +
                                  activity.attachment
                                }
                                src={
                                  process.env.REACT_APP_API_URL +
                                  activity.attachment
                                }
                              >
                                <img
                                  src={
                                    process.env.REACT_APP_API_URL +
                                    activity.attachment
                                  }
                                  className="my-btn object-fit"
                                />
                              </ImageViewer>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <h6 className="text-center mt-5 mb-5">
                      {t("No Comments Found!")}
                    </h6>
                  )}
                </div>
              </SimpleBar>
            </Col>
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default TaskView;
