import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import moment from 'moment';
import { getAdminNames, getCustomerContact } from 'src/service/api_calls';

const getDateAndtime = (value) => {
    const totalSeconds = value?.seconds + value?.nanoseconds / 1e9 || 0;
    const dateTime = new Date(totalSeconds * 1000);
    return moment(dateTime).format('MM-DD-YYYY');
};

const ChatReportData = ({ dataSet, category }) => {
    console.log(dataSet,category, "Data Set Value is");
    const [data, setData] = useState([]);

    
useEffect(() => {
  const fetchReportData = async () => {
    const allAdminIds = [
      ...new Set(dataSet.flatMap(item => item?.admin_included || []))
    ];
    const adminMap = await getAdminNames(allAdminIds);

    const dataWithContacts = await Promise.all(dataSet.map(async item => {
      let customerContact = null;
      if (item?.customer_id) {
        try {
          customerContact = await getCustomerContact(item.customer_id);
        } catch (error) {
          console.error(`Error fetching contact for customer ID: ${item.customer_id}`, error);
        }
      }

      const adminNames = item.admin_included
        ? item.admin_included.map(id => adminMap[id] || id).join(', ')
        : 'Yet to initiate chat';

      const adminCount = item.admin_included
        ? `${item.admin_included.length} x admin`
        : 'Yet to initiate chat';

      return {
        chat_name: item?.chat_name,
        Customer_name: item?.customer_name,
        Crated_time: getDateAndtime(item?.createdAt),
        Status: item?.status,
        Admin_includes: adminNames,
        Admin_includes_count: adminCount,
        customer_contact: customerContact?.contact_number || 'N/A',
        customer_email: customerContact?.customer_email || 'N/A'
      };
    }));

    setData(dataWithContacts);
  };

  if (dataSet.length > 0) {
    fetchReportData();
  }
}, [dataSet]);


    const columns = useMemo(() => [
        { accessorKey: 'chat_name', header: 'Chat name', size: 40 },
        { accessorKey: 'Customer_name', header: 'Customer name', size: 40 },
        { accessorKey: 'customer_contact', header: 'Contact Number', size: 100 },
        { accessorKey: 'customer_email', header: 'Email Address', size: 100 },
        { accessorKey: 'Crated_time', header: 'Chat created date', size: 120 },
        { accessorKey: 'Status', header: 'Chat status', size: 120 },
        { accessorKey: 'Admin_includes', header: 'Admin includes', size: 120 },
        { accessorKey: 'Admin_includes_count', header: 'Admin includes count', size: 120 }
    ], [category]);

    // const csvConfig = useMemo(() => mkConfig({
    //     fieldSeparator: ',',
    //     decimalSeparator: '.',
    //     useKeysAsHeaders: true,
    // }), []);

        const csvConfig = useMemo(() => {
  const filenamePrefix =
    category == 0 ? 'All Chat Report' :
    category == 1 ? 'Active Chat Report' :
    category == 2 ? 'Deactive Chat Report' :
    'Chat Report';
    console.log(category, "Filename Prefix is");
    console.log(filenamePrefix, "Filename Prefix is");

  return mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: filenamePrefix
  });
}, [category]);


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
        enableColumnDragging: false,
        columnFilterDisplayMode: 'popover',
        paginationDisplayMode: 'pages',
        enableColumnActions: false,
        positionToolbarAlertBanner: 'bottom',
        state: { },
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
                        <strong>Chats Report</strong>
                    </CCardHeader>
                    <CCardBody className='orderCheckoutDiv'>
                        <MaterialReactTable table={table} />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default ChatReportData;
