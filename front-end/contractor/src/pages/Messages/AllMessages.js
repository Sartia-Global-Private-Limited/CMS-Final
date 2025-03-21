import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Form, Badge } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { BsClock, BsPaperclip, BsPlus, BsSearch } from "react-icons/bs";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { BiPaperPlane } from "react-icons/bi";
import CardComponent from "../../components/CardComponent";
import TextareaAutosize from "react-textarea-autosize";
import moment from "moment";
import {
  getAllMessages,
  getMessagesMarkRead,
  getSingleMessages,
} from "../../services/authapi";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { socket } from "../../context/sockets";
import ImageViewer from "../../components/ImageViewer";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { findMatchingPath } from "../../utils/helper";

const AllMessages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [singleMessage, setSingleMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const scrollRef = useRef(null);
  const [search, setSearch] = useState("");
  const [messagesLists, setMessagesLists] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const { userPermission, user } = useSelector(selectUser);
  const { pathname } = useLocation();
  const [matchingPathObject, setMatchingPathObject] = useState(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    socket.emit("chat", {
      senderId: user.unique_id,
      message: newMessage,
      receiverId: receiverId,
    });
    scrollToBottom();
    handlerMessage(receiverId);
    setNewImage("");
    setNewMessage("");
  };

  const fetchMessagesData = async () => {
    const res = await getAllMessages();
    if (res.status) {
      setMessagesLists(res.data);
    } else {
      setMessagesLists([]);
    }
  };
  const handlerMessage = async (id) => {
    const res = await getSingleMessages(id);
    await getMessagesMarkRead(id);
    if (res.status) {
      setSingleMessage(res.data);
      setReceiverId(id);
      fetchMessagesData();
    } else {
      setSingleMessage([]);
    }
  };

  const results = !search
    ? messagesLists
    : messagesLists.filter(
        (item) =>
          item?.message_content
            ?.toLowerCase()
            .includes(search.toLocaleLowerCase()) ||
          item?.sender_details?.name
            ?.toLowerCase()
            .includes(search.toLocaleLowerCase())
      );

  const handleChange = (event) => {
    setSearch(event.target.value);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      const scrollHeight = scrollRef.current.scrollHeight;
      const height = scrollRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      scrollRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    fetchMessagesData();
  }, [messages]);

  useEffect(() => {
    socket.on("message_recieved", (data) => {
      console.log("client_data", data);
      fetchMessagesData();
      if (receiverId) {
        handlerMessage(receiverId);
      }
    });
  }, [receiverId]);

  // for role and permissions
  useEffect(() => {
    if (userPermission) {
      const result = findMatchingPath(userPermission, pathname);
      setMatchingPathObject(result);
    }
  }, [userPermission, pathname, searchParams, navigate]);

  const checkPermission = matchingPathObject;

  return (
    <>
      <Helmet>
        <title>Messages · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"Messages"}
          icon={<BsPlus />}
          link={"/all-messages/add-user"}
          tag={checkPermission?.create ? "Create" : null}
        >
          <Row className="g-4">
            <Col md={4}>
              <div className="shadow rounded h-100 search-invoice2 last-child-none position-sticky top-0">
                <div className="py-3 rounded-top px-2 success-combo">
                  <span className="position-relative">
                    <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
                    <Form.Control
                      type="search"
                      value={search}
                      onChange={handleChange}
                      placeholder="Search..."
                      className="purple-combo me-2 pe-5"
                    />
                  </span>
                </div>
                <SimpleBar className="area pe-2">
                  {results.length > 0 ? null : (
                    <div className="text-center">
                      <img
                        className="p-3"
                        alt="no-result"
                        width="230"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </div>
                  )}
                  {results?.map((data, id1) => {
                    const {
                      sender_details,
                      receiver_details,
                      message_content,
                      timestamp,
                      total_unread,
                    } = data;
                    const isCurrentUserSender =
                      sender_details?.id == user?.unique_id;
                    const isLinkActive =
                      receiverId == sender_details?.id ||
                      receiverId == receiver_details?.id;
                    const avatarImage = isCurrentUserSender
                      ? receiver_details?.image
                        ? `${process.env.REACT_APP_API_URL}${receiver_details.image}`
                        : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      : sender_details?.image
                      ? `${process.env.REACT_APP_API_URL}${sender_details.image}`
                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`;
                    const displayName = isCurrentUserSender
                      ? receiver_details?.name
                      : sender_details?.name;

                    return (
                      <div key={id1} className="py-2 hr-border2">
                        <div
                          onClick={() =>
                            handlerMessage(
                              isCurrentUserSender
                                ? receiver_details?.id
                                : sender_details?.id
                            )
                          }
                          className={`d-flex p-1 justify-content-between cursor-pointer ${
                            isLinkActive ? "danger-combo" : ""
                          }`}
                        >
                          <div className="d-flex flex-row">
                            <img
                              className="avatar ms-2 me-3"
                              src={avatarImage}
                              alt={displayName || "User Avatar"}
                            />
                            <div className="d-grid">
                              <p className="fw-bold mb-0 text-truncate pe-2">
                                {displayName}
                              </p>
                              <p className="small mb-0 text-truncate">
                                {message_content}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="small mb-1 text-truncate">
                              {moment(timestamp).fromNow(true)}
                            </p>
                            {total_unread > 0 && (
                              <Badge pill bg="danger" className="float-end">
                                {total_unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </SimpleBar>
              </div>
            </Col>
            <Col md={8}>
              <Card className="shadow border-0 justify-content-center chat-area h-100">
                <Card.Body
                  className="p-2 area chat-area-image position-relative"
                  style={{ overflowY: "auto", height: 350 }}
                  ref={scrollRef}
                >
                  {singleMessage.length > 0 ? null : (
                    <div
                      className="d-grid"
                      style={{ placeItems: "center", height: "inherit" }}
                    >
                      <img
                        className="p-3"
                        alt="no-result"
                        width="230"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </div>
                  )}
                  {singleMessage.map((msg, index) => (
                    <React.Fragment key={index}>
                      <div
                        className={`d-flex flex-row mb-4 justify-content-end`}
                        style={{
                          direction:
                            msg.sender_id === user.unique_id ? null : "rtl",
                        }}
                      >
                        <div
                          className={`chat-width ${
                            msg.sender_id === user.unique_id ? "me-3" : "ms-3"
                          }`}
                        >
                          <div
                            className={
                              msg.message_content?.length > 0
                                ? `px-3 py-2`
                                : null
                            }
                            style={{
                              borderRadius:
                                msg.sender_id === user.unique_id
                                  ? "15px 0 15px 15px"
                                  : "0 15px 15px 15px",
                              backgroundColor:
                                msg.sender_id === user.unique_id
                                  ? "rgb(255 255 255 / 35%)"
                                  : "rgba(57, 192, 237,.2)",
                              direction:
                                msg.sender_id === user.unique_id ? null : "ltr",
                            }}
                          >
                            <p className="small mb-0">{msg.message_content}</p>
                          </div>
                          <p
                            className={`fs-11 text-gray pt-2 mb-0 ${
                              msg.sender_id === user.unique_id
                                ? "text-end"
                                : "text-start"
                            }`}
                          >
                            {" "}
                            <BsClock /> {moment(msg?.timestamp).fromNow(true)}
                          </p>
                        </div>
                        {msg.sender_id === user.unique_id ? (
                          <ImageViewer
                            src={
                              user.image
                                ? `${process.env.REACT_APP_API_URL}${user.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <img
                              className="avatar"
                              src={
                                user.image
                                  ? `${process.env.REACT_APP_API_URL}${user.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />
                          </ImageViewer>
                        ) : (
                          <ImageViewer
                            src={
                              msg?.recipient_details?.image
                                ? `${process.env.REACT_APP_API_URL}${msg?.recipient_details?.image}`
                                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                            }
                          >
                            <img
                              className="avatar"
                              src={
                                msg?.recipient_details?.image
                                  ? `${process.env.REACT_APP_API_URL}${msg?.recipient_details?.image}`
                                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                              }
                            />
                          </ImageViewer>
                        )}
                      </div>

                      {msg?.attachment && (
                        <div
                          className={
                            msg.sender_id === user.unique_id ? "text-end" : null
                          }
                        >
                          <ImageViewer
                            src={`${process.env.REACT_APP_API_URL}${msg?.attachment}`}
                          >
                            <img
                              height={80}
                              width={80}
                              className="shadow p-1 mb-4"
                              style={{ marginTop: "-15px" }}
                              src={`${process.env.REACT_APP_API_URL}${msg?.attachment}`}
                              alt={msg?.recipient_details?.name}
                            />
                          </ImageViewer>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </Card.Body>
                {singleMessage.length > 0 ? (
                  <Form
                    className="shadow mt-2 rounded-bottom w-auto h-auto p-3"
                    onSubmit={handleSendMessage}
                  >
                    <div className="hstack gap-2">
                      <Form.Label
                        controlId="uploadfile"
                        className="mb-0 d-none"
                      >
                        <Form.Control
                          accept="image/*"
                          onChange={(e) => setNewImage(e.target.files[0])}
                          type="file"
                          className="d-none"
                        />
                        <div className="social-btn purple-combo d-align">
                          <BsPaperclip />
                        </div>
                      </Form.Label>
                      <TextareaAutosize
                        minRows={1}
                        className="edit-textarea"
                        placeholder="Type a message..."
                        name="remark"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <div className="vr hr-shadow" />
                      <button
                        type="submit"
                        className="social-btn-re w-auto success-combo border-0 gap-1 px-3 d-align"
                      >
                        Send <BiPaperPlane />
                      </button>
                    </div>
                  </Form>
                ) : null}
              </Card>
            </Col>
          </Row>
        </CardComponent>
      </Col>
    </>
  );
};

export default AllMessages;
