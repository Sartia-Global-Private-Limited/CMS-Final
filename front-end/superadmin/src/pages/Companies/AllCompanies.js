import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import AllCompany from "./360Widgets/AllCompany";
import Shortcuts from "./360Widgets/Shortcuts";
import TotalClients from "./360Widgets/TotalClients";
import TotalVendor from "./360Widgets/TotalVendor";
import TotalMyCompany from "./360Widgets/TotalMyCompany";
import { getAllCompaniesForChart } from "../../services/authapi";
import LoaderUi from "../../components/LoaderUi";

const AllCompanies = ({ checkPermission }) => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChartsData = async () => {
    const res = await getAllCompaniesForChart();
    if (res.status) {
      setRows(res.data);
    } else {
      setRows([]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchChartsData();
  }, []);

  if (isLoading) {
    return <LoaderUi />;
  }

  return (
    <div className="mt-3">
      <Row className="g-3">
        <Col md={4}>
          <div className="shadow h-100 p-2">
            <TotalVendor rows={rows} />
          </div>
        </Col>
        <Col md={4}>
          <div className="shadow h-100 p-2">
            <TotalMyCompany rows={rows} />
          </div>
        </Col>
        <Col md={4}>
          <div className="shadow h-100 p-2">
            <TotalClients rows={rows} />
          </div>
        </Col>
        <Col md={8}>
          <div className="shadow h-100 p-2">
            <AllCompany rows={rows} checkPermission={checkPermission} />
          </div>
        </Col>
        <Col md={4}>
          <div className="shadow h-100 p-2">
            <Shortcuts rows={rows} checkPermission={checkPermission} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AllCompanies;
