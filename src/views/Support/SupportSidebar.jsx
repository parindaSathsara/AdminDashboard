import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Offcanvas, Spinner, Card, Badge, Button } from 'react-bootstrap';
import ShowReqDetails from './ShowReqDetails';

const SupportSidebar = ({ show, onHide, getHelpCount }) => {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [selectedReq, setselectedReq] = useState(false);

  useEffect(() => {
    fetchSupportReq();
  }, [show]);

  //   useEffect(() => {
  //     // Logs whenever supportRequests change
  //     console.log("supportRequests updated", supportRequests);
  //   }, [supportRequests]);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const fetchSupportReq = () => {
    setLoading(true);
    axios.get("/help")
      .then((res) => {
        setSupportRequests(res.data);
        console.log(res.data);
        getHelpCount();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error fetching data!"
        });
        console.error(err);
      });
  };

  const handleReqClick = (req) => {
    setselectedReq(req);
    setModalShow(true);
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Support Requests</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : supportRequests.length === 0 ? (
          <div className="text-center p-3">
            <p className="mb-0">No support requests available</p>
          </div>
        ) : (
          supportRequests.map((request, index) => (
            <Card key={request.id || index} className="mb-3 shadow-sm"
              style={{
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
              }}>
              <Card.Body style={{ position: 'relative' }} onClick={() => handleReqClick(request)}>
                <div className="d-flex justify-content-between align-items-start">
                  <Card.Title
                    className="h5 mb-2"
                    style={{
                      whiteSpace: 'normal', // allow text to wrap
                      wordBreak: 'break-word', // break long words if needed
                      overflow: 'visible', // prevent hiding overflowing text
                    }}
                  >
                    {request.title || 'Untitled Request'}
                  </Card.Title>

                </div>
                <Card.Text className="text-muted mb-2 small">
                  {formatDate(request.created_at)}
                </Card.Text>
                <Card.Text className="mb-2">
                  {request.reason || 'No description provided'}
                </Card.Text>
                {request.user_name && (
                  <Card.Text className="text-muted small mb-0">
                    Submitted by: {request.user_name}
                  </Card.Text>
                )}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    right: '0',
                    transform: 'translateY(-50%)',
                  }}
                >
                  {/* <Button onClick={()=>handleReqClick(request)}>View</Button> */}
                </div>
              </Card.Body>
            </Card>

          ))
        )}
        <ShowReqDetails
          show={modalShow}
          onHide={() => setModalShow(false)}
          {...selectedReq}        // Spread the properties of selectedReq (e.g., title, reason, etc.)
          fetchSupportReq={fetchSupportReq}  // Pass fetchSupportReq as a separate prop
        />

      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default SupportSidebar;
