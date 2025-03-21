import { Alert, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  BsBellFill,
  BsFillChatLeftTextFill,
  BsClock,
  BsFillPersonFill,
  BsPower,
  BsTextIndentRight,
} from "react-icons/bs";
import { NavLink, useLocation } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import Select from "react-select";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../features/auth/authSlice";
import {
  adminProfile,
  getAdminAllNotifications,
  getAdminCountNotifications,
  getAdminMarkasReadMessages,
  getAdminMarkasReadNotifications,
  getAllMessages,
  getNewMessages,
} from "../services/authapi";
import {
  selectNoti,
  setNotification,
} from "../features/notifications/notificationSlice";
import { useEffect, useLayoutEffect } from "react";
import moment from "moment";
import { toast } from "react-toastify";
import { selectMsg, setMessage } from "../features/messages/messagesSlice";
import { socket } from "../context/sockets";
import { formatNumberToINR } from "../utils/helper";

function JsNavbar({ showOpen, setShowOpen }) {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const { noti: notificationData, count } = useSelector(selectNoti);
  const { msg: messageData, countMsg } = useSelector(selectMsg);

  const options = [
    {
      value: "en",
      label: (
        <>
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/us.png 2x`}
            src={`https://flagcdn.com/w20/us.png`}
            alt=""
          />{" "}
          English
        </>
      ),
    },
    {
      value: "hi",
      label: (
        <>
          <img
            loading="lazy"
            width="20"
            srcSet={`https://flagcdn.com/w40/in.png 2x`}
            src={`https://flagcdn.com/w20/in.png`}
            alt=""
          />{" "}
          Hindi
        </>
      ),
    },
  ];

  const { user } = useSelector(selectUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("cms-ca-token");
    dispatch(logout());
  };

  const handleCheck = async () => {
    const res = await adminProfile();
    if (!res.status) {
      handleLogout();
      toast.error("Session expired.");
    }
  };

  useEffect(() => {
    handleCheck();
  }, [pathname]);

  const fetchNotificationData = async () => {
    try {
      const [result1, result2] = await Promise.all([
        getAdminAllNotifications(),
        getAdminCountNotifications(),
      ]);
      if (result1.status && result2.status) {
        dispatch(
          setNotification({
            notification: result1.data,
            count: result2.data.totalUnreadNotifications,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchMessagesData = async () => {
    try {
      const [resultMsg1, resultMsg2] = await Promise.all([
        getAllMessages(),
        getNewMessages(),
      ]);
      if (resultMsg1.status && resultMsg2.status) {
        dispatch(
          setMessage({
            message: resultMsg1.data,
            countMsg: resultMsg2.data.total,
          })
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMarkasReadNotifications = async () => {
    const res = await getAdminMarkasReadNotifications();
    if (res.status) {
      // toast.success(res.message);
      fetchNotificationData();
    } else {
      toast.error(res.message);
    }
  };
  const fetchMarkasReadMessages = async () => {
    const res = await getAdminMarkasReadMessages();
    if (res.status) {
      toast.success(res.message);
      fetchMessagesData();
    } else {
      toast.error(res.message);
    }
  };

  const markasReadhandler = () => {
    fetchMarkasReadNotifications();
  };
  const markMessageReadhandler = () => {
    fetchMarkasReadMessages();
  };

  // useEffect(() => {
  //   fetchNotificationData();
  //   fetchMessagesData();
  // }, [pathname]);

  useLayoutEffect(() => {
    socket.on("message_recieved", (data) => {
      fetchNotificationData();
      fetchMessagesData();
    });
  }, []);

  return (
    <Navbar id="iq-navbar" className="nav-57 mb-3 border-primary border-bottom">
      <Container fluid>
        <Nav className="justify-content-end my-Dropdown flex-grow-1 gap-md-2 pe-md-3 pe-sm-5 align-items-center">
          <div
            onClick={() => setShowOpen(!showOpen)}
            className="me-auto social-btn-re text-none w-auto d-lg-flex d-none align-items-center danger-combo"
          >
            <BsTextIndentRight fontSize={25} />
          </div>
          <Alert
            variant={"success"}
            className="d-lg-block d-none"
            style={{ marginBottom: 0, padding: 6 }}
          >
            {user?.plan_name}{" "}
            <strong>
              ({formatNumberToINR(+user?.plan_price)}/{user?.plan_duration})
            </strong>{" "}
            {user?.plan_expire_date
              ? moment(user?.plan_expire_date).format("ll")
              : "-"}
          </Alert>
          <Select
            className="fs-11 me-2 react-select text-primary"
            onChange={(e) => i18n.changeLanguage(e?.value)}
            defaultValue={options[0]}
            options={options}
          />
          <NavDropdown
            title={
              <div className="d-align">
                <span className="my-btn d-align position-relative">
                  <BsBellFill className="text-green" />
                  <span
                    className="position-absolute top-0 mt-1 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: 10 }}
                  >
                    {count > 0 ? count : null}
                  </span>
                </span>
              </div>
            }
            align="end"
          >
            <div className="position-realtive">
              <NavLink
                className={`dropdown-item d-align justify-content-between py-3 rounded-top active`}
                to={"/AllNotifications"}
              >
                {t("Notifications")}{" "}
                <span
                  onClick={markasReadhandler}
                  className="text-success ms-4 fs-11"
                >
                  Mark All As Read
                </span>
              </NavLink>
              <SimpleBar>
                {notificationData?.length > 0 ? null : (
                  <div className="text-center">
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </div>
                )}
                {notificationData?.map((noti, id1) => (
                  <NavLink
                    to={"/AllNotifications"}
                    key={id1}
                    className={`py-2 dropdown-item hr-border2 ${
                      noti.is_admin_read === 1 ? "bg-transparent" : "bg-light"
                    }`}
                  >
                    <div className="d-flex justify-content-between">
                      <div className="d-flex">
                        <img
                          className="avatar me-3"
                          src={
                            noti.image
                              ? `${process.env.REACT_APP_API_URL}${noti.image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                          alt={""}
                        />
                        <span className="d-grid">
                          <div className="text-truncate pb-1">{noti.name}</div>
                          <div className="text-truncate fs-11 text-gray">
                            {noti.message}
                          </div>
                        </span>
                      </div>
                      <span className="fs-11 text-gray">
                        <BsClock /> {moment(noti.created_at).fromNow(true)}
                      </span>
                    </div>
                  </NavLink>
                ))}
              </SimpleBar>
              <div className="p-4 dropdown-item active d-align rounded-bottom">
                <NavLink
                  to={"/AllNotifications"}
                  className="nav-link text-primary position-fixed"
                >
                  {t("read_all")} {t("Notifications")}
                </NavLink>
              </div>
            </div>
          </NavDropdown>
          <NavDropdown
            title={
              <div className="d-align">
                <span className="my-btn d-align position-relative">
                  <BsFillChatLeftTextFill className="text-orange" />
                  <span
                    className="position-absolute top-0 mt-1 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: 10 }}
                  >
                    {countMsg > 0 ? countMsg : null}
                  </span>
                </span>
              </div>
            }
            align="end"
          >
            <div className="position-realtive">
              <NavLink
                className={`dropdown-item d-align justify-content-between py-3 rounded-top active`}
                to={"/AllMessages"}
              >
                {t("Messages")}{" "}
                <span
                  onClick={markMessageReadhandler}
                  className="text-success ms-4 fs-11"
                >
                  Mark All As Read
                </span>
              </NavLink>
              <SimpleBar>
                {messageData?.length > 0 ? null : (
                  <div className="text-center">
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </div>
                )}
                {messageData?.map((msg, id2) => (
                  <NavLink
                    to={"/AllMessages"}
                    key={id2}
                    className={`py-2 dropdown-item hr-border2 ${
                      msg.is_read === "1" ? "bg-transparent" : "bg-light"
                    }`}
                  >
                    <div className="d-flex justify-content-between">
                      <div className="d-flex">
                        <img
                          className="avatar me-3"
                          src={
                            msg?.sender_details?.image
                              ? `${process.env.REACT_APP_API_URL}${msg?.sender_details?.image}`
                              : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                          }
                          alt={""}
                        />
                        <span className="d-grid">
                          <div className="text-truncate pb-1">
                            {msg?.sender_details?.name}
                          </div>
                          <div className="text-truncate fs-11 text-gray">
                            {msg.message_content}
                          </div>
                        </span>
                      </div>
                      <span className="fs-11 text-gray">
                        <BsClock /> {moment(msg.timestamp).fromNow(true)}
                      </span>
                    </div>
                  </NavLink>
                ))}
              </SimpleBar>
              <div className="p-4 dropdown-item active d-align rounded-bottom">
                <NavLink
                  to={"/AllMessages"}
                  className="nav-link text-primary position-fixed"
                >
                  {t("read_all")} {t("Messages")}
                </NavLink>
              </div>
            </div>
          </NavDropdown>
          <NavDropdown
            title={
              <div className={"d-align"}>
                <div className="flex-shrink-0">
                  <img
                    className="img-fluid my-btn"
                    src={
                      user.image
                        ? `${process.env.REACT_APP_API_URL}${user.image}`
                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                    }
                    alt=""
                  />
                </div>
                <div className="flex-grow-1 fw-bolder ms-3 d-none d-md-block">
                  {user.name}
                </div>
              </div>
            }
            align="end"
          >
            <NavLink className={"dropdown-item text-primary"} to={"/MyProfile"}>
              <BsFillPersonFill /> {t("My Profile")}
            </NavLink>
            <div
              onClick={handleLogout}
              className={"dropdown-item cursor-pointer text-primary"}
            >
              <BsPower /> {t("Log_Out")}
            </div>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default JsNavbar;
