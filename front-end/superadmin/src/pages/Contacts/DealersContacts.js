import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import {
  getAdminAllDealerContacts,
  getAdminUpdateDealerContacts,
  getAdminUpdateInDealerContacts,
} from "../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

const DealersContacts = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [showAlert2, setShowAlert2] = useState(false);
  const [storeId, setStoreId] = useState({});

  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { userPermission } = useSelector(selectUser);
  const { t } = useTranslation();

  const fetchContactsData = async () => {
    const res = await getAdminAllDealerContacts(search, pageSize, pageNo);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handleUpdate = (software) => {
    setStoreId(software);
    setShowAlert(true);
  };

  const handleUpdate2 = (software) => {
    setStoreId(software);
    setShowAlert2(true);
  };

  const handleRejected = async () => {
    const sData = {
      admin_id: storeId.admin_id,
      status: 2,
      user_type: storeId.user_type,
    };
    const res = await getAdminUpdateInDealerContacts(sData);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) =>
        prev.filter((itm) => itm.admin_id !== +storeId.admin_id)
      );
      fetchContactsData();
    } else {
      toast.error(res.message);
    }
    setShowAlert(false);
  };

  const handleApproved = async () => {
    const sData = {
      admin_id: storeId.admin_id,
      status: 1,
      user_type: storeId.user_type,
    };
    const res = await getAdminUpdateInDealerContacts(sData);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) =>
        prev.filter((itm) => itm.admin_id !== +storeId.admin_id)
      );
      fetchContactsData();
    } else {
      toast.error(res.message);
    }
    setShowAlert2(false);
  };

  useEffect(() => {
    fetchContactsData();
  }, [search, pageSize, pageNo]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("name", {
        header: t("User Name"),
      }),
      columnHelper.accessor("email", {
        header: t("Email"),
      }),
      columnHelper.accessor("contact_no", {
        header: t("Phone No."),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              reject: {
                show: true,
                action: () => handleUpdate(info.row.original),
                // () => {
                //   setFundItemId(info.row.original.id);
                //   setShowReject(true);
                // },
              },
              approve: {
                show: true,
                action: () => handleUpdate2(info.row.original),
                // () => {
                //   setFundItemId(info.row.original.id);
                //   setShowApprove(true);
                // },
              },
            }}
          />
        ),
      }),
    ],
    [rows.length]
  );

  return (
    <Col md={12} data-aos={"fade-up"}>
      <CustomTable
        id={"dealers_contacts"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        align={"bottom"}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={userPermission}
            setSearchText={setSearch}
            permissions={true}
          />
        )}
        tableTitleComponent={
          <div>
            <strong>Dealers Contacts</strong>
          </div>
        }
      />

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleRejected}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Reject"}
        description={"Are you sure you want to reject this!!"}
      />
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleApproved}
        hide={setShowAlert2}
        show={showAlert2}
        title={"Confirm Approve"}
        description={"Are you sure you want to approve this!!"}
      />
    </Col>
  );
};

export default DealersContacts;
