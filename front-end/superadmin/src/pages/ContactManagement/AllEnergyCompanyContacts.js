import React, { useEffect, useMemo, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import {
  deleteEnergyCompanyById,
  getAreaManagerInEnergyCompanyByIdInContact,
} from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllEneryComnies } from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import { FilterSelect } from "../../components/FilterSelect";
import CustomTable, {
  selectable,
} from "../../components/DataTable/CustomTable";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import TableHeader from "../../components/DataTable/TableHeader";
import TooltipComponent from "../../components/TooltipComponent";
import { Send, UserPlus } from "lucide-react";
import { serialNumber } from "../../utils/helper";

const AllEnergyCompanyContacts = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const [allManagerId, setAllManagerId] = useState("");
  const [energyId, setEnergyId] = useState({ label: "", value: "" });
  const [allEnergy, setAllEnergy] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
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
    const res = await getAreaManagerInEnergyCompanyByIdInContact(
      energyId.value,
      id,
      search,
      pageSize,
      pageNo
    );
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteEnergyCompanyById(allManagerId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((data) => data.id != allManagerId));
    } else {
      toast.error(res.message);
    }
    setAllManagerId("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchEnergyData();
    fetchAllManagerData();
  }, [energyId.value, allManagerId]);

  const columns = useMemo(
    () => [
      selectable,
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
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Helmet>
        <title>Outlet Management · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
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
          id={"all_energy_company"}
          userPermission={checkPermission}
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
              userPermission={checkPermission}
              setSearchText={setSearch}
              button={{ show: false }}
              extraComponent={
                selectedRows?.info?.length > 0 && (
                  <TooltipComponent title={"Send Message"} align="top">
                    <Button
                      variant="success"
                      onClick={() => {
                        navigate(`/contacts/energy/send-messages/new`, {
                          state: {
                            id: selectedRows.info.map((itm) => itm.original.id),
                            data: rows,
                          },
                        });
                      }}
                    >
                      <Send size={14} className="me-1" />
                      Send Messages
                    </Button>
                  </TooltipComponent>
                )
              }
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>oil and gas</strong>
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
      </Col>
    </>
  );
};

export default AllEnergyCompanyContacts;
