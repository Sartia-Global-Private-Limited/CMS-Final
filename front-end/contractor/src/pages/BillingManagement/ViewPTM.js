import React, { useEffect, useState } from "react";
import CardComponent from "../../components/CardComponent";
import { getDetailsOfProcessToMeasurement } from "../../services/contractorApi";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Row, Stack, Table } from "react-bootstrap";
import { BsFileEarmarkText, BsRecord2 } from "react-icons/bs";
import { useTranslation } from "react-i18next";
import TooltipComponent from "../../components/TooltipComponent";
import { ReceiptText } from "lucide-react";
import ActionButton from "../../components/ActionButton";
import { formatNumberToINR } from "../../utils/helper";

export default function ViewPTM() {
  const location = useLocation();
  const complaint_id = location?.state?.complaint_id;
  const navigate = useNavigate();
  const [edit, setEdit] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  const fetchExpenseRequestData = async () => {
    const res = await getDetailsOfProcessToMeasurement(complaint_id);

    if (res.status) {
      setEdit(res.data?.[0]);
    } else {
      setEdit();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (complaint_id) fetchExpenseRequestData();
  }, []);

  return (
    <Col md={12}>
      <CardComponent showBackButton={true} title={"view PTM details"}>
        <Row className="my-2">
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Measurement Details")}
              </strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    {edit?.measurement_date && (
                      <tr>
                        <th>{t("measurement date")} :</th>
                        <td>{edit?.measurement_date}</td>
                      </tr>
                    )}
                    {edit?.financial_year && (
                      <tr>
                        <th>{t("financial year")} :</th>
                        <td>{edit?.financial_year}</td>
                      </tr>
                    )}
                    {edit?.po_number && (
                      <tr>
                        <th>{t("po number")} :</th>
                        <td>{edit?.po_number}</td>
                      </tr>
                    )}
                    {edit?.complaint_type_name && (
                      <>
                        <tr>
                          <th>{t("Complaint unique id")} :</th>
                          <td>{edit?.complaint_unique_id}</td>
                        </tr>
                        <tr>
                          <th>{t("Complaint Type Name")} :</th>
                          <td>{edit?.complaint_type_name}</td>
                        </tr>
                      </>
                    )}
                    {edit?.regional_office_name && (
                      <tr>
                        <th>{t("regional office name")} :</th>
                        <td>{edit?.regional_office_name}</td>
                      </tr>
                    )}
                    {edit?.sales_area_name && (
                      <tr>
                        <th>{t("sales area name")} :</th>
                        <td>{edit?.sales_area_name}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Po Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("po Number")} :</th>
                      <td>{edit?.po_details?.po_number}</td>
                    </tr>
                    <tr>
                      <th>{t("po date")}:</th>
                      <td>{edit?.po_details?.po_date}</td>
                    </tr>
                    <tr>
                      <th>{t("po limit")} :</th>
                      <td>{formatNumberToINR(edit?.po_details?.po_limit)}</td>
                    </tr>
                    <tr>
                      <th>{t("po used amount")} :</th>
                      <td>{formatNumberToINR(edit?.po_details?.po_amount)}</td>
                    </tr>
                    <tr>
                      <th>{t("po remaining amount")} :</th>
                      <td>
                        {formatNumberToINR(
                          edit?.po_details?.po_limit -
                            edit?.po_details?.po_amount
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={12}>
            {edit?.outlet_name && (
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">
                  {t("Outlet Details")}
                </strong>
                <div className="mt-2">
                  <table className="table-sm table">
                    <tbody>
                      {edit?.outlet_name && (
                        <tr>
                          <th>{t("Outlet name")} :</th>
                          <td>{edit?.outlet_name}</td>
                        </tr>
                      )}
                      {edit?.outlet_address && (
                        <tr>
                          <th>{t("Outlet Address")} :</th>
                          <td>{edit?.outlet_address}</td>
                        </tr>
                      )}
                      {edit?.outlet_category && (
                        <tr>
                          <th>{t("Outlet Category")} :</th>
                          <td>{edit?.outlet_category}</td>
                        </tr>
                      )}

                      {edit?.outelet_cc_number && (
                        <tr>
                          <th>{t("Outlet cc Number")} :</th>
                          <td>{edit?.outelet_cc_number}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Col>
        </Row>

        <>
          <div className="table-scroll">
            <div className="p-20 shadow">
              <strong className="text-secondary">{t("Item List")}</strong>
            </div>
            <Table className="text-body Roles">
              <thead>
                <tr>
                  <th style={{ maxWidth: "50px" }}>{t("Order Line")}</th>
                  <th>{t("Item Name")}</th>
                  <th>{t("Unit")}</th>
                  <th>{t("No.")}</th>
                  <th>{t("Length")}</th>
                  <th>{t("Breadth")}</th>
                  <th>{t("Depth")}</th>
                  <th>{t("Qty")}</th>
                  <th>{t("Total Qty")}</th>
                  <th>{t("Rate")}</th>
                  <th>{t("Amount")}</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <td colSpan={15}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : edit?.items_data?.length > 0 ? (
                  edit?.items_data?.map((parentItem, parentIndex) => (
                    <>
                      <tr key={parentIndex} className="bg-light">
                        <td>{parentItem.order_line_number}</td>
                        <td>{parentItem.item_name}</td>
                        <td>{parentItem.unit}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                          {parseFloat(
                            parentItem?.childArray?.reduce(
                              (total, item) => +item.qty + total,
                              0
                            )
                          ).toFixed(2)}
                        </td>
                        <td>{formatNumberToINR(parentItem.rate)}</td>
                        <td>
                          {formatNumberToINR(
                            parentItem?.childArray?.reduce(
                              (total, itm) => total + +itm.qty,
                              0
                            ) * +parentItem.rate
                          )}
                        </td>
                      </tr>
                      {parentItem?.childArray?.map((childItem, childIndex) => (
                        <tr key={childIndex}>
                          <td></td>
                          <td colSpan={2}>
                            <BsRecord2 /> {childItem?.description}
                          </td>
                          <td>{childItem?.no}</td>
                          <td>{childItem?.length}</td>
                          <td>{childItem?.breadth}</td>
                          <td>{childItem?.depth}</td>
                          <td className="text-start" colSpan={5}>
                            {parseFloat(childItem.qty).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan={15}>
                      <img
                        className="p-3"
                        alt="no-result"
                        width="250"
                        src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
          <div className="d-flex my-2 justify-content-end fw-bold fs-5">
            {t("Total Amount")} {formatNumberToINR(edit?.measurement_amount)}
          </div>
          <div className="d-flex m-3">
            <ActionButton
              className={"justify-content-end mb-3"}
              hideEye={"d-none"}
              hideEdit={"d-none"}
              hideDelete={"d-none"}
              custom={
                <>
                  <TooltipComponent title={"Hard Copy"}>
                    <Button
                      className={`view-btn`}
                      variant="light"
                      onClick={() => {
                        const url = `/view-measurements/${edit.complaint_id}`;
                        window.open(url, "_blank");
                      }}
                    >
                      <BsFileEarmarkText
                        className={`social-btn purple-combo`}
                      />
                    </Button>
                  </TooltipComponent>
                  <div className={`vr hr-shadow`} />
                  <TooltipComponent
                    title={
                      <div className="text-center">
                        Fund Amount
                        <div className="fw-bold text-green">
                          {formatNumberToINR(edit?.total_fund_amount)}
                        </div>
                      </div>
                    }
                  >
                    <Button
                      className={`view-btn`}
                      variant="light"
                      onClick={() => {
                        const url = `/view-final-expense/${"fund"}/${
                          edit.complaint_id
                        }`;
                        window.open(url, "_blank");
                      }}
                    >
                      <ReceiptText className={`social-btn success-combo`} />
                    </Button>
                  </TooltipComponent>
                  <div className={`vr hr-shadow`} />
                  <TooltipComponent
                    title={
                      <div className="text-center">
                        Stock Amount
                        <div className="fw-bold text-green">
                          {formatNumberToINR(edit?.total_stock_amount)}
                        </div>
                      </div>
                    }
                  >
                    <Button
                      className={`view-btn`}
                      variant="light"
                      onClick={() => {
                        const url = `/view-final-expense/${"stock"}/${
                          edit.complaint_id
                        }`;
                        window.open(url, "_blank");
                      }}
                    >
                      <ReceiptText className={`social-btn danger-combo`} />
                    </Button>
                  </TooltipComponent>
                </>
              }
            />
          </div>
        </>
      </CardComponent>
    </Col>
  );
}
