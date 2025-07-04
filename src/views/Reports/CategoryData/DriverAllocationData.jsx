import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const DriverAllocationData = ({ dataSet, category }) => {
    const [tableData, setTableData] = useState([]);

    console.log(dataSet,"Data set value data is")

    useEffect(() => {
        console.log('Raw data:', dataSet);
        if (dataSet) {
            const transformedData = dataSet.map(item => ({
                order_id: item.OrderId,
                product_name: item.productName,
                booking_date: item.booking_date,
                service_date: item.service_date,
                service_time: item.pickupTime,
                driver_name: item.driver_name,
                vehicle_type: item.vehicle_type,
                vehicle_number: item.vehicle_number,
            }));
            console.log('Transformed data:', transformedData);
            setTableData(transformedData);
        }
    }, [dataSet]);
    
    useEffect(() => {
        console.log('Table data state:', tableData);
    }, [tableData]);

    const columns = useMemo(() => [
        { accessorKey: 'order_id', header: 'Checkout ID', size: 40 },
        { accessorKey: 'product_name', header: 'Product', size: 200 },
        { accessorKey: 'booking_date', header: 'Booking Date', size: 120 },
        { accessorKey: 'service_date', header: 'Service Date', size: 120 },
        { accessorKey: 'service_time', header: 'Time', size: 200 },
        { accessorKey: 'driver_name', header: 'Driver', size: 200 },
        { accessorKey: 'vehicle_type', header: 'Vehicle Type', size: 120 },
        { accessorKey: 'vehicle_number', header: 'Vehicle Number', size: 120 },
    ], []);

    const csvConfig = useMemo(() => mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
        filename: `${category} Driver Reports`
    }));

    const handleExportRows = useCallback((rows, columns) => {
        const rowData = rows.map(row => {
            const filteredRow = {};
            columns.forEach(column => {
                if (row.original?.hasOwnProperty(column.id)) {
                    filteredRow[column.id] = row?.original[column.id];
                }
            });
            return filteredRow;
        });
        const csv = generateCsv(csvConfig)(rowData);
        download(csvConfig)(csv);
    }, [csvConfig]);

    const handleExportData = useCallback((table) => {
        const rows = table.getPrePaginationRowModel().rows;
        const columns = table.getVisibleLeafColumns();
        handleExportRows(rows, columns);
    }, [handleExportRows]);

    const table = useMaterialReactTable({
        columns,
        data: tableData,
        enableRowSelection: true,
        enableColumnDragging: true,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        state: {},
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
                <Button onClick={() => handleExportData(table)} startIcon={<FileDownloadIcon />}>
                    Export All Data
                </Button>
                {/* <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    onClick={() => handleExportRows(table.getPrePaginationRowModel().rows, table.getVisibleLeafColumns())}
                    startIcon={<FileDownloadIcon />}
                >
                    Export All Rows
                </Button> */}
                <Button
                    disabled={table.getRowModel().rows.length === 0}
                    onClick={() => handleExportRows(table.getRowModel().rows, table.getVisibleLeafColumns())}
                    startIcon={<FileDownloadIcon />}
                >
                    Export Page Rows
                </Button>
                <Button
                    disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                    onClick={() => handleExportRows(table.getSelectedRowModel().rows, table.getVisibleLeafColumns())}
                    startIcon={<FileDownloadIcon />}
                >
                    Export Selected Rows
                </Button>
            </Box>
        ),
    });

    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Driver Allocation Data</strong>
                    </CCardHeader>
                    <CCardBody className='orderCheckoutDiv'>
                        <MaterialReactTable table={table} />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default DriverAllocationData;