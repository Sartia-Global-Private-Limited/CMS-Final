import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Col } from "react-bootstrap";
import CardComponent from "../../../components/CardComponent";
import Select from "react-select";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../../components/ConfirmAlert";
import {
  deleteBillNoFormatById,
  deleteItemNoFormatById,
  getAllBillNoFormat,
  getAllFinancialYears,
  getAllItemNoFormat,
  updateItemFormateStatus,
} from "../../../services/contractorApi";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import CustomTable from "../../../components/DataTable/CustomTable";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import TableHeader from "../../../components/DataTable/TableHeader";
import Switch from "../../../components/Switch";
import { serialNumber } from "../../../utils/helper";

const ItemNoFormat = ({ checkPermission }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchItemNoFormatData = async () => {
    const res = await getAllItemNoFormat(search, pageSize, pageNo);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const showFinancialYearApi = async () => {
    const res = await getAllFinancialYears();
    if (res.status) {
      setAllFinancialYear(res.data);
    } else {
      setAllFinancialYear([]);
    }
  };

  const handleDelete = async () => {
    const res = await deleteItemNoFormatById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchItemNoFormatData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const handleChangeStatus = async (id, status) => {
    const sData = {
      id,
      status: status === 1 ? 0 : 1,
    };

    const res = await updateItemFormateStatus(sData);
    if (res.status) {
      toast.success(res.message);
      fetchItemNoFormatData();
    } else {
      toast.error(res.message);
    }
  };

  useEffect(() => {
    fetchItemNoFormatData();
    showFinancialYearApi();
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
      columnHelper.accessor("type", {
        header: t("Type"),
      }),
      columnHelper.accessor("prefix", {
        header: t("Prefix"),
      }),
      columnHelper.accessor("financial_year_format", {
        header: t("Financial Year Format"),
      }),
      columnHelper.accessor("start_item_number", {
        header: t("Start Item Number"),
      }),
      columnHelper.accessor("financial_year", {
        header: t("Financial Year"),
      }),
      columnHelper.accessor("sample_format", {
        header: t("Sample Format"),
      }),
      // columnHelper.accessor("company_type_name", {
      //   header: t("Status"),
      //   cell: (info) => (
      //     <Switch
      //       checked={+info.row.original.status === 1}
      //       onChange={() =>
      //         handleChangeStatus(
      //           info.row.original.id,
      //           +info.row.original.status
      //         )
      //       }
      //     />
      //   ),
      // }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/item-no-format/create-item-no-format/${info.row.original?.id}`
                  ),
              },
              delete: {
                show: false,
                action: () => {
                  setIdToDelete(`${info.row.original?.id}`);
                  setShowAlert(true);
                },
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Helmet>
        <title>Item Number Format · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"item_no_formate"}
          userPermission={checkPermission}
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
              userPermission={checkPermission}
              button={{
                show: false,
                noDrop: true,
                to: `/item-no-format/create-item-no-format/new`,
                title: "Create",
              }}
              // extraComponent={
              //   <Select
              //     menuPortalTarget={document.body}
              //     placeholder={t("Financial Year")}
              //     options={allFinancialYear?.map((year) => ({
              //       label: year.year_name,
              //       value: year.year_name,
              //     }))}
              //     isClearable
              //     onChange={(e) => {
              //       setSearch(e ? e.value : null);
              //     }}
              //   />
              // }
            />
          )}
          tableTitleComponent={
            <div>
              <strong>Fund | Stock Number Format</strong>
            </div>
          }
        />
      </Col>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default ItemNoFormat;
