import React, { useEffect, useMemo, useState } from "react";
import ActionButton from "../../components/ActionButton";
import { Badge, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import { getApprovedStockPunch } from "../../services/contractorApi";
import ReactPagination from "../../components/ReactPagination";
import ImageViewer from "../../components/ImageViewer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";
import ExportExcelPdf from "../../components/ExportExcelPdf";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { UserDetail } from "../../components/ItemDetail";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { serialNumber } from "../../utils/helper";

const CheckAndAppove = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchStockPunchApprovedData = async () => {
    const res = await getApprovedStockPunch({
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

  // set Delay time to get data on search
  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    fetchStockPunchApprovedData();
  }, [debounceValue, pageNo, pageSize]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("employee_id", {
        header: "employee id",
      }),
      columnHelper.accessor("user_name", {
        header: "user name",
        cell: (info) => (
          <UserDetail
            img={info.row.original?.user_image}
            name={info.row.original?.user_name}
            id={info.row.original?.user_id}
            unique_id={info.row.original?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("item_name", {
        header: "item name",
        cell: (info) => (
          <div>
            <ImageViewer
              src={
                info.row.original?.item_images
                  ? `${process.env.REACT_APP_API_URL}${info.row.original?.item_images}`
                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
              }
            >
              <span className="d-flex align-items-center gap-2">
                <img
                  width={30}
                  height={30}
                  className="my-bg object-fit p-1 rounded-circle"
                  src={
                    info.row.original?.item_images
                      ? `${process.env.REACT_APP_API_URL}${info.row.original?.item_images}`
                      : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
                  }
                />{" "}
                <span className="d-grid">
                  {info.row.original?.item_name || "-"}{" "}
                </span>
              </span>
            </ImageViewer>
          </div>
        ),
      }),
      columnHelper.accessor("brand_name", {
        header: "brand name",
      }),
      columnHelper.accessor("total_items", {
        header: "total items",
        cell: (info) => (
          <div className="text-center">
            {
              <Badge
                bg="secondary"
                className="fw-normal"
                style={{ fontSize: 11, marginTop: "5px" }}
              >
                {info.row.original?.total_items} {t("item")}
              </Badge>
            }
          </div>
        ),
      }),
      columnHelper.accessor("approved_at", {
        header: "date",
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
                    `/stock-punch/create-stock-punch/${info.row.original.id}?type=view`,
                    {
                      state: {
                        Complain_id: info.row.original.complaint_id,
                        userId: info.row.original.user_id,
                        viewType: "approveData",
                      },
                    }
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
        id={"stock_request"}
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
        apiForExcelPdf={getApprovedStockPunch}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/stock-punch/create-stock-punch/new`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>stock punch</strong>
          </div>
        }
      />
    </>
  );
};

export default CheckAndAppove;

{
  /* <div className="p-3">
  <div className="table-scroll">
    <Table className="text-body bg-new Roles">
      <thead className="text-truncate">
        <tr>
          <th>{t("employee Id")}</th>
          <th>{t("User Name")}</th>
          <th>{t("Complaint Number")}</th>
          <th>{t("Items Name")}</th>
          <th>{t("Brand Name")}</th>
          <th>{t("Total Items")}</th>
          <th>{t("date")}</th>
          <th>{t("Action")}</th>
        </tr>
      </thead>
      <tbody>
        {approveStockRequest.length > 0 ? null : (
          <tr>
            <td colSpan={8}>
              <img
                className="p-3"
                alt="no-result"
                width="250"
                src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
              />
            </td>
          </tr>
        )}

        {approveStockRequest.map((data, id1) => (
          <tr key={id1}>
            <td>{data?.employee_id || "-"}</td>
            <td>
              <UserDetail
                img={data?.user_image}
                name={data?.user_name}
                id={data?.user_id}
                unique_id={data?.employee_id}
                login_id={user.id}
              />
            </td>

            <td>{data?.complainsDetails?.complaint_unique_id ?? "-"}</td>
            <td>{data?.item_name ?? "-"}</td>
            <td>{data?.brand_name ?? "-"}</td>

            <td className="text-center">
              {
                <Badge
                  bg="secondary"
                  className="fw-normal"
                  style={{ fontSize: 11, marginTop: "5px" }}
                >
                  {data?.total_items} {t("item")}
                </Badge>
              }
            </td>

            <td>{data.approved_at ?? "-"}</td>

            <td>
              <ActionButton
                hideDelete={"d-none"}
                hideEdit={"d-none"}
                approveMargin={false}
                approveAlign={"left"}
                eyeOnclick={() =>
                  navigate(
                    `/stock-punch/create-stock-punch/${data.id}?type=view`,
                    {
                      state: {
                        Complain_id: data.complaint_id,
                        userId: data.user_id,
                        viewType: "approveData",
                      },
                    }
                  )
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <td colSpan={10}>
          <ReactPagination
            pageSize={pageSize}
            prevClassName={
              pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
            }
            nextClassName={
              pageSize == pageDetail?.total
                ? approveStockRequest.length - 1 < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
                : approveStockRequest.length < pageSize
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
</div> */
}
