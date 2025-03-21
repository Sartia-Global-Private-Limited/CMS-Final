import React, { Fragment, useEffect, useState } from "react";
import { Accordion, Nav, Spinner } from "react-bootstrap";
import { BsRecord2 } from "react-icons/bs";
import { NavLink, useLocation } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { findActiveDropdownId } from "../constants";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, setUserPermission } from "../features/auth/authSlice";
import { getAllModuleByRoleId } from "../services/authapi";

const JsSidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const { pathname } = useLocation();
  const [sidebarData, setSidebarData] = useState([]);

  const fetchAllSidebarData = async () => {
    const res = await getAllModuleByRoleId(user?.user_type);

    if (res.status) {
      setSidebarData(res.data);
      dispatch(setUserPermission(res.data));
    } else {
      setSidebarData([]);
    }
  };

  useEffect(() => {
    fetchAllSidebarData();
  }, []);

  if (sidebarData?.length == 0) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="secondary" size="sm" /> PLEASE
        WAIT...
      </div>
    );
  }

  return (
    <section className="sidebar">
      <SimpleBar color="red" className="area">
        <Accordion
          defaultActiveKey={findActiveDropdownId(sidebarData, pathname) || 0}
        >
          <Nav className="d-grid gap-2 pe-3 ps-2 pt-3 mb-3">
            {sidebarData?.map((e) => (
              <Fragment key={e.id}>
                {e?.submodules?.length > 0 ? (
                  <Accordion.Item eventKey={e?.id}>
                    <Accordion.Header
                      title={e?.title}
                      className={
                        e?.status ? "active-module" : `un-active-module`
                      }
                    >
                      <div className="d-grid">
                        <div className="d-flex">
                          <img
                            className="me-2 object-fit"
                            width={20}
                            height={20}
                            src={`${process.env.REACT_APP_API_URL}${e.icon}`}
                          />
                          <div className="text-truncatee">{e?.title} </div>
                        </div>
                      </div>
                    </Accordion.Header>

                    <Accordion.Body className="last-child-none d-grid p-2">
                      <React.Fragment>
                        {e?.submodules?.map((body) => (
                          <Fragment key={body.id}>
                            {/* {body?.modulesOfSubModule?.length > 0 ? (
                              <Accordion
                                defaultActiveKey={
                                  findActiveSubDropdownId(body, pathname) || 0
                                }
                                className="my-1"
                              >
                                <Accordion.Item eventKey={body.id}>
                                  <Accordion.Header title={body.title}>
                                    <div className="d-grid">
                                      <div className="text-truncatee">
                                        {body.title}
                                      </div>
                                    </div>
                                  </Accordion.Header>
                                  <Accordion.Body className="last-child-none d-grid p-2">
                                    <React.Fragment>
                                      {body?.modulesOfSubModule?.map((bb) => (
                                        <NavLink
                                          // to={bb.status ? bb.path : "#"}
                                          to={bb.path}
                                          className="px-0 d-block hr-border2 py-2 text-gray text-truncatee text-decoration-none"
                                          key={bb.id}
                                          title={bb.title}
                                        >
                                          <BsRecord2 /> {bb.title}
                                        </NavLink>
                                      ))}
                                    </React.Fragment>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            ) : (
                              <NavLink
                                // to={body.status ? body.path : "#"}
                                to={body.path}
                                className="px-0 d-block hr-border2 py-2 text-gray text-truncatee text-decoration-none"
                                title={body.title}
                              >
                                <BsRecord2 /> {body.title}
                              </NavLink>
                            )} */}
                            <NavLink
                              // to={body.status ? body.path : "#"}
                              to={body.path}
                              className="px-0 d-block hr-border2 py-2 text-gray text-truncatee text-decoration-none"
                              title={body.title}
                            >
                              <div className="d-flex align-items-center gap-1">
                                <BsRecord2 /> <div> {body.title} </div>
                              </div>
                            </NavLink>
                          </Fragment>
                        ))}
                      </React.Fragment>
                    </Accordion.Body>
                  </Accordion.Item>
                ) : (
                  <NavLink
                    // to={e.status ? e.path : "#"}
                    to={e.path}
                    className={`text-start my-bg-shadow r-5 text-gray text-truncatee text-decoration-none`}
                    style={{
                      padding: ".6rem .7rem",
                      borderLeft: e.status
                        ? "5px solid var(--text-green)"
                        : "5px solid var(--btn-danger1)",
                      backgroundColor: e.status ? "" : "#cfcfcf",
                      // pointerEvents: e.status ? "" : "none",
                      cursor: e.status ? "" : "no-drop",
                    }}
                    title={e.title}
                  >
                    <div className="d-flex">
                      <img
                        className="me-2 object-fit"
                        width={20}
                        height={20}
                        src={`${process.env.REACT_APP_API_URL}${e.icon}`}
                      />
                      {e.title}
                    </div>
                  </NavLink>
                )}
              </Fragment>
            ))}
          </Nav>
        </Accordion>
      </SimpleBar>
    </section>
  );
};

export default JsSidebar;
