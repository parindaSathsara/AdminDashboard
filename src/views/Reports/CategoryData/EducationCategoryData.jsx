import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { Box, Button } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { mkConfig, generateCsv, download } from 'export-to-csv';
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react';

const EducationCategoryData = ({ data }) => {
    const [tableData, setTableData] = useState([]);

    console.log(data, "Education Data")

    useEffect(() => {
        // Assuming `data` contains the fetched data from edu_tbl_education
        const transformedData = data.map(item => ({
            education_id: item.education_id,
            course_name: item.course_name,
            course_description: item.course_description?.slice(0, 50),
            education_type: item.education_type,
            medium: item.medium,
            course_mode: item.course_mode,
            couse_type: item.couse_type,
            group_type: item.group_type,
            sessions: item.sessions,
            free_session: item.free_session,
            payment_method: item.payment_method,
            status: item.status,
            image_path: item.image_path,
            intro_video_id: item.intro_video_id,
            user_active: item.user_active,
            vendor_id: item.vendor_id,
            category1: item.category1,
            category2: item.category2,
            category3: item.category3,
            category4: item.category4,
            additional_data5: item.additional_data5,
            additional_data6: item.additional_data6,
            additional_data7: item.additional_data7,
            additional_data8: item.additional_data8,
            additional_data9: item.additional_data9,
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
        { accessorKey: 'education_id', header: 'ID', size: 40 },
        { accessorKey: 'course_name', header: 'Course Name', size: 200 },
        { accessorKey: 'course_description', header: 'Description', size: 300 },
        { accessorKey: 'education_type', header: 'Education Type', size: 120 },
        { accessorKey: 'medium', header: 'Medium', size: 120 },
        { accessorKey: 'course_mode', header: 'Course Mode', size: 120 },
        { accessorKey: 'couse_type', header: 'Course Type', size: 120 },
        { accessorKey: 'group_type', header: 'Group Type', size: 120 },
        { accessorKey: 'sessions', header: 'Sessions', size: 120 },
        { accessorKey: 'free_session', header: 'Free Session', size: 120 },
        { accessorKey: 'payment_method', header: 'Payment Method', size: 120 },
        { accessorKey: 'status', header: 'Status', size: 120 },
        { accessorKey: 'image_path', header: 'Image Path', size: 200 },
        { accessorKey: 'intro_video_id', header: 'Intro Video ID', size: 120 },
        { accessorKey: 'user_active', header: 'User Active', size: 120 },
        { accessorKey: 'vendor_id', header: 'Vendor ID', size: 120 },
        { accessorKey: 'category1', header: 'Category 1', size: 120 },
        { accessorKey: 'category2', header: 'Category 2', size: 120 },
        { accessorKey: 'category3', header: 'Category 3', size: 120 },
        { accessorKey: 'category4', header: 'Category 4', size: 120 },
        { accessorKey: 'additional_data5', header: 'Additional Data 5', size: 120 },
        { accessorKey: 'additional_data6', header: 'Additional Data 6', size: 120 },
        { accessorKey: 'additional_data7', header: 'Additional Data 7', size: 120 },
        { accessorKey: 'additional_data8', header: 'Additional Data 8', size: 120 },
        { accessorKey: 'additional_data9', header: 'Additional Data 9', size: 120 },
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
        state: {}, // Add any state configurations as needed
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
                        <strong>Education Data</strong>
                    </CCardHeader>
                    <CCardBody className='orderCheckoutDiv'>
                        <MaterialReactTable table={table} />
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>

    );
};

export default EducationCategoryData;
