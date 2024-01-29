import MaterialTable from 'material-table'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import { useEffect, useState } from 'react';
import { getAllFeedbacks, getAllRefundRequests } from 'src/service/api_calls';

function CustomerFeedbacks(props) {


    const defaultMaterialTheme = createTheme();


    const [feedbacks, setFeedbacks] = useState([])

    useEffect(() => {


        getAllFeedbacks(props.orderId).then(res => {
            setFeedbacks(res)
            console.log("Feedbacks are".res)
        })
        // setOrderData(getAllDataUserWise());

    }, []);

    const data = {
        columns: [
            // {
            //     title: '#ID', field: 'id', align: 'center', editable: 'never',
            // },
            {
                title: 'Order Id', field: 'oid', align: 'left', editable: 'never', width: 10
            },
            {
                title: 'Reason for Refund', field: 'reason_refund', align: 'left', editable: 'never',
            },
            {
                title: 'Payment Type', field: 'pay_type', align: 'left', editable: 'never',
            },
            {
                title: 'Refund Amount', field: 'refund_amount', align: 'left', editable: 'never',
            },
            {
                title: 'Actions', field: 'actions', align: 'center', editable: 'never',
            },

        ],
        rows: feedbacks?.map((value, idx) => {
            return {
                // id: value.MainTId,
                oid: value.checkout_id,
                reason_refund: value.reason_for_refund,
                refund_amount: value.total_amount,
                pay_type: value.pay_category,
                actions:
                    <div className='actions_box'>
                        {/* <NavLink to={"/api/view_order_voucher/" + value.OrderId} target='_blank'><i className='bi bi-printer-fill'></i></NavLink> */}
                        <button className="btn btn_actions btnViewAction" onClick={(e) => { handleModalOpen(value.id, value) }}>View Refund</button>
                    </div>
            }
        })
    }

    return (
        <ThemeProvider theme={defaultMaterialTheme}>
            <MaterialTable
                title=""
                // tableRef={tableRef}
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
                    headerStyle: { background: '#001b3f', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                    rowStyle: { fontSize: "15px", width: "100%", color: "#000" },

                    // fixedColumns: {
                    //     left: 6
                    // }
                }}


            />
        </ThemeProvider>
    );
}

export default CustomerFeedbacks;