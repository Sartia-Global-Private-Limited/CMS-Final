import React, { useEffect, useState } from "react";
import { Col, Table, Form, Row, Spinner, Stack } from "react-bootstrap";
import { BsQuestionLg } from "react-icons/bs";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";

import ConfirmAlert from "../../../components/ConfirmAlert";
import CardComponent from "../../../components/CardComponent";
import {
  postStockPunchApproveByOffice,
  getOfficeExpenseRequestByOutletIdForPending,
  getOfficeExpenseRequestByOutletIdForPartial,
} from "../../../services/contractorApi";
import ImageViewer from "../../../components/ImageViewer";
import Feedback from "../Feedback";
import { RiArrowDownSFill } from "react-icons/ri";
import { RiArrowUpSFill } from "react-icons/ri";

const ApproveOfficeExpense = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const outletId = location?.state?.outletId;
  const month = location?.state?.month;
  const allData = location?.state?.allData;
  const type = location?.state?.type;
  const [edit, setEdit] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const fetchTransferDetails = async () => {
    const res =
      type == "pending"
        ? await getOfficeExpenseRequestByOutletIdForPending({
            outlet_id: outletId,
            month: month.split("-")[1],
            params: { user_id: allData?.user_id },
          })
        : await getOfficeExpenseRequestByOutletIdForPartial(
            outletId,
            month.split("-")[1]
          );

    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit([]);
    }
  };

  //   submit form
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const feedback = values.users
      .map((user) => {
        if (user.user_select)
          return {
            ...user.feedback_details,
            ...user.feedback,
            complaint_unique_id: user.itemDetails[0].complaint_unique_id,
            complaint_id: user.itemDetails[0].complaint_id,
            approve_type: "0",
          };
      })
      .filter((item) => item);

    const approve_stock_punch = [];
    const office_not_approved = [];

    for (let i = 0; i < values.users.length; i++) {
      const data = values.users[i];
      for (let j = 0; j < data.itemDetails.length; j++) {
        const d = data.itemDetails[j];
        if (data.user_select) {
          approve_stock_punch.push({
            approve_office_qty: d.approve_office_qty || 0,
            id: d.id,
            stock_id: d.stock_id,
          });
        } else {
          office_not_approved.push({
            id: d.id,
            stock_id: d.stock_id,
          });
        }
      }
    }

    const sData = {
      approve_stock_punch,
      office_not_approved,
      feedback,
    };

    // return console.log("sData", sData);
    const res = await postStockPunchApproveByOffice(sData);

    if (res.status) {
      toast.success(res.message);
      navigate(-1);
    } else {
      toast.error(res.message);
    }
    // setSubmitting(false);
  };

  useEffect(() => {
    fetchTransferDetails();
  }, []);

  return (
    <>
      <Helmet>
        <title>Approve Office Expense · CMS Electricals</title>
      </Helmet>

      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent title={`Approve Office Expense`} showBackButton={true}>
          <Formik
            enableReinitialize={true}
            initialValues={{
              users: edit || "",

              feedback_details: {},
            }}
            // validationSchema={approveOfficeExpenseSchema}
            onSubmit={handleSubmit}
          >
            {(props) => {
              return (
                <Form onSubmit={props?.handleSubmit}>
                  <Row className="g-3">
                    <>
                      {props.values.users.length > 0 &&
                        props.values.users.map((data, index) => {
                          return (
                            <div>
                              <div className="d-flex">
                                <Col md={12} className="">
                                  <div className="p-20 shadow rounded">
                                    <strong className="text-secondary d-flex">
                                      <Form.Check
                                        type={"checkbox"}
                                        className="fs-5"
                                      >
                                        {" "}
                                        <Form.Check.Input
                                          type={"checkbox"}
                                          style={{
                                            backgroundColor: "red",
                                            color: "blue",
                                          }}
                                          onChange={(e) =>
                                            props.setFieldValue(
                                              `users[${index}].user_select`,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      </Form.Check>{" "}
                                      <span className="my-2">
                                        {" "}
                                        User Details
                                      </span>
                                    </strong>
                                    <ul className="list-unstyled m-3">
                                      <li>
                                        Employee Name{" "}
                                        <span className="fw-bold">
                                          :{data?.userDetails?.[0]?.username}
                                        </span>
                                      </li>
                                      <li>
                                        Employee Id{" "}
                                        <span className="fw-bold">
                                          :{" "}
                                          {data?.userDetails?.[0]?.employee_id}
                                        </span>{" "}
                                      </li>
                                      <li>
                                        complaint Unique Id{" "}
                                        <span className="fw-bold">
                                          :{" "}
                                          {
                                            data.itemDetails?.[0]
                                              .complaint_unique_id
                                          }
                                        </span>
                                      </li>
                                    </ul>
                                    <div className="table-scroll my-3">
                                      <Table
                                        striped
                                        hover
                                        className="text-body Roles"
                                      >
                                        <thead>
                                          <tr>
                                            <th>S.No.</th>
                                            <th>Item Name</th>
                                            <th>Item Price</th>
                                            <th>Quantity </th>
                                            <th>total</th>
                                            <th>Approve Quantity</th>
                                            <th>Approved Date</th>
                                          </tr>
                                        </thead>

                                        <tbody>
                                          {data.itemDetails.map((itm, idx) => {
                                            return (
                                              <>
                                                <tr key={idx}>
                                                  <td>{idx + 1}</td>
                                                  <td>
                                                    <ImageViewer
                                                      src={
                                                        itm?.item_image
                                                          ? `${process.env.REACT_APP_API_URL}${itm?.item_image}`
                                                          : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                                                      }
                                                    >
                                                      <img
                                                        width={30}
                                                        height={30}
                                                        className="my-bg object-fit p-1 rounded-circle"
                                                        src={
                                                          itm?.item_image
                                                            ? `${process.env.REACT_APP_API_URL}${itm?.item_image}`
                                                            : `${process.env.REACT_APP_API_URL}/assets/images/no-image.png`
                                                        }
                                                      />{" "}
                                                      {itm?.item_name}
                                                    </ImageViewer>
                                                  </td>
                                                  <td>₹{itm?.item_rate}</td>
                                                  <td>{itm?.approved_qty}</td>
                                                  <td>
                                                    ₹{" "}
                                                    {itm?.total_approved_amount}
                                                  </td>

                                                  <td width={"100px"}>
                                                    <Form.Control
                                                      name={`users[${index}].itemDetails[${idx}].approve_office_qty`}
                                                      placeholder="0"
                                                      disabled={
                                                        !props?.values?.users?.[
                                                          index
                                                        ]?.user_select
                                                      }
                                                      onChange={(e) => {
                                                        const maxValue =
                                                          itm.approved_qty;
                                                        if (
                                                          +e.target.value <=
                                                          +maxValue
                                                        ) {
                                                          props.handleChange(e);
                                                          props.setFieldValue(
                                                            `users[${index}].itemDetails[${idx}].approved_amount`,
                                                            +e.target.value *
                                                              +itm.item_rate
                                                          );
                                                        } else {
                                                          e.target.value =
                                                            +maxValue;
                                                          props.handleChange(e);
                                                          props.setFieldValue(
                                                            `users[${index}].itemDetails[${idx}].approved_amount`,
                                                            +e.target.value *
                                                              +itm.item_rate
                                                          );
                                                        }
                                                      }}
                                                    />
                                                  </td>

                                                  <td>
                                                    {itm?.approved_at ?? "--"}
                                                  </td>
                                                </tr>
                                              </>
                                            );
                                          })}
                                        </tbody>
                                      </Table>
                                    </div>
                                    <div className="d-flex justify-content-end  fs-5">
                                      Total Amount{" "}
                                      <span className="fw-bold text-green">
                                        {" "}
                                        ₹{" "}
                                        {data?.itemDetails?.reduce(
                                          (userTotal, item) =>
                                            userTotal + +item?.approved_amount,
                                          0
                                        ) || 0}
                                      </span>
                                    </div>

                                    {props.values.users[index].user_select && (
                                      <button
                                        type="button"
                                        className="shadow border-0 purple-combo cursor-pointer px-4 py-1 my-2"
                                        onClick={() => {
                                          props.setFieldValue(
                                            `users[${index}].show_form`,
                                            !props.values.users[index].show_form
                                          );
                                        }}
                                      >
                                        {props.values.users[index].show_form ? (
                                          <>
                                            <RiArrowUpSFill /> hide Feedback
                                            Form
                                          </>
                                        ) : (
                                          <>
                                            {" "}
                                            <RiArrowDownSFill />
                                            show Feedback Form
                                          </>
                                        )}
                                      </button>
                                    )}

                                    {props?.values?.users[index]?.show_form && (
                                      <Feedback props={props} index={index} />
                                    )}
                                  </div>
                                </Col>
                              </div>
                            </div>
                          );
                        })}

                      <Form.Group as={Col} md={12}>
                        <div className="mt-2 text-center">
                          <button
                            type={`button`}
                            onClick={() => {
                              setShowAlert(true);
                            }}
                            disabled={props?.isSubmitting}
                            className={`shadow border-0 cursor-pointer px-4 py-1 purple-combo`}
                          >
                            {props?.isSubmitting ? (
                              <>
                                <Spinner
                                  animation="border"
                                  variant="primary"
                                  size="sm"
                                />
                                PLEASE WAIT...
                              </>
                            ) : (
                              <>Submit</>
                            )}
                          </button>{" "}
                          <ConfirmAlert
                            size={"sm"}
                            defaultIcon={<BsQuestionLg />}
                            deleteFunction={props.handleSubmit}
                            hide={setShowAlert}
                            show={showAlert}
                            title={"Confirm Alert"}
                            description={"Are sure to Approve This "}
                          />
                        </div>
                      </Form.Group>
                    </>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </CardComponent>
      </Col>
    </>
  );
};

export default ApproveOfficeExpense;
