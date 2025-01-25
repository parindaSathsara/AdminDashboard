import React, { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Container, Typography } from '@mui/material';
import { CButton, CSpinner } from '@coreui/react';
import MainDiscountForm from './Forms/MainDiscountForm';
import { createDiscount, deleteDiscountByID, editDiscount, loadAllDiscounts, editProductBasePromotion, loadAllProductBasePromotion, deleteProductBasePromotionByID, createProductBasePromotion } from '../offersServices';
import Swal from 'sweetalert2';
import ProductBasePromotionFrom from './Forms/ProductBasePromotionForm';
import { useNavigate, useParams } from 'react-router-dom'

const ProductBasePromotion = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate()

    const [isLoading, setRefreshTrigger] = useState(false);
    
    // const refresh = () => {
    //     console.log("refreshing");
    //     setRefreshTrigger(!isLoading);
    // }

    const columns = [
        { accessorKey: 'id', header: 'ID', size: 30, },
        { accessorKey: 'discount_id', header: 'Discount Id' },
        { accessorKey: 'origin_product_id', header: 'Original Product Id' },
        { accessorKey: 'discounted_product_id', header: 'Discounted Product Id' },
        { accessorKey: 'origin_inventory_id', header: 'Original Inventory Id' },
        { accessorKey: 'discounted_inventory_id', header: 'Discounted Inventory Id' },
        { accessorKey: 'category_id', header: 'Category Id' },
        { accessorKey: 'discounted_category_id', header: 'Discounted Category Id' },
        { accessorKey: 'discount_type', header: 'Discount Type' },
        // { accessorKey: 'origin_package_rate_id', header: 'Original Package Rate Id' },
        // { accessorKey: 'discounted_package_rate_id', header: 'Discounted Package Rate Id' },
        { accessorKey: 'origin_rate_id', header: 'Original Rate Id' },
        { accessorKey: 'discounted_rate_id', header: 'Discounted Rate Id' },
        // {
        //     accessorKey: 'edit',
        //     header: 'Edit',
        //     size: 20,
        //     Cell: (rowData) => (
        //         <CButton color='light' onClick={() => handleEdit(rowData.row)}>Edit</CButton>
        //     )
        // },
        {
            accessorKey: 'delete',
            header: 'Delete',
            size: 20,
            Cell: (rowData) => (
                <CButton color='dark' onClick={() => handleDelete(rowData.row)}>Delete</CButton>
            )
        }
    ];

    const table = useMaterialReactTable({
        columns,
        data,
        // enableEditing: true,
        muiTableContainerProps: { sx: { maxHeight: '500px' } },
        enableStickyHeader: true,
    });


    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([])

    const [editTrigger, setEditTrigger] = useState(false)

    const handleEdit = (dataSet) => {
        // console.log(dataSet.original, "Data set edit values are")
        setModalData(dataSet.original)
        setEditTrigger(true)
        setShowModal(true)
    }

    const handleDelete = (dataSet) => {

        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this promotion product',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log(dataSet.original, "Data Set original Value is");
                deleteProductBasePromotionByID(dataSet?.original?.id).then(response => {
                    if (response.status == 200) {
                        loadAllProductBasePromotion().then(response => {
                            if (response.status == 200) {
                                setData(response.data.data);
                                Swal.fire(
                                    'Deleted!',
                                    'Condition Deleted Successfully',
                                    'success'
                                );
                            }
                        })
                        // Swal.fire('promotion product Deleted!', 'promotion product Deleted Successfully', 'success');
                    }
                });
            }
        });

    }



    const handleCreateCondition = () => {
        setShowModal(true);
        setModalData([])
    };

 

    const customFromSubmit = (data) => {
        console.log(data, "Form Data issssss")
        var requiredFields = [];
        setRefreshTrigger(true)

        if (data.category_id === "4") {
            requiredFields = [
                'category_id',
                'discount_id',
                'discount_type',
                'discounted_category_id',
                'discounted_inventory_id',
                'discounted_product_id',
                'discounted_rate_id',
                'origin_rate_id',
                'origin_product_id']
        }
        else if (data.discounted_category_id === "4") {
            
            requiredFields = [
                'category_id',
                'discount_id',
                'discount_type',
                'discounted_category_id',
                'discounted_product_id',
                'discounted_rate_id',
                'origin_inventory_id',
                'origin_rate_id',
                'origin_product_id']
        }else{
            requiredFields = [
                'category_id',
                'discount_id',
                'discount_type',
                'discounted_category_id',
                'discounted_inventory_id',
                'discounted_product_id',
                'discounted_rate_id',
                'origin_inventory_id',
                'origin_rate_id',
                'origin_product_id'
            ];
        }

        // console.log(requiredFields, "Form Data kkkkk")
        for (let field of requiredFields) {
            if (!data[field]) {
            const fieldName = field.replace(/_/g, ' ').replace('id', '').trim();
            Swal.fire(
                'Error!',
                `The field ${fieldName} is required.`,
                'error'
            );
            setRefreshTrigger(false)
            return;
            }
        }
        console.log(data, "Form Data issssss")
        createProductBasePromotion(data).then(response => {
            // console.log(response, "Response response")
            if (response.status == 200) {
                // console.log("promotion product Created Successfully")
                Swal.fire(
                    'promotion product Created!',
                    'promotion product Created Successfully',
                    'success'
                );

                loadAllProductBasePromotion().then(response => {
                    if (response.status == 200) {
                        setData(response.data.data)
                    }
                })
                // setEditTrigger(false);
                // window.location.reload();
               
                navigate('/offers_promo')
                setRefreshTrigger(false)
                setShowModal(false);
            } else if (response.status == 422) {
                // console.log(response.data.message, "Error 422")
                Swal.fire(
                    'Error!',
                    response.data.message,
                    'error'
                );
                setRefreshTrigger(false)
            } else {
                // console.log("Something went wrong")
                Swal.fire(
                    'Error!',
                    'Something went wrong',
                    'error'
                );
                setRefreshTrigger(false)
            }

        }).catch(error => {
            // console.log(error, "Error is")
            Swal.fire(
                'Error!',
                'Something went wrong',
                'error'
            );
            setRefreshTrigger(false)
        })
    }

    const handleFormSubmit = (newCondition) => {
        setEditTrigger(false)
        // console.log(newCondition, "New Condition is")

        if (editTrigger == true) {
            // console.log("Editttt", "New Condition is")
            editProductBasePromotion(newCondition).then(reponse => {
                loadAllProductBasePromotion().then(response => {
                    if (response.status == 200) {
                        setData(response.data.data)
                    }
                })


                Swal.fire(
                    'Updated!',
                    'promotion product Updated Successfully',
                    'success'
                );
            })
        }

        else {
            console.log(newCondition, "New Condition is")
            // createProductBasePromotion(newCondition).then(response => {
            //         console.log(newCondition, "Response is222")

            //     if (response.status == 200) {
            //         console.log("promotion product Created Successfully")
            //         Swal.fire(
            //             'promotion product Created!',
            //             'promotion product Created Successfully',
            //             'success'
            //         );

            //         loadAllProductBasePromotion().then(response => {
            //             if (response.status == 200) {
            //                 setData(response.data.data)
            //             }
            //         })
            //     } else if (response.status == 422) {
            //         console.log(response.data.message, "Error 422")
            //         Swal.fire(
            //             'Error!',
            //             response.data.message,
            //             'error'
            //         );
            //     } else {
            //         console.log("Something went wrong")
            //         Swal.fire(
            //             'Error!',
            //             'Something went wrong',
            //             'error'
            //         );
            //     }

            // }).catch(error => {
            //     console.log(error, "Error is")
            //     Swal.fire(
            //         'Error!',
            //         'Something went wrong',
            //         'error'
            //     );
            // })
        }

        setShowModal(false);
    };



    useEffect(() => {
        loadAllProductBasePromotion().then(response => {
            if (response.status == 200) {
                setData(response.data.data)
            }
        })
    }, [])


  

    return (
        <>
             { isLoading ? <div className="d-flex justify-content-center"><CSpinner /></div> : <ProductBasePromotionFrom show={showModal} handleCloseModal={() => {
                setShowModal(false)
                setEditTrigger(false)
            }} onSubmit={handleFormSubmit}
                modalData={modalData}
                edit={editTrigger}
                customFromSubmit={customFromSubmit}
            />}

            <CButton color='dark' onClick={handleCreateCondition}>Create Product Promotion</CButton>
            <MaterialReactTable table={table} />
        </>
    );
};

export default ProductBasePromotion;
