import React, { useEffect, useState } from "react";
import { getSingleDetailsEmployeePromotionDemotion } from "../../../../services/authapi";
import CardComponent from "../../../../components/CardComponent";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ImageViewer from "../../../../components/ImageViewer";
import { formatNumberToINR, getDateValue } from "../../../../utils/helper";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../features/auth/authSlice";
import { UserDetail } from "../../../../components/ItemDetail";
import FileViewer from "../../../../components/FileViewer";
const ViewEmployeePromotionDemotion = () => {
  const { user } = useSelector(selectUser);
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleDetailsEmployeePromotionDemotion(id);
    if (res?.status) {
      setEdit(res?.data);
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
        title={"View Employee Promotion Demotion Details"}
      >
        <Row className="g-3">
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">
                {t("Promotion Demotion Details")}
              </strong>
              <div className="">
                <table className="table-sm table mt-2">
                  <tbody>
                    <tr>
                      <th className="align-middle">{t("user name")}:</th>
                      <td className="align-middle">
                        <UserDetail
                          img={edit?.user_image}
                          name={edit?.user_name}
                          login_id={user?.id}
                          id={edit?.user_id}
                          unique_id={edit?.user_employee_id}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>{t("Purpose")} :</th>
                      <td>{edit?.purpose}</td>
                    </tr>
                    <tr>
                      <th>{t("new designation")} :</th>
                      <td>{edit?.role_name}</td>
                    </tr>
                    <tr>
                      <th>{t("new team")} :</th>
                      <td>{edit?.team_name}</td>
                    </tr>
                    <tr>
                      <th>{t("basic")} :</th>
                      <td>{formatNumberToINR(edit?.basic)}</td>
                    </tr>
                    <tr>
                      <th>{t("change in salary")} :</th>
                      <td>{edit?.change_in_salary}</td>
                    </tr>
                    <tr>
                      <th>{t("Change in Salary Type")} :</th>
                      <td>{edit?.change_in_salary_type}</td>
                    </tr>
                    <tr>
                      <th>{t("Change in Salary Value")} :</th>
                      <td>
                        {edit?.change_in_salary_type == "percentage"
                          ? edit?.change_in_salary_value + "%"
                          : formatNumberToINR(edit?.change_in_salary_value)}
                      </td>
                    </tr>
                    <tr>
                      <th>{t("final salary")} :</th>
                      <td>{formatNumberToINR(edit?.final_salary)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Other Details")}</strong>
              <div className="">
                <table className="table-sm table mt-2">
                  <tbody>
                    <tr>
                      <th className="align-middle">{t("Document")} :</th>
                      <td className="align-middle">
                        <FileViewer file={edit?.document} />
                      </td>
                    </tr>
                    <tr>
                      <th>{t("Reason")} :</th>
                      <td>{edit?.reason}</td>
                    </tr>
                    <tr>
                      <th>{t("Created at")} :</th>
                      <td>{getDateValue(edit?.created_at)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
        </Row>
      </CardComponent>
    </Col>
  );
};

export default ViewEmployeePromotionDemotion;
