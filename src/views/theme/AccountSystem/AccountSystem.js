import React, { useState } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
} from '@coreui/react';
import HomeIcon from '@mui/icons-material/Home';
import './AccountSystem.css'; // Import a CSS file for styling

const AccountSystem = () => {
  const data = [
    { id: 1, orderSummary: 'Summary 1', orderName: 'Sprite', orderDate: '2024-01-10', status: 'Pending' },
    { id: 2, orderSummary: 'Summary 2', orderName: 'COCONUT HUSK ELEPHANT', orderDate: '2024-01-11', status: 'Completed' },
    { id: 3, orderSummary: 'Summary 3', orderName: 'Revello Milk', orderDate: '2024-03-11', status: 'refund' },
    { id: 4, orderSummary: 'Summary 4', orderName: 'Laxapana  ', orderDate: '2024-05-11', status: 'Completed' },
    { id: 5, orderSummary: 'Summary 5', orderName: 'MilkRice  ', orderDate: '2024-05-11', status: 'cancellation' },
    
    // Add more rows as needed
  ];

  const fields = ['id', 'orderSummary', 'orderName', 'orderDate', 'status'];

  const [activeAccordion, setActiveAccordion] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const handleAccept = (id) => {
    // Implement logic for accepting the order with the given id
    console.log(`Order ${id} accepted`);
  };

  const handleDecline = (id) => {
    // Implement logic for declining the order with the given id
    console.log(`Order ${id} declined`);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
  };

  const handleResetFilter = () => {
    setStatusFilter(null);
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // const filteredData = statusFilter ? data.filter(item => item.status.toLowerCase() === statusFilter) : data;

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // const filteredData = data.filter(item => {
  //   const orderNameLowerCase = item.orderName.toLowerCase();
  //   const searchTermLowerCase = searchTerm.toLowerCase();
  //   return orderNameLowerCase.includes(searchTermLowerCase);
  // });

  const filteredData = data.filter((item) => {
    const orderNameLowerCase = item.orderName.toLowerCase();
    const searchTermLowerCase = searchTerm.toLowerCase();
    const statusLowerCase = statusFilter ? statusFilter.toLowerCase() : null;

    return (
      orderNameLowerCase.includes(searchTermLowerCase) &&
      (!statusLowerCase || item.status.toLowerCase() === statusLowerCase)
    );
  });

  return (
    <div>
      <div className='d-flex '>
        <div className=' mb-4 col-6'>
          <button className='btn btn-primary ' onClick={() => handleResetFilter()}>
            <HomeIcon></HomeIcon>
          </button>
          <button className='btn btn-success ms-4 ' onClick={() => handleStatusFilter('completed')}>
            Completed
          </button>
          <button className='btn btn-warning ms-4' onClick={() => handleStatusFilter('pending')}>
            Pending
          </button>
          <button className='btn btn-danger ms-4' onClick={() => handleStatusFilter('refund')}>
            Refund
          </button>
          <button className='btn btn-info ms-4' onClick={() => handleStatusFilter('cancellation')}>
            cancellation
          </button>
         



        </div>
        <div className='search_bar ms-auto'>
          <input type='text'
            placeholder='Search by order name'
            value={searchTerm}
            onChange={handleSearch}

          />
          <div className='search'></div>
        </div>
      </div>

      <CCard>
        <CCardHeader>Order Details</CCardHeader>
        <CCardBody>
          <table className="custom-table">
            <thead>
              <tr>
                {fields.map((field, index) => (
                  <th key={index}>{field}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <tr onClick={() => toggleAccordion(rowIndex)} className={activeAccordion === rowIndex ? 'active' : ''}>
                    {fields.map((field, colIndex) => (
                      <td key={colIndex}>{item[field]}</td>
                    ))}
                    <td>
                      <CButton color="success" onClick={() => handleAccept(item.id)}>
                        Accept
                      </CButton>
                      {' '}
                      <CButton color="danger" onClick={() => handleDecline(item.id)}>
                        Decline
                      </CButton>
                    </td>
                  </tr>
                  <tr>

                    <td colSpan={6}>



                      {activeAccordion === rowIndex && (
                        <div className='row'>
                          {/* <tr>
                      <CTableHeaderCell>Customer Details </CTableHeaderCell>
                      <CTableHeaderCell>name </CTableHeaderCell>
                      <CTableHeaderCell>email</CTableHeaderCell>
                      <CTableHeaderCell>number</CTableHeaderCell>
                      <CTableHeaderCell>adress</CTableHeaderCell>
                      <CTableHeaderCell>delivery address</CTableHeaderCell>
                    </tr>
                    <tr>
                      <CTableHeaderCell>Details </CTableHeaderCell>
                      <CTableHeaderCell>ordered date </CTableHeaderCell>
                      <CTableHeaderCell>delivery date</CTableHeaderCell>
                      <CTableHeaderCell>refund date</CTableHeaderCell>
                      <CTableHeaderCell>payemnt method</CTableHeaderCell>
                      <CTableHeaderCell>cancellation date</CTableHeaderCell>
                      <CTableHeaderCell>cancellation date</CTableHeaderCell>
                    </tr> */}
                          <div class=" col-3">

                            <div class="card-body">
                              <h5 class="card-title">Order details</h5>
                              <tr>
                                <td>product name</td>
                                <td>RedMI headphone</td>
                              </tr>
                              <tr>
                                <td>Order ID</td>
                                <td>#123456</td>
                              </tr>

                              <tr>
                                <td>ordered date</td>
                                <td>01/01/2024</td>
                              </tr><tr>
                                <td>delivery date</td>
                                <td>08/01/2024 </td>
                              </tr>


                              {/* <tr>
  <td>customer number</td>
  <td>1234567890</td>
</tr><tr>
  <td>customer adress</td>
  <td>10 one galle face colombo</td>
</tr><tr>
  <td>delivery adress</td>
  <td>10 singapure </td>
</tr>
<tr>
  <td>customer email</td>
  <td>vishnukumar@gmail.com</td>
</tr> */}
                            </div>
                          </div>
                          <div class=" col-3">

                            <div class="card-body">
                              <h5 class="card-title">Customer details</h5>
                              <tr>
                                <td>customer name</td>
                                <td>vishnu kumar</td>
                              </tr>
                              <tr>
                                <td>customer number</td>
                                <td>1234567890</td>
                              </tr><tr>
                                <td>customer adress</td>
                                <td>chinna chokikulam madurai</td>
                              </tr><tr>
                                <td>delivery adress</td>
                                <td>mattuthavani depo </td>
                              </tr>
                              <tr>
                                <td>customer email</td>
                                <td>vishnukumar@gmail.com</td>
                              </tr>
                            </div>
                          </div>

                          <div class=" col-6">
                            <div class="card-body">
                              <h5 class="card-title">Product Details</h5>
                              <tr>
                                <td>product name</td>
                                <td>RedMI headphone</td>
                              </tr>
                              <tr>
                                <td>product category</td>
                                <td>non Essential</td>
                              </tr>

                              <tr>
                                <td>cancellation details</td>
                                <td>5 days before</td>
                              </tr>
                              <tr>
                                <td>vendor / sellar name</td>
                                <td>RedMI headphone</td>
                              </tr>
                              <tr>
                                <td>payemnt method</td>
                                <td>card / cash / custom</td>
                              </tr>
                              <tr>
                                <td>balance amount</td>
                                <td>rs : 1200</td>
                              </tr>
                              <tr>
                                <td>product amount</td>
                                <td>rs : 2000</td>
                              </tr>
                              <tr>
                                <td >payment status</td>
                                <td value="paymentStatus" onChange={(e) => setPaymentStatus(e.target.value)}>
                                  <select>
                                    <option value={""}>------</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">pending</option>
                                    <option value="cancel">cancel</option>
                                     <option value="refund">Refund</option>
                                  </select>
                                </td>
                              </tr>
                              {paymentStatus === 'pending' &&
                                <>
                                  <tr >
                                    <td>pending reason</td>
                                    <td>
                                      < select >
                                        <option value="">payment not received / checking with bank</option>
                                        <option value="">checking with vendor</option>
                                        <option value="">checking with customer</option>
                                      </select>
                                    </td>
                                  </tr>
                                </>
                              }
                               
                           {paymentStatus === "cancel" && 
                             <> 
                             <tr>
                                <td>cancellation reason</td>
                                <td>
                                  <select >
                                    <option value="">payment not received</option>
                                    <option value="">vendor cancelled the product</option>
                                    <option value="">customer cancelled the product</option>
                                  </select>
                                </td>
                              </tr>
                              </>
}
{paymentStatus === 'refund' &&
                                <>
                                  <tr >
                                    <td>Refund reason</td>
                                    <td>
                                      < select >
                                        <option value="">Customer is not available</option>
                                        <option value="">Product is not available in vendor side</option>
                                        <option value="">Customer is not statisfied ordered the product</option>
                                      </select>
                                    </td>
                                  </tr>
                                </>
                              }
                            </div>
                          </div>

                        </div>

                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </CCardBody>
      </CCard>
    </div>

  );
};

export default AccountSystem;
