import React from "react";
import { useParams } from "react-router-dom";
import AllManager from "./AllManager";
import ViewAllManager from "./ViewAllManager";

const AllManagerIndex = () => {
  const params = useParams();
  return (
    <>
      {params.page == "all" && <AllManager />}
      {params.page == "view" && <ViewAllManager />}
    </>
  );
};

export default AllManagerIndex;
