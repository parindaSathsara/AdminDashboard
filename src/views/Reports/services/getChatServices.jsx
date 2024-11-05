import { db } from "src/firebase";
import { collection, onSnapshot, orderBy, query, where } from "firebase/firestore";

const getChatServices = async (dataSet) => {

    let startDate = dataSet.startDate;
    let endDate = dataSet.endDate;

    // Return a promise to handle async data fetching
    return new Promise((resolve, reject) => {
        try {
            const q = query(
                collection(db, "customer-chat-lists"),
                orderBy("createdAt", "desc"),
                where("createdAt", ">=", new Date(startDate)),
                where("createdAt", "<=", new Date(endDate))
            );

            const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
                const fetchedMessages = [];

                QuerySnapshot.forEach((doc) => {
                    fetchedMessages.push({ ...doc.data(), id: doc.id });
                });

                resolve(fetchedMessages); // Resolve the promise with fetchedMessages
            }, (error) => {
                reject(error); // Handle any errors in onSnapshot
            });

            // Return a cleanup function to stop listening when no longer needed
            return unsubscribe;

        } catch (error) {
            reject(error); // Reject the promise if an error occurs
        }
    });
    
};

export default getChatServices;