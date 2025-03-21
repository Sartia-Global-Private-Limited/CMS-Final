import React from "react";
import { useParams } from "react-router-dom";
import CreateAssets from "./CreateAssets";
import RequestAssets from "./RequestAssets";
import ApprovedAssets from "./ApprovedAssets";
import RejectedAssets from "./RejectedAssets";
import IdleAssets from "./IdleAssets";
import AssetsRepairRequire from "./AssetsRepairRequire";
import AssignedAssets from "./AssignedAssets";
import AssetTimeline from "./AssetTimeline";
import ScrapAssets from "./ScrapAssets";
import AllAssets from "./AllAssets";

export default function AssetManagementIndex() {
  const params = useParams();
  return (
    <div>
      {params.page == "create" && <CreateAssets />}
      {params.page == "all-requested" && <RequestAssets />}
      {params.page == "all-approved" && <ApprovedAssets />}
      {params.page == "all-rejected" && <RejectedAssets />}
      {params.page == "all-idle" && <IdleAssets />}
      {params.page == "repair" && <AssetsRepairRequire />}
      {params.page == "scrap" && <ScrapAssets />}
      {params.page == "all-assigned" && <AssignedAssets />}
      {params.page == "all" && <AllAssets />}
      {params.page == "AssetTimeline/new" && <AssetTimeline />}
    </div>
  );
}
