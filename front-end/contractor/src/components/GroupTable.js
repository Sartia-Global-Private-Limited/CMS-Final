import React, { useState } from "react";
import { Table, Collapse } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  BsChevronDown,
  BsChevronUp,
  BsExclamationCircleFill,
  BsThreeDotsVertical,
} from "react-icons/bs";
import { ItemDetail } from "./ItemDetail";
import { formatNumberToINR, getDateValue } from "../utils/helper";

const groupById = (data) => {
  return data.reduce((acc, item) => {
    if (!acc[item?.item_master_id]) {
      acc[item?.item_master_id] = [];
    }
    acc[item?.item_master_id].push(item);
    return acc;
  }, {});
};

export const GroupTable = ({
  data,
  headers = [
    `Item Id`,
    `Item Name`,
    `Brand`,
    `HsnCode`,
    `Supplier`,
    `Item Price`,
    `Request quantity`,
    `Amount`,
    `Total Amount`,
    `Request Date`,
  ],
}) => {
  const { t } = useTranslation();
  const groupedData = groupById(data);
  const [openRow, setOpenRow] = useState({});

  const toggleCollapse = (groupId) => {
    setOpenRow((prevState) => ({
      ...prevState,
      [groupId]: !prevState[groupId],
    }));
  };

  return (
    <div className="p-3 shadow">
      <strong>{t("All Existing Items")}</strong>
      <div className="table-scroll mt-3">
        <Table striped bordered className="text-body bg-new Roles">
          <thead>
            <tr>
              {headers?.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
              <th>
                <BsThreeDotsVertical />
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).map((groupId) => {
              const groupTotalAmount = groupedData[groupId].reduce(
                (total, item) => total + (item.request_amount || 0),
                0
              );
              return (
                <React.Fragment key={groupId}>
                  <tr>
                    <td>{groupId || "-"}</td>
                    <td>
                      <ItemDetail
                        img={groupedData[groupId][0]?.image}
                        name={groupedData[groupId][0]?.item_name}
                        unique_id={groupedData[groupId][0]?.unique_id}
                      />
                    </td>{" "}
                    <td>{groupedData[groupId][0]?.brand_name || "-"}</td>{" "}
                    <td>{groupedData[groupId][0]?.hsncode || "-"}</td>{" "}
                    <td>{groupedData[groupId][0]?.supplier_name || "-"}</td>{" "}
                    <td>{groupedData[groupId][0]?.item_price || 0}</td>{" "}
                    <td>{groupedData[groupId][0]?.request_qty || 0}</td>{" "}
                    <td>
                      {formatNumberToINR(
                        groupedData[groupId][0]?.request_amount
                      )}
                    </td>{" "}
                    <td>{formatNumberToINR(groupTotalAmount)}</td>{" "}
                    <td>
                      {getDateValue(groupedData[groupId][0]?.request_date)}
                    </td>{" "}
                    <td>
                      {groupedData[groupId]?.length > 1 ? (
                        <div
                          onClick={() => toggleCollapse(groupId)}
                          aria-controls={`collapse-${groupId}`}
                          aria-expanded={openRow[groupId] || false}
                          className={`cursor-pointer`}
                        >
                          {openRow[groupId] ? (
                            <BsChevronUp
                              fontSize={"large"}
                              className="text-danger"
                            />
                          ) : (
                            <BsChevronDown
                              fontSize={"large"}
                              className="text-green"
                            />
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                  {groupedData[groupId]?.length > 1 && (
                    <tr>
                      <td
                        className="bg-blue"
                        colSpan={12}
                        style={{ padding: !openRow[groupId] && 0 }}
                      >
                        <Collapse in={openRow[groupId]}>
                          <div id={`collapse-${groupId}`}>
                            <Table striped>
                              <thead>
                                <tr>
                                  <th>{t("Price")}</th>
                                  <th>{t("Request quantity")}</th>
                                  <th>{t("Total Amount")}</th>
                                  <th>{t("Request Date")}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {groupedData[groupId]
                                  ?.slice(1)
                                  ?.map((item, index) => (
                                    <tr key={index}>
                                      <td>{item.item_price || 0}</td>
                                      <td>{item.request_qty || 0}</td>
                                      <td>
                                        {formatNumberToINR(item.request_amount)}
                                      </td>
                                      <td>
                                        {getDateValue(item?.request_date)}
                                      </td>{" "}
                                    </tr>
                                  ))}
                              </tbody>
                            </Table>
                          </div>
                        </Collapse>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {data?.length > 0 ? (
              <tr>
                <td colSpan={15} className="text-end">
                  <strong>
                    Over All Amount{" "}
                    {formatNumberToINR(
                      data?.reduce(
                        (userTotal, item) =>
                          userTotal + +item.request_amount || 0,
                        0
                      )
                    )}
                  </strong>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={15}>
                  <BsExclamationCircleFill
                    fontSize={"large"}
                    className="mb-2 text-danger"
                  />
                  <p className="mb-0"> no data available </p>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
