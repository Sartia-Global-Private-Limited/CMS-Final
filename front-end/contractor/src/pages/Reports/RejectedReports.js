import React, { useState } from "react";
import ActionButton from "../../components/ActionButton";
import ReactPagination from "../../components/ReactPagination";
import { Col, Table } from "react-bootstrap";
import CardComponent from "../../components/CardComponent";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";

const RejectedReports = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [handleshow, setHandleShow] = useState("");
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title>Reports · CMS Electricals</title>
      </Helmet>
      <Col md={12} data-aos={"fade-up"}>
        <CardComponent
          title={"Rejected Reports"}
          search={true}
          //   searchOnChange={(e) => {
          //     setSearch(e.target.value);
          //   }}
        >
          <div className="table-scroll">
            <Table className="text-body bg-new Roles">
              <thead className="text-truncate">
                <tr>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Sr No.")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>1</td>
                  <td>
                    <ActionButton
                      hideEdit={"d-none"}
                      hideDelete={"d-none"}
                      editlink={`/reports/create/new`}
                    />
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={12}>
                    <ReactPagination
                      pageSize={pageSize}
                      prevClassName={
                        pageNo === 1
                          ? "danger-combo-disable pe-none"
                          : "red-combo"
                      }
                      nextClassName={
                        pageSize
                          ? "danger-combo-disable pe-none"
                          : "success-combo"
                      }
                      title={`Showing  of $`}
                      handlePageSizeChange={() => handleshow}
                      prevonClick={() => setPageNo}
                      nextonClick={() => setPageNo}
                    />
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </CardComponent>
      </Col>
    </>
  );
};

export default RejectedReports;
