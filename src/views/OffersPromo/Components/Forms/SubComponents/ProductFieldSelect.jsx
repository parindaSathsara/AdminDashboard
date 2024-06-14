import React from 'react';
import Select from 'react-select';
import { CFormLabel, CFormFeedback } from '@coreui/react';

function ProductFieldSelect({ value, onChange, error }) {
    const options = [
        { value: 'product_inventory_id', label: 'Product Inventory' },
        { value: 'product_rate_id', label: 'Product Rate' },
        { value: 'product_package_id', label: 'Product Package' },
        // Add more options as needed
    ];

    return (
        <>
            <CFormLabel>Product Field</CFormLabel>
            <Select
                id="product_field"
                name="product_field"
                value={value}
                onChange={onChange}
                options={options}
                placeholder="Select Product Field"
                isSearchable
            />
            {error && <CFormFeedback invalid>This field is required.</CFormFeedback>}
        </>
    );
}

export default ProductFieldSelect;
