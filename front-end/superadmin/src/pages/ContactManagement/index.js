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
import AllEnergyCompanyContacts from "./AllEnergyCompanyContacts";
import EnergyCompanyContacts from "./EnergyCompanyContacts";
import OutletContacts from "./OutletContacts";
import ClientContacts from "./ClientContacts";
import VendorContacts from "./VendorContacts";
import InboxContacts from "./InboxContacts";

const TABS = [
  { component: EnergyCompanyContacts, eventKey: "0" },
  { component: AllEnergyCompanyContacts, eventKey: "1" },
  { component: OutletContacts, eventKey: "2" },
  { component: ClientContacts, eventKey: "3" },
  { component: VendorContacts, eventKey: "4" },
  { component: InboxContacts, eventKey: "5" },
];

const Contacts = () => {
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
            <Nav
              className="nav-pills flex-nowrap overflow-auto"
              style={{ whiteSpace: "nowrap" }}
              variant="pills"
            >
              {matchingPathObject?.modulesOfSubModule?.map((module, index) => (
                <Nav.Item className="mb-2" key={index}>
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

export default Contacts;
