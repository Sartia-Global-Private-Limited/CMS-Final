import React from "react";
import { useParams } from "react-router-dom";
import RequestOutlet from "./RequestOutlet";
import ApprovedOutlet from "./ApprovedOutlet";
import RejectedOutlet from "./RejectedOutlet";
import CreateOutlet from "./CreateOutlet";
import DealerOutlet from "./DealerOutlet";
import AllOutletOverview from "./AllOutletOverview";
import ImportExcelFile from "../ImportExcelFile";
import ImportExcelOutlets from "./ImportExcelOutlets";

const OutletIndex = () => {
  const params = useParams();
  return (
    <>
      {params.page == "request" && <RequestOutlet />}
      {params.page == "approved" && <ApprovedOutlet />}
      {params.page == "rejected" && <RejectedOutlet />}
      {params.page == "create" && <CreateOutlet />}
      {params.page == "all-outlet-overview" && <AllOutletOverview />}
      {params.page == "import" && <ImportExcelOutlets />}
    </>
  );
};
export default OutletIndex;
