import React, { useEffect, useMemo, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import "react-best-tabs/dist/index.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { FcCancel } from "react-icons/fc";
import { FaRegFilePdf } from "react-icons/fa";
import {
  discardPerformaById,
  getAllBillNumber,
  getAllComplaintTypeListInvoice,
  getAllFinacialYear,
  getAllOutletForPerforma,
  getAllPerformaInvoice,
  getAllPoListInvoice,
  getAllRoListInvoice,
  getAllSaListInvoice,
  getDetailPerforma,
} from "../../../services/contractorApi";
import TooltipComponent from "../../../components/TooltipComponent";
import { toast } from "react-toastify";
import FormLabelText from "../../../components/FormLabelText";
import ActionButtons from "../../../components/DataTable/ActionButtons";
import { UserPlus } from "lucide-react";
import TableHeader from "../../../components/DataTable/TableHeader";
import CustomTable from "../../../components/DataTable/CustomTable";
import { createColumnHelper } from "@tanstack/react-table";
import { selectUser } from "../../../features/auth/authSlice";
import { useSelector } from "react-redux";
import ConfirmAlert from "../../../components/ConfirmAlert";
import { serialNumber } from "../../../utils/helper";

const PerformaFinalListing = ({ checkPermission }) => {
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { userPermission } = useSelector(selectUser);
  const [poId, setPoId] = useState("");
  const { t } = useTranslation();
  const [allPiNumber, setAllPiNumber] = useState([]);
  const [salesAreaId, setSalesAreaId] = useState({});
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [outletId, setOutletId] = useState({});
  const [allOutletArea, setAllOutletArea] = useState([]);
  const [complaintTypeId, setComplaintTypeId] = useState({});
  const [allComplaintType, setComplaintType] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [yearValue, setYearValue] = useState(null);
  const [regionalOfficceId, setRegionalOfficeId] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [allPo, setAllPo] = useState([]);
  const [allRegionalOffice, setAllRegionalOffice] = useState([]);
  const [complaint_id, setComplaint_id] = useState("");
  const [showDiscard, setShowDiscard] = useState(false);
  const [idToDiscard, setIdToDiscard] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExpenseRequestData = async () => {
    let status = 2;
    let po_id = poId?.id;
    const res = await getAllPerformaInvoice({
      po_id,
      regional_office_id: regionalOfficceId?.id,
      sale_area_id: salesAreaId?.id,
      financial_year: yearValue?.id,
      bill_number: complaint_id,
      complaint_type: complaintTypeId?.id,
      outlet_id: outletId?.id,
      pageSize,
      pageNo,
      search,
      status,
    });

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

  const handleDiscard = async () => {
    const res = await discardPerformaById(idToDiscard);
    if (res.status) {
      toast.success(res.message);
      setRefresh((e) => !e);
    } else {
      toast.error(res.message);
    }
    setShowDiscard(false);
    setIdToDiscard("");
  };
  const fetchAllPo = async () => {
    const status = 2;
    const res = await getAllPoListInvoice({ status });
    if (res.status) {
      setAllPo(res.data);
    } else {
      setAllPo([]);
    }
  };

  const fetchAllRegionalOffice = async () => {
    const status = 2;
    const res = await getAllRoListInvoice({ status });
    if (res.status) {
      setAllRegionalOffice(res.data);
    } else {
      setAllRegionalOffice([]);
    }
  };
  const fetchAllSalesArea = async () => {
    const status = 2;
    const res = await getAllSaListInvoice({ status });
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };

  const fetchOutletArea = async () => {
    const status = 2;
    const res = await getAllOutletForPerforma({ status });
    if (res.status) {
      setAllOutletArea(res.data);
    } else {
      setAllOutletArea([]);
    }
  };

  const fetchAllComplaintType = async () => {
    const status = 2;
    const res = await getAllComplaintTypeListInvoice({ status });
    if (res.status) {
      setComplaintType(res.data);
    } else {
      setComplaintType([]);
    }
  };

  const fetchAllFinancialYear = async () => {
    const status = 2;
    const res = await getAllFinacialYear(status);

    if (res.status) {
      setAllFinancialYear(res.data);
    } else {
      setAllFinancialYear([]);
    }
  };
  const fetchAllPINumber = async () => {
    const status = 2;
    const res = await getAllBillNumber(status);

    if (res.status) {
      setAllPiNumber(res.data);
    } else {
      setAllPiNumber([]);
    }
  };

  const HandleDownloadPdf = async (id) => {
    setLoading(id);
    const pdf = 1;
    const response = await getDetailPerforma(id, pdf);
    if (response.status) {
      toast.success(response.message);

      const filePath = response.path;
      const fileUrl = `${process.env.REACT_APP_API_URL}${filePath}`;
      window.open(fileUrl, "_blank");
    } else {
      toast.error(response.message);
    }
    setLoading("");
  };

  useEffect(() => {
    fetchAllPo();
    fetchAllRegionalOffice();
    fetchAllSalesArea();
    fetchAllFinancialYear();
    fetchAllPINumber();
    fetchAllComplaintType();
    fetchOutletArea();
  }, []);

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenseRequestData();
  }, [
    pageNo,
    pageSize,
    poId?.id,
    regionalOfficceId?.id,
    salesAreaId?.id,
    outletId?.id,
    yearValue?.id,
    complaint_id,
    complaintTypeId?.id,
    refresh,
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
      columnHelper.accessor("bill_no", {
        header: "pi number",
      }),
      columnHelper.accessor("created_at", {
        header: "pi date",
      }),
      columnHelper.accessor("financial_year", {
        header: "financial year",
      }),
      columnHelper.accessor("billing_to_ro_office", {
        header: "billing regioanl office",
        cell: (info) => info.row.original.billing_to_ro_office?.ro_name,
      }),
      columnHelper.accessor("outlet_name", {
        header: "outlet name",
        cell: (info) => (
          <div>
            {info.row.original.outletDetails.length > 0
              ? info.row.original?.outletDetails?.map((item, idx) => (
                  <li> {item?.outlet_name ?? "--"}</li>
                ))
              : "--"}
          </div>
        ),
      }),
      columnHelper.accessor("sales_area_name", {
        header: "sales area name",
        cell: (info) => (
          <div>
            {info.row.original.salesAreaDetails.length > 0
              ? info.row.original?.outletDetails?.map((item, idx) => (
                  <li> {item?.sales_area_name ?? "--"}</li>
                ))
              : "--"}
          </div>
        ),
      }),
      columnHelper.accessor("complaint_unique_id", {
        header: "complaint id",
        cell: (info) => (
          <div>
            {info.row.original?.complaintDetails?.map(
              (item, idx) => item?.complaint_type_name ?? "--"
            )}
          </div>
        ),
      }),
      columnHelper.accessor("po_number", {
        header: "po number",
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => (
          <ActionButtons
            actions={{
              view: {
                show: checkPermission?.view,
                action: () =>
                  navigate(`/view-performa-invoice`, {
                    state: {
                      id: info.row.original?.id,
                    },
                  }),
              },
              edit: {
                show: checkPermission?.update,
                action: () =>
                  navigate(`/PerformaInvoice/CreatePerformaInvoice/edit`, {
                    state: {
                      regionalOfficceId: {
                        name: info.row.original?.billing_to_ro_office.ro_name,
                        id: info.row.original?.billing_to_ro_office.ro_id,
                      },
                      measurements: [info.row.original.id],

                      poId: {
                        id: info.row.original?.po_id,
                        name: info.row.original?.po_number,
                      },

                      editFrom: "final",
                    },
                  }),
              },
            }}
            custom={
              <>
                <div className="vr hr-shadow"></div>
                <TooltipComponent align="left" title={"PDF"}>
                  <Button
                    className={`view-btn`}
                    variant="light"
                    disabled={loading == info.row.original.id}
                    onClick={() => {
                      HandleDownloadPdf(info.row.original.id);
                    }}
                  >
                    <FaRegFilePdf
                      className={`social-btn  ${
                        loading == info.row.original.id ? "" : "red-combo"
                      }`}
                    />
                  </Button>
                </TooltipComponent>
                <div className="vr hr-shadow"></div>
                <TooltipComponent align="left" title={"discard"}>
                  <Button
                    className={`view-btn`}
                    variant="light"
                    onClick={() => {
                      setShowDiscard(true);
                      setIdToDiscard(info.row.original.id);
                    }}
                  >
                    <FcCancel className={`social-btn red-combo`} />
                  </Button>
                </TooltipComponent>
              </>
            }
          />
        ),
      }),
    ],
    [checkPermission, rows.length, pageNo, pageSize]
  );

  return (
    <>
      <div className="m-2">
        <div className="shadow p-2 rounded">
          <Row>
            <Col md={3}>
              <FormLabelText children={t("po number")} />
              <Select
                menuPortalTarget={document.body}
                options={allPo?.map((user) => ({
                  label: user.po_number,
                  value: user.id,
                }))}
                onChange={(e) => {
                  if (e) {
                    setPoId({ id: e?.value, name: e?.label });
                    setComplaint_id(null);
                  } else {
                    setPoId({});
                  }
                }}
                isClearable
              />
            </Col>
            <Col md={3}>
              <FormLabelText children={t("regional office")} />
              <Select
                menuPortalTarget={document.body}
                options={allRegionalOffice?.map((user) => ({
                  label: user.regional_office_name,
                  value: user.ro_id,
                }))}
                onChange={(e) => {
                  if (e) {
                    setRegionalOfficeId({ id: e?.value, name: e?.label });
                  } else setRegionalOfficeId({});
                }}
                isClearable
              />
            </Col>
            <Col md={3}>
              <FormLabelText children={t("sales area")} />
              <Select
                menuPortalTarget={document.body}
                options={allSalesArea?.map((user) => ({
                  label: user.sales_area_name,
                  value: user.id,
                }))}
                onChange={(e) => {
                  setSalesAreaId({ id: e?.value, name: e?.label });
                }}
                isClearable
              />
            </Col>
            <Col md={3}>
              <FormLabelText children={t("outlet area")} />
              <Select
                menuPortalTarget={document.body}
                options={allOutletArea?.map((user) => ({
                  label: user.outlet_name,
                  value: user.id,
                }))}
                onChange={(e) => {
                  setOutletId({ id: e?.value, name: e?.label });
                }}
                isClearable
              />
            </Col>
            <Col md={3} className="mt-2">
              <FormLabelText children={t("complaint type")} />
              <Select
                menuPortalTarget={document.body}
                options={allComplaintType?.map((user) => ({
                  label: user.complaint_type_name,
                  value: user.id,
                }))}
                onChange={(e) => {
                  setComplaintTypeId({ id: e?.value, name: e?.label });
                }}
                isClearable
              />
            </Col>
            <Col md={3} className="mt-2">
              <FormLabelText children={t("bill number")} />
              <Select
                menuPortalTarget={document.body}
                options={allPiNumber?.map((user) => ({
                  label: user.bill_no,
                  value: user.bill_no,
                }))}
                onChange={(e) => {
                  setComplaint_id(e ? e?.value : null);
                }}
                isClearable
              />
            </Col>
            <Col md={3} className="mt-2">
              <FormLabelText children={t("financial year")} />

              <Select
                menuPortalTarget={document.body}
                options={allFinancialYear?.map((user) => ({
                  label: user.financial_year,
                  value: user.financial_year,
                }))}
                onChange={(e) => {
                  setYearValue({ id: e?.value, name: e?.label });
                }}
                isClearable
              />
            </Col>
          </Row>
        </div>
      </div>
      <CustomTable
        id={"performa_invoice"}
        isLoading={isLoading}
        rows={rows || []}
        columns={columns}
        pagination={{
          pageNo,
          pageSize,
          totalData,
        }}
        status={2}
        excelAction={() => ""}
        pdfAction={() => ""}
        apiForExcelPdf={getAllPerformaInvoice}
        customHeaderComponent={() => (
          <TableHeader
            userPermission={checkPermission}
            setSearchText={setSearch}
            button={{ show: false }}
          />
        )}
        tableTitleComponent={
          <div>
            <UserPlus /> <strong> final</strong>
          </div>
        }
      />
      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDiscard}
        hide={setShowDiscard}
        show={showDiscard}
        title={"Confirm Discard"}
        description={"Are you sure you want to discard this!!"}
      />
    </>
  );
};

export default PerformaFinalListing;
