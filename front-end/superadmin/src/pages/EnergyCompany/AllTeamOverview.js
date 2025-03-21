import React, { useEffect, useMemo, useState } from "react";
import {
  deleteEnergyCompanyById,
  getAreaManagerInEnergyCompanyById,
} from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  getAllEneryComnies,
  getAllRegionalByEnergyCompany,
  getAllSalesAreaByEnergyCompany,
  getAllZoneByEnergyCompany,
  getAllDistrictByEnergyCompany,
} from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { UserPlus } from "lucide-react";
import { FilterSelect } from "../../components/FilterSelect";
import { serialNumber } from "../../utils/helper";
import { useTranslation } from "react-i18next";

const AllTeamOverview = ({ checkPermission }) => {
  const { t } = useTranslation();
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [idToDelete, setIdToDelete] = useState("");
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(true);
  const [energyId, setEnergyId] = useState({ label: "", value: "" });
  const [zoneId, setZoneId] = useState({ label: "", value: "" });
  const [regionalId, setRegionalId] = useState({ label: "", value: "" });
  const [salesId, setSalesId] = useState({ label: "", value: "" });
  const [districtId, setDistrictId] = useState({ label: "", value: "" });
  const [allEnergy, setAllEnergy] = useState([]);
  const [allZone, setAllZone] = useState([]);
  const [allRegional, setAllRegional] = useState([]);
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const navigate = useNavigate();

  const fetchEnergyData = async () => {
    const res = await getAllEneryComnies();
    if (res.status) {
      setAllEnergy(
        res.data?.map((itm) => ({
          label: itm?.name,
          value: itm?.energy_company_id,
        }))
      );
    } else {
      setAllEnergy([]);
    }
  };

  const fetchZoneData = async () => {
    const res = await getAllZoneByEnergyCompany(energyId?.value);
    if (res.status) {
      setAllZone(
        res.data?.map((itm) => ({
          label: itm?.zone_name,
          value: itm?.zone_id,
        }))
      );
    } else {
      setAllZone([]);
    }
  };

  const fetchRegionalData = async () => {
    const res = await getAllRegionalByEnergyCompany(energyId?.value);
    if (res.status) {
      setAllRegional(
        res.data?.map((itm) => ({
          label: itm?.ro_name,
          value: itm?.ro_id,
        }))
      );
    } else {
      setAllRegional([]);
    }
  };

  const fetchSalesAreaData = async () => {
    const res = await getAllSalesAreaByEnergyCompany(energyId?.value);
    if (res.status) {
      setAllSalesArea(
        res.data?.map((itm) => ({
          label: itm?.sales_area_name,
          value: itm?.sales_area_id,
        }))
      );
    } else {
      setAllSalesArea([]);
    }
  };

  const fetchDistrictData = async () => {
    const res = await getAllDistrictByEnergyCompany(energyId?.value);
    if (res.status) {
      setAllDistrict(
        res.data?.map((itm) => ({
          label: itm?.district_name,
          value: itm?.district_id,
        }))
      );
    } else {
      setAllDistrict([]);
    }
  };

  const fetchAllManagerData = async () => {
    const id = "";
    const res = await getAreaManagerInEnergyCompanyById({
      id: energyId.value,
      // id,
      zone_id: zoneId.value,
      regional_office_id: regionalId.value,
      sales_area_id: salesId.value,
      district_id: districtId.value,
      search,
      pageSize,
      pageNo,
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

  const handleDelete = async () => {
    const res = await deleteEnergyCompanyById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((data) => data.user_id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchEnergyData();
    fetchZoneData();
    fetchRegionalData();
    fetchSalesAreaData();
    fetchDistrictData();
    fetchAllManagerData();
  }, [
    energyId.value,
    idToDelete,
    search,
    pageSize,
    pageNo,
    zoneId.value,
    regionalId.value,
    salesId.value,
    districtId.value,
    setActiveField,
  ]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info.row.index];
        },
      }),
      columnHelper.accessor("username", {
        header: "Username",
      }),
      columnHelper.accessor("mobile", {
        header: "Mobile No.",
      }),
      columnHelper.accessor("email", {
        header: "email",
      }),
      columnHelper.accessor("country", {
        header: "country",
      }),
      columnHelper.accessor("city", {
        header: "city",
      }),
      columnHelper.accessor("pin_code", {
        header: "pin code",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/team/view-energy-team`, {
                    state: {
                      id: info.row.original.user_id,
                      energy_company_id: info.row.original.energy_company_id,
                    },
                  }),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/team/create-energy-team/${info.row.original.user_id}`,
                    {
                      state: {
                        energy_company_id: info.row.original.energy_company_id,
                      },
                    }
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(`${info.row.original.user_id}`);
                  setShowDelete(true);
                },
              },
            }}
          />
        ),
      }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  const handleFieldChange = (fieldName, selectedOption, setFieldState) => {
    setFieldState(selectedOption);
    if (selectedOption && Object.keys(selectedOption).length > 0) {
      setActiveField(fieldName);
    } else {
      setActiveField(null);
    }
  };

  return (
    <>
      <FilterSelect
        data={[
          {
            id: energyId,
            setId: setEnergyId,
            title: "Energy Company",
            data: allEnergy,
          },
          {
            id: zoneId,
            setId: (value) => handleFieldChange("zone", value, setZoneId),
            title: "Zone",
            data: allZone,
            isDisabled: activeField && activeField !== "zone",
          },
          {
            id: regionalId,
            setId: (value) =>
              handleFieldChange("regional", value, setRegionalId),
            title: "Regional",
            data: allRegional,
            isDisabled: activeField && activeField !== "regional",
          },
          {
            id: salesId,
            setId: (value) => handleFieldChange("sales", value, setSalesId),
            title: "Sales Area",
            data: allSalesArea,
            isDisabled: activeField && activeField !== "sales",
          },
          {
            id: districtId,
            setId: (value) =>
              handleFieldChange("district", value, setDistrictId),
            title: "District",
            data: allDistrict,
            isDisabled: activeField && activeField !== "district",
          },
        ]}
      />

      <CustomTable
        id={"energy_team_overview"}
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
        id={energyId?.value}
        apiForExcelPdf={getAreaManagerInEnergyCompanyById}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/team/create-energy-team/new`,
              title: "Create Team",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>All Team Member Overview</strong>
          </div>
        }
      />
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowDelete}
        show={showDelete}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default AllTeamOverview;
