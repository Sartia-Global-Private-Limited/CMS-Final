import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getSingleEmployeeResignationById } from "../../../services/authapi";
import CardComponent from "../../../components/CardComponent";
import { UserDetail } from "../../../components/ItemDetail";
import { formatNumberToINR, getDateValue } from "../../../utils/helper";
import StatusChip from "../../../components/StatusChip";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";

const ViewEmployeeResignation = () => {
  const { user } = useSelector(selectUser);
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleEmployeeResignationById(id);
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
        title={"View Employee Resignation Details"}
      >
        <Row className="g-3">
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Resignation Details")}
              </strong>
              <table className="table-sm table mt-2">
                <tbody>
                  <tr>
                    <th className="align-middle">{t("user name")}:</th>
                    <td className="align-middle">
                      <UserDetail
                        img={edit?.user_image}
                        name={edit?.username}
                        login_id={user?.id}
                        id={edit?.user_id}
                        unique_id={edit?.employee_id}
                      />
                    </td>
                  </tr>
                  {/* <tr>
                    <th>{t("designation")} :</th>
                    <td>{edit?.designation || "-"}</td>
                  </tr> */}
                  <tr>
                    <th>{t("resignation date")} :</th>
                    <td>{getDateValue(edit?.resignation_date)}</td>
                  </tr>
                  <tr>
                    <th>{t("last Working Day")} :</th>
                    <td>{getDateValue(edit?.last_working_day)}</td>
                  </tr>
                  <tr>
                    <th>{t("reason")} :</th>
                    <td>{edit?.reason || "-"}</td>
                  </tr>
                  <tr>
                    <th>{t("resignation status")} :</th>
                    <td>
                      <StatusChip
                        status={
                          edit?.resignation_status === "0"
                            ? "Pending"
                            : edit?.resignation_status === "1"
                            ? "Approved"
                            : edit?.resignation_status === "2"
                            ? "Rejected"
                            : null
                        }
                      />
                    </td>
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
                    <th>{t("fnf")} :</th>
                    <td>{formatNumberToINR(edit?.fnf)}</td>
                  </tr>
                  <tr>
                    <th>{t("term")} :</th>
                    <td>{edit?.term || "-"}</td>
                  </tr>
                  <tr>
                    <th>{t("notice period day")} :</th>
                    <td>{edit?.notice_period_day || "-"}</td>
                  </tr>
                  {/* <tr>
                    <th>{t("approved at")} :</th>
                    <td>{getDateValue(edit?.approved_at)}</td>
                  </tr>
                  <tr>
                    <th>{t("approved by")} :</th>
                    <td>{edit?.approved_by || "-"}</td>
                  </tr>
                  <tr>
                    <th>{t("assign asset")} :</th>
                    <td>{edit?.assign_asset || "-"}</td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      </CardComponent>
    </Col>
  );
};

export default ViewEmployeeResignation;
