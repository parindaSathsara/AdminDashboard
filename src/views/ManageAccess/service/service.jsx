import axios from "axios"
import Swal from "sweetalert2";


const getAllEmployees = async () => {

    var dataSet = [];
    await axios.get("users/all").then(res => {
        if (res.data.status == 200) {
            dataSet = res.data.data
            // console.log("All Employees", res)
        }
    })

    return dataSet

}

const getAllPositions = async () => {

    var dataSet = [];
    await axios.get("user-role/all").then(res => {
        if (res.data.status == 200) {
            dataSet = res.data.data
            // console.log("All Emplofvdvyees", dataSet)
        }
    })

    return dataSet

}

const assignPermissionToEmp = async (data) => {
   
    var returnVal = null
    try{
        await axios.post('/permissions/assign', data)
        .then(response => {
            returnVal=  [200,"Permission has been assigned successfully!" ]
        })
       .catch(error =>{
        returnVal= [400,"Fail! Permission Assigned" ]
       })
    }catch(error){
        returnVal =  [400,"Fail! Permission Assigned" ]
    }    

    return returnVal
}


const getPermissionByRole = async (role) => {
    var returnVal = null
    try{
        await axios.get(`/user-role/${role}/permissions`)
        .then(response => {
            returnVal=  [200,response.data.data ]
        })
       .catch(error =>{
        returnVal= [400,[] ]
       })
    }catch(error){
        returnVal =  [400,[] ]
    }    

    return returnVal
}


export { getAllEmployees,assignPermissionToEmp, getAllPositions, getPermissionByRole }
