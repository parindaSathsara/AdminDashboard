// // ModalCard.js
// import React from 'react';
// import { Modal, Button } from 'react-bootstrap';

// const ModalCard = ({ show, handleClose, order }) => {
//   return (
//     <Modal show={show} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>Order Details</Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <p><strong>Order Summary:</strong> {order.orderSummary}</p>
//         <p><strong>Order Name:</strong> {order.orderName}</p>
//         <p><strong>Order Date:</strong> {order.orderDate}</p>
//         {/* Add more details as needed */}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="success" onClick={() => handleClose('accept')}>
//           Accept
//         </Button>
//         <Button variant="danger" onClick={() => handleClose('decline')}>
//           Decline
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default ModalCard;
