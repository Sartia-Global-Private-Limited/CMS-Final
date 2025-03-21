import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import Switch from "../../components/Switch";
import {
  deleteProductDetailsById,
  getAllProductDetails,
  postPublishStatusUpdate,
} from "../../services/contractorApi";
import ImageViewer from "../../components/ImageViewer";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { selectUser } from "../../features/auth/authSlice";
import { useSelector } from "react-redux";
import { createColumnHelper } from "@tanstack/react-table";
import ActionButtons from "../../components/DataTable/ActionButtons";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { UserPlus } from "lucide-react";
import { serialNumber } from "../../utils/helper";

const ProductService = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const { userPermission } = useSelector(selectUser);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const fetchAllHrEmployeesData = async () => {
    const res = await getAllProductDetails(search, pageSize, pageNo);
    setIsLoading(true);
    if (res.status) {
      setRows(res?.data);
      setTotalData(res?.pageDetails?.total);
    } else {
      setRows([]);
      setTotalData(0);
    }
    setIsLoading(false);
  };

  const handlePublish = async (e, event) => {
    const sData = {
      product_id: e.id,
      value: event.target.checked === true ? "1" : "0",
    };
    // return console.log("changeStatus", sData);
    const res = await postPublishStatusUpdate(sData);
    if (res.status) {
      toast.success(res.message);
      fetchAllHrEmployeesData();
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async () => {
    const res = await deleteProductDetailsById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
      fetchAllHrEmployeesData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchAllHrEmployeesData();
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
      columnHelper.accessor("product_name", {
        header: "product name",
        cell: (info) => (
          <ImageViewer
            src={
              info.row.original.image_url
                ? `${process.env.REACT_APP_API_URL}${info.row.original.image_url}`
                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
            }
          >
            <img
              width={50}
              height={50}
              className="my-bg object-fit p-1 rounded"
              src={
                info.row.original.image_url
                  ? `${process.env.REACT_APP_API_URL}${info.row.original.image_url}`
                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
              }
              alt={info.row.original.product_name}
            />
            <span className="ms-2 text-success fw-bold">
              {info.row.original.product_name}
            </span>
          </ImageViewer>
        ),
      }),
      columnHelper.accessor("category_name", {
        header: "category name",
      }),
      columnHelper.accessor("price", {
        header: "price",
      }),
      columnHelper.accessor("supplier_name", {
        header: "supplier name",
      }),
      columnHelper.accessor("availability_status", {
        header: "availability status",
        cell: (info) => (
          <div
            className={`text-${
              info.row.original.availability_status === "1" ? "green" : "orange"
            }`}
          >
            {info.row.original.availability_status === "1"
              ? "In Stock"
              : "Out Stock"}
          </div>
        ),
      }),
      columnHelper.accessor("quantity", {
        header: "quantity",
      }),
      columnHelper.accessor("quantity", {
        header: "quantity",
        cell: (info) => (
          <div className="text-green text-center">
            <Switch
              checked={info.row.original.is_published === "1" ? true : false}
              onChange={(event) => handlePublish(info.row.original, event)}
            />
          </div>
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
                  navigate(
                    `/ProductService/AddProducts/${info.row.original.id}?type=view`
                  ),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/ProductService/AddProducts/${info.row.original.id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(info.row.original.id);
                  setShowAlert(true);
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
      <Col md={12} data-aos={"fade-up"}>
        <Helmet>
          <title>Product Service · CMS Electricals</title>
        </Helmet>
        <CustomTable
          id={"product_service"}
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
              setSearchText={setSearch}
              button={{
                noDrop: true,
                to: `/ProductService/AddProducts/new`,
                title: "Create",
              }}
              userPermission={checkPermission}
            />
          )}
          tableTitleComponent={
            <div>
              <UserPlus /> <strong>product service</strong>
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

export default ProductService;
