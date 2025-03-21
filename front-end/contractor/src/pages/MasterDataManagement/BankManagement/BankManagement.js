import React, { useEffect, useMemo, useState } from "react";
import { Col, Form, Table } from "react-bootstrap";
import { BsDownload, BsPlus, BsUpload } from "react-icons/bs";
import CardComponent from "../../../components/CardComponent";
import { Helmet } from "react-helmet";
import ReactDropzone from "../../../components/ReactDropzone";
import ActionButton from "../../../components/ActionButton";
import { toast } from "react-toastify";
import ReactPagination from "../../../components/ReactPagination";
import { Formik } from "formik";
import TooltipComponent from "../../../components/TooltipComponent";
import {
  getAllBankList,
  postImportBankList,
} from "../../../services/contractorApi";
import Modaljs from "../../../components/Modal";
import ImageViewer from "../../../components/ImageViewer";
import { useTranslation } from "react-i18next";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import CustomTable from "../../../components/DataTable/CustomTable";
import TableHeader from "../../../components/DataTable/TableHeader";
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { serialNumber } from "../../../utils/helper";

const BankManagement = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [showImports, setShowImports] = useState(false);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);

  const fetchAllBankData = async () => {
    const res = await getAllBankList(search, pageSize, pageNo);
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

  const handleFileChange = (e, setFieldValue) => {
    if (e.target.files) {
      setFieldValue("data", e.target.files[0]);
    }
  };

  const handleUploadEmployees = async (
    values,
    { setSubmitting, resetForm }
  ) => {
    const formData = new FormData();
    formData.append("data", values.data);
    const res = await postImportBankList(formData);
    if (res.status) {
      toast.success(res.message);
      fetchAllBankData();
    } else {
      toast.error(res.message);
    }
    setShowImports(false);
    resetForm();
    setSubmitting(false);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    element.href = `/assets/images/sample-bank-import.csv`;
    element.download = "sample-bank-import.csv";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    fetchAllBankData();
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
      columnHelper.accessor("bank_name", {
        header: t("Bank Name"),
      }),
      columnHelper.accessor("website", {
        header: t("Website"),
        cell: (info) => (
          <a
            target="_blank"
            className="text-secondary text-none"
            to={info.row.original?.website}
          >
            {info.row.original?.website}
          </a>
        ),
      }),
      columnHelper.accessor("logo", {
        header: t("Logo"),
        cell: (info) => (
          <ImageViewer
            src={
              info.row.original?.logo
                ? `${process.env.REACT_APP_API_URL}/${info.row.original?.logo}`
                : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
            }
          >
            <img
              className="avatar me-2"
              src={
                info.row.original?.logo
                  ? `${process.env.REACT_APP_API_URL}/${info.row.original?.logo}`
                  : `${process.env.REACT_APP_API_URL}/assets/images/default-image.png`
              }
            />
          </ImageViewer>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: t("Created At"),
      }),
      columnHelper.accessor("action", {
        header: t("Action"),
        cell: (info) => (
          <ActionButtons
            actions={{
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(
                    `/bank-management/create-bank-management/${info.row.original.id}`
                  ),
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
          <title>All Bank Data · CMS Electricals</title>
        </Helmet>

        <CustomTable
          id={"bank"}
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
                to: `/bank-management/create-bank-management/new`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <strong>All Bank Data</strong>
            </div>
          }
        />
      </Col>

      <Formik
        enableReinitialize={true}
        initialValues={{
          data: "",
        }}
        onSubmit={handleUploadEmployees}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={showImports}
            newButtonType={"button"}
            newButtonOnclick={handleDownload}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={"Save"}
            close={() => setShowImports(false)}
            newButtonClass={"success-combo"}
            newButtonTitle={<BsDownload />}
            title={"Import Employees"}
          >
            <Form.Group>
              <ReactDropzone
                name="data"
                value={props.values.data}
                onChange={(e) => handleFileChange(e, props.setFieldValue)}
                title={`Upload Employees`}
              />
            </Form.Group>
          </Modaljs>
        )}
      </Formik>
    </>
  );
};

export default BankManagement;
