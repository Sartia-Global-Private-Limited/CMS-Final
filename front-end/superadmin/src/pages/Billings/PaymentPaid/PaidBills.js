import React, { useEffect, useMemo, useState } from "react";
import { Button } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  discardfinalInvoices,
  getAllAreaManagerInPaymentPaid,
  getAllPaidPaymentListing,
  getAllRoInPaymentPaid,
  postPaymentPaid,
} from "../../../services/contractorApi";
import { BsPlus } from "react-icons/bs";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import CustomTable, {
  IndeterminateCheckbox,
} from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import {
  formatNumberToINR,
  getDateValue,
  serialNumber,
} from "../../../utils/helper";
import TooltipComponent from "../../../components/TooltipComponent";
import { FilterSelect } from "../../../components/FilterSelect";

const PaidBills = () => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const { userPermission } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showDiscard, setShowDiscard] = useState(false);
  const [discardDetails, setDiscardDetails] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [allRo, setAllRo] = useState([]);
  const [allAreaManager, setAllAreaManager] = useState([]);
  const [roId, setRoId] = useState({ label: "", value: "" });
  const [areaMangerId, setAreaManagerId] = useState({ label: "", value: "" });
  const [amountData, setAmountData] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);

  const fetchAllInvoices = async () => {
    const res = await getAllPaidPaymentListing(
      pageSize,
      pageNo,
      search,
      roId?.value,
      areaMangerId?.value
    );
    setIsLoading(true);
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };
  const fetchAllRo = async () => {
    const res = await getAllRoInPaymentPaid();
    if (res.status) {
      setAllRo(
        res.data?.map((itm) => ({
          label: itm?.ro_name,
          value: itm?.ro_id,
        }))
      );
    } else {
      setAllRo([]);
    }
  };

  const fetchAreaManager = async () => {
    const res = await getAllAreaManagerInPaymentPaid();
    if (res.data) {
      setAllAreaManager(
        res.data?.map((itm) => ({
          label: itm?.area_manager_name,
          value: itm?.area_manager_id,
        }))
      );
    } else {
      setAllAreaManager([]);
    }
  };

  const calculateTotals = (rows) => {
    const totalMeasurement = rows.reduce(
      (total, item) => total + item.measurement_amount,
      0
    );

    const totalDeduction = rows.reduce(
      (total, item) => total + +item.deduction.deduction,
      0
    );

    const finalManagerAmount = rows.reduce(
      (total, item) => total + item.manager_amount,
      0
    );

    return {
      total_measurement: totalMeasurement,
      total_deduction: totalDeduction,
      final_manager_amount: finalManagerAmount,
    };
  };

  const handleRowSelection = (isChecked, rowId, rowData) => {
    setSelectedRows((prev) => {
      if (isChecked) {
        return [...prev, rowData];
      }
      return prev.filter((row) => row.id !== rowId);
    });
  };

  useEffect(() => {
    if (selectedRows.length > 0) {
      setAmountData(calculateTotals(selectedRows));
    } else {
      setAmountData({});
    }
  }, [selectedRows]);

  const handleSelectAllRows = (isChecked) => {
    if (isChecked) {
      setSelectedRows([...rows]);
      setAmountData(calculateTotals(rows));
    } else {
      setSelectedRows([]);
      setAmountData({});
    }
  };

  const handleDiscard = async () => {
    const res = await discardfinalInvoices(discardDetails?.id);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
    setShowDiscard(false);
    setDiscardDetails("");
  };

  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("invoice_no", {
        header: "Bill Number",
      }),
      columnHelper.accessor("invoice_date", {
        header: "Bill Date",
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("measurement_amount", {
        header: "Measurement Amount",
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: "Complaint Number",
      }),
      columnHelper.accessor("po_number", {
        header: "PO Number",
      }),
      columnHelper.accessor("po_date", {
        header: "PO Date",
        cell: (info) => getDateValue(info.getValue()),
      }),
      columnHelper.accessor("area_manager_detail.user_name", {
        header: "Area Manager",
      }),
      columnHelper.accessor("ro_name", {
        header: "Regional Office",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "Sales Area",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("payment_voucher_number", {
        header: "PV Number",
      }),
      columnHelper.accessor("payment_voucher_date", {
        header: "PV Date",
        cell: (info) => getDateValue(info.getValue()),
      }),
    ];

    if (roId?.value && areaMangerId?.value) {
      //   baseColumns.unshift(selectable);
      baseColumns.unshift({
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllPageRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: (e) => {
                table.getToggleAllPageRowsSelectedHandler()(e);
                handleSelectAllRows(e.target.checked);
              },
            }}
          />
        ),
        cell: ({ row }) => (
          <IndeterminateCheckbox
            value={row.original.id}
            {...{
              checked: row.getIsSelected(),
              indeterminate: row.getIsSomeSelected(),
              onChange: (e) => {
                row.getToggleSelectedHandler()(e);
                handleRowSelection(
                  e.target.checked,
                  row.original.id,
                  row.original
                );
              },
            }}
          />
        ),
      });
    }

    return baseColumns;
  }, [rows, roId?.value, areaMangerId?.value, pageNo, pageSize]);

  useEffect(() => {
    fetchAllInvoices();
  }, [pageSize, pageNo, roId?.value, areaMangerId.value, refresh]);

  useEffect(() => {
    fetchAllRo();
    fetchAreaManager();
  }, []);

  const handleSubmit = async (ids) => {
    const filteredData = rows?.filter((item) =>
      ids?.includes(item.complaint_id)
    );

    const payment_data = filteredData.map((data) => {
      return {
        billNumber: data.invoice_no,
        bill_date: data.invoice_date,
        complaint_id: data.complaint_id,
        measurement_id: data.measurement_id,
        pv_number: data.pv_number,
        pv_date: data.payment_voucher_date,
        deduction: data?.deduction?.deduction?.toFixed(2),
      };
    });

    const sData = {
      manager_id: filteredData[0]?.area_manager_detail.area_manager_id,
      ro_id: filteredData[0]?.ro_id,
      paid_payment: parseFloat(amountData?.final_manager_amount).toFixed(2),
      payment_data,
    };
    // return console.log("sData", sData);
    const res = await postPaymentPaid(sData);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
      // navigate(-1);
    } else {
      toast.error(res.message);
    }
  };
  return (
    <>
      <Helmet>
        <title>Paid Bills · CMS Electricals</title>
      </Helmet>
      <FilterSelect
        data={[
          {
            id: roId,
            setId: setRoId,
            title: t("regional office"),
            data: allRo,
          },
          {
            id: areaMangerId,
            setId: setAreaManagerId,
            title: t("area manager"),
            data: allAreaManager,
          },
          {
            title: t("measurement Amount"),
            text: formatNumberToINR(amountData?.total_measurement),
          },
          {
            title: t("deduction Amount"),
            text: formatNumberToINR(amountData?.total_deduction),
          },
          {
            title: t("Final Amount"),
            text: formatNumberToINR(
              amountData?.total_measurement - amountData?.total_deduction
            ),
          },
          {
            title: t("manager Amount"),
            text: formatNumberToINR(amountData?.final_manager_amount),
          },
        ]}
      />
      <CustomTable
        id={"paid_bills"}
        // maxHeight={"40vh"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        customHeaderComponent={(selectedRows) => (
          <TableHeader
            userPermission={userPermission}
            setSearchText={setSearch}
            button={{ show: false }}
            extraComponent={
              roId?.value &&
              areaMangerId?.value &&
              rows?.length > 0 &&
              selectedRows?.info?.length > 0 && (
                <TooltipComponent title={"Create Payment"} align="top">
                  <Button
                    variant="success"
                    disabled={
                      (
                        amountData?.total_measurement -
                        amountData?.total_deduction
                      ).toFixed(2) < 0
                    }
                    onClick={(e) => {
                      handleSubmit(
                        selectedRows?.info.map(
                          (itm) => itm.original.complaint_id
                        )
                      );
                    }}
                  >
                    <BsPlus />
                    {t("Create Payment")}
                  </Button>
                </TooltipComponent>
              )
            }
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Paid Bills</strong>
          </div>
        }
      />

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDiscard}
        hide={setShowDiscard}
        show={showDiscard}
        title={"Confirm Discard"}
        description={"Are you sure you want to discard this!!"}
      />
    </>
  );
};

export default PaidBills;
