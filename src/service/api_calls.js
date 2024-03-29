
/* eslint-disable */

import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast';

const getAllDataUserWise = async () => {
    var dataArray = [];
    await axios
        .get('/fetch_all_orders_userwise/20')
        .then((res) => {
            console.log(res)

            if (res.data.status === 200) {
                dataArray = res.data.response

            }
        })
        .catch((err) => {
            throw new Error(err)
        })

    return dataArray;

}


const getAllRefundRequests = async () => {
    var dataArray = [];
    await axios
        .get('/get_all_refund_requests')
        .then((res) => {
            console.log(res)

            if (res.data.status === 200) {
                dataArray = res.data.response
            }
        })
        .catch((err) => {
            throw new Error(err)
        })

    return dataArray;

}


const getVendorDetails = async () => {
    var dataArray = [];
    await axios
        .get('/getAllVendors/5')
        .then((res) => {
            console.log(res)

            if (res.data.status === 200) {
                dataArray = res.data.response
            }
        })
        .catch((err) => {
            throw new Error(err)
        })

    return dataArray;

}

const getAllFeedbacks = async (id) => {
    var dataArray = [];
    var productData = [];
    await axios
        .get(`/get_all_feedbacks/${id}`)
        .then((res) => {
            console.log(res)

            if (res.data.status === 200) {
                dataArray = res.data.response
                productData = res.data.product
            }
        })
        .catch((err) => {
            throw new Error(err)
        })

    return [dataArray, productData];

}




const getAllCardData = async () => {
    var dataArray = [];

    await axios
        .get('/getCardData')
        .then((res) => {
            console.log(res)

            // if (res.data.status === 200) {
            dataArray = res.data

            // }
        })
        .catch((err) => {
            throw new Error(err)
        })

    return dataArray;
}


const getAllChartsDataSales = async () => {
    var dataArray = [];

    await axios
        .get('/getChartData')
        .then((res) => {
            console.log(res)

            // if (res.data.status === 200) {
            dataArray = res.data

            // }
        })
        .catch((err) => {
            throw new Error(err)
        })

    return dataArray;
}

async function getDashboardOrders() {
    try {

        var dataArray = [];

        await axios.get('/fetch_all_orders_userwise/20').then((res) => {

            console.log(res)

            if (res.data.status === 200) {
                dataArray = res.data.response
            }


        }).catch((err) => {
            throw new Error(err);
        })

        return {
            'dataset': dataArray
        }


    } catch (err) {
        throw new Error(err);
    }
}

async function getDashboardOrdersIdWise(id) {
    try {

        var dataArray = [];

        await axios.get(`/fetch_all_orders_userwise_id_wise/${id}`).then((res) => {

            console.log(res)

            if (res.data.status === 200) {
                dataArray = res.data
            }


        }).catch((err) => {
            throw new Error(err);
        })

        return dataArray


    } catch (err) {
        throw new Error(err);
    }
}



async function getAllProducts() {

    var productData = []
    try {
        await axios.get('get_all_products').then((res) => {
            if (res.data.status == 200) {
                productData = res.data.productList
            }
        })
    }
    catch (err) {
        throw new Error(err)
    }

    return productData;
}

///////////////////////////////

async function getPaymentStatusById(rowid, orderid, paymentmood, paymenttype) {
    try {

        const data = {
            'rowid': rowid,
            'orderid': orderid,
            'paymentmood': paymentmood,
            'paymenttype': paymenttype
        }

        console.log(data);
        var dataset = [];

        await axios.post('/fetch_order_wise_payment_details', data).then((res) => {
            console.log(res)
            if (res.data.status === 200) {
                dataset = res.data.response
            }

        }).catch((err) => {
            throw new Error(err);
        })

        return {
            'data': dataset
        }
    } catch (err) {
        throw new Error(err);
    }
}

async function updateDeliveryStatus(id, value, type) {

    try {

        console.log(id, value, type)

        const data = {
            rowid: id,
            status: value,
            type: type

        }

        console.log(data, "DataSet is Updated")

        await axios.post('/update_delivery_status_by_product', data).then((res) => {

            console.log(res)

            if (res.data.status === 200) {
                toast.success('Updated!')
            }

        }).catch((err) => {
            throw new Error(err);
        })
    } catch (error) {
        throw new Error(error);
    }

}

async function updateCartOrderStatus(id, status) {

    try {

        const data = {
            id: id,
            status: status
        }

        await axios.post('/update_cart_order_status', data).then((res) => {

            if (res.data.status === 200) {
                toast.success('Updated!')
            }

        }).catch((err) => {
            throw new Error(err);
        })

    } catch (error) {
        throw new Error(error);
    }
}

