import React, { useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { BsBoxArrowInRight } from "react-icons/bs";
import { getAdminChangeClockTime } from "../../../services/authapi";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import CustomTable from "../../../components/DataTable/CustomTable";
import { createColumnHelper } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { serialNumber } from "../../../utils/helper";

const MemberClockOut = ({ clockOut, setRefresh, refresh }) => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [totalData, setTotalData] = useState(0);
  const columnHelper = createColumnHelper();

  const handleClockOut = async (clockData) => {
    const sData = {
      id: clockData.id,
      type: "clock in",
    };
    const res = await getAdminChangeClockTime(sData);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setRefresh(!refresh);
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("user_name", {
        header: t("Employee Name"),
        cell: (info) => (
          // <UserDetail
          //   img={info.row.original?.user_image}
          //   name={info.row.original?.user_name}
          // />
          <div className="text-truncate text-start">
            <img
              className="avatar me-2"
              src={
                info.row.original?.image
                  ? `${process.env.REACT_APP_API_URL}${info.row.original?.user_image}`
                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
              }
            />
            {info.row.original?.user_name}
          </div>
        ),
      }),
      columnHelper.accessor("date", {
        header: t("Date"),
      }),
      columnHelper.accessor("status", {
        header: t("Status"),
      }),
      columnHelper.accessor("clockOut", {
        header: t("Clock Out"),
        cell: (info) => (
          <span className="d-align gap-2">
            <span
              onClick={() => handleClockOut(info.row.original)}
              className="social-btn-re d-align gap-2 px-3 w-auto success-combo"
            >
              <BsBoxArrowInRight /> {t("Clock In")}
            </span>
          </span>
        ),
      }),
    ],
    [clockOut.length, pageNo, pageSize]
  );

  return (
    <>
      <CustomTable
        id={"member_clockOut"}
        // isLoading={isLoading}
        rows={clockOut || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        hideFilters={false}
      />
    </>
  );
};

export default MemberClockOut;
