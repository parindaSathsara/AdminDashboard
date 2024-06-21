import { CCol, CForm, CFormInput, CFormFeedback, CFormSelect } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import ProductIDSelect from './SubComponents/ProductIDSelect';
import ProductFieldSelect from './SubComponents/ProductFieldSelect';
import OfferProductSelect from './SubComponents/OfferProductSelect'; // Import OfferProductSelect component
import { loadAllDiscounts } from '../../offersServices';

const columns = [
    { accessorKey: 'main_discount_id', header: 'Discount Title' },
    { accessorKey: 'discount_type', header: 'Discount Type' },
    { accessorKey: 'promo_type', header: 'Promotion Type' },
    { accessorKey: 'discount_value', header: 'Discount Value' },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'product_id', header: 'Product ID' },
    { accessorKey: 'product_field', header: 'Product Field' },
    { accessorKey: 'offer_product_category', header: 'Offer Product Category' }, // Added new column
    { accessorKey: 'offer_product', header: 'Offer Product' },
    { accessorKey: 'inventory_count', header: 'Inventory Count' },
    { accessorKey: 'balance_count', header: 'Balance Count' },
];

export default function ProductPromotionForm({ show, handleCloseModal, onSubmit, modalData, edit }) {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [formData, setFormData] = useState({
        discount_type: '',
        promo_type: '',
        discount_value: '',
        product_id: '',
        product_field: '',
        offer_product: '',
        offer_cover_image: '',
        inventory_count: '',
        balance_count: '',
        category: '',
        offer_product_category: '', // Added new field
        main_discount_id: ''
    });
    const [image, setImage] = useState(null);



    const [discounts, setDiscounts] = useState([])

    useEffect(() => {


        loadAllDiscounts().then(response => {
            if (response.data.status == 200) {
                setDiscounts(response.data.discountData)
            }
        })


        if (modalData) {
            setFormData({
                discount_type: modalData.discount_type || '',
                promo_type: modalData.promo_type || '',
                discount_value: modalData.discount_value || '',
                product_id: modalData.product_id || '',
                product_field: modalData.product_field || '',
                offer_product: modalData.offer_product || '',
                offer_cover_image: modalData.offer_cover_image || '',
                inventory_count: modalData.inventory_count || '',
                balance_count: modalData.balance_count || '',
                category: modalData.category || '',
                offer_product_category: modalData.offer_product_category || '', // Added new field
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

    const handleSelectChange = (name, selectedOption) => {
        setFormData(prevData => ({
            ...prevData,
            [name]: selectedOption
        }));
    };

    const onDrop = (acceptedFiles) => {
        setImage(acceptedFiles[0]);
        const reader = new FileReader();
        reader.onload = () => {
            setFormData(prevData => ({
                ...prevData,
                offer_cover_image: reader.result
            }));
        };
        reader.readAsDataURL(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

    return (
        <Modal show={show} onHide={handleCloseModal} centered size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>
                    {edit ? "Edit" : "Create"} Product Promotion
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CForm onSubmit={handleSubmit(onSubmit)}>
                    <div className="row g-3">
                        {columns.map((column, index) => (
                            <CCol key={index} md={6}>
                                {renderFormInput(column, register, errors, formData, handleChange, handleSelectChange, discounts)}
                            </CCol>
                        ))}
                    </div>
                    <div className="image-uploader-container mt-3">
                        <label htmlFor="offer_cover_image">Offer Cover Image</label>
                        <div className="image-uploader" {...getRootProps()}>
                            <input {...getInputProps()} />
                            {image ? (
                                <div className="image-preview">
                                    <img src={URL.createObjectURL(image)} alt="Cover Preview" className="image-preview-img" />
                                    <Button variant="danger" onClick={() => setImage(null)}>Remove Image</Button>
                                </div>
                            ) : (
                                <div className="image-dropzone">
                                    <p>Drag 'n' drop an image here, or click to select one</p>
                                </div>
                            )}
                            {errors.offer_cover_image && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                        </div>
                    </div>
                </CForm>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="dark" onClick={handleSubmit(onSubmit)}>
                    {edit ? "Edit" : "Create"} Product Promotion
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function renderFormInput(column, register, errors, formData, handleChange, handleSelectChange, discountOptions) {
    switch (column.accessorKey) {

        case 'main_discount_id':
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

        case 'discount_type':
            return (
                <CCol md={12}>
                    <CFormSelect
                        id="discount_type"
                        label="Discount Type"
                        name="discount_type"
                        value={formData.discount_type}
                        invalid={errors.discount_type ? true : false}
                        {...register("discount_type", { required: true })}
                        onChange={handleChange}
                    >
                        <option value="">Select Discount Type</option>
                        <option value="Percentage">Percentage</option>
                        <option value="Amount">Amount</option>
                        <option value="ProductOffer">Product Offer</option>
                    </CFormSelect>
                    {errors.discount_type && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </CCol>
            );

        case 'product_id':
            return (
                <ProductIDSelect
                    category={formData.category}
                    value={formData.product_id}
                    onChange={(selectedOption) => handleSelectChange(column.accessorKey, selectedOption)}
                    error={errors.product_id}
                />
            );
        case 'promo_type':
            return (
                <CCol md={12}>
                    <CFormSelect
                        id="promo_type"
                        label="Promotion Type"
                        name="promo_type"
                        value={formData.promo_type}
                        invalid={errors.promo_type ? true : false}
                        {...register("promo_type", { required: true })}
                        onChange={handleChange}
                    >
                        <option value="">Select Promotion Type</option>
                        <option value="Category Promotion">Category Promotion</option>
                        <option value="Product Promotion">Product Promotion</option>
                        <option value="Product Inventory Promotion">Product Inventory Promotion</option>
                    </CFormSelect>
                    {errors.promo_type && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </CCol>
            );
        case 'discount_value':
        case 'inventory_count':
        case 'balance_count':
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
        case 'product_field':
            return (
                <ProductFieldSelect
                    value={formData.product_field}
                    onChange={(selectedOption) => handleSelectChange(column.accessorKey, selectedOption)}
                    error={errors.product_field}
                />
            );
        case 'category':
        case 'offer_product_category': // Added new case for offer_product_category
            return (
                <>
                    <CFormSelect
                        id={column.accessorKey}
                        label={column.header}
                        name={column.accessorKey}
                        value={formData[column.accessorKey]}
                        invalid={errors[column.accessorKey] ? true : false}
                        {...register(column.accessorKey, { required: true })}
                        onChange={handleChange}
                    >
                        <option value="">Select {column.header}</option>
                        <option value="3">Lifestyles</option>
                        <option value="4">Hotels</option>
                        <option value="5">Education</option>
                        <option value="1">Essentials</option>
                        <option value="2">Non Essentials</option>
                    </CFormSelect>
                    {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </>
            );
        case 'offer_product': // Modified case for offer_product
            return (
                <OfferProductSelect
                    category={formData.offer_product_category} // Pass offer_product_category as prop
                    value={formData.offer_product}
                    onChange={(selectedOption) => handleSelectChange(column.accessorKey, selectedOption)}
                    error={errors.offer_product}
                />
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
