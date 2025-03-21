import React, { useState } from "react";
import { Table, Badge, Col } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../components/ActionButton";
import CardComponent from "../../components/CardComponent";
import Modaljs from "../../components/Modal";
import CreateRoles from "../../components/ModalContent/CreateRoles";
import Switch from "../../components/Switch";

const RolesPermissions = () => {
  const [showcreateroles, setshowcreateroles] = useState(false);
  return (
    <>
      <Col md={12} data-aos={"fade-up"} data-aos-delay={200}>
        <CardComponent
          title={"User Management"}
          onclick={setshowcreateroles}
          icon={<BsPlus />}
          tag={"Add"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="bg-new">
                <tr>
                  {["Sr No.", "User", "Module", "Action", "Permission"].map(
                    (thead) => (
                      <th key={thead}>{thead}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((home) => (
                  <tr key={home}>
                    td
                    <td className="text-truncate">Altaf Ahmad</td>
                    <td className="col-md-8">
                      {[
                        "Dashboard",
                        "Complaints",
                        "Complaints",
                        "Complaints",
                        "Complaints",
                        "Complaints",
                        "DISPENDING UNITS",
                        "My Outlets",
                        "CERTIFICATES",
                        "FEEDBACKS",
                        "MY PROFILE",
                      ].map((module) => (
                        <Badge
                          key={module}
                          className="m-1 btn-shadow purple-combo"
                        >
                          {module}
                        </Badge>
                      ))}
                    </td>
                    <td>
                      <ActionButton
                        eyelink={"/ViewRolesPermissions"}
                        editOnclick={setshowcreateroles}
                      />
                    </td>
                    <td>
                      <div>
                        <Switch />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </CardComponent>
      </Col>
      <Modaljs
        open={showcreateroles}
        size={"md"}
        closebtn={"Cancel"}
        Savebtn={"Add"}
        close={() => setshowcreateroles(false)}
        title={"Create New User"}
      >
        <CreateRoles />
      </Modaljs>
    </>
  );
};

export default RolesPermissions;
