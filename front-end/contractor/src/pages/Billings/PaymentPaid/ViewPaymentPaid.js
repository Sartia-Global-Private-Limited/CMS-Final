import React, { useEffect, useState } from "react";
import CardComponent from "../../../components/CardComponent";
import { getPaymentPaidDetails } from "../../../services/contractorApi";
import { Col, Row, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ViewPaymentPaid() {
  const [data, setData] = useState();
  const location = useLocation();
  const id = location.state?.id;
  const { t } = useTranslation();

  const ViewRetentionMoney = async () => {
    const res = await getPaymentPaidDetails(id);
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
      <CardComponent showBackButton={true} title={"View Payment Paid"}>
        <Row className="d-flex mb-3">
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("payment Detail")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("payment unique id")} :</th>
                      <td>{data?.unique_id}</td>
                    </tr>
                    <tr>
                      <th>{t("manager name")}:</th>
                      <td>{data?.manager_name}</td>
                    </tr>

                    <tr>
                      <th>{t("ro name")} :</th>
                      <td>{data?.ro_name}</td>
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
    </>
  );
}
