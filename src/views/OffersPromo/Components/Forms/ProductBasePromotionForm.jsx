import { CCol, CForm, CFormInput, CFormCheck, CFormFeedback, CFormSelect } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { loadDiscountsTypes, loadAllDiscounts, getAllProductByCategoryById, getAllProductByInventoryById } from '../../offersServices';
import ProductSelectContainer from './cards/ProductSelectContainer';
import DiscountProductSelectContainer from './cards/DiscountProductSelectContainer';
import Swal from 'sweetalert2';
import DropdownMapper from "./DropDown/Inventory";
import DiscountDropdownMapper from "./DropDown/DiscountInventory";
import RateSelectMapper from "./DropDown/Rate";
import DiscountRateSelectMapper from "./DropDown/DiscountRate";

const columns = [
    { accessorKey: 'discount_id', header: 'Discount' },
    { accessorKey: 'discount_type', header: 'Discount Type' },
    { accessorKey: 'category_id', header: 'Category' },
    { accessorKey: 'origin_product_id', header: 'Main Product' },
    { accessorKey: 'origin_inventory_id', header: 'Original Inventory' },
    { accessorKey: 'origin_rate_id', header: 'Original Rate' },
    { accessorKey: 'discounted_category_id', header: 'Discounted Category' },
    { accessorKey: 'discounted_product_id', header: 'Discounted Product' },
    { accessorKey: 'discounted_inventory_id', header: 'Discounted Inventory' },
    { accessorKey: 'discounted_rate_id', header: 'Discounted Rate' },

];

