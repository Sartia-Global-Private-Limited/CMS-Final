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
import ExpenseRequest from "./ExpenseRequest";
import ExpensePunch from "./ExpensePunch";
import ViewExpenseTransaction from "./ViewExpenseTransaction";
import ExpenseBalanceOverview from "./ExpenseBalanceOverview";

const TABS = [
  { component: ExpenseRequest, eventKey: "0" },
  { component: ExpensePunch, eventKey: "1" },
  { component: ExpenseBalanceOverview, eventKey: "2" },
  { component: ViewExpenseTransaction, eventKey: "3" },
];

const ViewExpenseManagement = () => {
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
        <title>expense Management · {HEADER_TITLE_DEFAULT}</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <Card className="card-bg p-2">
          <Tab.Container id="tabs" activeKey={activeTab}>
            <Nav variant="pills">
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
                  {eventKey == activeTab ? <Component checkPermission={checkPermission} /> : ""}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>
        </Card>
      </Col>
    </>
  );
};

export default ViewExpenseManagement;
