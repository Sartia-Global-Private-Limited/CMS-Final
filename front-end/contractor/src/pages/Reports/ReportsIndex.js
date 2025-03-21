import React from "react";
import { useParams } from "react-router-dom";
import RequestedReports from "./RequestedReports";
import ApprovedReports from "./ApprovedReports";
import RejectedReports from "./RejectedReports";
import AllReportsOverview from "./AllReportsOverview";

const ReportsIndex = () => {
  const params = useParams();
  return (
    <div>
      {params.page == "requested" && <RequestedReports />}
      {params.page == "approved" && <ApprovedReports />}
      {params.page == "rejected" && <RejectedReports />}
      {params.page == "all-reports-overview" && <AllReportsOverview />}
    </div>
  );
};

export default ReportsIndex;
