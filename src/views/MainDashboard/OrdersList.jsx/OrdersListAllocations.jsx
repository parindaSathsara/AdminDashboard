import React, { useMemo, useState, useEffect, useContext } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CCardImage, CButton, CBadge, CAlert, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { assignEmployeesToOrders, getAllProductsOrders, getAllProductsOrdersByEmployee, getAvailableEmployees, handleDeleteData, handleEmployeeDeleteFromOrder } from 'src/service/order_allocation_services';
import { cilDelete, cilInfo, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import Select from 'react-select';
import { CardText, Modal } from 'react-bootstrap';

import './OrdersListAllocations.css';
import Swal from 'sweetalert2';
import { UserLoginContext } from 'src/Context/UserLoginContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from 'src/firebase';
import MoreOrderView from 'src/Panels/OrderDetails/MoreOrderView/MoreOrderView';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';
import { Tab, Tabs } from 'react-bootstrap';

import '../../dashboard/MainComponents/ProductWiseOrders.css'
import HotelsOrderView from 'src/Panels/OrderDetails/MoreOrderView/Categories/HotelsOrderView';


// Function to fetch and map rows


const OrderAllocate = ({ normalUser = false }) => {
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [ordersDataStatic, setOrdersDataStatic] = useState([]);
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);

    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const { userData, setUserData } = useContext(UserLoginContext);

    // const fetchAndMapRows = async (val) => {



    //     if (val == false) {
    //         const response = await getAllProductsOrders();
    //         // console.log(response, "Response dataaaaaaaaaa")
    //         return response.map((result, index) => ({
    //             id: index + 1,
    //             product_id: result.PID,
    //             product_image: result.product_image,
    //             service_location: result.location,
    //             product_title: result.product_title,
    //             category: result.category,
    //             service_date: result.service_date,
    //             balance_amount: `${result.currency} ${result.balance_amount}`,
    //             paid_amount: `${result.currency} ${result.paid_amount}`,
    //             total_amount: `${result.currency} ${result.total_amount}`,
    //             booked_date: result.checkout_date,
    //             info: result,
    //             order_id: `AHS_${result.orderID}`,
    //             assigned_user: result.assigned_user || "Unassigned",
    //             customerData: result?.customerData,
    //         }));
    //     }

    //     else {
    //         const response = await getAllProductsOrdersByEmployee(userData?.id);


    //         // console.log(response, "Response dataaaaaaaaaa malik")

    //         return response.map((result, index) => ({
    //             id: index + 1,
    //             product_id: result.PID,
    //             product_image: result.product_image,
    //             service_location: result.location,
    //             product_title: result.product_title,
    //             category: result.category,
    //             service_date: result.service_date,
    //             balance_amount: `${result.currency} ${result.balance_amount}`,
    //             paid_amount: `${result.currency} ${result.paid_amount}`,
    //             total_amount: `${result.currency} ${result.total_amount}`,
    //             booked_date: result.checkout_date,
    //             info: result,
    //             order_id: `AHS_${result.orderID}`,
    //             customerData: result?.customerData,
    //         }));
    //     }

    // };

    // const getRows = async () => {
    //     const rows = await fetchAndMapRows(normalUser);
    //     setOrdersData(rows);
    //     setOrdersDataStatic(rows)
    // };
   
    const fetchAndMapRows = async (val) => {
        try {
            if (val == false) {
                const response = await getAllProductsOrders();
                return response.map((result, index) => ({
                    id: index + 1,
                    product_id: result.PID,
                    product_image: result.product_image,
                    service_location: result.location,
                    product_title: result.product_title,
                    category: result.category,
                    service_date: result.service_date,
                    balance_amount: `${result.currency} ${result.balance_amount}`,
                    paid_amount: `${result.currency} ${result.paid_amount}`,
                    total_amount: `${result.currency} ${result.total_amount}`,
                    booked_date: result.checkout_date,
                    info: result,
                    order_id: `AHS_${result.orderID}`,
                    assigned_user: result.assigned_user || "Unassigned",
                    customerData: result?.customerData,
                }));
            } else {
                const response = await getAllProductsOrdersByEmployee(userData?.id);
                return response.map((result, index) => ({
                    id: index + 1,
                    product_id: result.PID,
                    product_image: result.product_image,
                    service_location: result.location,
                    product_title: result.product_title,
                    category: result.category,
                    service_date: result.service_date,
                    balance_amount: `${result.currency} ${result.balance_amount}`,
                    paid_amount: `${result.currency} ${result.paid_amount}`,
                    total_amount: `${result.currency} ${result.total_amount}`,
                    booked_date: result.checkout_date,
                    info: result,
                    order_id: `AHS_${result.orderID}`,
                    customerData: result?.customerData,
                }));
            }
        } catch (error) {
            console.error('Error mapping rows:', error);
            return []; // Return empty array if there's an error
        }
    };
    const getRows = async () => {
        setLoading(true);
        try {
            const rows = await fetchAndMapRows(normalUser);
            setOrdersData(rows);
            setOrdersDataStatic(rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };



    const monitorEmployeeOrders = (employeeId) => {
        const q = query(collection(db, 'order_employee_allocations'), where('employee_id', '==', employeeId));
        onSnapshot(q, (querySnapshot) => {
            const orders = [];
            getRows();
        }, (error) => {
            console.error('Error monitoring employee orders:', error);
        });
    };

    const monitorAvailability = () => {

        const q = query(collection(db, 'employee_status'), where('status', '==', "Active"));

        onSnapshot(q, (querySnapshot) => {
            getAvailableEmployees().then(response => {
                setAvailableEmployees(response);
            });
        }, (error) => {
            // Handle any errors
            console.error('Error monitoring employee availability:', error);
        });
    };

    useEffect(() => {

        if (normalUser == false) {

            monitorAvailability();
            getAvailableEmployees().then(response => {
                setAvailableEmployees(response);
            });

        }
        else {
            monitorEmployeeOrders(userData?.id);
        }



        getRows();
    }, []);




    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRow([]);
        setSelectedEmployee(null);
    };




    const handleAssignEmployee = (rowData) => {
        // Implement the function to handle the assignment of the employee
        // // console.log("Assigned Employee:", selectedEmployee, "to Row:", selectedRow);
        // handleCloseModal();

        console.log(rowData)
        setSelectedRow(rowData?.info);
        setShowModal(true);

    };

    const employeeOptions = availableEmployees.map((response) => ({
        value: response.id,
        label: response.name
    }));

    // console.log("Employees are", employeeOptions);

    const customStyles = {
        menuPortal: (base) => ({
            ...base,
            zIndex: 99999999999,
        }),
    };

    const [currentFilters, setCurrentFilters] = useState("All")


    const fetchFilteredProducts = () => {
        var arrayData = [];
        if (currentFilters == "All") {
            arrayData = ordersDataStatic
        }
        else {
            arrayData = ordersDataStatic.filter(filterData => filterData?.info?.status == currentFilters)
            // filterData?.info?.status == currentFilters
        }
        setOrdersData(arrayData)
    }

    useEffect(() => {
        fetchFilteredProducts();
    }, [currentFilters]);


    const handleSelect = (key) => {
        setCurrentFilters(key)
    };




    const handleAllocateEmployee = async () => {
        // console.log(selectedEmployee, "Selected Employee Name iss");

        // Show confirmation message
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to assign employees to orders?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            // didOpen: (popup) => {
            //     popup.style.zIndex = '99999999999'; 
            // }
        });

        if (confirmation.isConfirmed) {

            // console.log("Confirmed")

            assignEmployeesToOrders(selectedRow?.checkoutID, selectedEmployee).then(res => {
                getRows();
                handleCloseModal();

                var errorVal = res[0]

                if (errorVal == 400) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: res[1]
                    });
                }
                else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: res[1]
                    });
                }

            }).catch(error => {

                console.error('Error:', error);

                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to assign employees to orders. Please try again later.'
                });

                Swal.hideLoading();
            });
        }
    };





    const columns = useMemo(
        () => [
            {
                accessorKey: 'info',
                header: 'Info',
                enableColumnFilter: false, // Disable filtering for this column
                Cell: ({ cell }) => (
                    <CButton style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }} onClick={() => handleMoreInfoModal(cell.row.original)}>
                        <CIcon icon={cilInfo} className="text-info" size="xl" />
                    </CButton>
                ),
                size: 50, 
                enableSorting: false
            },
            {
                accessorKey: 'order_id',
                header: 'Order ID', size: 100
            },
            {
                accessorKey: 'assigned_user',
                header: 'Assigned User',
                enableSorting: false,
                enableColumnFilter: false, // Disable filtering for this column
                Cell: ({ cell }) => {

                    // console.log(cell.row.original, "Cell Value is")
                    var allocatedUsers = cell?.row?.original?.info?.allocatedUser
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        {(["view assign employee order","delete assign employee order", "assign new employee order"].some(permission => userData?.permissions?.includes(permission))) &&
                            <CButton color="dark" className="position-relative" onClick={() => handleAssignEmployee(cell.row.original)}>
                                Assign Employees
                                <CBadge color="danger" position="top-end" shape="rounded-pill">
                                    {allocatedUsers?.length}
                                </CBadge>
                            </CButton>
                        }


                        </div>
                    )
                },
                enableHiding: true,

                visibleInShowHideMenu: false,
                size: 200 // Adjust the size as needed
            },
            {
                accessorKey: 'product_image',
                header: 'Product Image',
                enableSorting: false,
                enableColumnFilter: false, // Disable filtering for this column
                Cell: ({ cell }) => (
                    <div style={{ width: "120px", height: "100px", borderRadius: "10px", overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <CCardImage
                            src={cell.row.original.product_image?.split(",")[0]?.includes("http") ? cell.row.original.product_image?.split(",")[0] : "https://supplier.aahaas.com/" + cell.row.original.product_image?.split(",")[0]}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    </div>
                ),
                size: 150, // Fixed size for the Product Image column
            },
            { accessorKey: 'product_id', header: 'Product ID', size: 100 }, // Example of fixed size
            { accessorKey: 'product_title', header: 'Name', size: 200 }, // Example of fixed size
            { accessorKey: 'category', header: 'Category', size: 150 }, // Example of fixed size
            { accessorKey: 'service_location', header: 'Service Location', size: 200, }, // Example of fixed size
            { accessorKey: 'service_date', header: 'Service Date', size: 150 }, // Example of fixed size
        ],
        [employeeOptions],
    );

    const table = useMaterialReactTable({
        columns,
        data: ordersData,
        enableGrouping: true,
        initialState: { columnVisibility: { assigned_user: !normalUser } },
        muiTableBodyRowProps: ({ row }) => ({
            sx: rowStyle(row.original), // Apply row style based on the data
        }),

        
        muiTableContainerProps: { sx: { maxHeight: '500px' } },

    enableStickyHeader: true,
    
    });

    const rowStyle = (data) => {
        // console.log(data);

        // if (data?.info?.orderID === lastUpdatedId) {
        //     return {
        //         backgroundColor: '#C6E9FF',
        //         color: '#234962',
        //         fontSize: 18
        //     };
        // }

        if (currentFilters === "All") {
            if (data?.info?.status === "Approved") {
                return {
                    backgroundColor: '#FFEEAF',
                    color: '#372E10',
                    fontSize: 16
                };
            } else if (data?.info?.status === "Completed") {
                return {
                    backgroundColor: '#CEF5D1',
                    color: '#07420c',
                    fontSize: 16
                };
            } else if (data?.info?.status === "Cancel") {
                return {
                    backgroundColor: '#FFD3D3',
                    color: '#9C2525',
                    fontSize: 16
                };
            }
            else {

            }
        }

        return {}; // Default style if none of the conditions match
    };



    const handleDeleteEmployee = async (value, checkoutId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you really want to delete this employee?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                handleEmployeeDeleteFromOrder(value).then(response => {
                    var newDataSet = selectedRow?.allocatedUser?.filter(resFilter => resFilter.allotId !== value);

                    handleDeleteData(selectedRow?.checkoutID, userData?.id)

                    setSelectedRow({
                        ...selectedRow,
                        allocatedUser: newDataSet
                    });

                    getRows();


                    Swal.fire(
                        'Deleted!',
                        'The employee has been deleted.',
                        'success'
                    );
                }).catch(error => {
                    Swal.fire(
                        'Error!',
                        'There was an error deleting the employee.',
                        'error'
                    );
                });
            }
        });
    };






    const [moreOrderModal, setMoreOrderModal] = useState(false)
    const [moreOrderModalCategory, setMoreOrderModalCategory] = useState("")
    const [moreOrderDetails, setMoreOrderDetails] = useState("")
    const [mainDataSet, setMainDataSet] = useState([])



    const [hotelDataSet, setHotelDataSet] = useState([])
    const handleMoreInfoModal = (row) => {

        // console.log(row, "Row Data iss Data set")


        console.log(row?.info, "Info is data value")

        setMoreOrderModalCategory(row?.info.catid)
        if (row?.info.catid == 3) {
            setMoreOrderDetails(row?.info.lifestyle_booking_id)
            setMoreOrderModal(true)
        }
        else if (row?.info.catid == 1) {
            setMoreOrderDetails(row?.info.essential_pre_order_id)
            setMoreOrderModal(true)
        }


        else if (row?.info.catid == 4) {
            setMoreOrderDetails(row?.info.hotel_pre_booking_id)

            setHotelDataSet(row?.info)
            setMoreOrderModal(true)
        }

        else if (row?.info.catid == 5) {
            setMoreOrderDetails(row?.info.booking_id)
            setMoreOrderModal(true)
        }

        setMainDataSet(row)

    }





    return (
        <>

<MoreOrderView
            show={moreOrderModal}
            onHide={() => setMoreOrderModal(false)}
            preID={moreOrderDetails}
            category={moreOrderModalCategory}
            productViewData
            hotelsOrderView={hotelDataSet}
            productViewComponent={<OrderDetails orderid={mainDataSet} orderData={mainDataSet} hideStatus={false} productViewData updatedData={e=>console.log(e)}/>}
        />

        <Modal
            show={showModal}
            onHide={handleCloseModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ zIndex: 1305 }}
        >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Assign Employee
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Select
                        isSearchable={true}
                        options={employeeOptions}
                        value={selectedEmployee}
                        onChange={(selectedOption) => setSelectedEmployee(selectedOption)}
                        menuPortalTarget={document.body}
                        styles={customStyles}
                    />

                    <br></br>

                    {selectedRow?.allocatedUser?.length > 0 ? (
                        <>
                            <CAlert color="info">
                                {selectedRow?.allocatedUser?.length} Employee(s) Already Allocated
                            </CAlert>

                            <CTable>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Delete</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {selectedRow?.allocatedUser?.map((response, index) => (
                                        <CTableRow key={index}>
                                            <CTableDataCell>{response.name}</CTableDataCell>
                                            <CTableDataCell>{response.allotStatus}</CTableDataCell>
                                            <CTableDataCell>
                                            {(["delete assign employee order"].some(permission => userData?.permissions?.includes(permission))) &&
                                                <CButton color="danger" onClick={() => handleDeleteEmployee(response.allotId, response?.checkout_id)} style={{ color: 'white', fontSize: 14 }}>
                                                    Delete   <CIcon icon={cilTrash} />
                                                </CButton>
                                            }
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </>
                    ) : null}





                </Modal.Body>
                <Modal.Footer>
                {(["assign new employee order"].some(permission => userData?.permissions?.includes(permission))) &&
                    <CButton onClick={handleAllocateEmployee} color="dark">Assign Employee</CButton>
                }
                </Modal.Footer>
            </Modal>



            <Tabs
            defaultActiveKey="All"
            id="uncontrolled-tab-example"
            className="mt-4"
            style={{ fontSize: 16 }}
            onSelect={handleSelect}
        >
            <Tab eventKey="All" title={<span className="custom-tab-all">All Orders <span class="badge text-bg-light">{ordersDataStatic.length}</span></span>} />
            <Tab eventKey="CustomerOrdered" title={<span className="custom-tab-pending">Pending <span class="text-white  badge text-bg-secondary">{ordersDataStatic.filter(filterData => filterData?.info?.status == "CustomerOrdered").length}</span></span>} />
            <Tab eventKey="Approved" title={<span className="custom-tab-ongoing">Ongoing <span class=" text-white badge text-bg-warning">{ordersDataStatic.filter(filterData => filterData?.info?.status == "Approved").length}</span></span>} />
            <Tab eventKey="Completed" title={<span className="custom-tab-completed">Completed <span class="text-white  badge text-bg-success">{ordersDataStatic.filter(filterData => filterData?.info?.status == "Completed").length}</span></span>} />
            <Tab eventKey="Cancel" title={<span className="custom-tab-cancel">Cancelled <span class="text-white badge text-bg-danger">{ordersDataStatic.filter(filterData => filterData?.info?.status == "Cancel").length}</span></span>} />
        </Tabs>

        {loading ? (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading orders data...</p>
            </div>
        ) : (
            <MaterialReactTable table={table} />
        )}
    </>
    );
};

export default OrderAllocate;
