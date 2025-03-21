import React, { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { getSinglePurchaseOrderById } from "../../services/contractorApi";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";
import { formatNumberToINR, serialNumber } from "../../utils/helper";
import FileViewer from "../../components/FileViewer";
import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../components/DataTable/CustomTable";
import { ShoppingCart } from "lucide-react";
import TableHeader from "../../components/DataTable/TableHeader";
import LoaderUi from "../../components/LoaderUi";

const PoViewDetails = () => {
  const { id } = useParams();
  const columnHelper = createColumnHelper();
  const [searchParams] = useSearchParams();
  const pageNo = searchParams.get("pageNo") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const type = searchParams.get("type") || null;
  const [ViewDetails, setViewDetails] = useState({});
  const [totalData, setTotalData] = useState(0);
  const [search, setSearch] = useState("");
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  const fetchSingleData = async () => {
    const res = await getSinglePurchaseOrderById(id, pageSize, pageNo, search);
    if (res.status) {
      setViewDetails(res?.data);
      setTotalData(res?.data?.purchase_order_item?.pageDetails?.total);
    } else {
      setViewDetails({});
      setTotalData({});
    }
    setIsLoading(false);
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
      columnHelper.accessor("order_line_number", {
        header: t("Order Line Number"),
      }),
      columnHelper.accessor("name", {
        header: "Item Name",
      }),
      columnHelper.accessor("description", {
        header: "Description",
      }),
      columnHelper.accessor("hsn_code", {
        header: t("Hsn Code"),
      }),
      columnHelper.accessor("unit", {
        header: "Unit",
      }),
      columnHelper.accessor("gst_type", {
        header: "Gst Title",
      }),
      columnHelper.accessor("gst_percent", {
        header: "Gst %",
      }),
      columnHelper.accessor("rate", {
        header: "Rate",
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
      columnHelper.accessor("qty", {
        header: "Quantity",
      }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => formatNumberToINR(info.getValue()),
      }),
    ],
    [t, ViewDetails?.purchase_order_item?.data?.length, pageNo, pageSize]
  );

  useEffect(() => {
    fetchSingleData();
  }, [pageSize, pageNo, search]);

  if (isLoading) {
    return <LoaderUi />;
  }

  return (
    <>
      <Helmet>
        <title>View Details - · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          className={"shadow after-bg-light"}
          title={"view purchase order details"}
        >
          {type === "purchase-order" ? (
            <Row className="g-3 py-1">
              <Col md={6}>
                <div className="p-20 shadow rounded h-100">
                  <strong className="text-secondary">{t("PO Details")}</strong>
                  <div className="mt-2">
                    <table className="table-sm table">
                      <tbody>
                        <tr>
                          <th>{t("po date")} :</th>
                          <td>{ViewDetails?.po_date}</td>
                        </tr>
                        <tr>
                          <th>{t("Po regional office")} :</th>
                          <td>{ViewDetails?.regional_office_name}</td>
                        </tr>
                        <tr>
                          <th>{t("state")} :</th>
                          <td>{ViewDetails?.state_name}</td>
                        </tr>
                        <tr>
                          <th>{t("po number")} :</th>
                          <td>{ViewDetails?.po_number}</td>
                        </tr>

                        <tr>
                          <th> {t("po limit")} :</th>
                          <td>{formatNumberToINR(ViewDetails?.limit)}</td>
                        </tr>
                        <tr>
                          <th>{t("remaining amount")} :</th>
                          <td className="text-green">
                            {formatNumberToINR(
                              ViewDetails?.remaining_po_amount
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("security deposit date")} :</th>
                          <td>{ViewDetails?.security_deposit_date}</td>
                        </tr>
                        <tr>
                          <th>{t("overall gst type")} :</th>
                          <td>{ViewDetails?.gst_title}</td>
                        </tr>
                        <tr>
                          <th>{t("overall gst type")} :</th>
                          <td>{ViewDetails?.gst_percent}</td>
                        </tr>
                        <tr>
                          <th>{t("tender date")} :</th>
                          <td>{ViewDetails?.tender_date}</td>
                        </tr>
                        <tr>
                          <th>{t("tender number")} :</th>
                          <td>{ViewDetails?.tender_number}</td>
                        </tr>
                        <tr>
                          <th>{t("bank Name")} :</th>
                          <td>{ViewDetails?.bank_name}</td>
                        </tr>
                        <tr>
                          <th>{t("dd bg number")} :</th>
                          <td>{ViewDetails?.dd_bg_number}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="p-20 shadow rounded h-100">
                  <strong className="text-secondary">
                    {t("Other Details")}
                  </strong>
                  <div className="mt-2">
                    <table className="table-sm table">
                      <tbody>
                        <tr>
                          <th>{t("security deposit amount")} :</th>
                          <td>
                            {formatNumberToINR(
                              ViewDetails?.security_deposit_amount
                            )}
                          </td>
                        </tr>
                        <tr>
                          <th>{t("cr date")} :</th>
                          <td>{ViewDetails?.cr_date}</td>
                        </tr>
                        <tr>
                          <th>{t("cr number")} :</th>
                          <td>{ViewDetails?.cr_number}</td>
                        </tr>
                        <tr>
                          <th>{t("cr code")} :</th>
                          <td>{ViewDetails?.cr_code}</td>
                        </tr>
                        <tr>
                          <th>{t("created at")} :</th>
                          <td>{ViewDetails?.created_at}</td>
                        </tr>
                        <tr>
                          <th>{t("created by")} :</th>
                          <td>{ViewDetails?.created_by}</td>
                        </tr>
                        <tr>
                          <th className="align-middle">{t("cr copy")} :</th>
                          <td>
                            <FileViewer file={ViewDetails?.cr_copy} />
                          </td>
                        </tr>
                        <tr>
                          <th className="align-middle">{t("sd letter")} :</th>
                          <td>
                            <FileViewer file={ViewDetails?.sd_letter} />
                          </td>
                        </tr>
                        <tr>
                          <th>{t("work")} :</th>
                          <td>{ViewDetails?.work}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>

              <Col md={12}>
                <CustomTable
                  id={"items"}
                  rows={ViewDetails?.purchase_order_item?.data || []}
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
                        show: false,
                      }}
                    />
                  )}
                  tableTitleComponent={
                    <div>
                      <ShoppingCart /> <strong>All Items List</strong>
                    </div>
                  }
                />
              </Col>
            </Row>
          ) : (
            <Row className="g-3 py-1">
              <Col md={12}>
                <div className="p-20 shadow rounded h-100">
                  <strong className="text-secondary">{t("Details")}</strong>
                  <div className="mt-2">
                    <table className="table-sm table">
                      <tbody>
                        {ViewDetails?.regional_office_name && (
                          <tr>
                            <th>{t("regional office name")} :</th>
                            <td>{ViewDetails?.regional_office_name}</td>
                          </tr>
                        )}
                        {ViewDetails?.po_number && (
                          <tr>
                            <th>{t("po Number")} :</th>
                            <td>{ViewDetails?.po_number}</td>
                          </tr>
                        )}
                        {ViewDetails?.tender_date && (
                          <tr>
                            <th>{t("Tender Date")} :</th>
                            <td>{ViewDetails?.tender_date}</td>
                          </tr>
                        )}
                        {ViewDetails?.tender_number && (
                          <tr>
                            <th>{t("Tender Number")} :</th>
                            <td>{ViewDetails?.tender_number}</td>
                          </tr>
                        )}
                        {ViewDetails?.security_deposit_date && (
                          <tr>
                            <th>{t("security deposit date")} :</th>
                            <td>{ViewDetails?.security_deposit_date}</td>
                          </tr>
                        )}
                        {ViewDetails?.security_deposit_amount && (
                          <tr>
                            <th>{t("security deposit amount")} :</th>
                            <td>{ViewDetails?.security_deposit_amount}</td>
                          </tr>
                        )}
                        {ViewDetails?.bank_name && (
                          <tr>
                            <th>{t("bank name")} :</th>
                            <td>{ViewDetails?.bank_name}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </CardComponent>
      </Col>
    </>
  );
};

export default PoViewDetails;
