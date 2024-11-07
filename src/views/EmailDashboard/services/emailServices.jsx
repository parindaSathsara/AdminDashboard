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
  if (id == "All") {

    axios.post(`https://gateway.aahaas.com/api/receipt-items/create/mail/${id}`).then(res => {

    })

  }
  else {
    axios.post(`https://gateway.aahaas.com/api/sendOrderIndividualItemMailsVoucher/${indexId}/${goid}/A`).then(res => {

    })
  }
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


export { fetchAllCustomerWithEmails, getOrderIDs, resendOrderEmailToCustomer, confirmResendEmail, downloadOrderReceipt, getOrderIndexIds, resendAllSupplierVouchers, downloadAllSupplierVouchers, downloadSupplierVoucherOneByOne }
