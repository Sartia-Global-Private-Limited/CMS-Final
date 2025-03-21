import React from "react";
import { useParams } from "react-router-dom";
import CreateTeam from "./CreateTeam";
import AllTeamOverview from "./AllTeamOverview";
import RequestTeam from "./RequestTeam";
import ViewEnergyTeam from "./ViewEnergyTeam";

export default function CompanyTeam() {
  const params = useParams();
  return (
    <div>
      {params.page == "view-energy-team" && <ViewEnergyTeam />}
      {params.page == "request-energy-team" && <RequestTeam />}
      {params.page == "all-energy-team-overview" && <AllTeamOverview />}
    </div>
  );
}
