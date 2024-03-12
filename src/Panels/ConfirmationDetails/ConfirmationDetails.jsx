import React, { useEffect, useState, useMemo } from 'react';
import './ConfirmationDetails.css';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import { getDashboardOrdersIdWise, updateDeliveryStatus } from '../../service/api_calls';
import MaterialTable from 'material-table';

function ConfirmationDetails(props) {

    console.log(props)

    const [toggle, setToggle] = useState(true);
    const [productData, setProductData] = useState([])

    const [lifestylesData, setLifestylesData] = useState([])
    const [essNEssData, setEssNEssData] = useState([])
    const [hotelData, setHotelData] = useState([])
    const [educationData, setEducationData] = useState([])
    const [flightsData, setFlightsData] = useState([])

    function generateRandom() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    const handleDelStatusChange = (e, val) => {
        console.log(e)


        updateDeliveryStatus(e.id, val.target.value, e.category)

        props.relord();
    }

    useMemo(() => {
        getDashboardOrdersIdWise(props.orderid).then((res) => {
            setProductData(res.dataset)
        })
    }, [])

    useEffect(() => {
        getDashboardOrdersIdWise(props.orderid).then((res) => {
            setProductData(res.dataset)
        })
    }, [])

    const columns = [
        { field: 'id', headerName: 'Id', align: 'left' },
        { field: 'category', headerName: 'Category', align: 'left', },
        { field: 'service_date', headerName: 'Service Dates', align: 'left' },
        // { field: 'order_status', headerName: 'Order Status', align: 'left', },
        { field: 'voucher_status', headerName: 'Voucher Status', align: 'left', },
        { field: 'reconfirm_deadline', headerName: 'Recon.Deadline', align: 'left', },
        { field: 'reconfirm_status', headerName: 'Recon.Status', align: 'left', },
        { field: 'del_mode', headerName: 'Delivery Mode', align: 'left', },
        { field: 'del_contact', headerName: 'Delivery Contact', align: 'left', },
        {
            field: 'del_status', headerName: 'Delivery Status', align: 'left', editable: true, renderEditCell: (e) => {
                return (
                    <>
                        <select className='form-select required' name='delivery_status' onChange={(value) => handleDelStatusChange(e, value)}>

                            <option selected value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                        </select>
                    </>
                )
            }
        },
    ]

    const rows = {
        data: productData?.map((value) => {
            return {
                id: value.MainTId,
                category: value.CategoryType,
                service_date: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.delivery_date : value.CategoryType == 'Lifestyle' ? value.LifeStylePrefDate
                    : value.CategoryType == 'Education' ? 'Days: ' + value.course_day + ', ' + 'Start Time: ' + value.start_time + ', ' + 'End Time: ' + value.end_time
                        : value.CategoryType == 'Hotels' ? 'Check-in: ' + value.HotelCheckin + ' | ' + 'Check-out: ' + value.HotelCheckout : value.flight_id,
                // order_status: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.StatusCheck : value.CategoryType == 'Lifestyle' ? value.LifeStyleBookStatus
                //     : value.CategoryType == 'Education' ? value.StatusCheck : value.CategoryType == 'Hotels' ? value.StatusCheck : value.flight_id,
                voucher_status: '-',
                reconfirm_deadline: '-',
                reconfirm_status: '-',
                del_mode: 'N/A',
                del_contact: value['contact_number'],
                del_status: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.delivery_status : value.CategoryType == 'Lifestyle' ? 'N/A'
                    : value.CategoryType == 'Education' ? value.status : value.CategoryType == 'Hotels' ? value.StatusCheck : value.flight_id,

            }
        })
    }



    const data = {
        columns: [
            // {
            //     title: '#ID', field: 'id', align: 'center', editable: 'never',
            // },
            {
                field: 'id', title: 'Id', align: 'left', cellStyle: { width: "3%" },
                width: "3%",
                headerStyle: { width: "3%" }
            },
            { field: 'category', title: 'Category', align: 'left', },
            { field: 'service_date', title: 'Service Dates', align: 'left' },
            // { field: 'order_status', headerName: 'Order Status', align: 'left', },
            { field: 'voucher_status', title: 'Voucher Status', align: 'left', },
            { field: 'reconfirm_deadline', title: 'Recon.Deadline', align: 'left', },
            { field: 'reconfirm_status', title: 'Recon.Status', align: 'left', },
            { field: 'del_mode', title: 'Delivery Mode', align: 'left', },
            { field: 'del_contact', title: 'Delivery Contact', align: 'left', },
            {
                field: 'del_status', title: 'Delivery Status', align: 'left', render: (e) => {
                    return (
                        <>
                            <select className='form-select required' name='delivery_status' onChange={(value) => handleDelStatusChange(e, value)}>
                                {e.del_status == "Pending" ?
                                    <option value="Pending" selected>Pending</option>
                                    :
                                    <option value="Pending">Pending</option>
                                }
                                {e.del_status == "Confirmed" ?
                                    <option value="Confirmed" selected>Confirmed</option>
                                    :
                                    <option value="Confirmed">Confirmed</option>
                                }
                            </select>
                        </>
                    )
                }
            },

        ],
        rows: props.dataset?.map((value) => {
            return {
                id: value.checkoutID,
                category: value.category,
                service_date: value.service_date,
                // order_status: value.CategoryType == 'Essential' || value.CategoryType == 'Non Essential' ? value.StatusCheck : value.CategoryType == 'Lifestyle' ? value.LifeStyleBookStatus
                //     : value.CategoryType == 'Education' ? value.StatusCheck : value.CategoryType == 'Hotels' ? value.StatusCheck : value.flight_id,
                voucher_status: '-',
                reconfirm_deadline: '-',
                reconfirm_status: '-',
                del_mode: 'N/A',
                del_contact: "",
                del_status: "",

            }
        })
    }

    return (
        <div className='confirmation_container'>
            {/* <div className='expand_bar'>
                <button type='button' className='btn confirm_details_title mx-2 btn_expand btn-sm' id='btn_expand' onClick={() => setToggle(!toggle)} >Confirmation Details {toggle == true ? <i class="bi bi-dash-lg"></i> : <i className="bi bi-plus-lg"></i>}</button>
            </div> */}

            {
                toggle && (

                    <div className="confirmation_table mt-3" id='confirmation_table' style={{ width: "100%" }}>
                        {/* <DataGrid
                        
                            rows={rows.data}
                            columns={columns}
                            encodeHtml={false}
                            getRowClassName={(e) => `type_class-${e.row.del_status}`}
                            getRowId={(row) => generateRandom()}
                            pageSizeOptions={[5]}
                            columnVisibilityModel={{
                                id: false,
                                category: false
                            }}
                            localeText={{
                                toolbarDensityStandard: 'Small',
                            }}
                            rowHeight={40}
                            pinnedColumns={{ right: ['del_status'] }}
                            className='data_grid'
                        // onCellClick={(e) => handleClick(e)}
                        /> */}


                        <MaterialTable
                            data={data.rows}
                            columns={data.columns}
                            // title="Product Details"
                            options={{

                                sorting: true, search: false,
                                searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                                filtering: false, paging: false, pageSize: 3,
                                paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both",
                                exportAllData: false, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                                showSelectAllCheckbox: false, showTextRowsSelected: false,
                                grouping: false, columnsButton: false,
                                rowStyle: { fontSize: "12px", width: "100%", color: "#000" },
                                editCellStyle: { width: "100%" },
                                headerStyle: { fontSize: "13px", backgroundColor: '#D8EFFF' },
                                showTitle: false, exportCsv: false,

                                // fixedColumns: {
                                //     left: 6
                                // }
                            }}
                        />



                    </div>
                )
            }
        </div>
    )
}

export default ConfirmationDetails