import axios from "axios";
import { addDoc, collection, getDocs,getDoc,doc, updateDoc, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from 'src/firebase';

const fetchConversations = async () => {
    const baseURL = "https://gateway.aahaas.com/api";

    try {
        const response = await axios.get(baseURL + '/getchats');

        if (response.status === 200) {
            const conversations = response.data.data;

            conversations.sort((a, b) => {
                const dateA = new Date(a.updated_at);
                const dateB = new Date(b.updated_at);
                return dateB - dateA;
            });

            return conversations;
        } else {
            console.error(`Error: Received status code ${response.status}`);
            return [];
        }
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return [];
    }
}

const fetchMessages = (id) => {
    const q = query(collection(db, "chats/chats_dats/" + id), orderBy("createdAt", "asc"), limit(50))
    onSnapshot(q, (querySnapshot) => {
        const fetchedMessages = [];
        querySnapshot.forEach(doc => {
            fetchedMessages.push({ ...doc.data(), id: doc.id });
        });

        // console.log(fetchedMessages, "Fetched messages")
        return fetchedMessages
    })
}

const getAllEmployees = async () => {

    var dataSet = [];
    await axios.get("users/all").then(res => {
        if (res.data.status == 200) {
            dataSet = res.data.data
            console.log("All Employees", res)
        }
    })

    return dataSet

}

const assignEmployeeToChat = async (chat_id, employeeId) => {
   

    try {
        const employeeData = {
            chat_id: chat_id,
            employee_id: employeeId?.value
        };
    
        const employeeDataFirebase = {
            chat_id: chat_id,
            employee_id: employeeId?.value,
            createdAt: serverTimestamp(),
            readAt: null,
        };
    
        // if (!employeeDataFirebase.chat_id || !employeeDataFirebase.employee_id) {
        //     console.log("Valid data");
    
        //     return [400, "Invalid data"];
        // }
        if (employeeDataFirebase.chat_id && employeeDataFirebase.employee_id) {
            await addDoc(collection(db, 'chat-allocation'), employeeDataFirebase);
            console.log("Employee assigned to chat successfully");
            return [200, 'Employee assigned to chat successfully'];
        } else {
            return [400, 'Error occurred while assigning employee to chat'];
        }
    } catch (error) {

        // console.error("Error occurred while allocating order:", error);
        return [400, "Error occurred while allocating order"];
    }
};

const checkUpdateDoc = async (db, data, newStatus) => {
    const docRef = doc(db, 'customer-chat-lists', data.id)
    
    await updateDoc(docRef, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    })
    
    const updatedDoc = await getDoc(docRef)
    return updatedDoc.exists() ? updatedDoc.data() : null
  }
  

export { fetchConversations, fetchMessages,getAllEmployees, assignEmployeeToChat, checkUpdateDoc };