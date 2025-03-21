import React, { useEffect, useState } from "react";
import CardComponent from "../../../components/CardComponent";
import { getPODetailsById } from "../../../services/contractorApi";
import { Col, Row, Table } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ViewPoDetails() {
  const [data, setData] = useState();
  const location = useLocation();
  const id = location.state?.id;
  const { t } = useTranslation();

  const ViewPO = async () => {
    const res = await getPODetailsById(id);
    if (res.status) {
      setData(res.data[0]);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    ViewPO();
  }, []);

  return (
    <>
      <Col md={12}>
        <CardComponent showBackButton={true} title={"View Po Details"}>
          <Row className="d-flex mb-3">
            <Col md={12}>
              <div className="p-20 shadow rounded h-100">
                <strong className="text-secondary">
                  {t("Purhase Order Detail")}
                </strong>
                <div className="mt-2">
                  <table className="table-sm table">
                    <tbody>
                      <tr>
                        <th>{t("po number")} :</th>
                        <td>{data?.po_number}</td>
                      </tr>
                      <tr>
                        <th>{t("po date")}:</th>
                        <td>{data?.po_date}</td>
                      </tr>

                      <tr>
                        <th>{t("Total paid amount")} :</th>
                        <td className="text-green">
                          ₹ {data?.total_paid_amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>

            <div className="shadow p-2 g-4">
              <span className="fw-bold mx-2 text-danger">
                {t("All Complaints")}
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
                      <th>{t("regional office name")}</th>
                      <th>{t("PV number")}</th>
                      <th>{t("PV date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.complaints?.length > 0 &&
                      data?.complaints?.map((data, idx) => {
                        return (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{data.invoice_number}</td>
                            <td>{data.measurement_amount}</td>
                            <td>{data.pay_amount}</td>
                            <td>{data.deduction}</td>
                            <td>{data.complaint_unique_id}</td>
                            <td>{data.sales_area_details.sales_area_name}</td>
                            <td>{data.ro_details.ro_name}</td>
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
