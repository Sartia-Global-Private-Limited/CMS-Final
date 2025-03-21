import React, { useEffect, useState } from "react";
import { Card, Col, Button, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { BsPlus } from "react-icons/bs";
import {
  deleteMessageById,
  getAllSendMessages,
} from "../../services/contractorApi";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { useTranslation } from "react-i18next";
import "react-best-tabs/dist/index.css";
import { Link } from "react-router-dom";
import ReactPagination from "../../components/ReactPagination";

const MessageNotSent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allMessages, setAllMessages] = useState([]);
  const [allMessagesId, setAllMessagesId] = useState("");
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [showDelete, setShowDelete] = useState(false);

  const { t } = useTranslation();

  const navigate = useNavigate();
  const fetchAllMessages = async () => {
    const upcoming = true;
    const status = "0";
    const res = await getAllSendMessages(
      search,
      pageSize,
      pageNo,
      upcoming,
      status
    );

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
  }, []);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );
  return (
    <>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <Card className="card-bg">
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
                      <td className="text-danger">not sent</td>

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
                <tr>
                  <td colSpan={9}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                </tr>
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
                      title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                        pageDetail?.pageEndResult || 0
                      } of ${pageDetail?.total || 0}`}
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
                      description={"Are you sure you want to delete this!!"}
                    />
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </Card>
      </Col>
    </>
  );
};

export default MessageNotSent;
