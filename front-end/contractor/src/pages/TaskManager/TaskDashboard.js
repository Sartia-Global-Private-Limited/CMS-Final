import React, { useEffect, useState } from "react";
import { Card, Col, Row, Table } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import {
  getAdminAllTaskByStatus,
  getAdminAllTaskDashboard,
} from "../../services/authapi";
import moment from "moment";
import { Helmet } from "react-helmet";

const TaskDashboard = () => {
  const [taskShow, setTaskShow] = useState();
  const [taskDashboard, setTaskDashboard] = useState([]);
  const [taskByStatus, setTaskByStatus] = useState([]);

  const fetchTaskDashboardData = async () => {
    const res = await getAdminAllTaskDashboard();
    if (res.status) {
      setTaskDashboard(res.data);
    } else {
      setTaskDashboard([]);
    }
  };
  // const fetchTaskByStatusData = async (types) => {
  //   const res = await getAdminAllTaskByStatus(types)
  //   if (res.status) {
  //     setTaskByStatus(res.data)
  //   } else {
  //     setTaskByStatus([])
  //   }
  // }

  const handleShow = async (types) => {
    const res = await getAdminAllTaskByStatus(types);
    if (res.status) {
      setTaskByStatus(res.data);
    } else {
      setTaskByStatus([]);
    }
    setTaskShow(true);
  };

  useEffect(() => {
    fetchTaskDashboardData();
    // handleShow();
    // fetchTaskByStatusData();
  }, []);

  const taskData = [
    {
      id: 1,
      types: "all",
      title: taskDashboard[0]?.totalTaskName,
      value: taskDashboard[0]?.totalTask,
    },
    {
      id: 2,
      types: "completed",
      title: taskDashboard[1]?.completedTasksName,
      value: taskDashboard[1]?.totalCompletedTask,
    },
    {
      id: 3,
      types: "canceled",
      title: taskDashboard[2]?.toDoTasksName,
      value: taskDashboard[2]?.totalCanceledTask,
    },
    {
      id: 4,
      types: "assign",
      title: taskDashboard[3]?.inProgressTasksName,
      value: taskDashboard[3]?.totalToDodTask,
    },
    {
      id: 5,
      types: "in progress",
      title: taskDashboard[4]?.task_dashboard_name,
      value: taskDashboard[4]?.totalInProgressTask,
    },
    {
      id: 6,
      types: "overdue",
      title: taskDashboard[5]?.overDueTasksName,
      value: taskDashboard[5]?.totalOverDueTask,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Task Manager · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent title={"Task Dashboard"}>
          <Row className="g-3">
            {taskData?.map((item, idx) => (
              <Col md={4} key={idx}>
                <Card
                  onClick={() => handleShow(item.types)}
                  className={`shadow border cursor-pointer after-bg-light text-center text-${
                    item.id === 1
                      ? "secondary"
                      : null || item.id === 2
                      ? "green"
                      : null || item.id === 3
                      ? "danger"
                      : null || item.id === 4
                      ? "orange"
                      : null || item.id === 5
                      ? "warning"
                      : null || item.id === 6
                      ? "info"
                      : null
                  }`}
                >
                  <Card.Body>
                    <h1 className="fw-bolder">{item.value}</h1>
                    <p>{item.title}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </CardComponent>

        <Modaljs
          open={taskShow}
          size={"lg"}
          closebtn={"Cancel"}
          Savebtn={"Ok"}
          close={() => setTaskShow(false)}
          title={"View Tasks"}
        >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr. No.",
                    "Project",
                    "assign to",
                    "Start date",
                    "Deadline",
                    "Status",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {taskByStatus.length > 0 ? null : (
                  <tr>
                    <td colSpan={7}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="350"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
                {taskByStatus?.map((data, id1) => (
                  <tr key={id1}>
                    <td>{id1 + 1}</td>
                    <td>{data?.project_name}</td>
                    <td>{data?.assign_user_name}</td>
                    <td>{moment(data.start_date).format("DD-MM-YYYY")}</td>
                    <td>{moment(data.end_date).format("DD-MM-YYYY")}</td>
                    <td
                      className={`px-2 py-1 text-${
                        data.status === "assign"
                          ? "danger"
                          : data.status === "in progress"
                          ? "warning"
                          : "green"
                      }`}
                    >
                      {data.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modaljs>
      </Col>
    </>
  );
};

export default TaskDashboard;
