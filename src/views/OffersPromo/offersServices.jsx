import axios from "axios";

async function createDiscount(discountData) {


    console.log(discountData, "Discount Data")
    try {
        const response = await axios.post(`/discounts`, discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}




async function createCoupon(discountData) {


    console.log(discountData, "Discount Data")
    try {
        const response = await axios.post(`/add_coupons`, discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}






async function editCoupon(discountData) {

    try {
        const response = await axios.put(`/update_coupons/${discountData?.coupon_id}`, discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}



async function editDiscount(discountData) {

    discountData["type"] = discountData?.type_id

    try {
        const response = await axios.put(`/discounts_edit/${discountData?.id}`, discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

async function loadDiscountsTypes() {
    try {
        const response = await axios.get("get_discount_types");
        return response;
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}

async function loadAllDiscounts() {
    try {
        const response = await axios.get("get_discounts");
        return response;
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}


async function loadAllCoupons() {
    try {
        const response = await axios.get("get_coupons");
        return response;
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}



async function deleteDiscountByID(id) {
    try {
        const response = await axios.delete(`delete_discount_by_id/${id}`);
        return response;
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}


async function deleteCouponByID(id) {
    try {
        const response = await axios.delete(`delete_coupon_by_id/${id}`);
        return response;
    }
    catch (error) {
        console.log(error)
        throw error;
    }
}


export { createDiscount, loadDiscountsTypes, loadAllDiscounts, deleteDiscountByID, editDiscount, createCoupon, loadAllCoupons, editCoupon, deleteCouponByID }