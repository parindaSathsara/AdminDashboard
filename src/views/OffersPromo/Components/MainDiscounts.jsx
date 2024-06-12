import React, { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Container, Typography } from '@mui/material';
import { CButton } from '@coreui/react';
import MainDiscountForm from './Forms/MainDiscountForm';
import { createDiscount, deleteDiscountByID, loadAllDiscounts } from '../offersServices';
import Swal from 'sweetalert2';

const MainDashboard = () => {
    const [data, setData] = useState([

    ]);

    const columns = [
        { accessorKey: 'id', header: 'ID', size: 30, },
        { accessorKey: 'discount_title', header: 'Discount Title' },
        { accessorKey: 'type', header: 'Type' },
        { accessorKey: 'start_date', header: 'Start Date' },
        { accessorKey: 'expiry_date', header: 'Expiry Date' },
        {
            accessorKey: 'edit',
            header: 'Edit',
            size: 30,
            Cell: (rowData) => (
                <CButton color='primary' onClick={() => handleEdit(rowData.row)}>Edit</CButton>
            )
        },
        {
            accessorKey: 'delete',
            header: 'Delete',
            size: 30,
            Cell: (rowData) => (
                <CButton color='danger' onClick={() => handleDelete(rowData.row)}>Delete</CButton>
            )
        }
    ];

    const table = useMaterialReactTable({
        columns,
        data,
    });


    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState([])



    const handleEdit = (dataSet) => {
        console.log(dataSet.original, "Data set edit values are")
        setModalData(dataSet.original)

        setShowModal(true)
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
                console.log(dataSet.original, "Data Set original Value is");

                deleteDiscountByID(dataSet?.original?.id).then(response => {
                    if (response.data.status == 200) {
                        loadAllDiscounts().then(response => {
                            if (response.data.status == 200) {
                                setData(response.data.discountData);
                                Swal.fire(
                                    'Deleted!',
                                    'Discount Deleted Successfully',
                                    'success'
                                );
                            }
                        })
                    }
                });
            }
        });

    }



    const handleCreateDiscount = () => {
        setShowModal(true);
    };


    const handleFormSubmit = (newDiscount) => {

        createDiscount(newDiscount).then(response => {
            console.log(response, "Response Data is")

            loadAllDiscounts().then(response => {
                if (response.data.status == 200) {
                    setData(response.data.discountData)
                }
            })

        })

        setShowModal(false);
    };



    useEffect(() => {
        loadAllDiscounts().then(response => {
            if (response.data.status == 200) {
                setData(response.data.discountData)
            }
        })
    }, [])


    return (
        <>
            <MainDiscountForm show={showModal} handleCloseModal={() => setShowModal(false)} onSubmit={handleFormSubmit} modalData={modalData} />
            <CButton color='dark' onClick={handleCreateDiscount}>Create Discount</CButton>
            <MaterialReactTable table={table} />
        </>
    );
};

export default MainDashboard;
