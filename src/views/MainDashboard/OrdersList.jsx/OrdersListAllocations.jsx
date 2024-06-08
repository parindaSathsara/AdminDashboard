import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { CCardImage, CButton } from '@coreui/react';
import { getAllProductsOrders } from 'src/service/order_allocation_services';
import { cilInfo } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import Select from 'react-select';


// Function to fetch and map rows
const fetchAndMapRows = async () => {
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
        assigned_user: "Test"
    }));
};

const BasicTable = () => {
    const [ordersData, setOrdersData] = useState([]);

    useEffect(() => {
        const getRows = async () => {
            const rows = await fetchAndMapRows();
            setOrdersData(rows);
        };

        getRows();
    }, []);

    const handleMoreInfoModal = (rowData) => {
        // Implement the function to handle more info modal
        console.log("More info", rowData);
    };


    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    const columns = useMemo(
        () => [
            {
                accessorKey: 'info',
                header: 'Info',
                Cell: ({ cell }) => (
                    <CButton style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }} onClick={() => handleMoreInfoModal(cell.row.original)}>
                        <CIcon icon={cilInfo} className="text-info" size="xl" />
                    </CButton>
                ),
                size: 50, // Fixed size for the Info column
            },
            {
                accessorKey: 'order_id',
                header: 'Order ID', size: 100
            },

            {
                accessorKey: 'assigned_user', header: 'Assigned User',
                Cell: ({ cell }) => (
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={options[0]}
                        name="color"
                        options={options}
                        styles={{
                            container: (provided) => ({
                                ...provided,
                                zIndex: 9999,
                            }),
                        }}
                    />
                ),
                size: 100
            },
            {
                accessorKey: 'product_image',
                header: 'Product Image',
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
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data: ordersData,
    });

    return <MaterialReactTable table={table} />;
};

export default BasicTable;
