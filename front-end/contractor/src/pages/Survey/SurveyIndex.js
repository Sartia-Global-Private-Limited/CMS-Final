import React from "react";
import { useParams } from "react-router-dom";
import RequestSurvey from "./RequestSurvey";
import ApprovedSurvey from "./ApprovedSurvey";
import RejectedSurvey from "./RejectedSurvey";
import CreateSurvey from "./CreateSurvey";
import AssignedSurvey from "./AssignedSurvey";
import PurposeMaster from "./PurposeMaster";
import ResponseSurvey from "./ResponseSurvey";
import AllSurvey from "./AllSurvey";
import ViewAssignedSurvey from "./CreateResponse";

const SurveyIndex = () => {
  const params = useParams();
  return (
    <div>
      {params.page == "response-survey" && <ResponseSurvey />}
      {params.page == "purpose-master" && <PurposeMaster />}
      {params.page == "assigned-survey" && <AssignedSurvey />}
      {params.page == "all-survey-overview" && <AllSurvey />}
      {params.page == "create" && <CreateSurvey />}
      {params.page == "request" && <RequestSurvey />}
      {params.page == "approved" && <ApprovedSurvey />}
      {params.page == "rejected" && <RejectedSurvey />}
      {params.page == "view-response" && <ViewAssignedSurvey />}
    </div>
  );
};

export default SurveyIndex;
