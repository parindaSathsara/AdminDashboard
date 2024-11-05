import axios from 'axios';

async function sendPushNotificationsOnChats(notificationData, value) {
    try {


        console.log(notificationData, "Notification Dataaa aaaaaa")
        const response = await axios.post('sendPushNotificationsOnChat', {
            dataNotify: notificationData,
            message: value
        }).then(response => {

        })

        console.log('Notification sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}


export default sendPushNotificationsOnChats