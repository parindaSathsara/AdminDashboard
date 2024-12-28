import axios from 'axios'

const fetchInAppNotifications = async (id) => {

    var dataSet = [];
    // console.log(`fetch_in_app_notification/${id}`, "Notification Data")
    await axios.get(`fetch_in_app_notification/${id}`).then(res => {
        
        if (res?.data?.status == 200) {
            dataSet = res?.data?.dataSet
            // console.log(res?.data?.dataSet, "Notification Data")
        }
    })

    // console.log(dataSet, "DataSet value is")

    return dataSet
}



const fetchInAppNotificationsCount = async (id) => {

    var dataSet = 0;

    await axios.get(`fetch_in_app_notification_count/${id}`).then(res => {
        if (res?.data?.status == 200) {
            dataSet = res?.data?.unReadCount
        }
    })

    // console.log(dataSet, "DataSet value countttt is")

    return dataSet
}




const getHotListCardOrderDetails = async (id) => {
    var dataSet = [];

    console.log(`fetch_all_orders_userwise_by_id/${id}`)

    await axios.get(`fetch_all_orders_userwise_by_id/${id}`).then(res => {
        
        console.log(res, "Order Details 12333333")
        if (res?.data?.status == 200) {
            dataSet = res?.data?.response
        }
    }).catch(res=>{
        console.log(res,"Response data isss")
    })

    return dataSet

}





const readInAppNotifications = async (id) => {

    console.log(`read_in_app_notifications_by_user/${id}`)
    await axios.get(`read_in_app_notifications_by_user/${id}`).then(res => {
        console.log(res, "Read Notification")
    })
}


export { fetchInAppNotifications, readInAppNotifications, fetchInAppNotificationsCount, getHotListCardOrderDetails }