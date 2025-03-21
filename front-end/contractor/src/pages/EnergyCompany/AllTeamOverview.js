import React, { useEffect, useMemo, useState } from "react";
import {
  deleteEnergyCompanyById,
  getAreaManagerInEnergyCompanyById,
} from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllEneryComnies } from "../../services/authapi";
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

const AllTeamOverview = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [idToDelete, setIdToDelete] = useState("");
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(false);
  const [energyId, setEnergyId] = useState({ label: "", value: "" });
  const [allEnergy, setAllEnergy] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
  const fetchAllManagerData = async () => {
    const id = "";
    const res = await getAreaManagerInEnergyCompanyById(
      energyId.value,
      id,
      search,
      pageSize,
      pageNo
    );
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
    fetchAllManagerData();
  }, [energyId.value, idToDelete, search, pageSize, pageNo]);

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
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <FilterSelect
        data={[
          {
            id: energyId,
            setId: setEnergyId,
            title: "Energy Company",
            data: allEnergy,
            hyperText: "Please select Energy Company",
          },
        ]}
      />

      <CustomTable
        id={"energy_team"}
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
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/team/create-energy-team/new`,
              title: "Create",
            }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong>All Energy Team Members</strong>
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
