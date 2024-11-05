import axios from "axios";
import { addDoc, collection, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
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

export { fetchConversations, fetchMessages };