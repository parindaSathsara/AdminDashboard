import React, { useState, useMemo, useCallback, useEffect } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";

const HotelsCategoryData = ({ data }) => {
  console.log(data, "Hotels Data");
  
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const transformedData = data.map((item) => ({
      id: item.id,
      hotel_name: item.hotel_name,
      hotel_description: item.hotel_description?.replace(/<[^>]*>/g, '').slice(0, 200) + '...',
      star_classification: item.star_classification,
      auto_confirmation: item.auto_confirmation,
      triggers: item.triggers,
      longitude: item.longitude,
      latitude: item.latitude,
      hotel_address: item.hotel_address,
      trip_advisor_link: item.trip_advisor_link,
      hotel_image: item.hotel_image,
      country: item.country,
      city: item.city,
      micro_location: item.micro_location,
      hotel_status: item.hotel_status,
      start_date: item.start_date,
      end_date: item.end_date,
      vendor_id: item.vendor_id,
      updated_by: item.updated_by,
      created_at: item.created_at,
      updated_at: item.updated_at,
      markup: item.markup,
      sub_description: item.sub_description,
    }));

    setTableData(transformedData);
  }, [data]);

  const columns = useMemo(
    () => [
      { accessorKey: "id", header: "ID", size: 50 },
      { accessorKey: "hotel_name", header: "Hotel Name", size: 200 },
      { accessorKey: "hotel_description", header: "Description", size: 300 },
      { accessorKey: "star_classification", header: "Stars", size: 100 },
      { accessorKey: "auto_confirmation", header: "Auto Confirm", size: 100 },
      { accessorKey: "longitude", header: "Longitude", size: 120 },
      { accessorKey: "latitude", header: "Latitude", size: 120 },
      { accessorKey: "hotel_address", header: "Address", size: 200 },
      { accessorKey: "trip_advisor_link", header: "Trip Advisor Link", size: 200 },
      { accessorKey: "hotel_image", header: "Image", size: 150 },
      { accessorKey: "country", header: "Country", size: 100 },
      { accessorKey: "city", header: "City", size: 100 },
      { accessorKey: "micro_location", header: "Micro Location", size: 150 },
      { accessorKey: "hotel_status", header: "Status", size: 80 },
      { accessorKey: "start_date", header: "Start Date", size: 120 },
      { accessorKey: "end_date", header: "End Date", size: 120 },
      { accessorKey: "vendor_id", header: "Vendor ID", size: 80 },
      { accessorKey: "updated_by", header: "Updated By", size: 100 },
      { accessorKey: "created_at", header: "Created At", size: 120 },
      { accessorKey: "updated_at", header: "Updated At", size: 120 },
      { accessorKey: "markup", header: "Markup", size: 80 },
      { accessorKey: "sub_description", header: "Sub Description", size: 200 },
    ],
    []
  );

  // const csvConfig = useMemo(
  //   () =>
  //     mkConfig({
  //       fieldSeparator: ",",
  //       decimalSeparator: ".",
  //       useKeysAsHeaders: true,
  //     }),
  //   []
  // );
      const csvConfig = useMemo(() => mkConfig({
    fieldSeparator: ',',
    decimalSeparator: '.',
    useKeysAsHeaders: true,
    filename: `${"Hotel"}_Products_Report`
  }), [category]);

  const handleExportRows = useCallback(
    (rows, columns) => {
      const rowData = rows.map((row) => {
        const filteredRow = {};
        columns.forEach((column) => {
          if (row.original?.hasOwnProperty(column.id)) {
            filteredRow[column.id] = row?.original[column.id];
          }
        });
        return filteredRow;
      });
      const csv = generateCsv(csvConfig)(rowData);
      download(csvConfig)(csv);
    },
    [csvConfig]
  );

  const handleExportData = useCallback(
    (table) => {
      const rows = table.getPrePaginationRowModel().rows;
      const columns = table.getVisibleLeafColumns();
      handleExportRows(rows, columns);
    },
    [handleExportRows]
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
    enableRowSelection: true,
    enableColumnDragging: true,
    columnFilterDisplayMode: "popover",
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    state: {},
    renderTopToolbarCustomActions: ({ table }) => (
      <Box sx={{ display: "flex", gap: "16px", padding: "8px", flexWrap: "wrap" }}>
        <Button onClick={() => handleExportData(table)} startIcon={<FileDownloadIcon />}>
          Export All Data
        </Button>
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows, table.getVisibleLeafColumns())
          }
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
          onClick={() =>
            handleExportRows(table.getSelectedRowModel().rows, table.getVisibleLeafColumns())
          }
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
            <strong>Hotels Data</strong>
          </CCardHeader>
          <CCardBody className="orderCheckoutDiv">
            <MaterialReactTable table={table} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default HotelsCategoryData;
