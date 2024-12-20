import axios from "axios"
import Swal from "sweetalert2";

const getOrderIDs = async () => {

  var dataSet = [];

  await axios.get("get_order_ids").then(response => {
    if (response.data.status === 200) {
      dataSet = response.data.orderIds
    }
  })


  return dataSet
}



const downloadOrderReceipt = async (id) => {


  try {
    // Constructing the URL for the PDF download
    const url = `${axios.defaults.baseURL}/customer-voucher-by-order/${id}/pdf`;

    window.location.href = url;

  } catch (error) {
    console.error('Error fetching PDF:', error);
    throw error;
  }


}


const downloadSupplierVoucherOneByOne = async (id, goid) => {
  try {
    // Constructing the URL for the PDF download
    const url = `${axios.defaults.baseURL}/supplier-voucher/${id}/pdf`;

    // Open the URL in a new tab/window
    window.location.href = url

  } catch (error) {
    console.error('Error fetching PDF:', error);
    throw error;
  }

}

const downloadAllSupplierVouchers = async (id, groupIds = []) => {

  groupIds.map(res => {

    // console.log(res, "Group ID data values are")
    downloadSupplierVoucherOneByOne(res, id)
  })
}



const resendOrderEmailToCustomer = (id) => {
  // console.log(id, "ID Value is");

  Swal.fire({
    title: 'Sending...',
    text: 'Resending the order email, please wait.',
    allowOutsideClick: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });

  axios.post(`${axios.defaults.baseURL}/customer-voucher-by-order/${id}/mail`)
    .then(res => {
      if (res.data.status === 200) {
        Swal.fire(
          'Email Sent!',
          'The order email has been resent successfully.',
          'success'
        );
      } else {
        Swal.fire(
          'Error!',
          'There was an issue resending the order email.',
          'error'
        );
      }
    })
    .catch(error => {
      Swal.fire(
        'Error!',
        'There was an issue resending the order email.',
        'error'
      );
    });
};

const confirmResendEmail = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you want to resend the order email?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, resend it!',
    cancelButtonText: 'No, cancel!'
  }).then((result) => {
    if (result.isConfirmed) {
      resendOrderEmailToCustomer(id);
    }
  });
};



const resendAllSupplierVouchers = (id, indexId, goid) => {

  let url;
  if (id == "All") {
    url = `https://gateway.aahaas.com/api/receipt-items/create/mail/${id}`;
  }
  else {
    url = `${axios.defaults.baseURL}/supplier-voucher/${indexId}/mail`;
  }

  Swal.fire({
    title: 'Sending...',
    text: 'Resending the order email, please wait.',
    allowOutsideClick: false,
    onBeforeOpen: () => {
      Swal.showLoading();
    }
  });

  axios.post(url)
    .then(res => {
      if (res.data.status === 200) {
        Swal.fire(
          'Email Sent!',
          'The order email has been resent successfully.',
          'success'
        );
      } else {
        Swal.fire(
          'Error!',
          'There was an issue resending the order email.',
          'error'
        );
      }
    })
    .catch(error => {
      Swal.fire(
        'Error!',
        'There was an issue resending the order email.',
        'error'
      );
    });
}




const fetchAllCustomerWithEmails = async () => {
  var customerEmails = [];

  await axios.get(`get_customer_with_emails/${id}`).then(response => {
    if (response.data.status == 200) {
      customerEmails = response.data.customers
    }
  })

  return customerEmails
}




const getOrderIndexIds = async (id) => {
  var orderIndexes = [];


  await axios.get(`get_order_index_ids_by_id/${id}`).then(response => {
    if (response.data.status == 200) {
      orderIndexes = response.data.orderIndexes
    }
  })


  return orderIndexes
}

const sendGenerateEmail = async (data) => {
  console.log(data, "Data values are")
  var returnVal = null
  try{
      await axios.post(`/aahaas-mail/send`, data,{
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      })
      .then(response => {
          returnVal=  [200,response.data.data ]
      })
     .catch(error =>{
      returnVal= [400,[] ]
     })
  }catch(error){
      returnVal =  [400,[] ]
  }    

  return returnVal
}

const getAllSuppliers = async () => {
  var dataSet = null
  try{
      await axios.get(`suppliers/all`)
      .then(response => {
        dataSet = response.data.data
      })
     .catch(error =>{
      dataSet = response.data
     })
  }catch(error){
  }    

  return dataSet
}

const getAllCustomer = async () => {
  var dataSet = null
  try{
      await axios.get(`customers/all`)
      .then(response => {
        dataSet = response.data.data
      })
     .catch(error =>{
      dataSet = response.data
     })
  }catch(error){
  }    

  return dataSet
}

const getAllInternalEmails = async () => {
  var dataSet = null
  console.log("Get All Internal Emails")
  try{
      await axios.get(`get-company-emails`)
      .then(response => {
        dataSet = response.data.data
        console.log(response, "Data Set Values are")
      })
     .catch(error =>{
      dataSet = response.data
     })
  }catch(error){
  }    

  return dataSet
}


export {getAllInternalEmails, getAllSuppliers, getAllCustomer,sendGenerateEmail, fetchAllCustomerWithEmails, getOrderIDs, resendOrderEmailToCustomer, confirmResendEmail, downloadOrderReceipt, getOrderIndexIds, resendAllSupplierVouchers, downloadAllSupplierVouchers, downloadSupplierVoucherOneByOne }
