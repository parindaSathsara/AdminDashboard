import axios from "axios"
import Swal from "sweetalert2";


const getAllHelps = async () => {

    var dataSet = [];
    await axios.get("/helps/all").then(res => {
        if (res.data.status == 200) {
            dataSet = res.data.data
            console.log("All supports", res)
        }
    })

    return dataSet

}

export { getAllHelps }
