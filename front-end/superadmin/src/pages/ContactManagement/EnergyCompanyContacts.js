import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import { Col, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  deleteContactsById,
  getAllContacts,
} from "../../services/contractorApi";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable, {
  selectable,
} from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { Send, UserPlus } from "lucide-react";
import TooltipComponent from "../../components/TooltipComponent";
import { serialNumber } from "../../utils/helper";
import StatusChip from "../../components/StatusChip";

const EnergyCompanyContacts = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { userPermission } = useSelector(selectUser);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchAllData = async () => {
    const res = await getAllContacts({ search, pageSize, pageNo });
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
    const res = await deleteContactsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchAllData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchAllData();
  }, [search, pageNo, pageSize]);

  const columns = useMemo(
    () => [
      selectable,
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => {
          const serialNumbers = serialNumber(pageNo, pageSize);
          return serialNumbers[info?.row?.index];
        },
      }),
      columnHelper.accessor("first_name", {
        header: "Name",
        cell: (info) => <div>{info.row.original?.first_name || "-"}</div>,
      }),
      columnHelper.accessor("contact_unique_id", {
        header: "contact unique id",
      }),
      columnHelper.accessor("email", {
        header: "Email",
        // cell: (info) => {
        //   const primaryEmails = info
        //     ?.getValue()
        //     ?.filter(
        //       (email) => email?.primary === "1" || email?.primary === true
        //     )
        //     ?.map((email) => email?.email);
        //   return primaryEmails?.join(", ");
        // },
      }),
      columnHelper.accessor("phone", {
        header: "phone number",
        // cell: (info) => {
        //   const primaryPhones = info
        //     ?.getValue()
        //     ?.filter(
        //       (phone) => phone?.primary === "1" || phone?.primary === true
        //     )
        //     ?.map((phone) => phone?.number);
        //   return primaryPhones?.join(", ");
        // },
      }),
      columnHelper.accessor("company_name", {
        header: "company name",
      }),
      columnHelper.accessor("company_type_name", {
        header: "company type name",
      }),
      columnHelper.accessor("position", {
        header: "position",
      }),
      columnHelper.accessor("status", {
        header: "status",
        cell: (info) => (
          <StatusChip status={info.getValue() == "1" ? "Active" : "Inactive"} />
        ),
      }),
      // columnHelper.accessor("action", {
      //   header: "Action",
      //   cell: (info) => (
      //     <ActionButtons
      //       actions={{
      //         view: {
      //           show: checkPermission?.view,
      //           action: () =>
      //             navigate(
      //               `/Contacts/CreateContacts/${info.row.original.id}?type=view`
      //             ),
      //         },
      //         edit: {
      //           show: checkPermission?.update,
      //           action: () =>
      //             navigate(`/Contacts/CreateContacts/${info.row.original.id}`),
      //         },
      //         delete: {
      //           show: checkPermission?.delete,
      //           action: () => {
      //             setIdToDelete(info.row.original.id);
      //             setShowAlert(true);
      //           },
      //         },
      //       }}
      //     />
      //   ),
      // }),
    ],
    [checkPermission, t, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <Helmet>
        <title>Contacts · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CustomTable
          id={"energy_company"}
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
              button={{
                show: false,
                // noDrop: true,
                // to: `/Contacts/CreateContacts/new`,
                // title: "Create",
              }}
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
              <UserPlus /> <strong>company contacts</strong>
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

export default EnergyCompanyContacts;
