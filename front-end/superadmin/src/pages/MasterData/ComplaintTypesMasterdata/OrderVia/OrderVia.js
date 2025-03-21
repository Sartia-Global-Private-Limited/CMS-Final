import React, { useEffect } from "react";
import { useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import CardComponent from "../../../../components/CardComponent";
import ActionButton from "../../../../components/ActionButton";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import { deleteOrderVia, getAllOrderVia } from "../../../../services/authapi";
import ConfirmAlert from "../../../../components/ConfirmAlert";

const OrderVia = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allOrderVia, setAllOrderVia] = useState([]);

  const fetchOrderViaData = async () => {
    const res = await getAllOrderVia();
    if (res.status) {
      setAllOrderVia(res.data);
    } else {
      setAllOrderVia([]);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteOrderVia(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllOrderVia((prev) => prev.filter((dlt) => dlt.id !== +idToDelete));
      fetchOrderViaData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchOrderViaData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Order Via · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"All - Order Via"}
          icon={<BsPlus />}
          link={"/order-via/create-order-via/new"}
          tag={"Create"}
        >
          <div className="overflow-auto p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {["Sr no.", "Order Via", "Status", "Action"].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={4}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : allOrderVia.length > 0 ? (
                  <>
                    {allOrderVia?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{itm?.order_via}</td>
                        <td
                          className={`text-${
                            itm?.status === "1" ? "green" : "danger"
                          }`}
                        >
                          {itm?.status === "1" ? "Active" : "InActive"}
                        </td>
                        <td>
                          <ActionButton
                            hideEye={"d-none"}
                            deleteOnclick={() => {
                              setIdToDelete(itm.id);
                              setShowAlert(true);
                            }}
                            editlink={`/order-via/create-order-via/${itm.id}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={4}>
                    <img
                      className="p-3"
                      alt="no-result"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                    />
                  </td>
                )}
              </tbody>
            </Table>
          </div>
        </CardComponent>
      </Col>

      <ConfirmAlert
        size={"sm"}
        deleteFunction={handleDelete}
        hide={setShowAlert}
        show={showAlert}
        title={"Confirm Delete"}
        description={"Are you sure you want to delete this!!"}
      />
    </>
  );
};

export default OrderVia;
