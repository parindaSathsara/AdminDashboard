import React, { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Container, Typography } from '@mui/material';
import { CButton } from '@coreui/react';
import MainDiscountForm from './Forms/MainDiscountForm';
import { createPriceBaseDiscount,editPriceBaseDiscount,loadAllPriceBaseDiscount,deletePriceBaseDiscount} from '../offersServices';
import Swal from 'sweetalert2';
import PriceBaseForm from './Forms/PriceBaseForm';

const PriceBase = () => {
    const [data, setData] = useState([

    ]);

    const columns = [
        { accessorKey: 'id', header: 'ID', size: 30, },
        { accessorKey: 'discount_id', header: 'Discount Id' },
        { accessorKey: 'amount_type', header: 'Type of Amount' },
        { accessorKey: 'discounted_amount', header: 'Discount Amount' },
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
            text: 'You are about to delete this PriceBase Discount',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log(dataSet.original, "Data Set original Value is");

                deletePriceBaseDiscount(dataSet?.original?.id).then(response => {
                    if (response.status == 200) {
                        loadAllPriceBaseDiscount().then(response => {
                            if (response.status == 200) {
                                setData(response.data.data);
                                Swal.fire(
                                    'Deleted!',
                                    'Condition Deleted Successfully',
                                    'success'
                                );
                            }
                        })
                        // Swal.fire('PriceBase Discount Deleted!', 'PriceBase Discount Deleted Successfully', 'success');
                    }
                });
            }
        });

    }



    const handleCreateCondition = () => {
        setShowModal(true);
        setModalData([])
    };


    const handleFormSubmit = (newCondition) => {
        setEditTrigger(false)
        // console.log(newCondition, "New Condition is")

        if (editTrigger == true) {

            editPriceBaseDiscount(newCondition).then(reponse => {
                loadAllPriceBaseDiscount().then(response => {
                    if (response.status == 200) {
                        setData(response.data.data)
                    }
                })


                Swal.fire(
                    'Updated!',
                    'PriceBase Discount Updated Successfully',
                    'success'
                );
            })
        }

        else {
            createPriceBaseDiscount(newCondition).then(response => {
                    // console.log(response, "Response is222")
                if (response.status == 200) {
                    // console.log("PriceBase Discount Created Successfully")
                    Swal.fire(
                        'PriceBase Discount Created!',
                        'PriceBase Discount Created Successfully',
                        'success'
                    );

                    loadAllPriceBaseDiscount().then(response => {
                        if (response.status == 200) {
                            setData(response.data.data)
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
                    // console.log("Something went wrong")
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
        loadAllPriceBaseDiscount().then(response => {
            if (response.status == 200) {
                // console.log(response.data, "Data is priceBase")
                setData(response.data.data)
            }
        })
    }, [])




    return (
        <>
            <PriceBaseForm show={showModal} handleCloseModal={() => {
                setShowModal(false)
                setEditTrigger(false)
            }} onSubmit={handleFormSubmit} modalData={modalData} edit={editTrigger} />

            <CButton color='dark' onClick={handleCreateCondition}>Create PriceBase Discount</CButton>
            <MaterialReactTable table={table} />
        </>
    );
};

export default PriceBase;
