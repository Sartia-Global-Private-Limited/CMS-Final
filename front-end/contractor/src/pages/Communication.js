import React from "react";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Card, Col, Container, Row, Form, Badge } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsPaperclip, BsSearch } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { BiPaperPlane } from "react-icons/bi";
import { useTranslation } from "react-i18next";

const Communication = () => {
  const { t } = useTranslation();
  const tabs = [
    { title: t("Communication"), className: "fw-bold pe-none" },
    {
      title: t("Internal Communication"),
      className: "ms-auto",
      page: <MyPage />,
    },
    { title: t("External Communication"), page: <MyPage /> },
  ];

  function MyPage() {
    return (
      <Container fluid>
        <Row className="g-4">
          <Col md={4}>
            <Card className="card-bg search-invoice2 last-child-none position-sticky top-0">
              <Card.Body>
                <div className="pb-3">
                  <span className="position-relative">
                    <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                    <Form.Control
                      type="search"
                      placeholder="Search..."
                      className="me-2"
                    />
                  </span>
                </div>
                <SimpleBar className="area ps-1 pe-3">
                  {[1, 2, 3, 4, 5, 6.7, 8, 9].map((ide) => (
                    <div key={ide} className="py-2 hr-border2">
                      <NavLink className="d-flex justify-content-between text-decoration-none link-dark">
                        <div className="d-flex flex-row">
                          <img
                            src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-8.webp"
                            alt="avatar"
                            className="avatar me-3"
                          />
                          <div className="pt-1 d-grid">
                            <p className="fw-bold mb-0 text-truncate pe-2">
                              John Doe
                            </p>
                            <p className="small text-truncate">
                              Hello, Are you there?
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small mb-1 text-truncate">Just now</p>
                          <Badge pill bg="danger" className="float-end">
                            1
                          </Badge>
                        </div>
                      </NavLink>
                    </div>
                  ))}
                </SimpleBar>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className="card-bg chat-area h-100">
              <SimpleBar className="area p-2 position-relative">
                <Card.Body>
                  {[1, 2, 3, 4, 5, 6.7, 8, 9].map((chat, idf) => (
                    <React.Fragment key={idf}>
                      <div className="d-flex flex-row justify-content-start mb-4">
                        <img
                          src="https://i.ibb.co/6r9rSDq/download.jpg"
                          alt="avatar 1"
                          className="avatar"
                        />
                        <div className="ms-3 chat-width">
                          <div
                            className="p-3"
                            style={{
                              borderRadius: "0 15px 15px 15px",
                              backgroundColor: "rgba(57, 192, 237,.2)",
                            }}
                          >
                            <p className="small mb-0">
                              What are you doing tomorrow? Can we come up a bar?
                            </p>
                          </div>
                          <div className="d-md-flex mt-1 text-muted justify-content-between">
                            <p className="small mb-0">Altaf Ahmad</p>
                            <p className="small mb-0">23 Jan {chat}:00 pm</p>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex flex-row justify-content-end mb-4">
                        <div className="me-3 chat-width">
                          <div
                            className="p-3 border"
                            style={{
                              borderRadius: "15px 0 15px 15px",
                              backgroundColor: "#fbfbfb",
                            }}
                          >
                            <p className="small mb-0">
                              Long time no see! Tomorrow office. will be free on
                              sunday.
                            </p>
                          </div>
                          <div className="d-md-flex mt-1 text-muted justify-content-between">
                            <p className="small mb-0">Ansarul Mandal</p>
                            <p className="small mb-0">23 Jan {chat}:00 pm</p>
                          </div>
                        </div>
                        <img
                          src="https://i.ibb.co/vjkw06z/download.jpg"
                          alt="avatar 2"
                          className="avatar"
                        />
                      </div>
                    </React.Fragment>
                  ))}
                </Card.Body>
              </SimpleBar>
              <Card.Footer className="border-0 p-3">
                <div className="hstack gap-2">
                  <Form.Label controlId="uploadfile" className="mb-0">
                    <Form.Control type="file" className="d-none" />
                    <div className="social-btn d-align">
                      <BsPaperclip />
                    </div>
                  </Form.Label>
                  <Form.Control
                    className="me-auto"
                    type="text"
                    placeholder="Type a message..."
                  />
                  <div className="vr hr-shadow" />
                  <div className="social-btn w-auto gap-1 purple-combo d-align">
                    Send <BiPaperPlane />
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
  return (
    <>
      <Helmet>
        <title>Communication · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Card className="card-bg">
          <Card.Body>
            <Tabs
              activeTab="2"
              ulClassName="border-primary border-bottom"
              activityClassName="bg-secondary"
            >
              {tabs.map((tab, idx) => (
                <Tab key={idx} title={tab.title} className={tab.className}>
                  <div className="mt-3">{tab.page}</div>
                </Tab>
              ))}
            </Tabs>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
};

export default Communication;
