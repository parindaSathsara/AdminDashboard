import axios from "axios";

async function createDiscount(discountData) {


    // console.log(discountData, "Discount Data")
    try {
        const response = await axios.post(`/discounts`, discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

async function createCondition(conditionData) {


    try {
        const response = await axios.post(`meta-discounts/conditions`, conditionData);
        return response;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

async function createProductBasePromotion(productData) {

    try {
        const response = await axios.post(`meta-discounts/product-base`, productData);
        return response;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}




async function createCoupon(discountData) {
    // console.log(discountData, "Discount Data")
    try {
        const response = await axios.post(`/add_coupons`, discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

async function createPriceBaseDiscount(discountData) {
    // console.log(discountData, "Discount Data")
    try {
        const response = await axios.post(`/meta-discounts/price-base`, discountData);
        return response;
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

async function editPriceBaseDiscount(discountData) {
    try {
        const response = await axios.post(`/meta-discounts/price-base/${discountData?.id}/update`, discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}



async function editDiscount(discountData) {
    // discountData["type"] = discountData?.type_id

    try {
        const response = await axios.post(`meta-discounts/${discountData?.id}/update`, discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

async function editCondition(conditionData) {
    try {
        const response = await axios.post(`meta-discounts/conditions/${conditionData?.id}/update`, conditionData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

async function editProductBasePromotion(productData) {
    try {
        const response = await axios.post(`meta-discounts/product-base/${productData?.id}/update`, productData);
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
        // console.log(error)
        throw error;
    }
}

async function loadAllConditions() {
    try {
        const response = await axios.get("meta-discounts/conditions/all");
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}

async function loadAllPriceBaseDiscount() {
    try {
        const response = await axios.get("meta-discounts/price-base/all");
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}

async function loadAllDiscounts() {
    try {
        const response = await axios.get("meta-discounts/all");
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}


async function loadAllCoupons() {
    try {
        const response = await axios.get("get_coupons");
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}

async function loadAllProductBasePromotion() {
    try {
        const response = await axios.get("meta-discounts/product-base/all");
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}


async function deleteDiscountByID(id) {
    try {
        const response = await axios.post(`meta-discounts/${id}/delete`);
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}

async function deleteConditionById(id) {
    try {
        const response = await axios.post(`meta-discounts/conditions/${id}/delete`);
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}

async function deletePriceBaseDiscount(id) {
    try {
        const response = await axios.post(`meta-discounts/price-base/${id}/delete`);
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}

async function deleteCouponByID(id) {
    try {
        const response = await axios.delete(`delete_coupon_by_id/${id}`);
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}

async function deleteProductBasePromotionByID(id) {
    try {
        const response = await axios.post(`meta-discounts/product-base/${id}/delete`);
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}

async function getAllProductByCategoryById(id) {
    try {
        const response = await axios.get(`meta-discounts/get-product-by-category/${id}`);
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}

async function getAllProductByInventoryById(categoryId, productId) {
    try {
        const response = await axios.get(`meta-discounts/get-inventory-by-products/${categoryId}/${productId}`);
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}


async function loadAllPromotions() {
    try {
        const response = await axios.get("promotions");
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}


async function editPromotion(discountData) {

    discountData["type"] = discountData?.type_id

    try {
        const response = await axios.put(`/promotions/${discountData?.id}`, discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

async function deletePromotionByID(id) {
    try {
        const response = await axios.delete(`promotions/${id}`);
        return response;
    }
    catch (error) {
        // console.log(error)
        throw error;
    }
}


async function createPromotion(discountData) {
    try {
        const response = await axios.post(`/promotions`, discountData);
        return response.data;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}

async function createPromotionDiscount(discount) {
    try {
     
        const response = await axios.post(`meta-discounts`, discount);
       
        return response;
    } catch (error) {
        console.error('Error creating discount:', error);
        throw error; // Re-throw the error so it can be handled by the caller
    }
}









export {createPriceBaseDiscount,editPriceBaseDiscount,loadAllPriceBaseDiscount,deletePriceBaseDiscount, getAllProductByInventoryById, getAllProductByCategoryById, editProductBasePromotion,loadAllProductBasePromotion,deleteProductBasePromotionByID,createProductBasePromotion,editCondition, deleteConditionById, createPromotionDiscount,createCondition, createDiscount, loadDiscountsTypes, loadAllDiscounts,loadAllConditions, deleteDiscountByID, editDiscount, createCoupon, loadAllCoupons, editCoupon, deleteCouponByID, createPromotion, deletePromotionByID, editPromotion, loadAllPromotions }