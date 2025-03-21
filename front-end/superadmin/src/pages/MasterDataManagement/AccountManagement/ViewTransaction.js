import React, { useEffect, useState } from "react";
import { Badge, Col, Row, Table } from "react-bootstrap";
import ImageViewer from "../../../components/ImageViewer";
import ActionButton from "../../../components/ActionButton";
import "simplebar-react/dist/simplebar.min.css";
import { getAccountTransactionHistory } from "../../../services/contractorApi";
import ReactPagination from "../../../components/ReactPagination";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import Select from "react-select";
import { useTranslation } from "react-i18next";

export const ViewTransaction = ({ edit }) => {
  const [transaction, setTransaction] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [pageDetail, setPageDetail] = useState({});
  const [collapsedRows, setCollapsedRows] = useState([]);
  const [filterBy, setFilterby] = useState("last12Months");
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getAccountTransactionHistory(
      edit?.account_id,
      filterBy,
      pageSize,
      pageNo
    );

    if (res.status) {
      setTransaction(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setTransaction([]);
    }
  };

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const toggleRow = (index) => {
    setCollapsedRows((prev) => {
      const isCollapsed = prev.includes(index);
      if (isCollapsed) {
        return prev.filter((rowIndex) => rowIndex !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  useEffect(() => {
    if (edit?.account_id) {
      fetchSingleData();
    }
  }, [edit, filterBy, pageNo, pageSize]);
  return (
    <Row className="g-3">
      <Col md={12}>
        <div className="p-20 shadow rounded h-100">
          <strong className="text-secondary">{t("Account Details")} </strong>
          <div className="mt-2">
            <table className="table-sm table">
              <tbody>
                <tr>
                  <th>{t("Account Holder")}:</th>
                  <td>{edit?.accounts?.[0].account_holder_name ?? "--"}</td>
                </tr>
                <tr>
                  <th>{t("Created By")}:</th>
                  <td>{edit?.accounts?.[0].user_name ?? "--"}</td>
                </tr>
                <tr>
                  <th className="align-middle">{t("Bank Name")} :</th>
                  <td>
                    <ImageViewer
                      src={
                        edit?.bank_logo
                          ? `${process.env.REACT_APP_API_URL}${edit?.bank_logo}`
                          : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                      }
                    >
                      <img
                        width={35}
                        height={35}
                        className="my-bg object-fit p-1 rounded-circle"
                        src={
                          edit?.bank_logo
                            ? `${process.env.REACT_APP_API_URL}${edit?.bank_logo}`
                            : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                        }
                      />{" "}
                    </ImageViewer>
                    {edit?.bank_name}
                  </td>
                </tr>

                <tr>
                  <th>{t("Account Number")}:</th>
                  <td>{edit?.accounts?.[0].account_number}</td>
                </tr>

                <tr>
                  <th>{t("Ifsc Code")}:</th>
                  <td>{edit?.accounts?.[0].ifsc_code}</td>
                </tr>

                <tr>
                  <th>{t("Branch")}:</th>
                  <td>{edit?.accounts?.[0]?.branch}</td>
                </tr>
                <tr>
                  <th>{t("Account Type")}:</th>
                  <td>{edit?.accounts?.[0]?.account_type}</td>
                </tr>
                <tr>
                  <th>{t("Account Status")}:</th>
                  <td>
                    <Badge
                      bg="secondary"
                      className="fw-normal"
                      style={{ fontSize: 11 }}
                    >
                      {edit?.accounts?.[0]?.is_default
                        ? "Active"
                        : "Not Active"}
                    </Badge>
                  </td>
                </tr>

                <tr>
                  <th className="align-middle">{t("Action")} :</th>
                  <td>
                    <ActionButton
                      className="justify-content-start"
                      hideDelete={"d-none"}
                      hideEye={"d-none"}
                      editlink={`/account-management/create-account-management/${edit?.account_id}`}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Col>

      <Col md={12} className="my-4">
        <span className="d-align d-md-flex d-grid justify-content-end gap-2">
          {t("Filter By")}
          <Select
            menuPortalTarget={document.body}
            placeholder={t("Select Date")}
            defaultValue={{ label: "Last 12 Months", value: "last12Months" }}
            options={[
              { label: "Today", value: "today" },
              { label: "Yesterday", value: "yesterday" },
              { label: "This Week", value: "thisWeek" },
              { label: "Last Week", value: "lastWeek" },
              { label: "This Month", value: "thisMonth" },
              { label: "Last Month", value: "lastMonth" },
              { label: "this Quarter", value: "thisQuarter" },
              { label: "Last Quarter", value: "lastQuarter" },
              { label: "Last 6 Months", value: "last6Months" },
              { label: "Last 12 Months", value: "last12Months" },
            ]}
            // isClearable
            onChange={(e) => {
              setFilterby(e ? e.value : null);
            }}
          />
        </span>
        <strong className="text-secondary  ">
          {t("Account Transaction History")}
        </strong>
        <div className="table-scroll my-3">
          <Table className="text-body bg-new Roles">
            <thead className="text-truncate">
              <tr>
                <th>{t("Sr No.")}</th>
                <th>{t("Status")}</th>
                <th>{t("Description")}</th>
                <th>{t("Transaction")}</th>
                <th>{t("Updated Balance")}</th>
                <th>{t("Date")}</th>
              </tr>
            </thead>
            <tbody>
              {transaction?.length ? (
                <>
                  {transaction.map((data, id) => {
                    return (
                      <tr key={id}>
                        <td>{id + 1}</td>

                        <td className="text-green">{data?.status ?? "----"}</td>
                        <td className="text-green">
                          {data?.description ?? "----"}
                        </td>

                        <td className="text-green">
                          {data?.transaction ?? "----"}
                        </td>
                        <td className="text-green">
                          {data?.updated_balance ?? "----"}
                        </td>
                        <td className="text-green">{data?.date ?? "----"} </td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                <td colSpan={7}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </td>
              )}
            </tbody>
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
                        ? transaction.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : transaction.length < pageSize
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
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </Col>
    </Row>
  );
};
