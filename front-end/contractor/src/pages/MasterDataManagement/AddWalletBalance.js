import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import {
  addWalletBalance,
  getAllAccountByBankId,
  getAllBankListForDropdown,
} from "../../services/contractorApi";
import { toast } from "react-toastify";
import { AddWalletBalanceSchema } from "../../utils/formSchema";
import CardComponent from "../../components/CardComponent";
import { useTranslation } from "react-i18next";
import MyInput from "../../components/MyInput";
import NotAllowed from "../Authentication/NotAllowed";

export default function AddWalletBalance({ checkPermission }) {
  const [allBanksData, setAllBanksData] = useState([]);
  const [allAccountByBankId, setAllAccountByBankId] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchAllBanksData();
  }, []);

  const fetchAllBanksData = async () => {
    const res = await getAllBankListForDropdown();
    if (res.status) {
      const rData = res.data.map((itm) => {
        return {
          value: itm?.id,
          label: itm?.bank_name,
          logo: itm?.logo,
        };
      });
      setAllBanksData(rData);
    } else {
      setAllBanksData([]);
    }
  };

  const handleAccountByBankIdChange = async (val) => {
    if (!val) return false;
    setAllAccountByBankId([]);
    fetchAllAccountByBankId(val);
  };

  const fetchAllAccountByBankId = async (id) => {
    const res = await getAllAccountByBankId(id);
    if (res.status) {
      const rData = res?.data?.map((itm) => {
        return {
          value: itm.id,
          label: itm.account_number,
          account_holder_name: itm?.account_holder_name,
          account_type: itm?.account_type,
          logo: itm.res?.data?.bank_logo,
          balance: itm.balance,
        };
      });
      setAllAccountByBankId(rData);
    } else {
      setAllAccountByBankId([]);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    const res = await addWalletBalance(values);
    if (res.status) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    resetForm();
    setAllBanksData([]);
    setAllAccountByBankId([]);
  };

  const userFormatOptionLabel = ({ label, logo }) => (
    <div>
      {logo ? (
        <img
          src={process.env.REACT_APP_API_URL + logo}
          className="avatar me-2"
        />
      ) : null}
      {label}
    </div>
  );
  return (
    <div>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"Add Bank Balance"}
          showBackButton
          // backButton={true}
        >
          {checkPermission?.create ? (
            <Formik
              enableReinitialize={true}
              initialValues={{
                id: "",
                balance: "",
                remark: "",
                transaction_id: "",
              }}
              validationSchema={AddWalletBalanceSchema}
              onSubmit={handleSubmit}
            >
              {(props) => {
                return (
                  <Form onSubmit={props?.handleSubmit}>
                    <Row className="g-3">
                      <Form.Group as={Col} md={4}>
                        <MyInput
                          name={"user_id"}
                          formikProps={props}
                          label={t("Select Bank")}
                          customType={"select"}
                          selectProps={{
                            data: allBanksData,
                            onChange: (e) => {
                              handleAccountByBankIdChange(e ? e.value : null);
                              props.setFieldValue("id", "");
                            },
                          }}
                          formatOptionLabel={userFormatOptionLabel}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <MyInput
                          isRequired
                          name={"id"}
                          formikProps={props}
                          label={t("Select Account")}
                          customType={"select"}
                          selectProps={{
                            data: allAccountByBankId,
                          }}
                        />
                      </Form.Group>

                      <Form.Group as={Col} md={4}>
                        <MyInput
                          isRequired
                          name={"balance"}
                          formikProps={props}
                          label={t("Enter Amount")}
                          type="number"
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <MyInput
                          isRequired
                          name={"transaction_id"}
                          formikProps={props}
                          label={t("Enter Transaction Id")}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md={4}>
                        <MyInput
                          isRequired
                          name={"remark"}
                          formikProps={props}
                          label={t("Enter Remark")}
                          customType={"multiline"}
                        />
                      </Form.Group>
                    </Row>

                    <Form.Group as={Col} md={12}>
                      <div className="my-4 text-center">
                        <button
                          type="submit"
                          // onClick={() => handleUpdate(edit)}
                          className="shadow border-0 red-combo cursor-pointer px-4 py-1 mx-3"
                        >
                          {t("Add Amount")}
                        </button>
                      </div>
                    </Form.Group>
                  </Form>
                );
              }}
            </Formik>
          ) : (
            <NotAllowed />
          )}
        </CardComponent>
      </Col>
    </div>
  );
}
