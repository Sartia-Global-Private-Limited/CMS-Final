import React, { useEffect, useMemo, useState } from "react";
import {
  getAllmeasurementByStatus,
  reactiveMeasurementsById,
} from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FilterComponentInMeasurement } from "./FilterComponentInMeasurement";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { IoRefreshCircleOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { AiOutlineFund } from "react-icons/ai";
import { AiOutlineStock } from "react-icons/ai";
import { ActionDropdown } from "../../components/ActionDropdown";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../components/DataTable/ActionButtons";
import StatusChip from "../../components/StatusChip";
import { serialNumber } from "../../utils/helper";
import { useTranslation } from "react-i18next";

export default function AllDiscards() {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const [complaintId, setComplaintId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [complaintFor, setComplaintFor] = useState("");
  const [salesAreaId, setSalesAreaId] = useState("");
  const [outletId, setOutletId] = useState("");
  const [regionalOfficeId, setRegionalOfficeId] = useState("");
  const [orderById, setOrderById] = useState("");
  const [poId, setPoId] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);
  const { t } = useTranslation();
  const [reactiveDetails, setReactiveDetails] = useState("");

  const fetchExpenseRequestData = async () => {
    let status = 2;
    const res = await getAllmeasurementByStatus({
      sales_area_id: salesAreaId,
      regional_office_id: regionalOfficeId,
      outlet_id: outletId,
      order_by_id: orderById,
      company_id: companyId,
      complaint_for: complaintFor,
      complaint_type: complaintId,
      po_id: poId,
      pageSize,
      pageNo,
      search,
      status,
    });
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    outletId,
    regionalOfficeId,
    salesAreaId,
    orderById,
    companyId,
    complaintFor,
    complaintId,
    poId,
  ]);

  const handleReactive = async () => {
    const data = {
      id: reactiveDetails?.id,
      complaint_id: reactiveDetails?.complaint_id,
      measurement_amount: reactiveDetails?.measurement_amount,
      po_id: reactiveDetails.po_id,
    };
    const res = await reactiveMeasurementsById(data);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== reactiveDetails.id));
    } else {
      toast.error(res.message);
    }

    setShowDiscard(false);
    setReactiveDetails({});
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
      columnHelper.accessor("complaint_unique_id", {
        header: "complaint No",
      }),
      columnHelper.accessor("complaint_type_name", {
        header: "complaint type",
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional Office",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area",
      }),
      columnHelper.accessor("company_name", {
        header: "company name",
      }),
      columnHelper.accessor("po_number", {
        header: "po number",
      }),
      columnHelper.accessor("order_by_name", {
        header: "order by",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => <StatusChip status={info.row.original?.status} />,
      }),
      columnHelper.accessor("measurement_amount", {
        header: "measurement amount",
      }),
      columnHelper.accessor("measurement_date", {
        header: "measurement date",
      }),
      columnHelper.accessor("po_limit", {
        header: "po amount",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () =>
                  navigate(`/view-measurement-details`, {
                    state: {
                      complaint_id: info.row.original?.id,
                    },
                  }),
              },
            }}
            custom={
              <ActionDropdown
                data={[
                  {
                    title: "re-active",
                    icon: <IoRefreshCircleOutline />,
                    onClick: () => {
                      setShowDiscard(true);
                      setReactiveDetails(info.row.original);
                    },
                  },

                  {
                    title: "Hard Copy",
                    icon: <FaRegCopy />,
                    onClick: () => {
                      const url = `/view-measurements/${info.row.original.complaint_id}`;
                      window.open(url, "_blank");
                    },
                  },
                  {
                    title: "Fund Details",
                    icon: <AiOutlineFund />,
                    onClick: () => {
                      const url = `/view-final-expense/${"fund"}/${
                        info.row.original.complaint_id
                      }`;
                      window.open(url, "_blank");
                    },
                  },
                  {
                    title: "Stock Details",
                    icon: <AiOutlineStock />,
                    onClick: () => {
                      const url = `/view-final-expense/${"stock"}/${
                        info.row.original.complaint_id
                      }`;
                      window.open(url, "_blank");
                    },
                  },
                ]}
              />
            }
          />
        ),
      }),
    ],
    [rows.length, pageNo, pageSize]
  );

  return (
    <div>
      <div className="m-2">
        <FilterComponentInMeasurement
          setSalesAreaId={setSalesAreaId}
          setOutletId={setOutletId}
          setRegionalOfficeId={setRegionalOfficeId}
          setOrderById={setOrderById}
          setCompanyId={setCompanyId}
          setComplaintFor={setComplaintFor}
          setComplaintId={setComplaintId}
          po_number={true}
          setPoId={setPoId}
          status={2}
          filterFor={"discard"}
        ></FilterComponentInMeasurement>
      </div>
      <CustomTable
        id={"resolved_complaints"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={userPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong> discard </strong>
          </div>
        }
      />
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleReactive}
        hide={setShowDiscard}
        show={showDiscard}
        title={"Confirm Re-active"}
        description={"Are you sure you want to re-active this!!"}
      />
    </div>
  );
}
