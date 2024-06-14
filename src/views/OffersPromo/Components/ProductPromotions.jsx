import React, { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CButton } from '@coreui/react';
import Swal from 'sweetalert2';
import ProductPromotionForm from './Forms/ProductPromotionForm';
import { createPromotion, deletePromotionByID, editPromotion, loadAllPromotions } from '../offersServices';
import '../Stylings/ProductPromo.css'


const ProductPromotions = () => {
    const [data, setData] = useState([]);

    const columns = [
        { accessorKey: 'product_discount_id', header: 'ID', size: 30 },
        { accessorKey: 'discount_type', header: 'Discount Type', size: 30 },
        { accessorKey: 'discount_value', header: 'Discount Value' },
        { accessorKey: 'product_id', header: 'Product ID' },
        { accessorKey: 'product_inventory_id', header: 'Product Inventory ID' },
        { accessorKey: 'product_rate_id', header: 'Product Rate ID' },
        { accessorKey: 'product_package_id', header: 'Product Package ID' },
        { accessorKey: 'offer_product', header: 'Offer Product' },
        { accessorKey: 'offer_cover_image', header: 'Offer Cover Image' },
        { accessorKey: 'inventory_count', header: 'Inventory Count' },
        { accessorKey: 'balance_count', header: 'Balance Count' },
        {
            accessorKey: 'edit',
            header: 'Edit',
            size: 20,
            Cell: ({ row }) => (
                <CButton color='light' onClick={() => handleEdit(row)}>Edit</CButton>
            )
        },
        {
            accessorKey: 'delete',
            header: 'Delete',
            size: 20,
            Cell: ({ row }) => (
                <CButton color='dark' onClick={() => handleDelete(row)}>Delete</CButton>
            )
        }
    ];

    const table = useMaterialReactTable({
        columns,
        data,
    });

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [editTrigger, setEditTrigger] = useState(false);

    const handleEdit = (dataSet) => {
        setModalData(dataSet.original);
        setEditTrigger(true);
        setShowModal(true);
    };

    const handleDelete = (dataSet) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this promotion',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deletePromotionByID(dataSet?.original?.product_discount_id).then(response => {
                    if (response.data.status === 200) {
                        loadAllPromotions().then(response => {
                            if (response.data.status === 200) {
                                setData(response.data.promotionData);
                            }
                        });
                        Swal.fire('Promotion Deleted!', 'Promotion Deleted Successfully', 'success');
                    }
                });
            }
        });
    };

    const handleCreatePromotion = () => {
        setShowModal(true);
        setModalData([]);
    };

    const handleFormSubmit = (newPromotion) => {
        setEditTrigger(false);

        if (editTrigger) {
            editPromotion(newPromotion).then(response => {
                loadAllPromotions().then(response => {
                    if (response.data.status === 200) {
                        setData(response.data.promotionData);
                    }
                });
                Swal.fire('Promotion Updated!', 'Promotion Updated Successfully', 'success');
            });
        } else {
            createPromotion(newPromotion).then(response => {
                loadAllPromotions().then(response => {
                    if (response.data.status === 200) {
                        setData(response.data.promotionData);
                    }
                });
                Swal.fire('Promotion Created!', 'Promotion Created Successfully', 'success');
            });
        }

        setShowModal(false);
    };

    useEffect(() => {
        loadAllPromotions().then(response => {
            if (response.data.status === 200) {
                setData(response.data.promotionData);
            }
        });
    }, []);

    return (
        <>
            <ProductPromotionForm show={showModal} handleCloseModal={() => {
                setShowModal(false);
                setEditTrigger(false);
            }} onSubmit={handleFormSubmit} modalData={modalData} edit={editTrigger} />

            <CButton color='dark' onClick={handleCreatePromotion}>Create Product Promotion</CButton>

            <MaterialReactTable table={table} />
        </>
    );
};

export default ProductPromotions;
