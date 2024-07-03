import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { CFormLabel, CFormFeedback } from '@coreui/react';
import axios from 'axios';

function OfferProductSelect({ category, value, onChange, error }) {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Load initial 10 options when category changes
        if (category) {
            fetchOptions();
        }
    }, [category]);


    // console.log(category, "Category Data is")

    const fetchOptions = async (searchTerm = '') => {
        setIsLoading(true);

        const params = {
            category: category,
            searchTerm: searchTerm,
            limit: 10
        };

        try {
            const response = await axios.post('get_promotion_products', params);
            setOptions(response.data.map(product => ({ value: product.product_id, label: product.product_name })));
        } catch (error) {
            console.error('Error fetching offer products', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (newValue) => {
        const searchTerm = newValue.replace(/\W/g, '');
        fetchOptions(searchTerm);
    };

    return (
        <>
            <CFormLabel>Offer Product</CFormLabel>
            <Select
                id="offer_product"
                name="offer_product"
                value={value}
                onChange={onChange}
                onInputChange={handleInputChange}
                options={options}
                placeholder="Select Offer Product"
                isSearchable
                isLoading={isLoading}
            />
            {error && <CFormFeedback invalid>This field is required.</CFormFeedback>}
        </>
    );
}

export default OfferProductSelect;
