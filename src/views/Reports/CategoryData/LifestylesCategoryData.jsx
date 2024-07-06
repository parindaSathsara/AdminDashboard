import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { SignalCellularConnectedNoInternet1BarOutlined } from '@material-ui/icons';

const LifestylesCategoryData = ({ data }) => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        // Assuming `data` contains the fetched data from tbl_lifestyle
        const transformedData = data.map(item => ({
            lifestyle_id: item.lifestyle_id,
            lifestyle_city: item.lifestyle_city,
            lifestyle_attraction_type: item.lifestyle_attraction_type,
            lifestyle_name: item.lifestyle_name,
            lifestyle_description: item.lifestyle_description?.slice(0, 50),
            latitude: item.latitude,
            longitude: item.longitude,
            address: item.address,
            micro_location: item.micro_location,
            tripadvisor: item.tripadvisor,
            preferred: item.preferred,
            selling_points: item.selling_points,
            pref_start_date: item.pref_start_date,
            pref_end_date: item.pref_end_date,
            vendor_id: item.vendor_id,
            provider: item.provider,
            provider_id: item.provider_id,
            active_status: item.active_status,
            image: item.image,
            category1: item.category1,
            category2: item.category2,
            category3: item.category3,
            category4: item.category4,
            additional_data_5: item.additional_data_5,
            additional_data_6: item.additional_data_6,
            additional_data_7: item.additional_data_7,
            additional_data_8: item.additional_data_8,
            additional_data_9: item.additional_data_9,
            additional_data_10: item.additional_data_10,
            created_at: item.created_at,
            updated_at: item.updated_at,
            updated_by: item.updated_by,
            markup: item.markup,
            auto_confirmation: item.auto_confirmation,
            triggers: item.triggers
        }));

        setTableData(transformedData);
    }, [data]);

    const columns = useMemo(() => [
        { accessorKey: 'lifestyle_id', header: 'ID', size: 40 },
        { accessorKey: 'lifestyle_city', header: 'City', size: 120 },
        { accessorKey: 'lifestyle_attraction_type', header: 'Attraction Type', size: 120 },
        { accessorKey: 'lifestyle_name', header: 'Name', size: 200 },
        { accessorKey: 'latitude', header: 'Latitude', size: 120 },
        { accessorKey: 'longitude', header: 'Longitude', size: 120 },
        { accessorKey: 'address', header: 'Address', size: 200 },
        { accessorKey: 'micro_location', header: 'Micro Location', size: 200 },
        { accessorKey: 'tripadvisor', header: 'Tripadvisor', size: 120 },
        { accessorKey: 'preferred', header: 'Preferred', size: 120 },
        { accessorKey: 'selling_points', header: 'Selling Points', size: 200 },
        { accessorKey: 'pref_start_date', header: 'Start Date', size: 120 },
        { accessorKey: 'pref_end_date', header: 'End Date', size: 120 },
        { accessorKey: 'vendor_id', header: 'Vendor ID', size: 120 },
        { accessorKey: 'provider', header: 'Provider', size: 120 },
        { accessorKey: 'provider_id', header: 'Provider ID', size: 120 },
        { accessorKey: 'active_status', header: 'Status', size: 80 },
        { accessorKey: 'image', header: 'Image', size: 120 },
        { accessorKey: 'category1', header: 'Category 1', size: 120 },
        { accessorKey: 'category2', header: 'Category 2', size: 120 },
        { accessorKey: 'category3', header: 'Category 3', size: 120 },
        { accessorKey: 'category4', header: 'Category 4', size: 120 },
        { accessorKey: 'additional_data_5', header: 'Additional Data 5', size: 120 },
        { accessorKey: 'additional_data_6', header: 'Additional Data 6', size: 120 },
        { accessorKey: 'additional_data_7', header: 'Additional Data 7', size: 120 },
        { accessorKey: 'additional_data_8', header: 'Additional Data 8', size: 120 },
        { accessorKey: 'additional_data_9', header: 'Additional Data 9', size: 120 },
        { accessorKey: 'additional_data_10', header: 'Additional Data 10', size: 120 },
        { accessorKey: 'created_at', header: 'Created At', size: 120 },
        { accessorKey: 'updated_at', header: 'Updated At', size: 120 },
        { accessorKey: 'updated_by', header: 'Updated By', size: 120 },
        { accessorKey: 'markup', header: 'Markup', size: 120 },
        { accessorKey: 'auto_confirmation', header: 'Auto Confirmation', size: 120 },
        { accessorKey: 'triggers', header: 'Triggers', size: 120 }
    ], []);

    const csvConfig = useMemo(() => mkConfig({
        fieldSeparator: ',',
        decimalSeparator: '.',
        useKeysAsHeaders: true,
    }), []);

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
        state: { columnVisibility: { category_id: true } }, // Assuming default visibility
        renderTopToolbarCustomActions: ({ table }) => (
            <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
                <Button onClick={() => handleExportData(table)} startIcon={<FileDownloadIcon />}>
                    Export All Data
                </Button>
                <Button
                    disabled={table.getPrePaginationRowModel().rows.length === 0}
                    onClick={() => handleExportRows(table.getPrePaginationRowModel().rows, table.getVisibleLeafColumns())}
                    startIcon={<FileDownloadIcon />}
                >
                    Export All Rows
                </Button>
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
                        <strong>Lifestyles Data</strong>
                    </CCardHeader>
                    <CCardBody className='orderCheckoutDiv'>
                        <MaterialReactTable table={table} />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>

    );
};

export default LifestylesCategoryData;
