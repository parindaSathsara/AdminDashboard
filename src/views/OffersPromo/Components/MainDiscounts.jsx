import React, { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Container, Typography } from '@mui/material';
import { CButton } from '@coreui/react';
import MainDiscountForm from './Forms/MainDiscountForm';
import { createDiscount, deleteDiscountByID, editDiscount, loadAllDiscounts, createPromotionDiscount } from '../offersServices';
import Swal from 'sweetalert2';

const MainDashboard = () => {
    const [data, setData] = useState([

    ]);

    const columns = [
        { accessorKey: 'id', header: 'ID', size: 30, },
        { accessorKey: 'discount_tag_line', header: 'Tag line' },
        { accessorKey: 'discount_start_date', header: 'Start Date' },
        { accessorKey: 'discount_end_date', header: 'End Date' },
        { accessorKey: 'discount_total_limit', header: 'Total Limit' },
        { accessorKey: 'discount_travel_start_date', header: 'Travel Start Date' },
        { accessorKey: 'discount_travel_end_date', header: 'Travel End Date' },
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
        muiTableHeadCellProps: {
            sx: {
                backgroundColor: '#626f75',
                color: 'white',
            },
        },
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
            text: 'You are about to delete this discount',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log(dataSet.original, "Data Set original Value is");

                deleteDiscountByID(dataSet?.original?.id).then(response => {
                    // console.log(response, "Response is")
                    if (response.status == 200) {
                        loadAllDiscounts().then(response => {
                            if (response.status == 200) {
                                setData(response.data.data);
                                Swal.fire(
                                    'Deleted!',
                                    'Discount Deleted Successfully',
                                    'success'
                                );
                            }
                        })
                        // Swal.fire('Discount Deleted!', 'Discount Deleted Successfully', 'success');
                    }
                });
            }
        });

    }



    const handleCreateDiscount = () => {
        setShowModal(true);
        setModalData([])
    };


    const handleFormSubmit = (newDiscount) => {
        // console.log(newDiscount, "New Discount values are")
        setEditTrigger(false)

        if (editTrigger == true) {

            editDiscount(newDiscount).then(reponse => {
                loadAllDiscounts().then(response => {
                    if (response.status == 200) {
                        setData(response.data.data)
                    }
                })
                Swal.fire(
                    'Updated!',
                    'Discount Updated Successfully',
                    'success'
                );
            })
        }

        else {
            createPromotionDiscount(newDiscount).then(response => {
                // console.log(response.data.status, "Response is")
                if (response.status == 200) {
                    // console.log("Discount Created Successfully")
                    Swal.fire(
                        'Discount Created!',
                        'Discount Created Successfully',
                        'success'
                    );

                    loadAllDiscounts().then(response => {
                        if (response.status == 200) {
                            setData(response.data.data)
                            // Swal.fire(
                            //     'Discount Created!',
                            //     'Discount Created Successfully',
                            //     'success'
                            // );
                        }
                    })
                } else if (response.status == 422) {
                    // console.log(response.data.message, "Error 422")
                    Swal.fire(
                        'Error!',
                        response.data.message,
                        'error'
                    );
                } else {
                    console.log("Something went wrong")
                    Swal.fire(
                        'Error!',
                        'Something went wrong',
                        'error'
                    );
                }






            }).catch(error => {
                // console.log(error, "Error is")
                Swal.fire(
                    'Error!',
                    'Something went wrong',
                    'error'
                );
            })
        }

        setShowModal(false);
    };



    useEffect(() => {
        loadAllDiscounts().then(response => {
            if (response.status == 200) {
                // console.log(response.data, "Data is")
                setData(response.data.data)
            }
        })
    }, [])


    return (
        <>
            <MainDiscountForm show={showModal} handleCloseModal={() => {
                setShowModal(false)
                setEditTrigger(false)
            }} onSubmit={handleFormSubmit} modalData={modalData} edit={editTrigger} />

            <CButton color='dark' onClick={handleCreateDiscount}>Create Discount</CButton>
            <MaterialReactTable 
            table={table} />
        </>
    );
};

export default MainDashboard;
