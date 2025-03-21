import React, { useEffect, useMemo, useState } from "react";
import { Button, Col } from "react-bootstrap";

import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { Helmet } from "react-helmet";
import { deleteOutletById, getAllOutlet } from "../../services/contractorApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { Send, UserPlus } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import CustomTable, {
  selectable,
} from "../../components/DataTable/CustomTable";
import TooltipComponent from "../../components/TooltipComponent";
import { serialNumber } from "../../utils/helper";

const OutletContacts = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const [showDelete, setShowDelete] = useState(false);
  const [outletId, setOutletId] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchOutletAllData = async () => {
    const res = await getAllOutlet({ search, pageSize, pageNo });
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
  }, [search, pageNo, pageSize]);

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
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
      }),
      columnHelper.accessor("outlet_contact_person_name", {
        header: "outlet contact person",
      }),
      columnHelper.accessor("outlet_unique_id", {
        header: "outlet unique id",
      }),
      columnHelper.accessor("outlet_ccnohsd", {
        header: "outlet ccnohsd",
      }),
      columnHelper.accessor("outlet_ccnoms", {
        header: "outlet ccnoms",
      }),
      columnHelper.accessor("email", {
        header: "email",
        cell: (info) =>
          info?.row?.original?.email ? info?.row?.original?.email : "-",
      }),
      columnHelper.accessor("outlet_contact_number", {
        header: "outlet contact number",
      }),
      columnHelper.accessor("address", {
        header: "address",
      }),
      columnHelper.accessor("energy_company_name", {
        header: "energy company name",
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
        <CustomTable
          id={"all_outlet"}
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
                  <TooltipComponent title={"send"} align="top">
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
              <UserPlus /> <strong>outlet contacts</strong>
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

export default OutletContacts;
