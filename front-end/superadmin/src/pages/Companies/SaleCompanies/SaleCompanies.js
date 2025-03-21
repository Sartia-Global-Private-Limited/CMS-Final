import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../../../components/DataTable/CustomTable";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import TableHeader from "../../../components/DataTable/TableHeader";
import {
  deleteAdminCompanies,
  getAdminSaleCompanies,
  getAllCitiesByCompany,
} from "../../../services/authapi";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { UserPlus } from "lucide-react";
import { FilterSelect } from "../../../components/FilterSelect";
import { serialNumber } from "../../../utils/helper";

const SaleCompanies = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [allCity, setAllCity] = useState([]);
  const [cityId, setCityId] = useState("");

  const fetchMyCompaniesData = async () => {
    const res = await getAdminSaleCompanies({
      search,
      pageSize,
      pageNo,
      city: cityId?.label,
    });
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const fetchCityData = async () => {
    const res = await getAllCitiesByCompany({ type: 1 });
    if (res.status) {
      setAllCity(
        res?.data?.map((city) => {
          return { value: city.city_id, label: city.city_name };
        })
      );
    } else {
      setAllCity([]);
    }
  };

  const handleDelete = async () => {
    const module = "my-company";
    const res = await deleteAdminCompanies(idToDelete, module);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.company_id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
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
      columnHelper.accessor("company_unique_id", {
        header: "ID",
      }),
      columnHelper.accessor("company_name", {
        header: "Name",
      }),
      columnHelper.accessor("gst_number", {
        header: t("gst number"),
        cell: (info) =>
          info.row.original?.gst_details?.map((item) => {
            return item?.is_default == "1" ? item?.gst_number : "-";
          }),
      }),
      columnHelper.accessor("pan_number", {
        header: t("pan number"),
      }),
      columnHelper.accessor("company_mobile", {
        header: t("phone number"),
      }),
      columnHelper.accessor("state_name", {
        header: t("State"),
      }),
      columnHelper.accessor("city_name", {
        header: t("City"),
      }),
      columnHelper.accessor("pin_code", {
        header: t("Pin Code"),
      }),
      columnHelper.accessor("company_type_name", {
        header: t("Company Type"),
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
                    `/SaleCompanies/ViewCompany/${info.row.original.company_id}`,
                    { state: info.row.original }
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/SaleCompanies/AddSaleCompanies/${info.row.original.company_id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(`${info.row.original.company_id}`);
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

  useEffect(() => {
    fetchMyCompaniesData();
    fetchCityData();
  }, [search, pageNo, pageSize, cityId]);

  return (
    <>
      <FilterSelect
        data={[
          {
            id: cityId,
            setId: setCityId,
            title: "Locations",
            data: allCity,
          },
        ]}
      />
      <CustomTable
        id={"sale_company"}
        userPermission={checkPermission}
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
        apiForExcelPdf={getAdminSaleCompanies}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/SaleCompanies/AddSaleCompanies/new`,
              title: "Add Client",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>Client</strong>
          </div>
        }
      />

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

export default SaleCompanies;
