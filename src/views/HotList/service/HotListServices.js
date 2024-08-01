import axios from 'axios'

const fetchInAppNotifications = async (id) => {

    var dataSet = [];

    await axios.get(`fetch_in_app_notification/${id}`).then(res => {
        if (res?.data?.status == 200) {
            dataSet = res?.data?.dataSet
        }
    })

    console.log(dataSet, "DataSet value is")

    return dataSet
}



const fetchInAppNotificationsCount = async (id) => {

    var dataSet = 0;

    await axios.get(`fetch_in_app_notification_count/${id}`).then(res => {
        if (res?.data?.status == 200) {
            dataSet = res?.data?.unReadCount
        }
    })

    console.log(dataSet, "DataSet value countttt is")

    return dataSet
}




const getHotListCardOrderDetails = async (id) => {
    var dataSet = [];

    await axios.get(`fetch_all_orders_userwise_by_id/${id}`).then(res => {
        if (res?.data?.status == 200) {
            dataSet = res?.data?.response
        }
    })

    return dataSet

}





const readInAppNotifications = async (id) => {

    console.log(`read_in_app_notifications_by_user/${id}`)
    await axios.get(`read_in_app_notifications_by_user/${id}`).then(res => {

    })
}


export { fetchInAppNotifications, readInAppNotifications, fetchInAppNotificationsCount, getHotListCardOrderDetails }