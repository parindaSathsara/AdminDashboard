import { ThemeProvider, createTheme } from '@mui/material'
import MaterialTable from 'material-table'
import {
    CCol,
    CRow,
    CCard,
    CCardBody
} from '@coreui/react'
import { useEffect, useState } from 'react';
import axios from 'axios'

function ProductAnalytics() {
    const defaultMaterialTheme = createTheme();

    const [details, setDetails] = useState([]);

    const getDetails = async () => {
        try {
            const response = await axios.get('get_product_analytics');
            // console.log(response, 'responseeee');
            if (response.status === 200) {
                setDetails(response.data);
            }
        } catch (error) {
            // console.log(error);
        }
    }
    useEffect(() => {
        getDetails()
    }, [])

    const data = {
        columns: [
            {
                title: 'Name', field: 'name', align: 'center', editable: 'never',
            },
            {
                title: 'Image',
                field: 'image',
                align: 'center',
                editable: 'never',
                render: rowData => <img src={rowData.image} alt="" style={{ width: 100 }} />,
            },
            // { title: 'Image', field: 'image', render: item => <img src={value.product_image} alt="" border="3" height="100" width="100" />},
            {
                title: 'Description', field: 'description', align: 'center', editable: 'never',
            },
            {
                title: 'Extra Details', field: 'extra_details', align: 'center', editable: 'never',
            },
            {
                title: 'Selling Count', field: 'selling_count', align: 'center', editable: 'never'
            },
            {
                title: 'Total Sales', field: 'total_sales', align: 'center', editable: 'never'
            }
        ],
        rows: details.productData?.flatMap((value, idx) => {
            const rows = [];
            if (value) {
                function truncateString(value, maxLength) {
                    return value.slice(0, maxLength - 3) + '...';
                }
                rows.push({
                    name: value.product_title,
                    description: (value.product_description && value.product_description !== '') ? truncateString(value.product_description, 150) : '',
                    image: value.product_image,
                    // extra_details:[ 'Service Location : ' , value.location, ' | ' , 'Service Date : ' ,value.service_date, ' | ' , 'Pick up Time : ' ,value.pickupTime, ' | Course Duration : ' ,value.course_startime , '-', value.course_endtime, ' | ',
                    //                 'Variation : ', value.variant_type1, value.variant_type2, value.variant_type3, value.variant_type4, value.variant_type5]
                    extra_details: [
                        (value.location && value.location !== '') ? 'Service Location : ' + value.location + ' | ' : '',
                        (value.service_date && value.service_date !== '') ? 'Service Date : ' + value.service_date + ' | ' : '',
                        (value.pickupTime && value.pickupTime !== '') ? 'Pick up Time : ' + value.pickupTime + ' | ' : '',
                        (value.course_startime && value.course_startime !== '' && value.course_endtime && value.course_endtime !== '') ? 'Course Duration : ' + value.course_startime + '-' + value.course_endtime + ' | ' : '',
                        (value.variant_type1 && value.variant_type1 !== '') ? 'Variation : ' + value.variant_type1 + ' | ' : '',
                        (value.variant_type2 && value.variant_type2 !== '') ? value.variant_type2 + ' | ' : '',
                        (value.variant_type3 && value.variant_type3 !== '') ? value.variant_type3 + ' | ' : '',
                        (value.variant_type4 && value.variant_type4 !== '') ? value.variant_type4 + ' | ' : '',
                        (value.variant_type5 && value.variant_type5 !== '') ? value.variant_type5 + ' | ' : '',
                    ],
                    selling_count: value.count,
                    total_sales: value.sum

                });
            }
            return rows;
        })

    }
    return (
        <div>

            <CCard className="mb-4">
                <CCardBody>
                    <CRow>
                        <CCol sm={5}>
                            <h4 id="traffic" className="card-title mb-0">
                                Product Analytics
                            </h4>
                        </CCol>

                    </CRow>

                    <ThemeProvider theme={defaultMaterialTheme}>
                        <MaterialTable
                            title=""
                            data={data.rows}
                            columns={data.columns}

                            options={{

                                sorting: true, search: true,
                                searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                                filtering: false, paging: true, pageSizeOptions: [20, 25, 50, 100], pageSize: 10,
                                paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                                exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                                showSelectAllCheckbox: false, showTextRowsSelected: false,
                                grouping: true, columnsButton: true,
                                headerStyle: { background: '#070e1a', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                                rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                            }}


                        />
                    </ThemeProvider>

                </CCardBody>

            </CCard>
        </div>
    )
}

export default ProductAnalytics;