export default function ConditionForm({ show, handleCloseModal, onSubmit, modalData, edit, customFromSubmit }) {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [mainInventory, setMainInventory] = useState([])
    const [mainDiscountInventory, setMainDiscountInventory] = useState([])
    const [discountTypes, setDiscountTypes] = useState([]);
   
    const [formData, setFormData] = useState({
        discount_id: '',
        discount_type: '',
        category_id: '',
        origin_product_id: '',
        discounted_category_id: '',
        discounted_product_id: '',
        origin_inventory_id: '',
        origin_rate_id: '',
        discounted_inventory_id: '',
        discounted_rate_id: '',

    })

    const [formData2, setFormData2] = useState({
        discount_id: '',
        discount_type: '',
        category_id: '',
        origin_product_id: '',
        discounted_category_id: '',
        discounted_product_id: '',
        origin_inventory_id: '',
        origin_rate_id: '',
        discounted_inventory_id: '',
        discounted_rate_id: '',

    })

    const [products, setProducts] = useState([])
    const [discountProducts, setDiscountProducts] = useState([])
    useEffect(() => {
        if (formData.category_id) {
            try {
                setLoading(true);
                getAllProductByCategoryById(formData.category_id).then(response => {
                    if (response.status == 200) {
                        // console.log(response.data.data, "Data isssssssss")
                        setProducts(response.data.data)
                        setLoading(false);
                    }
                })
            } catch (e) {
                setLoading(false);
                Swal.fire(
                    'Error!',
                    'Something went wrong',
                    'error'
                );
            }
        }

    }, [formData.category_id])


    useEffect(() => {
        if (formData.discounted_category_id) {
            try {
                setLoadingDiscount(true);
                getAllProductByCategoryById(formData.discounted_category_id).then(response => {
                    if (response.status == 200) {
                        // console.log(response.data.data, "Data isssssssss")
                        setDiscountProducts(response.data.data)
                        setLoadingDiscount(false);
                    }
                })
            } catch (e) {
                setLoadingDiscount(false);
                Swal.fire(
                    'Error!',
                    'Something went wrong',
                    'error'
                );
            }
        }
    }, [formData.discounted_category_id])

    useEffect(() => {
        if (formData.origin_product_id) {
            try {
                getAllProductByInventoryById(formData.category_id).then(response => {
                    if (response.status == 200) {
                        // console.log(response.data.data, "Data isssssssss")
                        setProducts(response.data.data)
                    }
                })
            } catch (e) {
                Swal.fire(
                    'Error!',
                    'Something went wrong',
                    'error'
                );
            }
        }
    }, [formData.category_id])

    const [dataDiscount, setDataDiscount] = useState([])

    useEffect(() => {
        loadAllDiscounts().then(response => {
            if (response.status == 200) {
                // console.log(response.data, "Data is")
                setDataDiscount(response.data.data)
            }
        })
    }, [])

    useEffect(() => {
        loadDiscountsTypes().then(response => {
            if (response.status === 200) {
                setDiscountTypes(response.data.data);
            }
        });

        if (modalData) {
            setFormData({
                discount_id: modalData.discount_id || '',
                discount_type: modalData.discount_type || '',
                category_id: modalData.category_id || '',
                origin_product_id: modalData.origin_product_idy || '',
                discounted_category_id: modalData.discounted_category_id || '',
                discounted_product_id: modalData.discounted_product_id || '',
                origin_inventory_id: modalData.origin_inventory_id || '',
                origin_rate_id: modalData.origin_rate_id || '',
                discounted_rate_id: modalData.discounted_rate_id || '',
                discounted_inventory_id: modalData.discounted_inventory_id || '',
            });

            Object.keys(modalData).forEach(key => {
                if (modalData[key]) {
                    setValue(key, modalData[key]);
                }
            });
        }
    }, [modalData, setValue]);


    const [productDetails, setProductDetails] = useState()
    const fetchInventoriesByProductId = (id) => {

        // console.log(id.product_id, formData?.category_id, "chamod")
        if (formData?.category_id && id?.product_id) {

            try {
                getAllProductByInventoryById(formData?.category_id, id?.product_id).then(response => {
                    if (response.status == 200) {
                        // console.log(response.data, "Data isssssssssssssss")
                        setProductDetails(response.data.data)
                        setMainInventory(response.data.data.inventories)
                    }
                })
            } catch (e) {
                Swal.fire(
                    'Error!',
                    'Something went wrong',
                    'error'
                );
            }
        }

    }

    const [discountProductDetails, setDiscountProductDetails] = useState()
    const fetchDiscountInventoriesByProductId = (id) => {

        // console.log(id.product_id, formData?.discounted_category_id, "chamod")
        if (formData?.discounted_category_id && id?.product_id) {

            try {
                getAllProductByInventoryById(formData?.discounted_category_id, id?.product_id).then(response => {
                    if (response.status == 200) {
                        // console.log(response.data, "Data isssssssssssssss")
                        setDiscountProductDetails(response.data.data)
                        setMainDiscountInventory(response.data.data.inventories)
                    }
                })
            } catch (e) {
                Swal.fire(
                    'Error!',
                    'Something went wrong',
                    'error'
                );
            }
        }

    }

    const [categoryInventoryId, setCategoryInventoryId] = useState(null)
    const [discountCategoryInventoryId, setDiscountCategoryInventoryId] = useState(null)
    const [inventoryId, setInventory] = useState(null)
    const [inventoryIdDiscount, setInventoryDiscount] = useState(null)
    const [rateId, setRateId] = useState(null)
    const [rateIdDiscount, setRateIdDiscount] = useState(null)
    const [loading, setLoading] = useState(false);
    const [loadingDiscount, setLoadingDiscount] = useState(false);
    const handleChange = (e) => {

        const { name, value } = e.target ? e.target : e;

        // console.log(name, value, "Dataaaaaaaaaaaaaaaa");

        if (typeof value === "string" && value.includes("-") && name === "origin_rate_id") {
            const [firstValue, lastValue] = value.split("-")
            // .map((v) => v.trim());
            setFormData((prevData) => ({
                ...prevData,
                origin_rate_id: value,
                origin_inventory_id: value,
            }));
            setFormData2((prevData) => ({
                ...prevData,
                origin_rate_id: firstValue,
                origin_inventory_id: lastValue,
            }));
            return;
        }

        if (typeof value === "string" && value.includes("-") && name === "discounted_rate_id") {
            const [firstValue, lastValue] = value.split("-")
            setFormData((prevData) => ({
                ...prevData,
                discounted_rate_id: value,
                discounted_inventory_id: value,
            }));
            setFormData2((prevData) => ({
                ...prevData,
                discounted_rate_id: firstValue,
                discounted_inventory_id: lastValue,
            }));
            return;
        }

        if (name === "origin_product_id") {
            fetchInventoriesByProductId(value);
            setFormData((prevData) => ({
                ...prevData,
                [name]: value.product_id,
            }));
            setFormData2((prevData) => ({
                ...prevData,
                [name]: value.product_id,
            }));
            return;
        }
        if (name === "discounted_product_id") {
            fetchDiscountInventoriesByProductId(value);
            // console.log(value.product_id, "Discounted Producttttttttt")
            setFormData((prevData) => ({
                ...prevData,
                [name]: value.product_id,
            }));

            setFormData2((prevData) => ({
                ...prevData,
                [name]: value.product_id,
            }));
            return;
        }
        if (name === "category_id") {
            setCategoryInventoryId(value);
        }
        if (name === "discounted_category_id") {
            setDiscountCategoryInventoryId(value);
        }
        if (name === "origin_inventory_id") {
            setInventory(value)
        }
        if (name === "discounted_inventory_id") {
            setInventoryDiscount(value)
        }
        if (name === "origin_rate_id") {
            setRateId(value)
        }
        if (name === "discounted_rate_id") {
            setRateIdDiscount(value)
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        setFormData2((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // console.log(formData, formData2, "test");
        // console.log(formData, "Dataaaaaaaaaaaaaaa");
    };

    
    return (
        <Modal style={{ maxHeight: '95vh', overflowY: 'auto' }} show={show} onHide={handleCloseModal} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title>
                    {edit ? "Edit" : "Create"} Promotion Product
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <CForm onSubmit={
                    handleSubmit(onSubmit)}>
                    <div className="row g-3">
                        {columns.map((column, index) => (
                            <CCol key={index} md={12}>
                                {renderFormInput(column, register, errors, discountTypes, formData, handleChange, dataDiscount, products, discountProducts, mainInventory, mainDiscountInventory, categoryInventoryId, productDetails, discountProductDetails, inventoryId, inventoryIdDiscount, rateId, rateIdDiscount, discountCategoryInventoryId,loading, loadingDiscount)}
                            </CCol>
                        ))}
                    </div>
                </CForm>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button variant="dark" onClick={handleSubmit(onSubmit)}>
                    {edit ? "Edit" : "Create"} Promotion Product
                </Button> */}
                <Button variant="dark" onClick={() => {
                    handleSubmit(onSubmit);
                    customFromSubmit(formData2)
                }}>
                     {edit ? "Edit" : "Create"} Promotion Product
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function renderFormInput(column, register, errors, discountTypes, formData, handleChange, dataDiscount, products, discountProducts, mainInventory, mainDiscountInventory, categoryInventoryId, productDetails, discountProductDetails, inventoryId, inventoryIdDiscount, rateId, rateIdDiscount, discountCategoryInventoryId,loading, loadingDiscount) {

    // console.log(inventoryId, "Column data isss data")
    const discountType = [{ value: "product_update", name: "Product Update" }, { value: "inventory_update", name: "Inventory Update" }, { value: "package_update", name: "Package Update" }, { value: "bogof", name: "Buy one get one free" }]
    const categories = [{ value: "1", name: "Essential" }, { value: "2", name: "NonEssential" }, { value: "3", name: "Lifestyle" }, { value: "4", name: "Hotel" }, , { value: "5", name: "Education" }]

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
        case 'discount_type':
            return (
                <CCol md={12}>
                    <CFormSelect
                        id="discount_type"
                        label="Discount Type"
                        name="discount_type"
                        value={formData[column.accessorKey]}
                        invalid={errors[column.accessorKey] ? true : false}
                        {...register("discount_type", { required: true })}
                        onChange={handleChange}
                    >
                        <option value="">Select Discount Type</option>
                        {
                            discountType.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.name}
                                </option>
                            ))
                        }
                    </CFormSelect>
                    {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                    <br></br><br></br>
                </CCol>
            );
        case 'category_id':
            return (
                <CCol md={12}>
                    <CFormSelect
                        id="category_id"
                        label="Main Category"
                        name="category_id"
                        value={formData[column.accessorKey]}
                        invalid={errors[column.accessorKey] ? true : false}
                        {...register("category_id", { required: true })}
                        onChange={handleChange}
                    >
                        <option value="">Select Category Type</option>
                        {
                            categories.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.name}
                                </option>
                            ))
                        }
                    </CFormSelect>
                    {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>}

                </CCol>
            );
        case 'discounted_category_id':
            return (
                <CCol md={12}>
                    <CFormSelect
                        id="discounted_category_id"
                        label="Discount Category"
                        name="discounted_category_id"
                        value={formData[column.accessorKey]}
                        invalid={errors[column.accessorKey] ? true : false}
                        {...register("discounted_category_id", { required: true })}
                        onChange={handleChange}
                    >
                        <option value="">Select Discount category Type</option>
                        {
                            categories.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.name}
                                </option>
                            ))
                        }
                    </CFormSelect>
                    {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>}
                </CCol>
            );
        case 'origin_product_id':
            return (
                <CCol md={12}>
                 

                    <ProductSelectContainer id="origin_product_id" label="Main Product" name="origin_product_id" category={formData["category_id"]} value={formData[column.accessorKey]} invalid={errors[column.accessorKey]} onChange={handleChange} products={products} load={loading} />
                    {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
                </CCol>
            )
        case 'discounted_product_id':
            return (
                <CCol md={12}>
                   {/* register={register} onChange={handleChange} */}
                    <DiscountProductSelectContainer id="discounted_product_id" label="Discount Product" name="discounted_product_id" category={formData["discounted_category_id"]} value={formData[column.accessorKey]} invalid={errors[column.accessorKey]} onChange={handleChange}  products={discountProducts} load={loadingDiscount} />
                    {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
                </CCol>
            );
        case 'origin_inventory_id':
            if (categoryInventoryId === '3' && formData?.origin_rate_id) {
                return (
                    <CCol md={12}>
                        <DropdownMapper
                            id="origin_inventory_id"
                            label="Main Inventory Id"
                            name="origin_inventory_id"
                            value={formData[column.accessorKey]}
                            invalid={errors[column.accessorKey]}
                            register={register("origin_inventory_id", { required: true })}
                            onChange={handleChange}
                            inventory={mainInventory}
                            category={categoryInventoryId}
                            reteId={rateId}
                        />
                        {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
                    </CCol>
                );
            } else if (categoryInventoryId === '5' && formData?.origin_rate_id) {
                return (
                    <CCol md={12}>
                        <DropdownMapper
                            id="origin_inventory_id"
                            label="Main Inventory Id"
                            name="origin_inventory_id"
                            value={formData[column.accessorKey]}
                            invalid={errors[column.accessorKey]}
                            register={register("origin_inventory_id", { required: true })}
                            onChange={handleChange}
                            inventory={mainInventory}
                            category={categoryInventoryId}
                            reteId={rateId}
                        />
                        {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
                    </CCol>
                );
            } else if (categoryInventoryId === '1' || categoryInventoryId === '2') {
                return (
                    <CCol md={12}>
                        <DropdownMapper
                            id="origin_inventory_id"
                            label="Main Inventory"
                            name="origin_inventory_id"
                            value={formData[column.accessorKey]}
                            invalid={errors[column.accessorKey]}
                            register={register("origin_inventory_id", { required: true })}
                            onChange={handleChange}
                            inventory={mainInventory}
                            category={categoryInventoryId}
                            reteId={rateId}
                        />
                        {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
                    </CCol>
                );

            } else if (categoryInventoryId === '4') {
                return;
            } else {
                return;
            }

        case 'discounted_inventory_id':
            if (discountCategoryInventoryId === '3' && formData?.discounted_rate_id) {
                return (
                    <CCol md={12}>
                        <DiscountDropdownMapper
                            id="discounted_inventory_id"
                            label="Discount Inventory"
                            name="discounted_inventory_id"
                            value={formData[column.accessorKey]}
                            invalid={errors[column.accessorKey]}
                            register={register("discounted_inventory_id", { required: true })}
                            onChange={handleChange}
                            inventory={mainDiscountInventory}
                            category={discountCategoryInventoryId}
                            reteId={rateIdDiscount}
                        />
                        {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
                    </CCol>
                );

            } else if (discountCategoryInventoryId === '5' && formData?.discounted_rate_id) {
                return (
                    <CCol md={12}>
                        <DiscountDropdownMapper
                            id="discounted_inventory_id"
                            label="Discount Inventory"
                            name="discounted_inventory_id"
                            value={formData[column.accessorKey]}
                            invalid={errors[column.accessorKey]}
                            register={register("discounted_inventory_id", { required: true })}
                            onChange={handleChange}
                            inventory={mainDiscountInventory}
                            category={discountCategoryInventoryId}
                            reteId={rateIdDiscount}
                        />
                        {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
                    </CCol>
                );
            } else if (discountCategoryInventoryId === '1' || discountCategoryInventoryId === '2') {
                return (
                    <CCol md={12}>
                        <DiscountDropdownMapper
                            id="discounted_inventory_id"
                            label="Discount Inventory"
                            name="discounted_inventory_id"
                            value={formData[column.accessorKey]}
                            invalid={errors[column.accessorKey]}
                            register={register("discounted_inventory_id", { required: true })}
                            onChange={handleChange}
                            inventory={mainDiscountInventory}
                            category={discountCategoryInventoryId}
                            reteId={rateIdDiscount}
                        />
                        {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
                    </CCol>
                );
            }
            else if (discountCategoryInventoryId === '4') {
                return;
            } else {
                return;
            }
        case 'origin_rate_id':
            return (
                // {categoryInventoryId == 1 || categoryInventoryId == 2 ? ()}
                <CCol md={12}>
                    <RateSelectMapper
                        id="origin_rate_id"
                        label="Main Rate"
                        name="origin_rate_id"
                        value={formData[column.accessorKey]}
                        invalid={errors[column.accessorKey]}
                        register={register("origin_rate_id",
                            { required: true })}
                        onChange={handleChange}
                        rate={productDetails?.rates}
                        inventoryId={inventoryId}
                        category={categoryInventoryId}
                    ></RateSelectMapper>
                    {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
                    <br></br><br></br>
                </CCol>

            );
        case 'discounted_rate_id':
            return (
                // {categoryInventoryId == 1 || categoryInventoryId == 2 ? ()}
                <CCol md={12}>
                    <DiscountRateSelectMapper
                        id="discounted_rate_id"
                        label="Discount Rate"
                        name="discounted_rate_id"
                        value={formData[column.accessorKey]}
                        invalid={errors[column.accessorKey]}
                        register={register("discounted_rate_id",
                            { required: true })}
                        onChange={handleChange}
                        rate={discountProductDetails?.rates}
                        inventoryId={inventoryIdDiscount}
                        category={discountCategoryInventoryId}
                    ></DiscountRateSelectMapper>
                    {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
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
                    {/* {errors[column.accessorKey] && <CFormFeedback invalid>This field is required.</CFormFeedback>} */}
                </>
            );
    }
}
