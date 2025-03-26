import axios from "axios"
import Swal from "sweetalert2";


const getOrderWiseBookingDetails = async () => {

    // var dataSet = [];
    // await axios.get("/helps/all").then(res => {
    //     if (res.data.status == 200) {
    //         dataSet = res.data.data
    //         console.log("All supports", res)
    //     }
    // })
    // return dataSet
    return null;
}

const getAllOrdersBooking = async (data) => {
  var dataSet = [];
  if (data.length === 2) {
    const [startDate, endDate] = data;
    data = {
      start_date: startDate,
      end_date: endDate
    };
  }
  console.log("All Orders date",data)
  await axios.get("kpi/get-order-turnaround-time", {params: data}).then(res => {
    console.log("All Orders", res);
    if (res.status === 200) {
      dataSet = res.data.data;
      console.log("All Orders date", res.data.data);
      return dataSet;
    }
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.res.data.message,
    });
  });
  return dataSet;
}

const getUserWiseOrdersBooking = async (data,userId) => {
  var dataSet = [];
  if (data.length === 2) {
    const [startDate, endDate] = data;
    data = {
      start_date: startDate,
      end_date: endDate
    };
  }
  console.log("All Orders date user",data, userId)
  await axios.get(`kpi/get-order-turnaround-time/${userId}/user`, {params: data}).then(res => {
    console.log("All Orders users", res);
    if (res.status === 200) {
      dataSet = res.data.data;
      console.log("All Orders date user", res.data.data);
      return dataSet;
    }
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.res.data.message,
    });
  });
  return dataSet;
}

const getOrderWiseOrdersBooking = async (oId) => {
  var dataSet = [];
  
  console.log("Alll Orders date order", oId)
  await axios.get(`kpi/get-order-turnaround-time/${oId}/order`).then(res => {
    console.log("Allll Orders", res);
    if (res.status === 200) {
      dataSet = res.data.data;
      console.log("Allll Orders date order", res.data.data);
      return dataSet;
    }
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.res.data.message,
    });
  });
  return dataSet;
}

const getOrderIDs = async () => {

    var dataSet = [];
  
    await axios.get("get_order_ids").then(response => {
      if (response.data.status === 200) {
        dataSet = response.data.orderIds
      }
    })
  
  
    return dataSet
  }

  const getAllEmployees = async () => {

    var dataSet = [];
    await axios.get("users/all").then(res => {
        if (res.data.status == 200) {
            dataSet = res.data.data
            // console.log("All Employees", res)
        }
    })

    return dataSet

}

const getAllProducts = async (data,categoryId,country) => {
  var dataSet = [];
  if (data.length === 2) {
    const [startDate, endDate] = data;
    data = {
      start_date: startDate,
      end_date: endDate,
      category_id: categoryId,
      country: country
    };
  }
  console.log("All products",data)
  await axios.get(`kpi/supplier/get-products`, {params: data}).then(res => {
    console.log("All products", res.data);
    if (res.status === 200) {
      dataSet = res.data;
      return dataSet;
    }
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.res.data.message,
    });
  });
  return dataSet;
}

const getAllCountry = async () => {

  var dataSet = [];

  await axios.get("countries/all").then(response => {
    if (response.status === 200) {
      console.log("All countries", response)
      dataSet = response.data.data
    }
  })


  return dataSet
}


const getSupplierByCountryWise= async (data) => {
  var dataSet = [];
  if (data) {
    data = {
      country: data
    };
  }
  
  await axios.get(`kpi/supplier/get-supplier`, {params: data}).then(res => {
    if (res.status === 200) {
      dataSet = res.data.data;
      return dataSet;
    }
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.res.data.message,
    });
  });
  return dataSet;
}


const getAllAccountDetails = async (data) => {
  var dataSet = [];
  if (data.length === 2) {
    const [startDate, endDate] = data;
    data = {
      start_date: startDate,
      end_date: endDate
    };
  }
  console.log("All Accounts",data)
  await axios.get("kpi/accounts/get-payment-data", {params: data}).then(res => {
    console.log("All Accounts", res);
    if (res.status === 200) {
      dataSet = res.data.data;
      console.log("All Accounts", res.data.data);
      return dataSet;
    }
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.res.data.message,
    });
  });
  return dataSet;
}

const getOrderWiseFeedbacks = async (oId) => {
  var dataSet = [];
  
  
  await axios.get(`kpi/traveller/get-feedback-data/${oId}`).then(res => {
    if (res.status === 200) {
      dataSet = res.data.data;
      console.log("Alll Orders feedback", dataSet)
      return dataSet;
    }
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.res.data.message,
    });
  });
  return dataSet;
}

const getGlobalTargetDetails = async (data) => {
  var dataSet = [];
  if (data) {
    data = {
      currency: data
    };
  }
  console.log("All global target",data)
  await axios.get("kpi/global/get-order-data", {params: data}).then(res => {
    console.log("All global target", res);
    if (res.status === 200) {
      dataSet = res.data.data;
      console.log("All global target", res.data.data);
      return dataSet;
    }
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.res.data.message,
    });
  });
  return dataSet;
}

const getAllTravelerDetails = async (data,oId) => {
  var dataSet = [];
  if (data.length === 2) {
    const [startDate, endDate] = data;
    data = {
      start_date: startDate,
      end_date: endDate,
      order: oId,
    };
  }
  console.log("All traveler data",data)
  await axios.get(`kpi/traveller/get-times`, {params: data}).then(res => {
    console.log("All traveler data", res.data);
    if (res.status === 200) {
      dataSet = res.data;
      return dataSet;
    }
  }).catch(error => {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error.res.data.message,
    });
  });
  return dataSet;
}

export { getOrderWiseBookingDetails,getOrderIDs, getAllEmployees,getAllOrdersBooking, getUserWiseOrdersBooking, getOrderWiseOrdersBooking, getAllProducts, getAllCountry, getSupplierByCountryWise, getAllAccountDetails, getOrderWiseFeedbacks, getGlobalTargetDetails, getAllTravelerDetails }
