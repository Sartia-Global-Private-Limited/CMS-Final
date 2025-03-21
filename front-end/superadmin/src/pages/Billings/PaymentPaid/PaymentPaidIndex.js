import React from "react";
import { useParams } from "react-router-dom";
import AllPaidBills from "./AllPaidBills";
import OtpVerify from "./OtpVerify";
import ViewPaymentPaid from "./ViewPaymentPaid";
import ViewPoDetails from "./ViewPoDetails";

export default function PaymentPaidIndex() {
  const params = useParams();

  return (
    <>
      {params.page == "all" && <AllPaidBills />}
      {params.page == "otp-verify" && <OtpVerify />}
      {params.page == "view" && <ViewPaymentPaid />}
      {params.page == "po-view" && <ViewPoDetails />}
    </>
  );
}
