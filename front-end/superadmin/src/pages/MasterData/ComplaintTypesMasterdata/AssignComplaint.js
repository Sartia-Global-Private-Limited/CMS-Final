import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import moment from "moment";
import {
  getApprovelDataList,
  getApprovelMemberList,
  postApprovelMemberList,
} from "../../../services/authapi";
import { toast } from "react-toastify";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import CustomTable, {
  selectable,
} from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { useTranslation } from "react-i18next";
import TooltipComponent from "../../../components/TooltipComponent";
import { FilterSelect } from "../../../components/FilterSelect";
import { serialNumber } from "../../../utils/helper";

const AssignComplaint = ({ refresh }) => {
  const [assign, setAssign] = useState([]);
  const [roleId, setRoleId] = useState("");
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchApprovedData = async () => {
    const res = await getApprovelDataList(search, pageSize, pageNo);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handlerSubmit = async (ids) => {
    const sData = {
      role_id: roleId.value,
      complaint_list: ids,
    };
    // return console.log("sData", sData);
    const res = await postApprovelMemberList(sData);
    if (res.status) {
      toast.success(res.message);
      fetchApprovedData();
    } else {
      toast.error(res.message);
    }
  };

  // Only Use for Assign
  const fetchAssignData = async () => {
    const res = await getApprovelMemberList();
    if (res.status) {
      setAssign(
        res.data?.map((itm) => ({
          label: itm?.name,
          value: itm?.id,
        }))
      );
    } else {
      setAssign([]);
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchApprovedData();
    fetchAssignData();
  }, [search, pageSize, pageNo, refresh]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("ec_name", {
        header: t("energy company name"),
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: t("complaint no."),
      }),
      columnHelper.accessor("complaint_type_name", {
        header: t("complaint type"),
      }),
      columnHelper.accessor("complaint_create_date", {
        header: t("date"),
        cell: (info) =>
          moment(info.row.original.complaint_create_date).format("DD-MM-YYYY"),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => <div className="text-success">new Complaints</div>,
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(
                    `/AllComplaintsMasterdata/ViewUserComplaint/${info.row.original.id}`
                  ),
              },
            }}
          />
        ),
      }),
    ],
    [rows.length, pageNo, pageSize]
  );

  return (
    <>
      <FilterSelect
        data={[
          {
            id: roleId,
            setId: setRoleId,
            title: t("select role"),
            data: assign,
          },
        ]}
      />
      <CustomTable
        id={"assign_complaint"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        align={"bottom"}
        customHeaderComponent={(selectedRows) => (
          <TableHeader
            userPermission={userPermission}
            setSearchText={setSearch}
            button={{ show: false }}
            extraComponent={
              <TooltipComponent title={"approve"} align="top">
                <Button
                  variant="success"
                  onClick={() => {
                    handlerSubmit(
                      selectedRows.info.map((itm) => itm.original.id)
                    );
                  }}
                >
                  {t("submit")}
                </Button>
              </TooltipComponent>
            }
          />
        )}
        tableTitleComponent={
          <div>
            <strong>assign complaints</strong>
          </div>
        }
      />
    </>
  );
};

export default AssignComplaint;
