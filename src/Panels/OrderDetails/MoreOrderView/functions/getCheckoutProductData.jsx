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


    // console.log(`/fetch_more_order_data/${id}/${preID}`, "Pre ID Value is")
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


export { getLifestylesDataSet, getEssentialsNonessentialsDataSet, getMoreDataSet }