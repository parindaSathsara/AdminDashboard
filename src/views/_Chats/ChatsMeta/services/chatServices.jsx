import axios from "axios";
import { addDoc,doc, collection, getDocs,getDoc,updateDoc, limit, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useState } from "react";

import { db } from 'src/firebase';
import Swal from 'sweetalert2'

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
        console.log("Messages", querySnapshot);
        
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

// Reusable Firebase operations
export const firebaseOperations = {
    async updateDocument(collection, docId, data) {
      const docRef = doc(db, collection, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      return docRef;
    },
  
    async addDocument(collectionName, data) {
      return await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });
    },
  
    async fetchDocument(docRef) {
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        throw new Error('Document not found');
      }
      return docSnap.data();
    }
  };
  
  // Reusable Swal dialogs
  export const dialogUtils = {
    async showConfirmation({ title, text, confirmButtonText = 'Yes' }) {
      const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText,
        cancelButtonText: 'No',
      });
      return result.isConfirmed;
    },
  
    async showError(text) {
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text,
      });
    },
  
    async showSuccess(text) {
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text,
        showConfirmButton: true,
        timer: 1500,
      });
    }
  };
  
  // Generic handler function
  export const handleOperation = async ({
    operation,
    validationFn,
    successMessage,
    errorMessage,
    onSuccess,
    onError
  }) => {
    try {
      // Validate data if validation function is provided
      if (validationFn) {
        const isValid = await validationFn();
        if (!isValid) {
          throw new Error('Validation failed');
        }
      }
  
      // Perform the operation
      const result = await operation();
      
      // Handle success
      if (result[0] === 200) {
        await dialogUtils.showSuccess(successMessage || result[1]);
        if (onSuccess) await onSuccess(result);
        return [200, result[1]];
      } else {
        throw new Error(result[1]);
      }
    } catch (error) {
      console.error('Operation failed:', error);
      await dialogUtils.showError(errorMessage || error.message);
      if (onError) await onError(error);
      return [400, error.message];
    }
  };

export { fetchConversations, fetchMessages,getAllEmployees, assignEmployeeToChat };