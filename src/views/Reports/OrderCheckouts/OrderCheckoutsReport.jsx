import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';

import './OrderCheckoutsReport.css'

const OrderCheckoutsReport = ({ dataSet, category, dateType }) => {
  const [data, setData] = useState([]);
  console.log(dataSet, category, "Data Set Value is")
  useEffect(() => {
    const dataVal = dataSet.map(item => ({
      PID: item?.PID,
      product_title: item?.product_title,
      category_name: item?.catid === 1 ? "Essentials" :
        item?.catid === 2 ? "Non Essentials" :
          item?.catid === 3 ? "Lifestyles" :
            item?.catid === 4 ? "Hotels" :
              item?.catid === 5 ? "Education" : "Flights",
      balance_amount: item?.balance_amount,
      paid_amount: item?.paid_amount,
      total_amount: item?.total_amount,
      currency: item?.currency,
      company_name: item?.company_name,
      service_location: item?.DAddress,
      service_date: item?.service_date,
      status: item?.status === "CustomerOrdered" ? "Pending" : item?.status,
      checkout_date: item?.checkout_date,
      // Add the new status fields from checkoutData
      delivery_status: item?.checkoutData?.delivery_status,
      supplier_status: item?.checkoutData?.supplier_status,
      accounts_status: item?.checkoutData?.accounts_status,
      ...(category === 0 && {
        category_id: item?.catid === 1 ? "Essentials" :
          item?.catid === 2 ? "Non Essentials" :
            item?.catid === 3 ? "Lifestyles" :
              item?.catid === 4 ? "Hotels" :
                item?.catid === 5 ? "Education" : "Flights"
      })
    }));

    setData(dataVal);
  }, [dataSet, category]);

   const columns = useMemo(() => [
    { accessorKey: 'PID', header: 'Product ID', size: 40 },
    { accessorKey: 'category_name', header: 'Category', size: 40 },
    { accessorKey: 'status', header: 'Main Status', size: 40 },
    // Add the new status columns
    { accessorKey: 'delivery_status', header: 'Delivery Status', size: 40 },
    { accessorKey: 'supplier_status', header: 'Supplier Status', size: 40 },
    { accessorKey: 'accounts_status', header: 'Accounts Status', size: 40 },
    { accessorKey: 'product_title', header: 'Product Title', size: 120 },
    { accessorKey: 'currency', header: 'Currency', size: 120 },
    { accessorKey: 'total_amount', header: 'Total Amount', size: 120 },
    { accessorKey: 'balance_amount', header: 'Balance Amount', size: 120 },
    { accessorKey: 'paid_amount', header: 'Paid Amount', size: 120 },
    { accessorKey: 'service_date', header: 'Service Date', size: 120 },
    { accessorKey: 'company_name', header: 'Company Name', size: 120 },
    { accessorKey: 'service_location', header: 'Service Location', size: 220 },
    { accessorKey: 'checkout_date', header: 'Checkout Date', size: 120 },
  ], [category]);

  // const csvConfig = useMemo(() => mkConfig({
  //   fieldSeparator: ',',
  //   decimalSeparator: '.',
  //   useKeysAsHeaders: true,
  // }), []);
      //    const csvConfig = useMemo(() => mkConfig({
      //   fieldSeparator: ',',
      //   decimalSeparator: '.',
      //   useKeysAsHeaders: true,
      //   filename: `${dateType}-Orders Group Wise Reports`
      // }), [category]);

      const csvConfig = useMemo(() => {
  const categoryMap = {
    0: 'all',
    1: 'essential',
    2: 'non-essential',
    3: 'lifestyle',
    4: 'hotel',
    5: 'education'
  };

  const categoryName = categoryMap[category] || 'unknown';

  return mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: `${dateType}-${categoryName}-Orders checkout Reports`
  });
}, [category, dateType]);

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
    data,
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
            <strong>Order Checkout Report</strong>
          </CCardHeader>
          <CCardBody className='orderCheckoutDiv'>
            <MaterialReactTable table={table} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default OrderCheckoutsReport;
