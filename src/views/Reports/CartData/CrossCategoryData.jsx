// src/views/Reports/CrossCategoryData/CrossCategoryData.js
import React, { useMemo, useCallback } from 'react';
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import moment from 'moment';

const CrossCategoryData = ({ dataSet }) => {
  if (!dataSet || dataSet.length === 0) {
    return <h5 style={{ marginTop: 15 }}>No Cross Category data available</h5>;
  }

  // Category name mapping
  const categoryMap = {
    essentials: 'Essentials',
    'non-essentials': 'Non-Essentials',
    lifestyles: 'Lifestyles',
    educations: 'Educations',
    hotels: 'Hotels',
    flights: 'Flights',
  };

  // Define columns
  const columns = useMemo(() => [
    { accessorKey: 'user_id', header: 'user id' },
    { accessorKey: 'name', header: 'Customer Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'contact', header: 'Contact' },
    // {
    //   accessorKey: 'bookings',
    //   header: 'Bookings',
    //   Cell: ({ cell }) => {
    //     const bookings = cell.getValue();
    //     return Object.keys(bookings).map(cat => {
    //       const items = bookings[cat]
    //         .map(b => `#${b.product_id} (${moment(b.checkout_date).format('YYYY-MM-DD')})`)
    //         .join(', ');

    //       return (
    //         <div key={cat} style={{ marginBottom: '6px' }}>
    //           <strong>{categoryMap[cat] || cat}:</strong> {items}
    //         </div>
    //       );
    //     });
    //   }
    // }
  ], []);

  // CSV config
  const csvConfig = useMemo(() =>
    mkConfig({
      fieldSeparator: ',',
      decimalSeparator: '.',
      useKeysAsHeaders: true,
      filename: 'Cross_Category_Report',
    }), []
  );

  // Export handlers
  const handleExportRows = useCallback((rows, columns) => {
    const rowData = rows.map(row => {
      const filteredRow = {};
      columns.forEach(column => {
        if (row.original?.hasOwnProperty(column.id)) {
          filteredRow[column.id] = row.original[column.id];
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

  // Build table
  const table = useMaterialReactTable({
    columns,
    data: dataSet,
    enableRowSelection: true,
    enableColumnDragging: false,
    columnFilterDisplayMode: 'popover',
    paginationDisplayMode: 'pages',
    enableColumnActions: false,
    positionToolbarAlertBanner: 'bottom',
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
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Cross Category Report</strong>
          </CCardHeader>
          <CCardBody>
            <MaterialReactTable table={table} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CrossCategoryData;
