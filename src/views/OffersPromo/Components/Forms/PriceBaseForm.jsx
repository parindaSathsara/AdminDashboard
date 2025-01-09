import { CCol, CForm, CFormInput, CFormCheck, CFormFeedback, CFormSelect } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { loadDiscountsTypes,loadAllDiscounts } from '../../offersServices';

const columns = [
    { accessorKey: 'discount_id', header: 'Discount Id' },
    { accessorKey: 'amount_type', header: 'Type of Amount' },
    { accessorKey: 'discounted_amount', header: 'Discount Amount' },
];

export default function PriceBaseForm({ show, handleCloseModal, onSubmit, modalData, edit }) {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    const [discountTypes, setDiscountTypes] = useState([]);
    const [formData, setFormData] = useState({
        discount_id: '',
        amount_type: '',
        discounted_amount: '',
    })

    const [dataDiscount, setDataDiscount] = useState([])
    
          useEffect(() => {
                loadAllDiscounts().then(response => {
                    if (response.status == 200) {
                        // console.log(response.data, "Data is")
                        setDataDiscount(response.data.data)
                    }
                })
            }, [show])

    useEffect(() => {
        loadDiscountsTypes().then(response => {
            if (response.data.status === 200) {
                setDiscountTypes(response.data.discounts);
            }
        });

        if (modalData) {
            setFormData({
                discount_id: modalData.discount_id || '',
                amount_type: modalData.amount_type || '',
                discounted_amount: modalData.discounted_amount || '',
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

        // console.log(name,value,"Name value data issss")

        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <Modal show={show} onHide={handleCloseModal} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {edit ? "Edit" : "Create"} PriceBase Discount
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CForm onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-3">
                        {columns.map((column, index) => (
                            <CCol key={index} md={12}>
                                {renderFormInput(column, register, errors, discountTypes, formData, handleChange,dataDiscount)}
                            </CCol>
                        ))}
                    </div>
                </CForm>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleSubmit(onSubmit)}>
                    {edit ? "Edit" : "Create"} PriceBase Discount
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function renderFormInput(column, register, errors, discountTypes, formData, handleChange,dataDiscount) {

    const amountType =[{name:"Fixed rate"},{name:"Percentage"}]

    switch (column.accessorKey) {
        case 'discount_id':
            return (
                <CCol md={12}>
                    <CFormSelect
                        id="discount_id"
                        label="Discount"
                        name="discount_id"
                        value={formData[column.accessorKey]}
                        invalid={errors[column.accessorKey] ? true : false}
                        {...register("discount_id", { required: true })}
                        onChange={handleChange}
                    >
                        <option value="">Select Discount</option>
                        { 
                            dataDiscount.map((type) => (
                                <option key={type.id} value={type.id}>
                                    {type.discount_tag_line}
                                </option>
                            ))
                        }
                    </CFormSelect>
                    {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </CCol>
            );
            case 'amount_type':
                return (
                    <CCol md={12}>
                        <CFormSelect
                            id="amount_type"
                            label="Amount Type"
                            name="amount_type"
                            value={formData[column.accessorKey]}
                            invalid={errors[column.accessorKey] ? true : false}
                            {...register("amount_type", { required: true })}
                            onChange={handleChange}
                        >
                            <option value="">Select Amount Type</option>
                            {
                             amountType.map((type) => (
                                <option key={type.name} value={type.name}>
                                    {type.name}
                                </option>
                            ))
                            }
                        </CFormSelect>
                        {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                    </CCol>
                );
                case 'discounted_amount':
                    return (
                        <CCol md={12}>
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
                        </CCol>
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
