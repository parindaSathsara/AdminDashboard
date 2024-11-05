import axios from "axios"

const getReports = async (dataSet) => {
    let dataArray = [];
    await axios.post("generate_custom_reports", dataSet).then(response => {
        if (response.data.status == 200) {
            dataArray = response.data.productData
        }
    }).catch((res) => {
        dataArray = []
    })
    return dataArray
}

export { getReports }