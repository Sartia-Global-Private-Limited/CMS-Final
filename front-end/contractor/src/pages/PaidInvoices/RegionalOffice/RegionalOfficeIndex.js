import React from "react";
import { useParams } from "react-router-dom";
import AllRegionalOffice from "./AllRegionalOffice";
import ViewRegionalofficeDetails from "./ViewRegionalofficeDetails";
import CreateRoPayment from "./CreateRoPayment";
import ROTransactions from "./ROTransactions";
import ViewROTransations from "./ViewROTransations";
import POTransactions from "./POTransactions";
import ViewPOTransactions from "./ViewPOTransactions";

const RegionalOfficeIndex = () => {
  const params = useParams();
  return (
    <div>
      {params.page == "all" && <AllRegionalOffice />}
      {params.page == "view" && <ViewRegionalofficeDetails />}
      {params.page == "payment" && <CreateRoPayment />}
      {params.page == "ro-transactions" && <ROTransactions />}
      {params.page == "po-transactions" && <POTransactions />}
      {params.page == "transaction-details" && <ViewROTransations />}
      {params.page == "view-po-details" && <ViewPOTransactions />}
    </div>
  );
};

export default RegionalOfficeIndex;
