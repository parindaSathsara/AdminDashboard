import axios from 'axios';
import { toast } from 'react-toastify';


async function sendPushNotificationsOnChats(notificationData, value) {
    try {


        console.log(notificationData, "Notification Dataaa aaaaaa")
        const response = await axios.post('sendPushNotificationsOnChat', {
            dataNotify: notificationData,
            message: value
        }).then(response => {
            toast.success('✅ Chat notification sent!');
        })

        console.log('Notification sent successfully:', response);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}


export default sendPushNotificationsOnChats