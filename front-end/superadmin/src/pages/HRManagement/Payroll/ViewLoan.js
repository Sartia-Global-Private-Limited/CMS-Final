import React, { useEffect, useState } from "react";
import CardComponent from "../../../components/CardComponent";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatNumberToINR, getDateValue } from "../../../utils/helper";
import { useSelector } from "react-redux";
import { selectUser } from "../../../features/auth/authSlice";
import { UserDetail } from "../../../components/ItemDetail";
import { getSingleLoanById } from "../../../services/authapi";
import StatusChip from "../../../components/StatusChip";

const ViewLoan = () => {
  const { user } = useSelector(selectUser);
  const [edit, setEdit] = useState({});
  const { id } = useParams();
  const { t } = useTranslation();

  const fetchSingleData = async () => {
    const res = await getSingleLoanById(id);
    if (res?.status) {
      setEdit(res?.data);
    } else {
      setEdit({});
    }
  };
  useEffect(() => {
    fetchSingleData();
  }, []);

  const [loans, setLoans] = useState([
    {
      id: 1,
      borrower: "John Doe",
      amount: 5000,
      dueDate: "2024-12-15",
      status: "Pending",
    },
    {
      id: 2,
      borrower: "Jane Smith",
      amount: 12000,
      dueDate: "2024-11-20",
      status: "Approved",
    },
    {
      id: 3,
      borrower: "Alice Johnson",
      amount: 8000,
      dueDate: "2024-10-30",
      status: "Rejected",
    },
  ]);

  return (
    <Col md={12} data-aos="fade-up" data-aos-delay={200}>
      <CardComponent
        className={"after-bg-light"}
        showBackButton={true}
        title={"View Loan Details"}
      >
        <Row className="g-3">
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Loan Details")}</strong>
              <div className="">
                <table className="table-sm table mt-2">
                  <tbody>
                    <tr>
                      <th className="align-middle">{t("user name")}:</th>
                      <td className="align-middle">
                        <UserDetail
                          img={edit?.image}
                          name={edit?.name}
                          login_id={user?.id}
                          id={edit?.user_id}
                          unique_id={edit?.employee_id}
                        />
                      </td>
                    </tr>
                    <tr>
                      <th>{t("Interest Rate")} :</th>
                      <td>{edit?.interest_rate || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("loan amount")} :</th>
                      <td>{formatNumberToINR(edit?.loan_amount)}</td>
                    </tr>
                    <tr>
                      <th>{t("loan id")} :</th>
                      <td>{edit?.loan_id}</td>
                    </tr>
                    <tr>
                      <th>{t("loan term")} :</th>
                      <td>{edit?.loan_term || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("loan type")} :</th>
                      <td>{edit?.loan_type}</td>
                    </tr>
                    <tr>
                      <th>{t("repayment amount")} :</th>
                      <td>{formatNumberToINR(edit?.repayment_amount)}</td>
                    </tr>
                    <tr>
                      <th>{t("repayment date")} :</th>
                      <td>{getDateValue(edit?.repayment_date)}</td>
                    </tr>
                    <tr>
                      <th>{t("status")} :</th>
                      <td>
                        <StatusChip status={edit?.status} />
                      </td>
                    </tr>
                    <tr>
                      <th>{t("interest mode")} :</th>
                      <td>{edit?.interest_mode || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("interest rate")} :</th>
                      <td>{edit?.interest_rate || "-"}</td>
                    </tr>
                    {/* <tr>
                      <th>{t("loan status changed by")} :</th>
                      <td>{edit?.loan_status_changed_by || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("loan status changed date")} :</th>
                      <td>{getDateValue(edit?.loan_status_changed_date)}</td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Bank Details")}</strong>
              <div className="">
                <table className="table-sm table mt-2">
                  <tbody>
                    <tr>
                      <th>{t("bank")} :</th>
                      <td>{edit?.bank || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("branch")} :</th>
                      <td>{edit?.branch || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("cheque date")} :</th>
                      <td>{getDateValue(edit?.cheque_date)}</td>
                    </tr>
                    <tr>
                      <th>{t("cheque number")} :</th>
                      <td>{edit?.cheque_number || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("payment mode")} :</th>
                      <td>{edit?.payment_mode || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("emi")} :</th>
                      <td>{edit?.emi || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("emi start from")} :</th>
                      <td>{getDateValue(edit?.emi_start_from)}</td>
                    </tr>
                    <tr>
                      <th>{t("remarks")} :</th>
                      <td>{edit?.remarks || "-"}</td>
                    </tr>
                    <tr>
                      <th>{t("Created at")} :</th>
                      <td>{getDateValue(edit?.created_at)}</td>
                    </tr>
                    <tr>
                      <th>{t("Updated at")} :</th>
                      <td>{getDateValue(edit?.updated_at)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Col>
          <Col md={12}>
            <div className="p-20 shadow rounded h-100">
              <strong className="text-secondary">{t("Emi Details")}</strong>
              <table className="table-sm text-center table mt-2">
                <thead>
                  <tr>
                    <th>Sr No.</th>
                    <th>Loan Amount</th>
                    <th>Due Date</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody className="text-wrap">
                  {edit?.emis?.map((loan, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{formatNumberToINR(loan.amount)}</td>
                      <td>{getDateValue(loan.emi_date)}</td>
                      <td>{getDateValue(loan.payment_date)}</td>
                      <td>
                        <StatusChip status={loan.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      </CardComponent>
    </Col>
  );
};

export default ViewLoan;
