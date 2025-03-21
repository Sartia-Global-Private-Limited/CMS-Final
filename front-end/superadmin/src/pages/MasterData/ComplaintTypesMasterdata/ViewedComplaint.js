import React from "react";
import { Col, Table } from "react-bootstrap";

const ViewedComplaint = ({ data }) => {
  return (
    <Col md={12} data-aos={"fade-up"}>
      <div className="overflow-auto p-2">
        <Table className="text-body bg-new Roles">
          <thead className="text-truncate">
            <tr>
              {[
                "Sr No.",
                "Energy Company Name",
                "Complaint Type",
                "Date",
                "Status",
              ].map((thead) => (
                <th key={thead}>{thead}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? null : (
              <tr>
                <td colSpan={7}>
                  <img
                    className="p-3"
                    alt="no-result"
                    width="250"
                    src={`${process.env.REACT_APP_API_URL}/assets/images/no-results.png`}
                  />
                </td>
              </tr>
            )}
            {data.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.ec_name}</td>
                <td>{complaint.complaint_type_name}</td>
                <td>{complaint.complaint_create_date}</td>
                {/* <td className={
                                    complaint.status === 1 ? 'text-warning' :
                                        complaint.status === 2 ? 'text-green' :
                                            complaint.status === 3 ? 'text-green' :
                                                complaint.status === 4 ? 'text-danger' :
                                                    complaint.status === 5 ? 'text-green' : null
                                }
                                >
                                    {complaint.status === 1 ? 'Pending' :
                                        complaint.status === 2 ? 'Viewed' :
                                            complaint.status === 3 ? 'Approved' :
                                                complaint.status === 4 ? 'Rejected' :
                                                    complaint.status === 5 ? 'Resolved' : null
                                    }
                                </td> */}
                <td className="text-green fw-bold">Viewed</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </Col>
  );
};

export default ViewedComplaint;
