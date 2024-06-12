import { CCol, CForm, CFormInput, CFormCheck, CFormFeedback, CFormSelect } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { loadDiscountsTypes } from '../../offersServices';

const columns = [
    { accessorKey: 'discount_title', header: 'Discount Title' },
    { accessorKey: 'type', header: 'Type' },

    { accessorKey: 'start_date', header: 'Start Date' },
    { accessorKey: 'expiry_date', header: 'Expiry Date' },
];

export default function MainDiscountForm({ show, handleCloseModal, onSubmit, modalData }) {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [discountTypes, setDiscountTypes] = useState([])

    const [dataSet, setDataSet] = useState([])

    useEffect(() => {
        loadDiscountsTypes().then(response => {
            if (response.data.status == 200) {
                setDiscountTypes(response.data.discounts)
            }
        })

        setDataSet(modalData)

    }, [modalData]);


    return (
        <Modal show={show} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>Create Discount</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CForm onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-3">
                        {columns.map((column, index) => (
                            <CCol key={index} md={12}>
                                {renderFormInput(column, register, errors, discountTypes, dataSet)}
                            </CCol>
                        ))}
                    </div>
                </CForm>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleSubmit(onSubmit)}>
                    Create Discount
                </Button>
            </Modal.Footer>
        </Modal>
    );
}



function renderFormInput(column, register, errors, discountTypes, modalData) {
    console.log("Modal Data", modalData);

    switch (column.accessorKey) {
        case 'type':
            return (
                <CCol md={12}>
                    <CFormSelect
                        id="type"
                        label="Discount Type"
                        value={modalData.discount_type_id}
                        invalid={errors.type ? true : false}
                        {...register("type", { required: true })}
                    >
                        <option value="">Select Discount Type</option>
                        {discountTypes.map((type) => (
                            <option key={type.discount_type_id} value={type.discount_type_id}>
                                {type.discount_type}
                            </option>
                        ))}
                    </CFormSelect>
                    {errors.type && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </CCol>
            );
        case 'start_date':
        case 'expiry_date':
            return (
                <>
                    <CFormInput
                        type="date"
                        id={column.accessorKey}
                        label={column.header}
                        value={modalData[column.accessorKey] || ''} // Set default value if undefined
                        invalid={errors[column.accessorKey] ? true : false}
                        {...register(column.accessorKey, { required: true })}
                    />
                    {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </>
            );
        default:
            return (
                <>
                    <CFormInput
                        type="text"
                        id={column.accessorKey}
                        label={column.header}
                        value={modalData[column.accessorKey] || ''} // Set default value if undefined
                        invalid={errors[column.accessorKey] ? true : false}
                        {...register(column.accessorKey, { required: true })}
                    />
                    {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </>
            );
    }
}