async function createNewOtherInfo(dataset) {
    try {

        toast('Please wait..Upload processing')

        await axios.post('/create_new_other_info', dataset, { xsrfHeaderName: 'X-CSRF-Token', withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
            console.log(res)
            if (res.status === 200) {
                toast.success('Upload Success')
            }
        }).catch((err) => {
            throw new Error(err)
        })

    } catch (error) {
        throw new Error(error)
    }
}

async function availableHotelProducts(id) {
    try {

        const dataset = {
            'hotel_id': id,
        }

        var data_array = [];

        await axios.post('/get_hotel_products_availability', dataset).then((res) => {

            if (res.data.status == 200) {
                data_array = res.data.data_set;
            }
            if (res.data.status == 404) {
                data_array = [];
            }

        }).catch((err) => {
            throw new Error(err);
        })

        return data_array;

    } catch (err) {
        throw new Error(err);
    }
}

async function getDataEmailPrev(id) {
    try {

        var data = [];

        await axios.get(`/fetch_hotel_detail_preview/${id}`).then((res) => {

            if (res.data.status == 200) {
                data = res.data.data_set;
            }

        }).catch((err) => {
            throw new Error(err);
        })

        return data;

    } catch (error) {
        throw new Error(error)
    }
}

async function sendHotelConfirmationEmail(dataset) {

    try {

        await axios.post('/send_hotel_confirmation_email', dataset).then((res) => {

            if (res.data.status == 200) {
                toast.success('Confirmation mail sent')
            } else {
                toast.error('Something went wrong')
            }

        }).catch((err) => {
            throw new Error(err);
        })

    } catch (err) {
        throw new Error(err);
    }

}

async function sendOrderConfirmationVoucher(dataset) {
    try {

        await axios.post('/send_customer_order_confirmation_voucher', dataset).then((res) => {
            if (res.data.status == 200) {
                toast.success('Confirmation mail sent')
            } else {
                toast.error('Something went wrong')
            }
        }).catch((err) => {
            throw new Error(err);
        })

    } catch (error) {
        throw new Error(error);
    }
}

async function getCustomerVoucherData(id) {
    try {

        var data_array = [];

        await axios.get(`/view_customer_order_voucher_data/${id}`).then((res) => {

            if (res.data.status === 200) {
                data_array = res.data.data_response
            }

        }).catch((err) => {
            throw new Error(err);
        })

        return data_array;

    } catch (err) {
        throw new Error(err);
    }
}

async function PaymentStatusChange(id, status, user) {

    try {

        const dataset = {
            'order_id': id,
            'payment_status': status,
            'user': user
        }

        await axios.post('/update_order_payment_status', dataset).then((res) => {

            if (res.data.status === 200) {
                toast.success('Payment status change success')
            } else {
                toast.error('Something went wrong')
            }

        }).catch((err) => {
            throw new Error(err);
        })

    } catch (err) {
        throw new Error(err)
    }

}

//fetch other info data by order id
async function getOtherInforDataByOrderId(id) {
    try {

        var dataset = []

        await axios.get(`/fetch_other_info_data/${id}`).then((res) => {
            console.log(res)
            if (res.data.status === 200) {
                dataset = res.data.data_response
            }

        }).catch((err) => {
            throw new Error(err);
        })

        return dataset;

    } catch (error) {
        throw new Error(error)
    }
}

//update additional information data by order id
async function updateAdditionalInfoDataByOrderId(dataset, id) {
    try {

        var status = '';

        await axios.post(`/update_additional_data_info/${id}`, dataset).then((res) => {

            if (res.data.status === 200) {
                status = 200
            } else {
                toast.error('Something went wrong')
            }

        }).catch((err) => {
            throw new Error(err);
        })

        return status;

    } catch (error) {
        throw new Error(error)
    }
}

export {
    getAllRefundRequests, getAllFeedbacks, getVendorDetails, getAllProducts,
    getAllChartsDataSales, getAllCardData, getDashboardOrders, getPaymentStatusById, updateDeliveryStatus, updateCartOrderStatus, getDashboardOrdersIdWise, createNewOtherInfo, getAllDataUserWise,
    availableHotelProducts, getDataEmailPrev, sendHotelConfirmationEmail, sendOrderConfirmationVoucher, getCustomerVoucherData, PaymentStatusChange, getOtherInforDataByOrderId, updateAdditionalInfoDataByOrderId
}
