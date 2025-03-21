import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import CardComponent from "../../../components/CardComponent";
import FormSelect from "../../../components/FormSelect";
import {
  fileteredEmployeeTask,
  viewSingleEmployeeTask,
} from "../../../services/authapi";
import Select from "react-select";

const EmployeeTask = () => {
  const { id } = useParams();
  const [viewTask, setViewTask] = useState([]);
  const [projects, setProject] = useState("");
  const [statuss, setStatus] = useState("");
  // console.log(project);
  const getStatus = [
    { value: "todo", label: "To Do" },
    { value: "progress", label: "Progress" },
    { value: "complete", label: "Complete" },
  ];
  const [getProjectName, setProjectName] = useState([]);
  const fetchData = async () => {
    const res = await viewSingleEmployeeTask(id);
    if (res.status) {
      setViewTask(res.data[0]);
    } else {
      setViewTask([]);
    }
  };
  const fetchSelectData = async () => {
    const res = await viewSingleEmployeeTask(id);
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm.id,
          label: itm.project_name,
        };
      });
      setProjectName(rData);
    } else {
      setProjectName([]);
    }
  };

  const handleFileterd = async (selector, value) => {
    if (selector === "select-project") {
      // console.log(value);
      setProject(value);
    } else {
      // console.log(value);
      setStatus(value);
    }

    const res = await fileteredEmployeeTask(
      id,
      selector === "select-project" ? value : ""
    );
  };

  useEffect(() => {
    fetchData();
    fetchSelectData();
  }, []);

  return (
    <Col md={12} data-aos={"fade-up"}>
      <CardComponent
        custom={
          <>
            {/* <FormSelect option={["Project", "One"]} className={"d-none"} />
            <FormSelect option={["Milestone", "One"]} className={"d-none"} />
            <FormSelect option={["Deadline", "One"]} className={"d-none"} />
            <FormSelect option={["Status", "One"]} className={"d-none"} />
            <FormSelect option={["Filters", "One"]} className={"d-none"} /> */}
          </>
        }
      >
        <div className="d-flex justify-content-end mb-4">
          {/* <Select
            menuPosition="fixed"
            className="text-primary me-3"
            options={getProjectName}
            // name={"team_id"}
            // value={"props.values.team_id"}
          /> */}

          <Form.Select
            aria-label="Default select example"
            className="w-25 me-3"
            name="select-project"
            value={projects}
            onChange={(e) => {
              handleFileterd("select-project", e.target.value);
            }}
          >
            <option>--- Select ---</option>

            {getProjectName.map((e) => (
              <option value={e.label}>{e.label}</option>
            ))}
          </Form.Select>
          <Form.Select
            aria-label="Default select example"
            className="w-25 me-3"
            name={"select-status"}
            value={statuss}
            onChange={(e) => {
              handleFileterd("select-status", e.target.value);
            }}
          >
            <option>--- Select ---</option>
            {getStatus.map((e) => (
              <option value={e.value}>{e.label}</option>
            ))}
          </Form.Select>
        </div>
        <div className="overflow-auto p-2">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                {[
                  "Id",
                  "Title",
                  "Start  Date",
                  "Deadline",
                  "project",
                  "Assinged to",
                  "Category",
                  "Status",
                ].map((thead) => (
                  <th key={thead}>{thead}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{viewTask.id}</td>
                <td>{viewTask.title}</td>
                <td>{moment(viewTask.start_date).format("LTS")}</td>
                <td>{moment(viewTask.end_date).format("LTS")}</td>

                <td>{viewTask.project_name}</td>
                <td>{viewTask.user_name}</td>
                <td>{viewTask.task_category_name}</td>
                <td>{viewTask.status}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </CardComponent>
    </Col>
  );
};

export default EmployeeTask;
