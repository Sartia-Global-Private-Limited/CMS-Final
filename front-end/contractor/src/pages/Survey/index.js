import React, { useEffect, useState } from "react";
import { Card, Col, Nav, Tab } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { findMatchingPath } from "../../utils/helper";
import { HEADER_TITLE_DEFAULT } from "../../data/StaticData";
import CreateSurvey from "./CreateSurvey";
import RequestSurvey from "./RequestSurvey";
import ApprovedSurvey from "./ApprovedSurvey";
import RejectedSurvey from "./RejectedSurvey";
import AssignedSurvey from "./AssignedSurvey";
import ResponseSurvey from "./ResponseSurvey";
import PurposeMaster from "./PurposeMaster";
import AllSurvey from "./AllSurvey";
import ViewAssignedSurvey from "./CreateResponse";

const TABS = [
  // { component: CreateSurvey, eventKey: "0" },
  { component: RequestSurvey, eventKey: "0" },
  { component: ApprovedSurvey, eventKey: "1" },
  { component: RejectedSurvey, eventKey: "2" },
  { component: AssignedSurvey, eventKey: "3" },
  { component: ResponseSurvey, eventKey: "4" },
  { component: AllSurvey, eventKey: "5" },
  { component: PurposeMaster, eventKey: "6" },
  { component: ViewAssignedSurvey, eventKey: "7" },
];

const Survey = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userPermission } = useSelector(selectUser);
  const [matchingPathObject, setMatchingPathObject] = useState(null);
  const activeTab = searchParams.get("tab") || "0";

  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
      if (!searchParams.get("tab")) {
        navigate(`?tab=0`, { replace: true });
      }
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject?.modulesOfSubModule[activeTab];

  return (
    <>
      <Helmet>
        <title>Survey Management · {HEADER_TITLE_DEFAULT}</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg p-2">
          <Tab.Container id="tabs" activeKey={activeTab}>
            <Nav
              className="nav-pills flex-nowrap overflow-auto"
              style={{ whiteSpace: "nowrap" }}
              variant="pills"
            >
              {matchingPathObject?.modulesOfSubModule?.map((module, index) => (
                <Nav.Item key={index}>
                  <Nav.Link
                    as={Link}
                    to={`?tab=${index}`}
                    eventKey={`${index}`}
                  >
                    {module.title}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>

            <Tab.Content>
              {TABS?.map(({ component: Component, eventKey }) => (
                <Tab.Pane key={eventKey} eventKey={eventKey}>
                  {eventKey == activeTab ? (
                    <Component checkPermission={checkPermission} />
                  ) : (
                    ""
                  )}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </Card>
      </Col>
    </>
  );
};

export default Survey;
