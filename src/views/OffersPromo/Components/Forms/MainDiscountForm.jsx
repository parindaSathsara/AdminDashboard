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

export default function MainDiscountForm({ show, handleCloseModal, onSubmit, modalData, edit }) {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [discountTypes, setDiscountTypes] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        discount_title: '',
        type: '',
        start_date: '',
        expiry_date: ''
    });

    useEffect(() => {
        loadDiscountsTypes().then(response => {
            if (response.data.status === 200) {
                setDiscountTypes(response.data.discounts);
            }
        });

        if (modalData) {
            setFormData({
                discount_title: modalData.discount_title || '',
                type: modalData.type_id || '',
                start_date: modalData.start_date || '',
                expiry_date: modalData.expiry_date || '',
                id: modalData.id || ""
            });

            Object.keys(modalData).forEach(key => {
                if (modalData[key]) {
                    setValue(key, modalData[key]);
                }
            });
        }
    }, [modalData, setValue]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <Modal show={show} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {edit ? "Edit" : "Create"} Discount
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CForm onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-3">
                        {columns.map((column, index) => (
                            <CCol key={index} md={12}>
                                {renderFormInput(column, register, errors, discountTypes, formData, handleChange)}
                            </CCol>
                        ))}
                    </div>
                </CForm>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleSubmit(onSubmit)}>
                    {edit ? "Edit" : "Create"} Discount
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function renderFormInput(column, register, errors, discountTypes, formData, handleChange) {


    switch (column.accessorKey) {
        case 'type':
            return (
                <CCol md={12}>
                    <CFormSelect
                        id="type"
                        label="Discount Type"
                        name="type"
                        value={formData.type}
                        invalid={errors.type ? true : false}
                        {...register("type", { required: true })}
                        onChange={handleChange}
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
                        name={column.accessorKey}
                        value={formData[column.accessorKey]}
                        invalid={errors[column.accessorKey] ? true : false}
                        {...register(column.accessorKey, { required: true })}
                        onChange={handleChange}
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
                        name={column.accessorKey}
                        value={formData[column.accessorKey]}
                        invalid={errors[column.accessorKey] ? true : false}
                        {...register(column.accessorKey, { required: true })}
                        onChange={handleChange}
                    />
                    {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </>
            );
    }
}
