import React, { useEffect, useState } from "react";
import { Col, Table } from "react-bootstrap";
import { BsPlus } from "react-icons/bs";
import ActionButton from "../../../../components/ActionButton";
import ReactPagination from "../../../../components/ReactPagination";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import ConfirmAlert from "../../../../components/ConfirmAlert";
import {
  deleteExpensesCashById,
  getAllExpensesCash,
} from "../../../../services/contractorApi";
import CardComponent from "../../../../components/CardComponent";

const ExpensesCash = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");
  const [allExpensesCash, setAllExpensesCash] = useState([]);
  const [pageDetail, setPageDetail] = useState({});
  const [search, setSearch] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const fetchExpensesCashData = async () => {
    const res = await getAllExpensesCash(search, pageSize, pageNo);
    if (res.status) {
      setAllExpensesCash(res.data);
      setPageDetail(res.pageDetails);
    } else {
      setAllExpensesCash([]);
      setPageDetail({});
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    const res = await deleteExpensesCashById(idToDelete);
    if (res.status) {
      toast.success(res.message);
      setAllExpensesCash((prev) =>
        prev.filter((dlt) => dlt.id !== +idToDelete)
      );
      fetchExpensesCashData();
    } else {
      toast.error(res.message);
    }
    setIdToDelete("");
    setShowAlert(false);
  };

  useEffect(() => {
    fetchExpensesCashData();
  }, [search, pageNo, pageSize]);

  const handlePageSizeChange = (selectedOption) => {
    setPageSize(selectedOption.value);
  };

  const serialNumber = Array.from(
    { length: pageDetail?.pageEndResult - pageDetail?.pageStartResult + 1 },
    (_, index) => pageDetail?.pageStartResult + index
  );

  return (
    <>
      <Helmet>
        <title>Expenses Cash · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"Expenses Cash"}
          search={true}
          searchOnChange={(e) => {
            setSearch(e.target.value);
          }}
          icon={<BsPlus />}
          link={"/ExpensesCash/create-expenses-cash/new"}
          tag={"Create"}
        >
          <div className="table-scroll p-2">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  {[
                    "Sr no.",
                    "expense date",
                    "expense category name",
                    "expense amount",
                    "supplier name",
                    // "status",
                    "Action",
                  ].map((thead) => (
                    <th key={thead}>{thead}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={6}>
                    <img
                      className="p-3"
                      width="250"
                      src={`${process.env.REACT_APP_API_URL}/assets/images/Curve-Loading.gif`}
                      alt="Loading"
                    />
                  </td>
                ) : allExpensesCash.length > 0 ? (
                  <>
                    {allExpensesCash?.map((itm, idx) => (
                      <tr key={idx}>
                        <td>{serialNumber[idx]}</td>
                        <td>{itm?.expense_date}</td>
                        <td>{itm?.expense_category_name}</td>
                        <td>₹ {itm?.expense_amount}</td>
                        <td>{itm?.supplier_name}</td>
                        {/* <td
                          className={`text-${
                            itm?.status === "1" ? "green" : "danger"
                          }`}
                        >
                          {itm?.status === "1" ? "Active" : "Inactive"}
                        </td> */}
                        <td>
                          <ActionButton
                            deleteOnclick={() => {
                              setIdToDelete(itm.id);
                              setShowAlert(true);
                            }}
                            eyelink={`/ExpensesCash/create-expenses-cash/${itm.id}?type=view`}
                            editlink={`/ExpensesCash/create-expenses-cash/${itm.id}`}
                          />
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <td colSpan={6}>
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
            <ReactPagination
              pageSize={pageSize}
              prevClassName={
                pageNo === 1 ? "danger-combo-disable pe-none" : "red-combo"
              }
              nextClassName={
                pageSize == pageDetail?.total
                  ? allExpensesCash.length - 1 < pageSize
                    ? "danger-combo-disable pe-none"
                    : "success-combo"
                  : allExpensesCash.length < pageSize
                  ? "danger-combo-disable pe-none"
                  : "success-combo"
              }
              title={`Showing ${pageDetail?.pageStartResult || 0} to ${
                pageDetail?.pageEndResult || 0
              } of ${pageDetail?.total || 0}`}
              handlePageSizeChange={handlePageSizeChange}
              prevonClick={() => setPageNo(pageNo - 1)}
              nextonClick={() => setPageNo(pageNo + 1)}
            />
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

export default ExpensesCash;
