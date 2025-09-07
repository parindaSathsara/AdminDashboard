import React, { useMemo, useCallback } from 'react';
import { CCard, CCardBody, CCardHeader, CRow, CCol } from '@coreui/react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import moment from 'moment';

const CartInsightsData = ({ dataSet, category }) => {
  if (!dataSet || dataSet.length === 0) {
    return <h5 style={{ marginTop: 15 }}>No Cart Insights data available</h5>;
  }

  // Mapping of category IDs to names
  const categoryMap = {
    1: 'Essentials',
    2: 'Non-Essentials',
    3: 'Lifestyle',
    4: 'Hotels',
    5: 'Educations',
  };

  const columns = useMemo(() => [
    { accessorKey: 'customer_fname', header: 'Customer Name' },
    { accessorKey: 'contact_number', header: 'Contact Number' },
    { accessorKey: 'customer_email', header: 'Email' },
    {
      accessorKey: 'main_category_id',
      header: 'Category',
      Cell: ({ cell }) => categoryMap[cell.getValue()] || 'Unknown',
    },
    {
      accessorKey: 'cart_added_date',
      header: 'Cart Added Date',
      Cell: ({ cell }) => moment(cell.getValue()).format('YYYY-MM-DD'),
    },
    {
      accessorKey: 'order_preffered_date',
      header: 'Preferred Date',
      Cell: ({ cell }) =>
        cell.getValue() ? moment(cell.getValue()).format('YYYY-MM-DD') : 'N/A',
    },
  ], []);

  const csvConfig = useMemo(() =>
    mkConfig({
      fieldSeparator: ',',
      decimalSeparator: '.',
      useKeysAsHeaders: true,
      filename: 'Cart_Insights_Report',
    }), []
  );

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
            <strong>Cart Insights Report</strong>
            {category && <span style={{ marginLeft: 10 }}>(Category ID: {category})</span>}
          </CCardHeader>
          <CCardBody>
            <MaterialReactTable table={table} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default CartInsightsData;
