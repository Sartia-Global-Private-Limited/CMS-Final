import React, { useEffect, useMemo, useState } from "react";
import { Button, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import { deleteOutletById, getAllOutlet } from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable from "../../components/DataTable/CustomTable";
import TooltipComponent from "../../components/TooltipComponent";
import { FaFileExcel } from "react-icons/fa";
import { FilterSelect } from "../../components/FilterSelect";
import {
  getAllDistrictByOutlet,
  getAllEneryComnies,
  getAllRegionalByOutlet,
  getAllSalesAreaByOutlet,
  getAllZoneByOutlet,
} from "../../services/authapi";
import { serialNumber } from "../../utils/helper";
import { UserDetail } from "../../components/ItemDetail";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";

const AllOutletOverview = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [outletId, setOutletId] = useState("");
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    const res = await getAllZoneByOutlet(energyId?.value);
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
    const res = await getAllRegionalByOutlet(energyId?.value, zoneId?.value);
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
    const res = await getAllSalesAreaByOutlet(
      energyId?.value,
      zoneId?.value,
      regionalId?.value
    );
    if (res.status) {
      setAllSalesArea(
        res.data?.map((itm) => ({
          label: itm?.sa_name,
          value: itm?.sa_id,
        }))
      );
    } else {
      setAllSalesArea([]);
    }
  };

  const fetchDistrictData = async () => {
    const res = await getAllDistrictByOutlet(
      energyId?.value,
      zoneId?.value,
      regionalId?.value,
      salesId?.value
    );
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

  const fetchOutletAllData = async () => {
    const res = await getAllOutlet({
      energy_company_id: energyId.value,
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
    const res = await deleteOutletById(outletId);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((data) => data.id != outletId));
    } else {
      toast.error(res.message);
    }
    setOutletId("");
    setShowDelete(false);
  };

  useEffect(() => {
    fetchOutletAllData();
    fetchEnergyData();
    fetchZoneData();
    fetchRegionalData();
    fetchSalesAreaData();
    fetchDistrictData();
  }, [
    search,
    pageNo,
    pageSize,
    energyId.value,
    zoneId.value,
    regionalId.value,
    salesId.value,
    districtId.value,
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
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
      }),
      columnHelper.accessor("energy_company_name", {
        header: "energy company name",
      }),
      columnHelper.accessor("zone_name", {
        header: "zone name",
      }),
      columnHelper.accessor("regional_office_name", {
        header: "regional office name",
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area name",
      }),
      columnHelper.accessor("district_name", {
        header: "district name",
      }),
      columnHelper.accessor("outlet_unique_id", {
        header: "outlet unique id",
      }),
      columnHelper.accessor("outlet_category", {
        header: "outlet category",
      }),
      columnHelper.accessor("created_by", {
        header: t("Created By"),
        cell: (info) => (
          <UserDetail
            img={info.row.original?.created_by?.image}
            name={info.row.original?.created_by?.name}
            id={info.row.original?.created_by?.id}
            unique_id={info.row.original?.created_by?.employee_id}
            login_id={user.id}
          />
        ),
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/outlet/create/${info.row.original.id}?type=view`),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/outlet/create/${info.row.original.id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setOutletId(info.row.original.id);
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

  return (
    <>
      <FilterSelect
        data={[
          {
            id: energyId,
            setId: setEnergyId,
            title: "Energy Company",
            data: allEnergy,
            // hyperText: "Please Select Energy Company",
          },
          {
            id: zoneId,
            setId: setZoneId,
            title: "Zone",
            data: allZone,
            // hyperText: "Please Select Zone",
          },
          {
            id: regionalId,
            setId: setRegionalId,
            title: "Regional",
            data: allRegional,
            // hyperText: "Please Select Regional",
          },
          {
            id: salesId,
            setId: setSalesId,
            title: "Sales Area",
            data: allSalesArea,
            // hyperText: "Please Select Sales Area",
          },
          {
            id: districtId,
            setId: setDistrictId,
            title: "District",
            data: allDistrict,
            // hyperText: "Please Select District",
          },
        ]}
      />

      <Helmet>
        <title>Outlet Management · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CustomTable
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
          apiForExcelPdf={getAllOutlet}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={checkPermission}
              setSearchText={setSearch}
              button={{ show: false }}
              extraComponent={
                checkPermission?.create ? (
                  <TooltipComponent title={"import"} align="top">
                    <Button
                      variant="success"
                      onClick={() =>
                        navigate("/outlet/import", {
                          state: { module: "outlet" },
                        })
                      }
                    >
                      <FaFileExcel size={20} />
                    </Button>
                  </TooltipComponent>
                ) : null
              }
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>all outlet</strong>
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

export default AllOutletOverview;
