import React from "react";
import { useParams } from "react-router-dom";
import ViewInvoices from "./ViewInvoices";
import CreatePayment from "./CreatePayment";
import PaymentRecieved from "./PaymentRecieved";
import ViewRecievedPayment from "./ViewRecievedPayment";
import Payments from "./Payments";

export default function PaymentIndex() {
  const params = useParams();

  return (
    <>
      {params.page == "all" && <Payments />}
      {params.page == "recieved" && <PaymentRecieved />}
      {params.page == "create" && <CreatePayment />}
      {params.page == "view-invoice" && <ViewInvoices />}
      {params.page == "view-recieved-payments" && <ViewRecievedPayment />}
    </>
  );
}
