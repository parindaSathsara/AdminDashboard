import axios from 'axios'

const getLifestylesDataSet = async (dataSet) => {

    var returnData = []
    await axios.post('/fetch_more_order_data/3', dataSet).then((res) => {
        // console.log(res)
        if (res.data.status === 200) {
            returnData = res.data
        }

    }).catch((err) => {
        throw new Error(err);
    })

    return returnData

}


const getMoreDataSet = async (id, preID) => {

    var returnData = []


    if (id && preID) {

        await axios.post(`/fetch_more_order_data/${id}/${preID}`).then((res) => {
            // console.log(res)
            if (res.data.status === 200) {
                returnData = res.data
            }

        }).catch((err) => {
            throw new Error(err);
        })

        return returnData
    }


}



const getMoreDataSetByID = async (id) => {

    var returnData = [];

    await axios.get(`fetch_all_orders_product_wise_by_id/${id}`).then(response => {
        if (response?.data?.status == 200) {
            returnData = response?.data?.productData
        }
    }).catch((err) => {
        throw new Error(err)
    })


    return returnData
}



const getEssentialsNonessentialsDataSet = async (dataSet) => {
    var returnData = []
    await axios.post('/fetch_more_order_data/1', dataSet).then((res) => {
        // console.log(res)
        if (res.data.status === 200) {
            returnData = res.data
        }

    }).catch((err) => {
        throw new Error(err);
    })

    return returnData
}


export { getLifestylesDataSet, getEssentialsNonessentialsDataSet, getMoreDataSet, getMoreDataSetByID }