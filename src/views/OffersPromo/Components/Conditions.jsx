import React, { useEffect, useState } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Container, Typography } from '@mui/material';
import { CButton } from '@coreui/react';
import MainDiscountForm from './Forms/MainDiscountForm';
import { createDiscount, deleteDiscountByID, editDiscount, loadAllDiscounts, loadAllConditions, createCondition,editCondition, deleteConditionById } from '../offersServices';
import Swal from 'sweetalert2';
import ConditionForm from './Forms/ConditonForm';

const MainConditions = () => {
    const [data, setData] = useState([

    ]);

    const columns = [
        { accessorKey: 'id', header: 'ID', size: 30, },
        { accessorKey: 'discount_id', header: 'Discount Id' },
        { accessorKey: 'discount_condition_type', header: 'Condition Type' },
        { accessorKey: 'condition_start_value', header: 'Start Value' },
        { accessorKey: 'condition_end_value', header: 'End Value' },
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
            text: 'You are about to delete this Condition',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // console.log(dataSet.original, "Data Set original Value is");

                deleteConditionById(dataSet?.original?.id).then(response => {
                    if (response.status == 200) {
                        loadAllConditions().then(response => {
                            if (response.status == 200) {
                                setData(response.data.data);
                                Swal.fire(
                                    'Deleted!',
                                    'Condition Deleted Successfully',
                                    'success'
                                );
                            }
                        })
                        // Swal.fire('Condition Deleted!', 'Condition Deleted Successfully', 'success');
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

            editCondition(newCondition).then(reponse => {
                loadAllConditions().then(response => {
                    if (response.status == 200) {
                        setData(response.data.data)
                    }
                })


                Swal.fire(
                    'Updated!',
                    'Condition Updated Successfully',
                    'success'
                );
            })
        }

        else {
            createCondition(newCondition).then(response => {
                    // console.log(response, "Response is222")
                if (response.status == 200) {
                    // console.log("condition Created Successfully")
                    Swal.fire(
                        'Condition Created!',
                        'Condition Created Successfully',
                        'success'
                    );

                    loadAllConditions().then(response => {
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
        loadAllConditions().then(response => {
            if (response.status == 200) {
                setData(response.data.data)
            }
        })
    }, [])




    return (
        <>
            <ConditionForm show={showModal} handleCloseModal={() => {
                setShowModal(false)
                setEditTrigger(false)
            }} onSubmit={handleFormSubmit} modalData={modalData} edit={editTrigger} />

            <CButton color='dark' onClick={handleCreateCondition}>Create Condition</CButton>
            <MaterialReactTable table={table} />
        </>
    );
};

export default MainConditions;
