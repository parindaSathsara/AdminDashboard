import Button from 'react-bootstrap/Button'; 
import Modal from 'react-bootstrap/Modal'; 
import { Row, Col, Badge } from 'react-bootstrap'; 
import axios from 'axios'; 
import Swal from 'sweetalert2' 
 
export default function ShowReqDetails(props) { 
    const {  
        id,  
        title,  
        reason,  
        user_type,  
        user_id,  
        status,  
        description,  
        user_name,  
        user_email,  
        created_at,  
        fetchSupportReq  
    } = props; 
 
    const statusLabel = status === "0" ? "Unseen" : "Seen"; 
    const statusVariant = status === "0" ? "warning" : "success"; 
 
    const handleRead = () => { 
        axios.put(`/markRead/${id}`) 
            .then((res) => { 
                Swal.fire({ 
                    title: "Success!", 
                    text: "You marked the request as seen!", 
                    icon: "success" 
                }); 
                props.onHide(); 
                fetchSupportReq(); 
            }) 
            .catch((err) => { 
                Swal.fire({ 
                    title: "Error!", 
                    text: "Something went wrong. Please try again later.", 
                    icon: "error" 
                }); 
                console.error("Error marking request as read:", err); 
            }); 
    }; 
 
    return ( 
        <Modal  
            {...props}  
            size="lg"  
            aria-labelledby="contained-modal-title-vcenter" 
            centered  
            backdrop="static"  
            keyboard={false} 
        > 
            <Modal.Header closeButton> 
                <Modal.Title id="contained-modal-title-vcenter"> 
                    {title || 'Request Details'} 
                </Modal.Title> 
            </Modal.Header> 
            <Modal.Body> 
                <Row className="mb-3"> 
                    <Col md={4}><strong>Title:</strong></Col> 
                    <Col md={8}>{title || 'Untitled Request'}</Col> 
                </Row> 
                <Row className="mb-3"> 
                    <Col md={4}><strong>Reason:</strong></Col> 
                    <Col md={8}>{reason || 'No description provided'}</Col> 
                </Row> 
                <Row className="mb-3"> 
                    <Col md={4}><strong>User Type:</strong></Col> 
                    <Col md={8}>{user_type || 'N/A'}</Col> 
                </Row> 
                <Row className="mb-3"> 
                    <Col md={4}><strong>User ID:</strong></Col> 
                    <Col md={8}>{user_id || 'N/A'}</Col> 
                </Row> 
                <Row className="mb-3"> 
                    <Col md={4}><strong>Status:</strong></Col> 
                    <Col md={8}> 
                        <Badge variant={statusVariant}>{statusLabel}</Badge> 
                    </Col> 
                </Row> 
                <Row className="mb-3"> 
                    <Col md={4}><strong>Description:</strong></Col> 
                    <Col md={8}>{description || 'No additional details provided'}</Col> 
                </Row> 
                <Row className="mb-3"> 
                    <Col md={4}><strong>Submitted by:</strong></Col> 
                    <Col md={8}>{user_name || 'Anonymous'}</Col> 
                </Row> 
                <Row className="mb-3"> 
                    <Col md={4}><strong>Email:</strong></Col> 
                    <Col md={8}>{user_email || 'N/A'}</Col> 
                </Row> 
                <Row className="mb-3"> 
                    <Col md={4}><strong>Created At:</strong></Col> 
                    <Col md={8}>{new Date(created_at).toLocaleString() || 'N/A'}</Col> 
                </Row> 
            </Modal.Body> 
            <Modal.Footer> 
                <div style={{display:'flex', gap: '10px'}}> 
                    <Button onClick={props.onHide}>Close</Button> 
                    <Button onClick={handleRead}>Mark Read</Button> 
                </div> 
            </Modal.Footer> 
        </Modal> 
    ); 
}