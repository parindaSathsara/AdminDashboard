import axios from "axios"
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, query, serverTimestamp, where } from "firebase/firestore"
import { db } from "src/firebase"
import Swal from "sweetalert2"

const getAllProductsOrders = async (val) => {
    var dataset = []
    await axios.get("fetch_all_orders_product_wise_allcation").then(res => {
        if (res.data.status == 200) {
            dataset = res.data.productData
        }
    }).catch(response => {

    })

    return dataset;
}


const getAvailableEmployees = async () => {

    var dataSet = [];
    await axios.get("admin/getAvailables").then(res => {
        if (res.data.status == 200) {
            dataSet = res.data.dataSet
        }
    })

    // console.log(dataSet, "Data set is employee available")

    return dataSet
}


const handleEmployeeDeleteFromOrder = async (val) => {
    await axios.post(`orderallocations_remove/${val}`).then(response => {
        // console.log(response, "response value")
    })
}


const getAllProductsOrdersByEmployee = async (val) => {
    try {
        // console.log("User ID val is", val);
        const response = await axios.get(`fetch_all_orders_product_wise_allcation_by_id/${val}`);
        if (response.data.status === 200) {
            return response.data.productData;
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}




const assignEmployeesToOrders = async (checkout_id, employeeId) => {
    const employeeData = {
        checkout_id: checkout_id,
        employee_id: employeeId?.value
    };

    const employeeDataFirebase = {
        checkout_id: checkout_id,
        employee_id: employeeId?.value,
        createdAt: serverTimestamp(),
        readAt: null,
    };



    try {
        const response = await axios.post("orderallocations_new", employeeData);
        if (response.data.status === 200) {
            await addDoc(collection(db, 'order_employee_allocations'), employeeDataFirebase);
            return [200, response.data.message];
        } else {
            return [400, response.data.message];
        }
    } catch (error) {

        console.error("Error occurred while allocating order:", error);
        return [400, "Error occurred while allocating order"];
    }
};


const handleDeleteData = async (checkout_id, employee_id) => {
    try {


        // console.log("Delete Data Function print", checkout_id, employee_id)
        // Query the collection to find the document
        const q = query(
            collection(db, "order_employee_allocations"),
            where("checkout_id", "==", checkout_id),
            where("employee_id", "==", employee_id)
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach(async (docSnapshot) => {
                // Delete the document
                await deleteDoc(doc(db, "order_employee_allocations", docSnapshot.id));
                // console.log("Document deleted successfully");
            });
        } else {
            // console.log("No document matches the criteria");
        }
    } catch (error) {
        console.error("Error deleting document: ", error);
    }
};



const monitorEmployeeOrders = async (employeeId) => {
    const q = query(collection(db, 'order_employee_allocations'), where('employee_id', '==', employeeId));

    return onSnapshot(q, (querySnapshot) => {
        const orders = [];

        return querySnapshot;
    }, (error) => {
        console.error('Error monitoring employee orders:', error);
    });
};





export {
    getAllProductsOrders, getAvailableEmployees, assignEmployeesToOrders, handleEmployeeDeleteFromOrder, getAllProductsOrdersByEmployee, monitorEmployeeOrders, handleDeleteData
}