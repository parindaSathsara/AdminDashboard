import axios from 'axios'

const getProductData = async (dataSet) => {

    var returnData = []

    // console.log("Request data is", dataSet)

    await axios.post('/fetch_more_product_data', dataSet).then((res) => {
        // console.log(res)
        if (res.data.status === 200) {
            returnData = res.data
        }

    }).catch((err) => {
        throw new Error(err);
    })

    return returnData

}



export { getProductData }