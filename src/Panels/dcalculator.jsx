function discountTotal(qty, dataset) {
    var discountamout = 0.00;
    var finaltotal = 0.00;

    // console.log(dataset)

    if (dataset['ESDiscountType'] === 'ps') {
        discountamout = ((dataset['mrp'] * qty) / 100) * dataset['ESDiscountPrecentage'];
        finaltotal = (dataset['mrp'] * qty) - discountamout;
    }
    if (dataset['ESDiscountType'] === 'fps') {
        discountamout = (dataset['mrp'] * qty) - dataset['CartEachItemDisPrice'];
        finaltotal = (parseFloat(discountamout)).toFixed(2)
    }
    if (dataset['ESDiscountType'] == null || dataset['ESDiscountType'] == undefined) {
        discountamout = (dataset['mrp']) * qty;
        finaltotal = (parseFloat(discountamout)).toFixed(2)
    }

    return {
        discount_amount: parseFloat(finaltotal).toFixed(2)
    }


}

export default discountTotal;