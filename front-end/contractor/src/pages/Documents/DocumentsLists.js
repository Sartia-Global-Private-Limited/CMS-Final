import React, { Fragment, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import Select from "react-select";
import {
  SearchAllDocumentList,
  getAdminAllDocumentList,
  getAdminDeleteDocumentList,
} from "../../services/authapi";
import ConfirmAlert from "../../components/ConfirmAlert";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { createColumnHelper } from "@tanstack/react-table";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CustomTable from "../../components/DataTable/CustomTable";
import TableHeader from "../../components/DataTable/TableHeader";
import { FileText } from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { UserDetails } from "../../components/ItemDetail";
import { getDateValue, serialNumber } from "../../utils/helper";
import ImageViewer from "../../components/ImageViewer";
import FileViewer from "../../components/FileViewer";

const DocumentsList = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const { userPermission } = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const fetchDocumentData = async () => {
    const res = await getAdminAllDocumentList(search, pageSize, pageNo);
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

  const searchDocumentData = async () => {
    try {
      const response = await SearchAllDocumentList();
      if (response.status) {
        setSearchData(response.data);
      } else {
        setSearchData([]);
      }
    } catch (error) {
      setSearchData([]);
    }
  };

  const handleDelete = async () => {
    const res = await getAdminDeleteDocumentList(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.document_id !== +idToDelete));
      fetchDocumentData();
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
      columnHelper.accessor("title", {
        header: "Title",
      }),
      columnHelper.accessor("created_at", {
        header: "Document Date",
        cell: (info) => getDateValue(info.row.original.created_at),
      }),
      columnHelper.accessor("users", {
        header: "User's",
        cell: (info) => (
          <div className="d-align">
            {info.row.original?.users.slice(0, 5).map((user, index) => (
              <Fragment key={index}>
                <UserDetails
                  img={user?.image}
                  name={user?.user_name}
                  id={user?.user_id}
                  unique_id={user?.employee_id}
                />
              </Fragment>
            ))}
          </div>
        ),
      }),
      columnHelper.accessor("Attachment", {
        header: "Attachment's",
        cell: (info) => (
          <div className="d-align gap-2">
            {info.row.original?.image?.map((img) => {
              return <FileViewer file={img} />;
            })}
          </div>
        ),
      }),
      columnHelper.accessor("remark", {
        header: "Remark",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/AddDocument/${info.row.original.document_id}`),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(`${info.row.original.document_id}`);
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
    fetchDocumentData();
    searchDocumentData();
  }, [search, pageNo, pageSize]);

  const handleSearchChange = (selectedOption) => {
    if (selectedOption) {
      setSearch(selectedOption.label);
    } else {
      setSearch(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Documents Lists · CMS Electricals</title>
      </Helmet>
      <CustomTable
        id={"documents_list"}
        userPermission={checkPermission}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        excelAction={false}
        pdfAction={false}
        apiForExcelPdf={getAdminAllDocumentList}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{
              noDrop: true,
              to: `/AddDocument`,
              title: "Create",
            }}
            extraComponent={
              <Select
                isClearable
                className="text-primary"
                placeholder={t("--Select Category--")}
                menuPortalTarget={document.body}
                value={searchData.find((types) => types.label === search)}
                name={"category_type"}
                options={searchData?.map((types) => ({
                  label: types.title,
                  value: types.id,
                }))}
                onChange={handleSearchChange}
              />
            }
          />
        )}
        tableTitleComponent={
          <div>
            <FileText /> <strong>Documents List</strong>
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

export default DocumentsList;
