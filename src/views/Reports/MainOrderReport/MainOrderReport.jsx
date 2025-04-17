import React from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';


const OrderCheckoutsReport = ({ dataSet }) => {
  const columns = [
    { accessorKey: 'order_id', header: 'Order ID' },
    { accessorKey: 'product_count', header: 'Product Count' },
    { accessorKey: 'min_service_date', header: 'Min Service Date' },
    { accessorKey: 'order_date', header: 'Order Date' },
    { accessorKey: 'total_amount', header: 'Total Amount' },
    { accessorKey: 'payment_type', header: 'Payment Type' },
    { accessorKey: 'pay_category', header: 'Pay Category' },
    { accessorKey: 'checkout_status', header: 'Checkout Status' },
  ];

  const handleExportData = () => {
    const csvConfig = mkConfig({
      fieldSeparator: ',',
      filename: 'order_checkouts_report',
      useKeysAsHeaders: true,
    });

    const csvData = generateCsv(csvConfig)(dataSet);
    download(csvConfig)(csvData);
  };

  return (
    <div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody className='orderCheckoutDiv'>
              <Button onClick={() => handleExportData(dataSet)} startIcon={<FileDownloadIcon />}>
                Export All Data
              </Button>
              <MaterialReactTable
                columns={columns}
                data={dataSet}
                enableSorting
                enablePagination
                enableColumnFilters
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

    </div>
  );
};

export default OrderCheckoutsReport;
