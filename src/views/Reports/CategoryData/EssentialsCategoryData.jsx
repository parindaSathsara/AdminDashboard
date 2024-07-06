import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const EssentialsCategoryData = ({ data, category }) => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        // Assuming `data` contains the fetched data from tbl_product_listing
        const transformedData = data.map(item => ({
            id: item.id,
            listing_title: item.listing_title,
            listing_description: item.listing_description?.slice(0, 50),
            sub_description: item.sub_description,
            cash_onDelivery: item.cash_onDelivery,
            discount_status: item.discount_status,
            product_images: item.product_images,
            lisiting_status: item.lisiting_status,
            seo_tags: item.seo_tags,
            seller_id: item.seller_id,
            created_at: item.created_at,
            updated_at: item.updated_at,
            updated_by: item.updated_by,
            sku: item.sku,
            unit: item.unit,
            product_status: item.product_status,
            brand_id: item.brand_id,
            variationStatus: item.variationStatus,
            cancellationDay: item.cancellationDay,
            new_data_2: item.new_data_2,
            new_data_3: item.new_data_3,
            new_data_4: item.new_data_4,
            new_data_5: item.new_data_5,
            new_data_6: item.new_data_6,
            new_data_7: item.new_data_7,
            new_data_8: item.new_data_8,
            terms_conditions: item.terms_conditions?.slice(0, 50),
            refund_policy: item.refund_policy?.slice(0, 50),
            delivery_policy: item.delivery_policy?.slice(0, 50),
            time_to_delivery: item.time_to_delivery,
            auto_confirmation: item.auto_confirmation,
            triggers: item.triggers
        }));

        setTableData(transformedData);
    }, [data]);

    const columns = useMemo(() => [
        { accessorKey: 'id', header: 'ID', size: 40 },
        { accessorKey: 'listing_title', header: 'Title', size: 200 },
        { accessorKey: 'listing_description', header: 'Description', size: 300 },
        { accessorKey: 'sub_description', header: 'Sub Description', size: 300 },
        { accessorKey: 'cash_onDelivery', header: 'Cash on Delivery', size: 120 },
        { accessorKey: 'discount_status', header: 'Discount Status', size: 120 },
        { accessorKey: 'product_images', header: 'Product Images', size: 200 },
        { accessorKey: 'lisiting_status', header: 'Listing Status', size: 120 },
        { accessorKey: 'seo_tags', header: 'SEO Tags', size: 200 },
        { accessorKey: 'seller_id', header: 'Seller ID', size: 120 },
        { accessorKey: 'created_at', header: 'Created At', size: 120 },
        { accessorKey: 'updated_at', header: 'Updated At', size: 120 },
        { accessorKey: 'updated_by', header: 'Updated By', size: 120 },
        { accessorKey: 'sku', header: 'SKU', size: 120 },
        { accessorKey: 'unit', header: 'Unit', size: 120 },
        { accessorKey: 'product_status', header: 'Product Status', size: 120 },
        { accessorKey: 'brand_id', header: 'Brand ID', size: 120 },
        { accessorKey: 'variationStatus', header: 'Variation Status', size: 120 },
        { accessorKey: 'cancellationDay', header: 'Cancellation Day', size: 120 },
        { accessorKey: 'new_data_2', header: 'New Data 2', size: 120 },
        { accessorKey: 'new_data_3', header: 'New Data 3', size: 120 },
        { accessorKey: 'new_data_4', header: 'New Data 4', size: 120 },
        { accessorKey: 'new_data_5', header: 'New Data 5', size: 120 },
        { accessorKey: 'new_data_6', header: 'New Data 6', size: 120 },
        { accessorKey: 'new_data_7', header: 'New Data 7', size: 120 },
        { accessorKey: 'new_data_8', header: 'New Data 8', size: 120 },
        { accessorKey: 'terms_conditions', header: 'Terms & Conditions', size: 300 },
        { accessorKey: 'refund_policy', header: 'Refund Policy', size: 300 },
        { accessorKey: 'delivery_policy', header: 'Delivery Policy', size: 300 },
        { accessorKey: 'time_to_delivery', header: 'Time to Delivery', size: 120 },
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
        state: {}, // Add any state configurations as needed
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
                        <strong>{category == 1 ? "Essentials" : "Non Essentials"} Data</strong>
                    </CCardHeader>
                    <CCardBody className='orderCheckoutDiv'>
                        <MaterialReactTable table={table} />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>

    );
};

export default EssentialsCategoryData;
