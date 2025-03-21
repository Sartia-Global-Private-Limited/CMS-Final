import React, { useEffect, useState } from "react";
import { Card, Col, Button, Table } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import ReactPagination from "../../components/ReactPagination";
import { Helmet } from "react-helmet";
import { BsPlus } from "react-icons/bs";
import {
  deleteMessageById,
  getAllSendMessages,
} from "../../services/contractorApi";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { useTranslation } from "react-i18next";
import Tabs, { Tab } from "react-best-tabs";
import "react-best-tabs/dist/index.css";
import { Link } from "react-router-dom";
import MessageNotSent from "./MessageNotSent";
const AllSendMessages = () => {
  const [allMessages, setAllMessages] = useState([]);
  const [allMessagesId, setAllMessagesId] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("last_tab") || "2"
  );
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchAllMessages = async () => {
    const res = await getAllSendMessages(search, pageSize, pageNo);
    if (res.status) {
      setAllMessages(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllMessages([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };
  const handleDelete = async () => {
    const res = await deleteMessageById(allMessagesId);
    if (res.status) {
      toast.success(res.message);
      setAllMessages((prev) => prev.filter((data) => data.id != allMessagesId));
    } else {
      toast.error(res.message);
    }
    setAllMessagesId("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchAllMessages();
  }, [pageNo, pageSize]);
  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );
  const handleClick = (e, tab) => {
    localStorage.setItem("last_tab", tab);
    setActiveTab(tab);
  };
  return (
    <>
      <Helmet>
        <title>Outlet Management · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Card className="card-bg">
          <Tabs
            onClick={(e, tab) => handleClick(e, tab)}
            activeTab={activeTab}
            ulClassName="border-primary p-2 border-bottom"
            activityClassName="bg-secondary"
          >
            <Tab className="pe-none fs-15 fw-bold" title={t("Send Messages")} />

            <Tab className="ms-auto" title={t("All Messages")}>
              {activeTab == "2" && (
                <>
                  {/* <span className="d-align m-3 justify-content-end gap-2">
                    <Button
                      as={Link}
                      to={"/FeedbackSuggestion/create"}
                      variant="light"
                      className={`text-none view-btn shadow rounded-0 px-1 text-orange`}
                    >
                      <BsPlus /> {t("Create")}
                    </Button>
                  </span> */}
                  <div className="table-scroll mt-2 mb-2">
                    <Table className="text-body bg-new Roles">
                      <thead className="text-truncate">
                        <tr>
                          <th>{t("Sr No.")}</th>
                          <th>{t("title")}</th>
                          <th>{t("message")}</th>
                          <th>{t("date")}</th>
                          <th> {t("status")} </th>
                          <th>{t("Action")}</th>
                        </tr>
                      </thead>
                      {isLoading ? (
                        <td colSpan={7}>
                          <img
                            className="p-3"
                            width="250"
                            src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                            alt={t("Loading")}
                          />
                        </td>
                      ) : allMessages.length > 0 ? (
                        <>
                          {allMessages.map((data, id1) => (
                            <tr key={id1}>
                              <td>{serialNumber[id1]}</td>
                              <td>{data.title}</td>
                              <td>
                                {data.message < 59
                                  ? data.message
                                  : data.message.slice(0, 60) + "....."}
                              </td>
                              <td>{data.date}</td>
                              <td
                                className={`text-${
                                  data?.status == "1" ? "green" : "danger"
                                }`}
                              >
                                {data.status == 1 ? "sent" : "not sent"}
                              </td>

                              <td>
                                <ActionButton
                                  eyeOnclick={() =>
                                    navigate(`/contacts/view`, {
                                      state: {
                                        id: data.id,
                                      },
                                    })
                                  }
                                  editOnclick={() =>
                                    navigate(
                                      `/contacts/energy/send-messages/${data.id}`,
                                      {
                                        state: {
                                          selectedId: data.id,
                                        },
                                      }
                                    )
                                  }
                                  editClass={
                                    data?.status == 1
                                      ? `danger-combo-disable pe-none`
                                      : `danger-combo`
                                  }
                                  deleteOnclick={() => {
                                    setAllMessagesId(data.id);
                                    setShowDelete(true);
                                  }}
                                />
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <td colSpan={9}>
                          <img
                            className="p-3"
                            alt="no-result"
                            width="250"
                            src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                          />
                        </td>
                      )}

                      <tfoot>
                        <tr>
                          <td colSpan={10}>
                            <ReactPagination
                              pageSize={pageSize}
                              prevClassName={
                                pageNo === 1
                                  ? "danger-combo-disable pe-none"
                                  : "red-combo"
                              }
                              nextClassName={
                                pageSize == pageDetail?.total
                                  ? allMessages.length - 1 < pageSize
                                    ? "danger-combo-disable pe-none"
                                    : "success-combo"
                                  : allMessages.length < pageSize
                                  ? "danger-combo-disable pe-none"
                                  : "success-combo"
                              }
                              title={`Showing ${
                                pageDetail?.pageStartResult || 0
                              } to ${pageDetail?.pageEndResult || 0} of ${
                                pageDetail?.total || 0
                              }`}
                              handlePageSizeChange={handlePageSizeChange}
                              prevonClick={() => setPageNo(pageNo - 1)}
                              nextonClick={() => setPageNo(pageNo + 1)}
                            />
                            <ConfirmAlert
                              size={"sm"}
                              deleteFunction={handleDelete}
                              hide={setShowDelete}
                              show={showDelete}
                              title={"Confirm Delete"}
                              description={
                                "Are you sure you want to delete this!!"
                              }
                            />
                          </td>
                        </tr>
                      </tfoot>
                    </Table>
                  </div>
                </>
              )}
            </Tab>
            <Tab title={t("Upcoming Messages")}>
              {activeTab == "3" && <MessageNotSent />}
            </Tab>
          </Tabs>
        </Card>
      </Col>
    </>
  );
};

export default AllSendMessages;
