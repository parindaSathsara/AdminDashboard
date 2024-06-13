import { CCol, CForm, CFormInput, CFormCheck, CFormFeedback, CFormSelect } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { loadAllDiscounts, loadDiscountsTypes } from '../../offersServices';

const columns = [

    { accessorKey: 'discount_id', header: 'Discount Name' },
    { accessorKey: 'sub_title', header: 'Sub Title' },
    { accessorKey: 'code', header: 'Code' },
    { accessorKey: 'usage_count', header: 'Usage Count' },
    { accessorKey: 'balance_count', header: 'Balance Count' },
    { accessorKey: 'detect_balance_amount', header: 'Detect Balance Amount' },
    { accessorKey: 'min_purchase_amount', header: 'Min Purchase Amount' },
    { accessorKey: 'coupon_type', header: 'Coupon Type' },
    { accessorKey: 'condition', header: 'Condition' }
];

export default function CouponPromotionsForms({ show, handleCloseModal, onSubmit, modalData, edit }) {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [discountTypes, setDiscountTypes] = useState(["Percentage", "Amount"]);
    const [discounts, setDiscounts] = useState([]);

    const [formData, setFormData] = useState({
        discount_id: '',
        sub_title: '',
        code: '',
        usage_count: '',
        balance_count: '',
        detect_balance_amount: '',
        min_purchase_amount: '',
        coupon_type: '',
        condition: ''
    });

    useEffect(() => {
        loadAllDiscounts().then(response => {
            if (response.data.status == 200) {
                setDiscounts(response.data.discountData)
            }
        })

        if (modalData) {
            setFormData({
                discount_id: modalData.discount_id || '',
                sub_title: modalData.sub_title || '',
                code: modalData.code || '',
                usage_count: modalData.usage_count || '',
                balance_count: modalData.balance_count || '',
                detect_balance_amount: modalData.detect_balance_amount || '',
                min_purchase_amount: modalData.min_purchase_amount || '',
                coupon_type: modalData.coupon_type || '',
                condition: modalData.condition || ''
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
        <Modal show={show} onHide={handleCloseModal} centered size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>
                    {edit ? "Edit" : "Create"} Coupon
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CForm onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-3">
                        {columns.map((column, index) => (
                            <CCol key={index} md={6}>
                                {renderFormInput(column, register, errors, discountTypes, formData, handleChange, discounts)}
                            </CCol>
                        ))}
                    </div>
                </CForm>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleSubmit(onSubmit)}>
                    {edit ? "Edit" : "Create"} Coupon
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
function renderFormInput(column, register, errors, discountTypes, formData, handleChange, discountOptions) {
    switch (column.accessorKey) {

        case 'coupon_type':
            return (
                <CCol md={12}>
                    <CFormSelect
                        id="coupon_type"
                        label="Coupon Type"
                        name="coupon_type"
                        value={formData.coupon_type}
                        invalid={errors.coupon_type ? true : false}
                        {...register("coupon_type", { required: true })}
                        onChange={handleChange}
                    >
                        <option value="">Select Coupon Type</option>
                        {discountTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </CFormSelect>
                    {errors.coupon_type && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </CCol>
            );

        case 'discount_id':
            return (
                <CCol md={12}>
                    <CFormSelect
                        id="discount_id"
                        label="Discount Name"
                        name="discount_id"
                        value={formData.discount_id}
                        invalid={errors.discount_id ? true : false}
                        {...register("discount_id", { required: true })}
                        onChange={handleChange}
                    >
                        <option value="">Select Discount Name</option>
                        {discountOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.discount_title}
                            </option>
                        ))}
                    </CFormSelect>
                    {errors.discount_id && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </CCol>
            );

        case 'usage_count':
        case 'balance_count':
        case 'detect_balance_amount':
        case 'min_purchase_amount':
            return (
                <>
                    <CFormInput
                        type="number"
                        id={column.accessorKey}
                        label={column.header}
                        name={column.accessorKey}
                        value={formData[column.accessorKey]}
                        invalid={errors[column.accessorKey] ? true : false}
                        {...register(column.accessorKey, { required: true, valueAsNumber: true })}
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