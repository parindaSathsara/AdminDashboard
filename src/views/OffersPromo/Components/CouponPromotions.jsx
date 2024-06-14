import React, { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Container, Typography } from '@mui/material';
import { CButton } from '@coreui/react';
import MainDiscountForm from './Forms/MainDiscountForm';
import { createCoupon, createDiscount, deleteCouponByID, deleteDiscountByID, editCoupon, editDiscount, loadAllCoupons, loadAllDiscounts } from '../offersServices';
import Swal from 'sweetalert2';
import CouponPromotionsForms from './Forms/CouponPromotionsForm';

const CouponPromotions = () => {
    const [data, setData] = useState([

    ]);

    const columns = [
        { accessorKey: 'coupon_id', header: 'ID', size: 30 },

        { accessorKey: 'discount_title', header: 'Title', size: 30 },


        { accessorKey: 'sub_title', header: 'Sub Title' },
        { accessorKey: 'code', header: 'Code' },
        { accessorKey: 'usage_count', header: 'Usage Count' },
        { accessorKey: 'balance_count', header: 'Balance Count' },
        { accessorKey: 'detect_balance_amount', header: 'Detect Balance Amount' },
        { accessorKey: 'min_purchase_amount', header: 'Min Purchase Amount' },
        { accessorKey: 'coupon_type', header: 'Coupon Type' },
        { accessorKey: 'condition', header: 'Condition' },
        {
            accessorKey: 'edit',
            header: 'Edit',
            size: 20,
            Cell: (rowData) => (
                <CButton color='light' onClick={() => handleEdit(rowData.row)}>Edit</CButton>
            )
        },
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
    });

    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [editTrigger, setEditTrigger] = useState(false);

    const handleEdit = (dataSet) => {
        setModalData(dataSet.original);
        setEditTrigger(true);
        setShowModal(true);
    }

    const handleDelete = (dataSet) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You are about to delete this discount',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteCouponByID(dataSet?.original?.coupon_id).then(response => {
                    if (response.data.status === 200) {
                        loadAllCoupons().then(response => {
                            if (response.data.status === 200) {
                                setData(response.data.discountData);
                            }
                        });
                        Swal.fire('Coupon Deleted!', 'Coupon Deleted Successfully', 'success');
                    }



                });

            }
        });
    }

    const handleCreateDiscount = () => {
        setShowModal(true);
        setModalData([]);
    }

    const handleFormSubmit = (newDiscount) => {
        setEditTrigger(false);

        console.log(newDiscount, "New Discount")

        if (editTrigger) {

            editCoupon(newDiscount).then(response => {
                loadAllCoupons().then(response => {
                    if (response.data.status === 200) {
                        setData(response.data.discountData);
                    }
                });
                Swal.fire('Coupon Updated!', 'Coupon Updated Successfully', 'success');
            });

        } else {

            createCoupon(newDiscount).then(response => {
                loadAllCoupons().then(response => {
                    if (response.data.status === 200) {
                        setData(response.data.discountData);
                    }
                });
                Swal.fire('Coupon Created!', 'Coupon Created Successfully', 'success');
            });

        }

        setShowModal(false);
    }

    useEffect(() => {
        loadAllCoupons().then(response => {
            if (response.data.status === 200) {
                setData(response.data.discountData);
            }
        });
    }, []);

    return (
        <>
            <CouponPromotionsForms show={showModal} handleCloseModal={() => {
                setShowModal(false);
                setEditTrigger(false);
            }} onSubmit={handleFormSubmit} modalData={modalData} edit={editTrigger} />

            <CButton color='dark' onClick={handleCreateDiscount}>Create Coupon</CButton>

            <MaterialReactTable table={table} />
        </>
    );
};

export default CouponPromotions;
