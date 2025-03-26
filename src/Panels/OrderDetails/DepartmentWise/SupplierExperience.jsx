


import React, { useContext, useState } from 'react'
import MaterialTable from 'material-table';
import { CButton, CCard, CCardBody, CCloseButton, CCol, COffcanvas, COffcanvasBody, COffcanvasHeader, COffcanvasTitle, CPopover, CRow, CSpinner } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilChatBubble, cilCloudDownload, cilExitToApp, cilInfo } from '@coreui/icons';
import Modal from 'react-bootstrap/Modal';
import rowStyle from '../Components/rowStyle';
import axios from 'axios';
import Swal from 'sweetalert2';
import ResendVoucher from './ResendVoucher';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore';
import { db } from 'src/firebase';
import { UserLoginContext } from 'src/Context/UserLoginContext';

export default function SupplierExperience(props) {
  const { userData } = useContext(UserLoginContext);
  const customPopoverStyle = {
    '--cui-popover-max-width': '400px',
    '--cui-popover-border-color': '#0F1A36',
    '--cui-popover-header-bg': '#0F1A36',
    '--cui-popover-header-color': 'var(--cui-white)',
    '--cui-popover-body-padding-x': '1rem',
    '--cui-popover-body-padding-y': '.5rem',
  }

  const productData = props.dataset
  const selectedProductId =productData?.[0]?.PID
  console.log("Supplier Experience", productData)


  // console.log(productData, "Product Data set is123")


  const QuantityContainer = ({ data }) => {


    // console.log(data, "Data Value is")


    if (data.category == "Education") {
      return (
        <CCol style={{ width: '320px' }}>
          <CRow>
            <CCol style={{ flex: 2 }}><h6>Max Adult Occupancy</h6></CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxAdultOccupancy}</h6></CCol>
          </CRow>
          <CRow>
            <CCol style={{ flex: 2 }}><h6>Max Child Occupancy</h6></CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxChildOccupancy}</h6></CCol>
          </CRow>
          <CRow>
            <CCol style={{ flex: 2 }}><h6>Total Occupancy</h6></CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.TotalOccupancy}</h6></CCol>
          </CRow>
        </CCol>
      )
    }

    else if (data.category == "Essentials/Non Essentials") {
      return (
        <CCol style={{ width: '320px' }}>
          <CRow>
            <CCol style={{ flex: 2 }}><h6>Quantity</h6></CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.Quantity}</h6></CCol>
          </CRow>


          <CRow>
            <CCol style={{ flex: 2 }}><h6>SKU</h6></CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.SKU} {data.Unit}</h6></CCol>
          </CRow>


        </CCol>
      )
    }

    else if (data.category == "Lifestyles") {
      return (
        <CCol style={{ width: '320px' }}>

          <CRow>
            <CCol style={{ flex: 2 }}><h6>Adult Count</h6></CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.AdultCount}</h6></CCol>
          </CRow>

          <CRow>
            <CCol style={{ flex: 2 }}><h6>Child Count</h6></CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.ChildCount}</h6></CCol>
          </CRow>


          {data.ChildCount > 0 ?
            <CRow>
              <CCol style={{ flex: 2 }}><h6>Child Ages</h6></CCol>
              <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.Age}</h6></CCol>
            </CRow>
            :
            null
          }



          <CRow>
            <CCol style={{ flex: 2 }}><h6>Total Occupancy</h6></CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.TotalOccupancy}</h6></CCol>
          </CRow>


          <CRow>
            <CCol style={{ flex: 2 }}><h6>Max Adult Occupancy</h6></CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxAdultOccupancy}</h6></CCol>
          </CRow>


          <CRow>
            <CCol style={{ flex: 2 }}><h6>Max Child Occupancy</h6></CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxChildOccupancy}</h6></CCol>
          </CRow>

        </CCol>
      )
    }

  }

  //


  const [supplierVoucherView, setSupplierVoucherView] = useState(false)

  const [supplierVoucherData, setSupplierVoucherData] = useState('')
  const [selectedSupplierVoucherData, setSelectedSupplierVoucherData] = useState([])


  const getSupplierVoucher = async (data) => {

    // console.log(data, "Voucher ID")

    setSupplierVoucherView(true)
    setSelectedSupplierVoucherData(data)

    await axios.get(`/supplier-voucher/${data.checkout_id}`).then((response) => {
      // console.log(response.data, "Handle PNL Report")
      const dataVal = response.data;
      setSupplierVoucherData(dataVal);

    }).catch(error => {
      console.log(error)
    })
  }


  const navigate = useNavigate();

  const createChatWithSupplier = async (data) => {

    const customerCollectionId = `AHS_SUP${data?.sid}_${data?.data?.checkoutID}CHAT`;

    const chatRef = collection(db, "customer-chat-lists");

    const q = query(chatRef, where("customer_collection_id", "==", customerCollectionId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingChat = querySnapshot.docs[0].data();  // Get the existing chat data
      const existingChatId = querySnapshot.docs[0].id;  // Get the existing chat document ID

      console.log("Chat already exists");

      // Navigate to the existing chat with its data
      navigate("../Chats", {
        state: { createdChatData: { ...existingChat, id: existingChatId } }
      });
      return;
    }

    const newChatData = {
      status: 'Pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      supplierAdded: 'true',
      notifyAdmin: 'true',
      notifySupplier: 'true',
      notifyCustomer: 'false',
      customer_collection_id: customerCollectionId,
      supplier_id: '',
      supplier_name: '',
      group_chat: '',
      customer_name: '',
      customer_mail_id: '',
      supplier_mail_id: data?.email,
      supplier_added_date: '',
      comments: '',
      chat_name: `${data?.company_name} Conversation OID (${data?.supplier_voucher})`,
      customer_id: '',
      chat_related: "Supplier Chat",
      chat_avatar: '',
      last_message: {
        name: "",
        value: "Start a Conversation"
      },
      customer_unreads: 0,
      supplier_unreads: 0,
      admin_unreads: 0
    };


    await addDoc(chatRef, newChatData);

    navigate("../Chats", {
      state: { createdChatData: { ...newChatData, id: docRef.id } }
    });
  };




  const columns = [
    { title: 'Product ID', field: 'pid' },
    { title: 'Supplier Voucher', field: 'supplier_voucher' },
    { title: 'Supplier ID', field: 'sid' },
    { title: 'Name', field: 'name' },
    { title: 'Supplier Confirmation', field: 'sup_confirm' },
    { title: 'Email', field: 'email' },
    { title: 'Company Name', field: 'company_name' },
    { title: 'Company Address', field: 'company_address' },
    { title: 'Contact', field: 'contact' },
    {
      field: 'chatsupplier', width: 5, title: 'Reach Supplier', align: 'left', render: (e) => {
        return (
          <>

          {(["reach supplier"].some(permission => userData?.permissions?.includes(permission))) &&
            <CButton color="success" style={{ fontSize: 14, color: 'white', }} onClick={() => createChatWithSupplier(e)}><CIcon icon={cilChatBubble} size="xl" /> Reach Supplier</CButton>
          }
          </>
        );
      }
    },

    {
      field: 'suppliervoucher', width: 5, title: 'Supplier Voucher', align: 'left', render: (e) => {
        return (
          <>


            <CButton color="info" style={{ fontSize: 14, color: 'white', }} onClick={() => getSupplierVoucher(e)}>View Voucher</CButton>

          </>
        );
      }
    },
  ]



  const data = productData?.map((value, index) => {
    const supplierID = value.supplier_id;


    var voucherID = ""
    // console.log(value, "Value is")

    if (supplierID) {
      if(value?.orderID === undefined){
        console.log("Order ID", props?.orderid)
        voucherID = `VO${props?.orderid}V${index + 1}`;

      }else{
        console.log("Value ID", value?.orderID)
        voucherID = `VO${value?.orderID}V${index + 1}`;
      }
    }
    else {
      voucherID = ""
    }


    return {
      pid: value?.['PID'],
      sid: value?.supplier_id,
      name: value?.['PName'],
      sup_confirm: value?.supplier_status,
      company_name: value?.company_name,
      company_address: value?.address,
      contact: value?.phone,
      checkout_id: value?.checkoutID,
      data: value,
      email: value?.email,
      supplier_voucher: voucherID  // Assign the generated voucher ID
    };
  });
  const [voucherSending, setVoucherSending] = useState(false)
  const [downloadVoucher, setDownloadVoucher] = useState(false)


  const resendVoucher = () => {

    // console.log("resend calling")


    setVisible(true)
    // setVoucherSending(true)
    // var email = `https://gateway.aahaas.com/api/sendOrderIndividualItemMailsVoucher/${selectedSupplierVoucherData?.checkout_id}/${props?.orderid}`
    // console.log(email, "Supplier Data")


    // fetch(`https://gateway.aahaas.com/api/sendOrderIndividualItemMailsVoucher/${selectedSupplierVoucherData?.checkout_id}/${props?.orderid}`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    // })
    //     .then(response => {
    //         if (response.ok) {
    //             return response.json();
    //         } else {
    //             throw new Error('Network response was not ok.');
    //         }
    //     })
    //     .then(data => {
    //         setVoucherSending(false)
    //         if (data.status === 200) {
    //             Swal.fire({
    //                 title: "Voucher Resent Successfully",
    //                 text: "Voucher Sent",
    //                 icon: "success"
    //             });
    //         }
    //     })
    //     .catch(error => {
    //         console.error('There was a problem with the fetch operation:', error);
    //     });



    // axios.post()
  }




  function decodeEmail(encoded) {
    var key = 0x82;
    var decoded = "";
    for (var i = 0; i < encoded.length; i += 2) {
      decoded += String.fromCharCode(parseInt(encoded.substr(i, 2), 16) ^ key);
    }
    return decoded;
  }


  async function fetchPDF() {
    try {
      // Constructing the URL for the PDF download
      const url = `${axios.defaults.baseURL}/supplier-voucher/${selectedSupplierVoucherData?.checkout_id}/pdf`;

      // Open the URL in a new tab/window
      window.location.href = url

    } catch (error) {
      console.error('Error fetching PDF:', error);
      throw error;
    }
  }



  const [visible, setVisible] = useState(false)

  return (
    <>
      <Modal show={supplierVoucherView} onHide={() => setSupplierVoucherView(false)} size="xl" style={{ zIndex: 1300 }}>
        <Modal.Header closeButton>
          <Modal.Title>Supplier Voucher</Modal.Title>
          {(["resend supplier voucher"].some(permission => userData?.permissions?.includes(permission))) &&
          <CButton disabled={selectedProductId === 'Flights'? true : false }  color="info" style={{ fontSize: 16, color: 'white', marginLeft: 20, alignContent: 'center' }} onClick={() => resendVoucher()}>
            Resend Voucher
            {voucherSending === false ?
              null
              :
              <CSpinner style={{ height: 18, width: 18, marginLeft: 10 }} />
            }
          </CButton>
          }
          <CButton color="info" style={{ fontSize: 16, color: 'white', marginLeft: 20, alignContent: 'center' }} onClick={() => fetchPDF()}>
            Download Voucher
          </CButton>

        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{ __html: supplierVoucherData }} />

          <COffcanvas backdrop="static" placement="end" visible={visible} onHide={() => setVisible(false)} style={{ zIndex: 500000 }}>
            <COffcanvasHeader>
              <COffcanvasTitle>Resend Voucher</COffcanvasTitle>
              <CCloseButton className="text-reset" onClick={() => setVisible(false)} />
            </COffcanvasHeader>

            <COffcanvasBody>
              <ResendVoucher voucherData={selectedSupplierVoucherData} orderID={props?.orderid}></ResendVoucher>
            </COffcanvasBody>
          </COffcanvas>


        </Modal.Body>
        <Modal.Footer>

        </Modal.Footer>
      </Modal>





      <MaterialTable
        title="Supplier Experience"
        columns={columns}
        data={data}
        options={{
          headerStyle: {
            fontSize: '14px', // Adjust the header font size here
          },
          cellStyle: {
            fontSize: '14px', // Adjust the column font size here
          },
          paging: false,
          search: false,
          columnsButton: true,
          exportButton: true,
          grouping: true,

          rowStyle: rowStyle
        }}


      />
    </>
  )
}
