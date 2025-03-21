import React from "react";
import { useParams } from "react-router-dom";
import DealerContacts from "./DealerContacts";
import ClientContacts from "./ClientContacts";
import SupplierContacts from "./SupplierContacts";
import EnergyCompanyContacts from "./EnergyCompanyContacts";
import CreateContacts from "./CreateContacts";
import AllSendMessages from "./AllSendMessages";
import ViewAllMessages from "./ViewAllMessages";
import AllEnergyCompanyContacts from "./AllEnergyCompanyContacts";

export default function ContactsIndex() {
  const params = useParams();
  return (
    <>
      {params.page == "create" && <CreateContacts />}
      {params.page == "dealer" && <DealerContacts />}
      {params.page == "client" && <ClientContacts />}
      {params.page == "energy" && <EnergyCompanyContacts />}
      {params.page == "supplier" && <SupplierContacts />}
      {params.page == "allmessages" && <AllSendMessages />}
      {params.page == "view" && <ViewAllMessages />}
      {params.page == "all-energy-company-contact" && (
        <AllEnergyCompanyContacts />
      )}
    </>
  );
}
