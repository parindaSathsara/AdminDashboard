import axios from "axios"

const getAllProductsOrders = async (val) => {

    var dataset = []
    await axios.get("fetch_all_orders_product_wise").then(res => {
        if (res.data.status == 200) {
            dataset = res.data.productData
        }
    }).catch(response => {

    })

    return dataset;


}


export {
    getAllProductsOrders
}