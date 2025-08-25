import React, { useMemo, useCallback } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const OrderCheckoutsReport = ({ dataSet, category }) => {
  const columns = [
    { accessorKey: 'order_id', header: 'Order ID' },
    { accessorKey: 'product_count', header: 'Product Count' },
    { accessorKey: 'min_service_date', header: 'Min Service Date' },
    { accessorKey: 'order_date', header: 'Order Date' },
    { accessorKey: 'total_amount', header: 'Total Amount' },
    { accessorKey: 'payment_type', header: 'Payment Type' },
    { accessorKey: 'pay_category', header: 'Pay Category' },
    { accessorKey: 'checkout_status', header: 'Checkout Status' },
    { accessorKey: 'payment_status', header: 'Payment Status' },
  ];

  const csvConfig = useMemo(() => mkConfig({
    fieldSeparator: ',',
    filename: `${category} Order Checkouts Report`,
    useKeysAsHeaders: true,
  }), [category]);

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
    data: dataSet,
    enableRowSelection: true,
    enableColumnDragging: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'bottom',
    enableColumnActions: false,
    state: {},
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: 'flex', gap: '16px', padding: '8px', flexWrap: 'wrap' }}>
        <Button onClick={() => handleExportData(table)} startIcon={<FileDownloadIcon />}>
          Export All Data
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
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody className='orderCheckoutDiv'>
              <MaterialReactTable table={table} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default OrderCheckoutsReport;