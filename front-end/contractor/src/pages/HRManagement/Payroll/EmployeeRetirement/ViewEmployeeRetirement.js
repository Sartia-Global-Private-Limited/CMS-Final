import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSinglePensionRetirment } from "../../../../services/authapi";
import CardComponent from "../../../../components/CardComponent";
import { UserDetail } from "../../../../components/ItemDetail";
import { formatNumberToINR, getDateValue } from "../../../../utils/helper";
import StatusChip from "../../../../components/StatusChip";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/auth/authSlice";

const ViewEmployeeRetirement = () => {
  const { user } = useSelector(selectUser);
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSinglePensionRetirment(id);
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };
  useEffect(() => {
    fetchSingleData();
  }, []);

  return (
    <Col md={12} data-aos="fade-up" data-aos-delay={200}>
      <CardComponent
        className={"after-bg-light"}
        showBackButton={true}
        title={"View Employee Retirement Details"}
      >
        <Row className="g-3">
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Retirement Details")}
              </strong>
              <table className="table-sm table mt-2">
                <tbody>
                  <tr>
                    <th className="align-middle">{t("user name")}:</th>
                    <td className="align-middle">
                      <UserDetail
                        img={edit?.user_image}
                        name={edit?.name}
                        login_id={user?.id}
                        id={edit?.user_id}
                        unique_id={edit?.user_employee_id}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>{t("retirement date")} :</th>
                    <td>{getDateValue(edit?.retirement_date)}</td>
                  </tr>
                  <tr>
                    <th>{t("asset recovery")} :</th>
                    <td>{edit?.asset_recovery || "-"}</td>
                  </tr>
                  <tr>
                    <th>{t("pension status")} :</th>
                    <td>
                      <StatusChip
                        status={
                          edit?.pension_status == "1" ? "Active" : "Inactive"
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>{t("pension amount")} :</th>
                    <td>{formatNumberToINR(edit?.pension_amount)}</td>
                  </tr>
                  <tr>
                    <th>{t("Pension Duration")} :</th>
                    <td>{edit?.pension_duration}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Other Details")}</strong>
              <table className="table-sm table mt-2">
                <tbody>
                  <tr>
                    <th>{t("allow commutation")} :</th>
                    <td>
                      {Boolean(edit?.allow_commutation) == false ? "No" : "Yes"}
                    </td>
                  </tr>
                  <tr>
                    <th>{t("commute percentage")} :</th>
                    <td>{edit?.commute_percentage}</td>
                  </tr>
                  <tr>
                    <th>{t("retirement gratuity")} :</th>
                    <td>{edit?.retirement_gratuity}</td>
                  </tr>
                  <tr>
                    <th>{t("service gratuity")} :</th>
                    <td>{edit?.service_gratuity}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      </CardComponent>
    </Col>
  );
};

export default ViewEmployeeRetirement;
