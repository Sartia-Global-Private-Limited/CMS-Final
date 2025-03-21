import React, { useEffect, useMemo, useState } from "react";
import { getAllTransferStockRequest } from "../../services/contractorApi";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { UserDetail } from "../../components/ItemDetail";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import { serialNumber } from "../../utils/helper";

const AllStock = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const { user } = useSelector(selectUser);
  const { t } = useTranslation();

  const fetchTransferedFundData = async () => {
    const res = await getAllTransferStockRequest({
      search,
      pageSize,
      pageNo,
    });
    setIsLoading(true);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransferedFundData();
  }, [search, pageNo, pageSize]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("unique_id", {
        header: "Unique ID",
      }),
      columnHelper.accessor("request_for", {
        header: "Request For",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.request_for_image}
            name={info.row.original?.request_for}
            login_id={user?.id}
            id={info.row.original?.request_for_id}
            unique_id={info.row.original?.request_for_employee_id}
          />
        ),
      }),
      columnHelper.accessor("request_date", {
        header: "request date",
      }),
      columnHelper.accessor("total_request_qty", {
        header: "request quantity",
        cell: (info) => (
          <div className={`fw-bolder text-danger`}>
            {info.row.original?.total_request_qty}
          </div>
        ),
      }),
      columnHelper.accessor("total_approved_qty", {
        header: "approved quantity",
        cell: (info) => (
          <div className={`fw-bolder text-green`}>
            {info.row.original?.total_approved_qty}
          </div>
        ),
      }),
      columnHelper.accessor("transfer_stock_quantity", {
        header: "transferred quantity",
        cell: (info) => (
          <div className={`fw-bolder text-green`}>
            {info.row.original?.transfer_stock_quantity}
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original.status} />,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(
                    `/stock-request/create-stock-request/${info.row.original.id}?type=view`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <CustomTable
        id={"all_stock"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        excelAction={() => ""}
        pdfAction={() => ""}
        apiForExcelPdf={getAllTransferStockRequest}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              show: false,
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>all stock</strong>
          </div>
        }
      />
    </>
  );
};

export default AllStock;

{
  /* <Helmet>
        <title>All Fund · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <span className="d-align mt-3 me-3 justify-content-end gap-2">
          <span className="position-relative">
            <BsSearch className="position-absolute top-50 me-3 end-0 translate-middle-y" />
            <Form.Control
              type="text"
              placeholder={t("Search")}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="me-2"
              aria-label="Search"
            />
          </span>
        </span>

        <Row className="g-2 align-items-end ms-2">
          <ExportExcelPdf
            api={getAllTransferStockRequest}
            headerNames={headerNames}
          />
        </Row>

        <div className="p-3">
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Unique Id")}</th>
                  <th>{t("Request For")}</th>
                  <th>{t("Request Date")}</th>
                  <th>{t("Request Quantity")}</th>
                  <th>{t("Total Approved Quantity")}</th>
                  <th>{t("Transfered Quantity")}</th>
                  <th>{t("Status")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={15}>
                      <img
                        className="p-3"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                        alt="Loading"
                      />
                    </td>
                  </tr>
                ) : results.length > 0 ? (
                  results.map((data, id1) => (
                    <tr key={id1}>
                      <td>{data?.unique_id}</td>
                      <td>
                        <UserDetail
                          img={data?.request_for_image}
                          name={data?.request_for}
                          id={data?.request_for_id}
                          unique_id={data?.request_for_employee_id}
                          login_id={user.id}
                        />
                      </td>
                      <td>{data.request_date}</td>
                      <td className={`fw-bolder text-danger`}>
                        {data?.total_request_qty}
                      </td>
                      <td className={`fw-bolder text-green`}>
                        {data?.total_approved_qty}
                      </td>
                      <td className={`fw-bolder text-green`}>
                        {data?.transfer_stock_quantity}
                      </td>
                      <td
                        className={`text-${
                          data?.status === "0"
                            ? "warning"
                            : data?.status === "1"
                            ? "green"
                            : data?.status === "2"
                            ? "danger"
                            : data?.status === "3"
                            ? "orange"
                            : "success"
                        }`}
                      >
                        {data?.status}
                      </td>
                      <td>
                        <ActionButton
                          hideDelete={"d-none"}
                          hideEdit={"d-none"}
                          eyelink={`/stock-request/create-stock-request/${data.id}?type=view`}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={15}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <td colSpan={15}>
                  <ReactPagination
                    pageSize={pageSize}
                    prevClassName={
                      pageNo === 1
                        ? "danger-combo-disable pe-none"
                        : "red-combo"
                    }
                    nextClassName={
                      pageSize == pageDetail?.total
                        ? transferedStock.length - 1 < pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                        : transferedStock.length < pageSize
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
              </tfoot>
            </Table>
          </div>
        </div>
      </Col> */
}
