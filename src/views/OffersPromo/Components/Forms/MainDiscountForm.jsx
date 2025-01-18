import { CCol, CForm, CFormInput, CFormCheck, CFormFeedback, CFormSelect } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { loadDiscountsTypes } from '../../offersServices';

const columns = [
    { accessorKey: 'discount_tag_line', header: 'Discount Title' },
    { accessorKey: 'discount_total_limit', header: 'Total Limit' },
    { accessorKey: 'discount_start_date', header: 'Start Date' },
    { accessorKey: 'discount_end_date', header: 'End Date' },
    { accessorKey: 'discount_travel_start_date', header: 'Travel Start Date' },
    { accessorKey: 'discount_travel_end_date', header: 'Travel End Date' },
];

export default function MainDiscountForm({ show, handleCloseModal, onSubmit, modalData, edit }) {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    // console.log(modalData, "Modal Data");

    const [discountTypes, setDiscountTypes] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        discount_tag_line: '',
        discount_total_limit: '',
        discount_start_date: '',
        discount_end_date: '',
        discount_travel_start_date: '',
        discount_travel_end_date: '',
    })

    useEffect(() => {
        loadDiscountsTypes().then(response => {
            if (response.data.status === 200) {
                setDiscountTypes(response.data.discounts);
            }
        });

        if (modalData) {
            setFormData({
                discount_total_limit: modalData.discount_total_limit || '',
                discount_tag_line: modalData.discount_tag_line || '',
                discount_start_date: modalData.discount_start_date || '',
                discount_end_date: modalData.discount_end_date || '',
                discount_travel_start_date: modalData.discount_travel_start_date || '',
                discount_travel_end_date: modalData.discount_travel_end_date || '',
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
        case 'discount_total_limit':
            return (
                <>
                    <CFormInput
                        type="number"
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
            case 'discount_start_date':
        case 'discount_end_date':
        case 'discount_travel_start_date':
        case 'discount_travel_end_date':
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
