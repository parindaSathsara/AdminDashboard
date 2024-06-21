import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { CFormLabel, CFormFeedback } from '@coreui/react';
import axios from 'axios';

function ProductIDSelect({ category, value, onChange, error }) {
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Load initial 10 options
        fetchOptions();
    }, [category]);



    console.log("Console", category)

    const fetchOptions = async (searchTerm = '') => {
        setIsLoading(true);

        const params = {
            category: category,
            searchTerm: searchTerm,
            limit: 10
        }

        console.log(params, "Params are")

        try {

            const response = await axios.post('get_promotion_products', params);
            setOptions(response.data.map(product => ({ value: product.product_id, label: product.product_name })));

        } catch (error) {
            console.error('Error fetching products', error);
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
            <CFormLabel>Product ID</CFormLabel>
            <Select
                id="product_id"
                name="product_id"
                value={value}
                onChange={onChange}
                onInputChange={handleInputChange}
                options={options}
                placeholder="Select Product ID"
                isSearchable
                isLoading={isLoading}
            />
            {error && <CFormFeedback invalid>This field is required.</CFormFeedback>}
        </>
    );
}

export default ProductIDSelect;
