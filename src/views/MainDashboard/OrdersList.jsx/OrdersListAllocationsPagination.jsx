import React, { useMemo, useState, useEffect, useContext } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CCardImage, CButton, CBadge, CAlert, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react';
import { assignEmployeesToOrders, getAvailableEmployees, handleDeleteData, handleEmployeeDeleteFromOrder } from 'src/service/order_allocation_services';
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
import '../../dashboard/MainComponents/ProductWiseOrders.css';
import axios from "axios"
import HotelsOrderView from 'src/Panels/OrderDetails/MoreOrderView/Categories/HotelsOrderView';

const OrderAllocatePagination = ({ normalUser = false }) => {
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalCount: 0,
    });
    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const { userData, setUserData } = useContext(UserLoginContext);
    const [currentFilter, setCurrentFilter] = useState("All");
    const [moreOrderModal, setMoreOrderModal] = useState(false);
    const [moreOrderModalCategory, setMoreOrderModalCategory] = useState("");
    const [moreOrderDetails, setMoreOrderDetails] = useState("");
    const [mainDataSet, setMainDataSet] = useState([]);
    const [hotelDataSet, setHotelDataSet] = useState([]);


    console.log(hotelDataSet,"HotelsssssssssssssssssssssXXXXXXXXXXXXXXXXXX")
    const [statusCounts, setStatusCounts] = useState({
        All: 0,
        CustomerOrdered: 0,
        Approved: 0,
        Completed: 0,
        Cancel: 0
    });

    const fetchOrdersData = async (pageIndex, pageSize, statusFilter = "All") => {
        setLoading(true);
        try {
            const response = await axios.get('/fetch_all_orders_product_wise_allcation', {
                params: {
                    page: pageIndex + 1,
                    per_page: pageSize,
                    status: statusFilter,
                }
            });

            const data = response.data;
            console.log(data, "Fetched Data");
            
            if (data.status === 200) {
                const mappedData = data.productData.map((result, index) => ({
                    id: (pageIndex * pageSize) + index + 1, // Better ID calculation for pagination
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
                    allocatedUser: result?.allocatedUser || [],
                }));
                
                setOrdersData(mappedData);
                setPagination(prev => ({
                    ...prev,
                    totalCount: data.pagination.total,
                }));
            } else {
                console.error('Error fetching data:', data.error);
                setOrdersData([]);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setOrdersData([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch status counts for all statuses
    const fetchStatusCounts = async () => {
        try {
            const statusTypes = ['All', 'CustomerOrdered', 'Approved', 'Completed', 'Cancel'];
            const counts = { All: 0, CustomerOrdered: 0, Approved: 0, Completed: 0, Cancel: 0 };

            // Fetch count for each status
            for (const status of statusTypes) {
                try {
                    const response = await axios.get('/fetch_all_orders_product_wise_allcation', {
                        params: {
                            page: 1,
                            per_page: 1, // We only need the count
                            status: status,
                        }
                    });
                    
                    if (response.data.status === 200) {
                        counts[status] = response.data?.pagination?.total || 10;
                    }
                } catch (err) {
                    console.error(`Error fetching count for ${status}:`, err);
                }
            }

            setStatusCounts(counts);
        } catch (error) {
            console.error('Error fetching status counts:', error);
        }
    };

    useEffect(() => {
        fetchOrdersData(pagination.pageIndex, pagination.pageSize, currentFilter);
        
        if (!normalUser) {
            monitorAvailability();
            getAvailableEmployees().then(response => {
                setAvailableEmployees(response);
            });
        } else {
            monitorEmployeeOrders(userData?.id);
        }
    }, [pagination.pageIndex, pagination.pageSize, currentFilter]);

    // Fetch status counts on component mount and when filter changes
    useEffect(() => {
        fetchStatusCounts();
    }, []);

    const monitorEmployeeOrders = (employeeId) => {
        const q = query(collection(db, 'order_employee_allocations'), where('employee_id', '==', employeeId));
        onSnapshot(q, () => {
            fetchOrdersData(pagination.pageIndex, pagination.pageSize, currentFilter);
        }, (error) => {
            console.error('Error monitoring employee orders:', error);
        });
    };

    const monitorAvailability = () => {
        const q = query(collection(db, 'employee_status'), where('status', '==', "Active"));
        onSnapshot(q, () => {
            getAvailableEmployees().then(response => {
                setAvailableEmployees(response);
            });
        }, (error) => {
            console.error('Error monitoring employee availability:', error);
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRow([]);
        setSelectedEmployee(null);
    };

    const handleAssignEmployee = (rowData) => {
        setSelectedRow(rowData?.info);
        setShowModal(true);
    };

    const handleAllocateEmployee = async () => {
        const confirmation = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to assign employees to orders?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        });

        if (confirmation.isConfirmed) {
            assignEmployeesToOrders(selectedRow?.checkoutID, selectedEmployee)
                .then(res => {
                    fetchOrdersData(pagination.pageIndex, pagination.pageSize, currentFilter);
                    fetchStatusCounts(); // Refresh counts after assignment
                    handleCloseModal();

                    if (res[0] == 400) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: res[1]
                        });
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: res[1]
                        });
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to assign employees to orders. Please try again later.'
                    });
                });
        }
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
                handleEmployeeDeleteFromOrder(value)
                    .then(() => {
                        const newDataSet = selectedRow?.allocatedUser?.filter(resFilter => resFilter.allotId !== value);
                        setSelectedRow({
                            ...selectedRow,
                            allocatedUser: newDataSet
                        });
                        fetchOrdersData(pagination.pageIndex, pagination.pageSize, currentFilter);
                        fetchStatusCounts(); // Refresh counts after deletion
                        Swal.fire('Deleted!', 'The employee has been deleted.', 'success');
                    })
                    .catch(error => {
                        Swal.fire('Error!', 'There was an error deleting the employee.', 'error');
                    });
            }
        });
    };

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



    const employeeOptions = availableEmployees.map((response) => ({
        value: response.id,
        label: response.name
    }));

    const rowStyle = (data) => {
        if (currentFilter === "All") {
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
            } else if (data?.info?.status === "CustomerOrdered") {
                return {
                    backgroundColor: '#E6F3FF',
                    color: '#0D3A6E',
                    fontSize: 16
                };
            }
        }
        return {};
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'info',
                header: 'Info',
                enableColumnFilter: false,
                Cell: ({ cell }) => (
                    <CButton style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }} 
                            onClick={() => handleMoreInfoModal(cell.row.original)}>
                        <CIcon icon={cilInfo} className="text-info" size="xl" />
                    </CButton>
                ),
                size: 50,
                enableSorting: false
            },
            {
                accessorKey: 'order_id',
                header: 'Order ID',
                size: 100
            },
            {
                accessorKey: 'assigned_user',
                header: 'Assigned User',
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({ cell }) => {
                    const allocatedUsers = cell?.row?.original?.info?.allocatedUser;
                    return (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {(["view assign employee order","delete assign employee order", "assign new employee order"].some(permission => userData?.permissions?.includes(permission))) &&
                                <CButton color="dark" className="position-relative" onClick={() => handleAssignEmployee(cell.row.original)}>
                                    Assign Employees
                                    <CBadge color="danger" position="top-end" shape="rounded-pill">
                                        {allocatedUsers?.length || 0}
                                    </CBadge>
                                </CButton>
                            }
                        </div>
                    );
                },
                enableHiding: true,
                visibleInShowHideMenu: false,
                size: 200
            },
            {
                accessorKey: 'product_image',
                header: 'Product Image',
                enableSorting: false,
                enableColumnFilter: false,
                Cell: ({ cell }) => {
                    const hasProductImage = cell.row.original.product_image && 
                                           cell.row.original.product_image.trim() !== "";
                    const defaultImagePath = "https://play-lh.googleusercontent.com/qoEowqafsAPLEHj5pj-Tfgoj3XuehDt2cEBBe9vvRwyfaaMv3S2SzggQnbAmHx3eB6no=w240-h480-rw";
                    const imageUrl = hasProductImage
                        ? (cell.row.original.product_image?.split(",")[0]?.includes("http") 
                            ? cell.row.original.product_image?.split(",")[0] 
                            : "https://supplier.aahaas.com/" + cell.row.original.product_image?.split(",")[0])
                        : defaultImagePath;
                    
                    return (
                        <div style={{ 
                            width: "120px", 
                            height: "100px", 
                            borderRadius: "10px", 
                            overflow: 'hidden', 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center' 
                        }}>
                            <CCardImage
                                src={imageUrl}
                                style={{ 
                                    width: "100%", 
                                    height: "100%", 
                                    objectFit: "cover" 
                                }}
                                onError={(e) => {
                                    e.target.src = defaultImagePath;
                                }}
                            />
                        </div>
                    );
                },
                size: 150,
            },
            { accessorKey: 'product_id', header: 'Product ID', size: 100 },
            { accessorKey: 'product_title', header: 'Name', size: 200 },
            { accessorKey: 'category', header: 'Category', size: 150 },
            { accessorKey: 'service_location', header: 'Service Location', size: 200 },
            { accessorKey: 'service_date', header: 'Service Date', size: 150 },
            { 
                accessorKey: 'info.status',
                header: 'Status',
                size: 120,
                Cell: ({ cell }) => {
                    const status = cell.getValue();
                    let badgeColor = 'secondary';
                    let displayText = status;
                    
                    if (status === 'Approved') {
                        badgeColor = 'warning';
                        displayText = 'Ongoing';
                    } else if (status === 'Completed') {
                        badgeColor = 'success';
                    } else if (status === 'Cancel') {
                        badgeColor = 'danger';
                        displayText = 'Cancelled';
                    } else if (status === 'CustomerOrdered') {
                        badgeColor = 'info';
                        displayText = 'Pending';
                    }
                    
                    return <CBadge color={badgeColor}>{displayText}</CBadge>;
                }
            },
        ],
        [employeeOptions, userData?.permissions],
    );

    const table = useMaterialReactTable({
        columns,
        data: ordersData,
        enableGrouping: true,
        initialState: { columnVisibility: { assigned_user: !normalUser } },
        muiTableBodyRowProps: ({ row }) => ({
            sx: rowStyle(row.original),
        }),
        muiTableContainerProps: { sx: { maxHeight: '500px' } },
        enableStickyHeader: true,
        manualPagination: true,
        rowCount: pagination.totalCount,
        onPaginationChange: setPagination,
        state: {
            pagination,
        },
    });

    const handleFilterChange = (filter) => {
        setCurrentFilter(filter);
        // Reset to first page when changing filters
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

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
                    // style={{ zIndex: 10000 }} // Add this
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
                        styles={{
                            menuPortal: (base) => ({
                                ...base,
                                zIndex: 99999999999,
                            }),
                        }}
                    />

                    <br></br>

                    {selectedRow?.allocatedUser?.length > 0 && (
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
                                                        Delete <CIcon icon={cilTrash} />
                                                    </CButton>
                                                }
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {(["assign new employee order"].some(permission => userData?.permissions?.includes(permission))) &&
                        <CButton onClick={handleAllocateEmployee} color="dark">Assign Employee</CButton>
                    }
                </Modal.Footer>
            </Modal>

            <Tabs
                defaultActiveKey="All"
                id="orders-status-tabs"
                className="mt-4"
                style={{ fontSize: 16 }}
                onSelect={handleFilterChange}
                activeKey={currentFilter}
            >
                <Tab 
                    eventKey="All" 
                    title={
                        <span className="custom-tab-all">
                            All Orders <span className="badge text-bg-light">{statusCounts.All}</span>
                        </span>
                    } 
                />
                <Tab 
                    eventKey="CustomerOrdered" 
                    title={
                        <span className="custom-tab-pending">
                            Pending <span className="text-white badge text-bg-secondary">{statusCounts.CustomerOrdered}</span>
                        </span>
                    } 
                />
                <Tab 
                    eventKey="Approved" 
                    title={
                        <span className="custom-tab-ongoing">
                            Ongoing <span className="text-white badge text-bg-warning">{statusCounts.Approved}</span>
                        </span>
                    } 
                />
                <Tab 
                    eventKey="Completed" 
                    title={
                        <span className="custom-tab-completed">
                            Completed <span className="text-white badge text-bg-success">{statusCounts.Completed}</span>
                        </span>
                    } 
                />
                <Tab 
                    eventKey="Cancel" 
                    title={
                        <span className="custom-tab-cancel">
                            Cancelled <span className="text-white badge text-bg-danger">{statusCounts.Cancel}</span>
                        </span>
                    } 
                />
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

export default OrderAllocatePagination;