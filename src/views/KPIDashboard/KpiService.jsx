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
    console.log("All Orders", res);
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

export { getOrderWiseBookingDetails,getOrderIDs, getAllEmployees,getAllOrdersBooking, getUserWiseOrdersBooking, getOrderWiseOrdersBooking }
