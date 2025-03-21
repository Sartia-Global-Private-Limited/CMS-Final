import React, { useEffect, useState } from "react";
import { Col, Form, Row, Table } from "react-bootstrap";
import { BsPlus, BsSearch } from "react-icons/bs";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import Select from "react-select";
import ActionButton from "../../components/ActionButton";
import {
  getAdminAllHREmployees,
  getAdminAllTaskCategory,
  getAdminAllTasklist,
  getAdminCreateTask,
  getAdminDeleteTask,
  getAdminUpdateTask,
  getAllUsers,
} from "../../services/authapi";
import moment from "moment";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Formik } from "formik";
import { addTaskSchema } from "../../utils/formSchema";
import { toast } from "react-toastify";
import ReactPagination from "../../components/ReactPagination";

const AllTask = () => {
  const [viewTask, setviewTask] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [edit, setEdit] = useState({});
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [taskCategory, setTaskCategory] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const [allHrEmployees, setAllHrEmployees] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchTaskListData = async () => {
    const res = await getAdminAllTasklist(search, pageSize, pageNo);
    if (res.status) {
      setTaskList(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setTaskList([]);
      setPageDetail({});
    }
  };

  const fetchTaskCategoryData = async () => {
    const isDropdown = true;
    const res = await getAdminAllTaskCategory({ isDropdown });
    if (res.status) {
      setTaskCategory(res.data);
    } else {
      setTaskCategory([]);
    }
  };

  const handleEdit = async (task) => {
    setEdit(task);
    setviewTask(true);
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteTask(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setTaskList((prev) => prev.filter((itm) => itm.id !== +idToDelete));
      fetchTaskListData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const collaborator = values.collaborators?.map((itm) => itm.value);
    const sData = {
      title: values.title,
      project_name: values.project_name,
      collaborators: collaborator,
      assign_to: values.assign_to.value,
      start_date: values.start_date,
      end_date: values.end_date,
      status: values.status.value,
      category_id: values.category_id.value,
    };
    if (edit.id) {
      sData["id"] = edit.id;
    }
    // return console.log(sData)
    const res = edit.id
      ? await getAdminUpdateTask(sData)
      : await getAdminCreateTask(sData);
    if (res.status) {
      fetchTaskListData();
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setSubmitting(false);
    setviewTask(false);
  };

  const fetchAllUsersData = async () => {
    const res = await getAllUsers();
    if (res.status) {
      setAllUserData(res.data);
    } else {
      setAllUserData([]);
    }
  };

  const fetchAllHrEmployeesData = async () => {
    const isDropdown = "false";
    const res = await getAdminAllHREmployees({ isDropdown });
    if (res.status) {
      setAllHrEmployees(res.data);
    } else {
      setAllHrEmployees([]);
    }
  };

  useEffect(() => {
    fetchTaskListData();
    fetchTaskCategoryData();
    fetchAllUsersData();
    fetchAllHrEmployeesData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  return (
    <Col md={12} data-aos={"fade-up"}>
      <CardComponent
        title={"All Task"}
        search={true}
        searchOnChange={(e) => {
          setSearch(e.target.value);
        }}
        icon={<BsPlus />}
        onclick={() => {
          setEdit({});
          setviewTask(true);
        }}
        tag={"Create"}
      >
        <div className="overflow-auto p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                {[
                  "Sr No.",
                  "Task Category",
                  "Task Name",
                  "Project Name",
                  "Task Assign",
                  "Start Date",
                  "End Date",
                  "Status",
                  "Action",
                ].map((thead) => (
                  <th key={thead}>{thead}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {taskList.length > 0 ? null : (
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
              {taskList.map((list, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td
                    className={list.start_date > list.end_date && "text-danger"}
                  >
                    {list.category_name}
                  </td>
                  <td>{list.title}</td>
                  <td>{list.project_name}</td>
                  <td>{list.assign_user_name}</td>
                  <td>{moment(list.start_date).format("MM-DD-YYYY")}</td>
                  <td>{moment(list.end_date).format("MM-DD-YYYY")}</td>
                  <td
                    className={list.start_date > list.end_date && "text-danger"}
                  >
                    {list.status}
                  </td>
                  <td>
                    <ActionButton
                      deleteOnclick={() => {
                        setIdToDelete(list.id);
                        setShowAlert(true);
                      }}
                      eyelink={`/AllTask/TaskView/${list.id}`}
                      editOnclick={() => handleEdit(list)}
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
              taskList.length < pageSize
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

      <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit.id || "",
          title: edit.title || "",
          project_name: edit.project_name || "",
          collaborators: edit.collaborators_list
            ? edit.collaborators_list?.map((itm) => {
                return { label: itm.name, value: itm.id };
              })
            : "",
          assign_to: edit.assign_to
            ? { label: edit.assign_user_name, value: edit.assign_to }
            : {},
          category_id: edit.category_id
            ? { label: edit.category_name, value: edit.category_id }
            : {},
          start_date: edit.start_date
            ? moment(edit.start_date).format("YYYY-MM-DD")
            : "",
          end_date: edit.end_date
            ? moment(edit.end_date).format("YYYY-MM-DD")
            : "",
          status: edit.status ? { label: edit.status, value: edit.status } : {},
        }}
        validationSchema={addTaskSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={viewTask}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Submit"}
            close={() => setviewTask(false)}
            title={"Create Task Manager"}
          >
            <Row className="g-2">
              <Form.Group as={Col} md={6}>
                <Form.Label>Select Category</Form.Label>
                <Select
                  menuPosition="fixed"
                  name={"category_id"}
                  options={taskCategory.map((category) => ({
                    label: category.name,
                    value: category.id,
                  }))}
                  value={props.values.category_id}
                  onChange={(selectedOption) => {
                    props.setFieldValue("category_id", selectedOption);
                  }}
                />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Create Task</Form.Label>
                <Form.Control
                  type="text"
                  name={"title"}
                  value={props.values.title}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.title && props.errors.title)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.title}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <Form.Label>Select Collaborators</Form.Label>
                <Select
                  menuPosition="fixed"
                  isMulti
                  name={"collaborators"}
                  options={allUserData?.map((user) => ({
                    label: user.name,
                    value: user.id,
                  }))}
                  value={props.values.collaborators}
                  onChange={(selectedOption) => {
                    props.setFieldValue("collaborators", selectedOption);
                  }}
                />
              </Form.Group>
              <p className="mt-3 mb-0 small fw-bolder">-- Assign To --</p>
              <Form.Group as={Col} md={6}>
                <Form.Label>Select Team Member</Form.Label>
                <Select
                  menuPosition="fixed"
                  name={"assign_to"}
                  options={allHrEmployees.map((member) => ({
                    label: member.name,
                    value: member.id,
                  }))}
                  value={props.values.assign_to}
                  onChange={(selectedOption) => {
                    props.setFieldValue("assign_to", selectedOption);
                  }}
                />
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  type="text"
                  name={"project_name"}
                  value={props.values.project_name}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.project_name && props.errors.project_name
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.project_name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Start Date</Form.Label>
                <Form.Control
                  type="date"
                  name={"start_date"}
                  value={props.values.start_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.start_date && props.errors.start_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.start_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>End Date</Form.Label>
                <Form.Control
                  type="date"
                  name={"end_date"}
                  value={props.values.end_date}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.end_date && props.errors.end_date
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.end_date}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <Form.Label>Select Status</Form.Label>
                <Select
                  menuPosition="fixed"
                  name={"status"}
                  options={[
                    { value: "assign", label: "assign" },
                    { value: "in progress", label: "in progress" },
                    { value: "completed", label: "completed" },
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
    </Col>
  );
};

export default AllTask;
