import React, { Fragment, useEffect, useMemo } from "react";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import Modaljs from "../../../components/Modal";
import { Helmet } from "react-helmet";
import { deleteAdminOutlet, getAdminOutlet } from "../../../services/authapi";
import { toast } from "react-toastify";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { useTranslation } from "react-i18next";

const OutletsMasterdata = () => {
  const [singleoutlets, setSingleOutlets] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const navigate = useNavigate();
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
  const singleoutletsList = [
    {
      id: 1,
      type: "text",
      title: "Outlet Name",
      value: singleoutlets?.outlet_name,
    },
    {
      id: 11,
      type: "text",
      title: "Outlet Unique Id",
      value: singleoutlets?.outlet_unique_id,
    },
    {
      id: 2,
      type: "text",
      title: "Outlet Contact Person Name",
      value: singleoutlets?.outlet_contact_person_name,
    },
    {
      id: 3,
      type: "number",
      title: "Outlet Contact Number",
      value: singleoutlets?.outlet_contact_number,
    },
    {
      id: 4,
      type: "number",
      title: "Primary Number",
      value: singleoutlets?.primary_number,
    },
    {
      id: 5,
      type: "number",
      title: "Secondary Number",
      value: singleoutlets?.secondary_number,
    },
    {
      id: 6,
      type: "email",
      title: "Primary Email",
      value: singleoutlets?.primary_email,
    },
    {
      id: 7,
      type: "email",
      title: "Secondary Email",
      value: singleoutlets?.secondary_email,
    },
    {
      id: 8,
      type: "text",
      title: "Customer Code",
      value: singleoutlets?.customer_code,
    },
    {
      id: 9,
      type: "text",
      title: "Outlet Category",
      value: singleoutlets?.outlet_category,
    },
    { id: 10, type: "text", title: "Location", value: singleoutlets?.location },
    { id: 11, type: "text", title: "Address", value: singleoutlets?.address },
    {
      id: 12,
      type: "text",
      title: "Outlet ccnoms",
      value: singleoutlets?.outlet_ccnoms,
    },
    {
      id: 13,
      type: "text",
      title: "Outlet ccnohsd",
      value: singleoutlets?.outlet_ccnohsd,
    },
    {
      id: 14,
      type: "text",
      title: "Outlet resv",
      value: singleoutlets?.outlet_resv,
    },
    {
      id: 15,
      type: "text",
      title: "Outlet longitude",
      value: singleoutlets?.outlet_longitude,
    },
    {
      id: 16,
      type: "text",
      title: "Outlet lattitude",
      value: singleoutlets?.outlet_lattitude,
    },
    {
      id: 17,
      type: "image",
      title: "Outlet Image",
      src: singleoutlets?.outlet_image
        ? `${process.env.REACT_APP_API_URL}${singleoutlets?.outlet_image}`
        : "",
    },
  ];

  // Delete Outlet
  const handleDelete = async () => {
    const res = await deleteAdminOutlet(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
      fetchOutletsData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  const fetchOutletsData = async () => {
    const res = await getAdminOutlet(search, pageSize, pageNo);
    if (res.status) {
      setRows(res.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOutletsData();
  }, [search, pageNo, pageSize]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("sr_no", {
        header: t("Sr No."),
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.accessor("id", {
        header: t("OUTLET id"),
      }),
      columnHelper.accessor("district_name", {
        header: t("outlet Name"),
      }),
      columnHelper.accessor("zone_name", {
        header: t("Zone name"),
      }),
      columnHelper.accessor("regional_office_name", {
        header: t("regional office name"),
      }),
      columnHelper.accessor("sales_area_name", {
        header: t("sales area name"),
      }),
      columnHelper.accessor("status", {
        header: t("status"),
        cell: (info) => (
          <div
            className={`text-${
              info.row.original?.status === 1 ? "green" : "danger"
            }`}
          >
            {info.row.original?.status === 1 ? "Active" : "Inactive"}
          </div>
        ),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: true,
                action: () => setSingleOutlets(info.row.original),
              },
              edit: {
                show: true,
                action: () =>
                  navigate(
                    `/OutletsMasterdata/AddOutlet/${info.row.original.id}`
                  ),
              },
              delete: {
                show: true,
                action: () => {
                  setIdToDelete(info.row.original?.id);
                  setShowAlert(true);
                },
              },
            }}
          />
        ),
      }),
    ],
    [rows.length]
  );

  return (
    <>
      <Helmet>
        <title>Outlets · CMS Electricals</title>
      </Helmet>
      <Col md={12}>
        <CustomTable
          id={"outlet_office"}
          isLoading={isLoading}
          rows={rows || []}
          columns={columns}
          align={"bottom"}
          pagination={{
            pageNo,
            pageSize,
            totalData,
          }}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={userPermission}
              setSearchText={setSearch}
              button={{
                noDrop: true,
                to: `/OutletsMasterdata/AddOutlet/new`,
                title: "Add outlet",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>All outlet</strong>
            </div>
          }
        />
      </Col>

      <Modaljs
        open={singleoutlets}
        size={"md"}
        closebtn={"Cancel"}
        Savebtn={"Ok"}
        close={() => setSingleOutlets(false)}
        title={"View Outlet"}
      >
        <Row className="g-2 align-items-center">
          {singleoutletsList.map((sOutletdata, id1) =>
            sOutletdata.value || sOutletdata.src ? (
              <Fragment key={id1}>
                <Col md={4}>{sOutletdata.title}</Col>
                <Col md={8}>
                  <Form.Control
                    type={sOutletdata.type}
                    className="fw-bolder"
                    size="100"
                    src={sOutletdata.src}
                    defaultValue={sOutletdata.value}
                    disabled
                  />
                </Col>
              </Fragment>
            ) : null
          )}
        </Row>
      </Modaljs>
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

export default OutletsMasterdata;
