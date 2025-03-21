import React, { useEffect, useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CardComponent from "../../../components/CardComponent";
import { getDetailsOfPaymentPaidForRO } from "../../../services/contractorApi";

export default function ViewRegionalofficeDetails() {
  const [data, setData] = useState();
  const { id } = useParams();
  const { t } = useTranslation();

  const ViewRetentionMoney = async () => {
    const res = await getDetailsOfPaymentPaidForRO(id);
    if (res.status) {
      setData(res.data[0]);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    ViewRetentionMoney();
  }, []);

  return (
    <>
      <Col md={12}>
        <CardComponent showBackButton={true} title={"View ro details"}>
          <Row className="d-flex mb-3">
            <Col md={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">
                  {t("payment Detail")}
                </strong>
                <div className="mt-2">
                  <table className="table-sm table">
                    <tbody>
                      <tr>
                        <th>{t("payment unique id")} :</th>
                        <td>{data?.unique_id}</td>
                      </tr>

                      <tr>
                        <th>{t("ro name")} :</th>
                        <td>{data?.ro_name}</td>
                      </tr>
                      <tr>
                        <th>{t("po number")} :</th>
                        <td>{data?.po_details?.po_number}</td>
                      </tr>
                      <tr>
                        <th>{t("Payment amount")} :</th>
                        <td className="text-green">₹ {data?.amount}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>

            <div className="shadow p-2 g-4">
              <span className="fw-bold mx-2 text-danger">
                {" "}
                {t("All Invoices")}
              </span>

              <div className="mt-2">
                <Table className="table-sm table Roles">
                  <thead>
                    <tr>
                      <th>{t("Sr No.")}</th>
                      <th>{t("Invoice number")}</th>
                      <th>{t("measurement amount")}</th>
                      <th>{t("Pay amount")}</th>
                      <th>{t("Deduction amount")}</th>
                      <th>{t("complaint unique id")}</th>
                      <th>{t("sales area name")}</th>
                      <th>{t("PV number")}</th>
                      <th>{t("PV date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.complaint_details?.length > 0 &&
                      data?.complaint_details?.map((data, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{data.invoice_number}</td>
                            <td>{data.measurement_amount}</td>
                            <td>{data.pay_amount}</td>
                            <td>{data.deduction}</td>
                            <td>{data.complaint_unique_id}</td>
                            <td>{data.sales_area_details.sales_area_name}</td>
                            <td>{data.pv_number}</td>
                            <td>{data.pv_date}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>
              </div>
            </div>
          </Row>
        </CardComponent>
      </Col>
    </>
  );
}
