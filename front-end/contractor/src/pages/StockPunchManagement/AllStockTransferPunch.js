import React, { useEffect, useMemo, useState } from "react";
import { Col, Row, Spinner, Table } from "react-bootstrap";
import ReactPagination from "../../components/ReactPagination";
import { getStockPunchTransferList } from "../../services/contractorApi";
import { Helmet } from "react-helmet";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageViewer from "../../components/ImageViewer";
import CardComponent from "../../components/CardComponent";
import { BiTransfer } from "react-icons/bi";
import ActionButton from "../../components/ActionButton";
import { useDebounce } from "../../hooks/UseDebounce";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import ExportExcelPdf from "../../components/ExportExcelPdf";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { createColumnHelper } from "@tanstack/react-table";
import { UserDetail, UserDetails } from "../../components/ItemDetail";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { serialNumber } from "../../utils/helper";

const AllStockTransferPunch = ({ checkPermission }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const formattedDate = moment(startDate).format("YYYY-MM");

  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchStockPunchTransferData = async () => {
    const res = await getStockPunchTransferList({
      search: searchTerm,
      pageSize,
      pageNo,
      month: formattedDate,
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

  const debounceValue = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchStockPunchTransferData();
  }, [debounceValue, pageNo, pageSize, formattedDate]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("transfer_by", {
        header: t("Transfer By"),
        cell: (info) => (
          <UserDetails
            img={info.row.original?.transfer_by?.image}
            name={info.row.original?.transfer_by?.name}
            id={info.row.original?.id}
            unique_id={info.row.original?.transfer_by?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("transfer_to_details", {
        header: t("Transfer To"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.transfer_to_details?.image}
            name={info.row.original?.transfer_to_details?.name}
            id={info.row.original?.transfer_to_details?.id}
            unique_id={info.row.original?.transfer_to_details?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("item_name", {
        header: t("Item Name"),
        cell: (info) =>
          info.row.original?.item_name ? info.row.original?.item_name : "-",
      }),
      columnHelper.accessor("brands", {
        header: t("Brand Name"),
        cell: (info) =>
          info.row?.original?.brands?.map((item, idx) => (
            <span key={idx} className="p-1 shadow rounded">
              {item?.brand_name ?? "-"}
            </span>
          )),
      }),
      columnHelper.accessor("supplier_name", {
        header: t("supplier Name"),
        cell: (info) =>
          info.row.original?.supplier_name
            ? info.row.original?.supplier_name
            : "-",
      }),
      columnHelper.accessor("transfer_amounts", {
        header: t("Total Amount"),
        cell: (info) =>
          info.row.original?.transfer_amounts
            ? info.row.original?.transfer_amounts
            : "-",
      }),
      columnHelper.accessor("transfered_date", {
        header: t("Transfer date & time"),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-stock-punch-transfer`, {
                    state: {
                      transfer_by_id: info.row?.original?.transfer_by?.id,
                      transfer_to_id:
                        info.row?.original?.transfer_to_details?.id,
                    },
                  }),
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
      <Helmet>
        <title>Stock Punch · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className="card-bg "
          title={"stock punch transfer"}
          search={true}
          searchOnChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          link={`/create-stock-punch-transfer`}
          icon={<BiTransfer />}
          tag={"Transfer"}
          custom={
            <>
              <Col md={4}>
                <DatePicker
                  className="p-1 me-1 z-3 shadow-none border-primary bg-transparent"
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  selected={startDate}
                  placeholderText="--select month--"
                  onChange={(date) => setStartDate(date)}
                />
              </Col>
            </>
          }
        >
          <CustomTable
            id={"all_stock_transfer"}
            isLoading={isLoading}
            rows={rows || []}
            columns={columns}
            pagination={{
              pageNo,
              pageSize,
              totalData,
            }}
            // align={"bottom"}
            excelAction={true}
            pdfAction={true}
            apiForExcelPdf={getStockPunchTransferList}
            customHeaderComponent={() => (
              <TableHeader
                button={{ show: false }}
                userPermission={checkPermission}
              />
            )}
          />
        </CardComponent>
      </Col>
    </>
  );
};

export default AllStockTransferPunch;
