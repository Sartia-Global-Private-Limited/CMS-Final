import React from "react";
import { useParams } from "react-router-dom";
import TaskCategory from "./TaskCategory";
import AllTask from "./AllTask";
import RequestedTask from "./RequestedTask";
import ApprovedTask from "./ApprovedTask";
import RejectedTask from "./RejectedTask";
import AssignedTask from "./AssignedTask";
// import CreateTask from "./CreateTask";

const TaskIndex = () => {
  const params = useParams();
  return (
    <div>
      {/* {params.page == "create" && <CreateTask />} */}
      {params.page == "request" && <RequestedTask />}
      {params.page == "approved" && <ApprovedTask />}
      {params.page == "rejected" && <RejectedTask />}
      {params.page == "assigned-task" && <AssignedTask />}
      {params.page == "task-category" && <TaskCategory />}
      {params.page == "all-task-overview" && <AllTask />}
    </div>
  );
};

export default TaskIndex;
