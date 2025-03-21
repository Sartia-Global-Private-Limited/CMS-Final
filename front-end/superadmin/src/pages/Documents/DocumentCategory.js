import React, { useEffect, useMemo, useState } from "react";
import { Col } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import ConfirmAlert from "../../components/ConfirmAlert";
import {
  getAdminAllDocument,
  getAdminDeleteDocument,
} from "../../services/authapi";
import { createColumnHelper } from "@tanstack/react-table";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionButtons from "../../components/DataTable/ActionButtons";
import { FileText } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import { getDateValue, serialNumber } from "../../utils/helper";
import CustomTable from "../../components/DataTable/CustomTable";
import { useTranslation } from "react-i18next";

const DocumentCategory = ({ checkPermission }) => {
  const navigate = useNavigate();
  const { userPermission } = useSelector(selectUser);
  const columnHelper = createColumnHelper();
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || "10";
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [idToDelete, setIdToDelete] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();

  const fetchDocumentData = async () => {
    const res = await getAdminAllDocument(search, pageSize, pageNo);
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
    const res = await getAdminDeleteDocument(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setRows((prev) => prev.filter((itm) => itm.id !== +idToDelete));
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    fetchDocumentData();
    setShowAlert(false);
  };

  useEffect(() => {
    fetchDocumentData();
  }, [search, pageSize, pageNo]);

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
        header: "Document Title",
        cell: (info) => info.getValue() || "-",
      }),
      columnHelper.accessor("category", {
        header: "Document Category",
      }),
      columnHelper.accessor("created_at", {
        header: "Created At",
        cell: (info) => getDateValue(info.row.original.created_at),
      }),
      columnHelper.accessor("description", {
        header: "Document Description",
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
                  navigate(
                    `/DocumentCategory/CreateDocumentCategory/${info.row.original.id}`
                  ),
              },
              delete: {
                show: checkPermission?.delete,
                action: () => {
                  setIdToDelete(`${info.row.original.id}`);
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

  return (
    <>
      <Helmet>
        <title>Document Category · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CustomTable
          id={"document_category"}
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
          align={"bottom"}
          apiForExcelPdf={getAdminAllDocument}
          customHeaderComponent={() => (
            <TableHeader
              userPermission={checkPermission}
              setSearchText={setSearch}
              button={{
                noDrop: true,
                to: `/DocumentCategory/CreateDocumentCategory/new`,
                title: "Create",
              }}
            />
          )}
          tableTitleComponent={
            <div>
              <FileText /> <strong>Document Category</strong>
            </div>
          }
        />
      </Col>

      {/* <Formik
        enableReinitialize={true}
        initialValues={{
          id: edit?.id || "",
          title: edit?.title || "",
          category: edit?.category || "",
          description: edit?.description || "",
        }}
        validationSchema={addDocumentSchema}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Modaljs
            formikProps={props}
            open={documents}
            size={"md"}
            closebtn={"Cancel"}
            Savebtn={edit.id ? "Update" : "Save"}
            close={() => setDocuments(false)}
            title={
              edit.id ? "Update Document Category" : "Create Document Category"
            }
          >
            <Row className="g-2">
              <Form.Group as={Col} md={6}>
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name={"title"}
                  value={props.values.title}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(props.touched.title && props.errors.title)}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={6}>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  name={"category"}
                  value={props.values.category}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  isInvalid={Boolean(
                    props.touched.category && props.errors.category
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {props.errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md={12}>
                <Form.Label>Description</Form.Label>
                <TextareaAutosize
                  minRows={2}
                  onChange={props.handleChange}
                  value={props.values.description}
                  name="description"
                  className="edit-textarea"
                />
              </Form.Group>
            </Row>
          </Modaljs>
        )}
      </Formik> */}

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

export default DocumentCategory;
