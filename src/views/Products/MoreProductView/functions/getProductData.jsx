import { Dataset } from '@mui/icons-material'
import axios from 'axios'

const getProductData = async (dataSet) => {

    var returnData = []

    // console.log("Request data is", dataSet)

    await axios.post('/fetch_more_product_data', dataSet).then((res) => {
        console.log(res)
        if (res.data.status === 200) {
            returnData = res.data
        }
       
    }).catch((err) => {
        throw new Error(err);
    })

    return returnData

}
const getBridgifyProductData =async (product_id) => {
    // const api = `https://api.bridgify.io/attractions/products/${product_id}`;
    const api = `https://dev-gateway.aahaas.com/api/bridgify/attractions/${product_id}/details`;

    try {
        const response = await axios.get(api, {
            headers: {
                Accept: 'application/json'
            },
            params: {
                user_id: 1
            }
        });
        console.log("vvvvv",response);
        

        if (response.status === 200) {
            return {
                success: true,
                status: 200,
                data: response.data
            };
        } else {
            return {
                success: false,
                status: response.status,
                error: response.data
            };
        }
    } catch (error) {
        return {
            success: false,
            status: 422,
            error: error.message
        };
    }
};
const getTboProductData = async (dataSet) => {

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



export { getProductData ,getBridgifyProductData, getTboProductData }