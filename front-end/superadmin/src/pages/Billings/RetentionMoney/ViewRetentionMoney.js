import React, { useEffect, useState } from "react";
import CardComponent from "../../../components/CardComponent";
import { getInvoiceDetailForRetention } from "../../../services/contractorApi";
import { Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ViewRecievedPayment() {
  const [data, setData] = useState();
  const location = useLocation();
  const id = location.state?.id;
  const { t } = useTranslation();

  const ViewRetentionMoney = async () => {
    const res = await getInvoiceDetailForRetention(id);
    if (res.status) {
      setData(res.data);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    ViewRetentionMoney();
  }, []);

  return (
    <>
      <CardComponent showBackButton={true} title={"View Retention money"}>
        <div className="d-flex mb-3">
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Invoice Details")}</strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("Invoice Number")} :</th>
                      <td>{data?.invoice_number}</td>
                    </tr>
                    <tr>
                      <th>{t("invoice date")}:</th>
                      <td>{data?.invoice_date}</td>
                    </tr>

                    <tr>
                      <th>{t("Pv number")} :</th>
                      <td>{data?.payment_voucher_number}</td>
                    </tr>
                    <tr>
                      <th>{t("Payment unique id")} :</th>
                      <td>{data?.payment_unique_id}</td>
                    </tr>
                    <tr>
                      <th>{t("Net Amount")} :</th>
                      <td>{data?.net_amount}</td>
                    </tr>
                    <tr>
                      <th>{t("Bill Amount")} :</th>
                      <td> ₹ {data?.amount}</td>
                    </tr>
                    <tr>
                      <th>{t("Amount Recieved")} :</th>
                      <td>₹ {data?.received_amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Deduction Details")}
              </strong>
              <div className="mt-2">
                <table className="table-sm table">
                  <tbody>
                    <tr>
                      <th>{t("Tds Amount")} :</th>

                      <td>₹ {data?.tds_amount}</td>
                    </tr>
                    <tr>
                      <th>{t("tds amount on gst")} :</th>
                      <td>₹ {data?.tds_on_gst_amount}</td>
                    </tr>
                    <tr>
                      <th>{t("retention amount")}:</th>
                      <td>₹ {data?.retention_amount}</td>
                    </tr>
                    <tr>
                      <th>{t("covid 19 amount")} :</th>
                      <td>₹ {data?.covid19_amount_hold}</td>
                    </tr>
                    <tr>
                      <th>{t("Ld Amount")}:</th>
                      <td>₹ {data?.ld_amount}</td>
                    </tr>
                    <tr>
                      <th>{t("other deduction")}:</th>
                      <td>₹ {data?.other_deduction}</td>
                    </tr>
                    <tr>
                      <th>{t("Hold Amount")}:</th>
                      <td>₹{data?.hold_amount}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </div>
      </CardComponent>
    </>
  );
}
