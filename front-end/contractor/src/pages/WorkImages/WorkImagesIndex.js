import React from "react";
import { useParams } from "react-router-dom";
import CreateWorkImages from "./CreateWorkImages";
import RequestWorkImage from "./RequestWorkImage";
import ApprovedWorkImage from "./ApprovedWorkImage";
import RejectedWorkImage from "./RejectedWorkImage";
import WorkImages from "./WorkImages";
import ViewWorkImagesDeatils from "./ViewWorkImagesDeatils";

export default function WorkImagesIndex() {
  const params = useParams();
  return (
    <>
      {params.page == "request" && <RequestWorkImage />}
      {params.page == "approved" && <ApprovedWorkImage />}
      {params.page == "rejected" && <RejectedWorkImage />}
      {params.page == "all" && <WorkImages />}
      {params.page == "create" && <CreateWorkImages />}
      {params.page == "view" && <ViewWorkImagesDeatils />}
    </>
  );
}
