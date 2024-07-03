import React, { useEffect, useState } from 'react';
import './SupDetails.css';
// import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import MaterialTable from 'material-table';

function SupDetails(props) {

    const [toggle, setToggle] = useState(true);

    function generateRandom() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    // console.log(props.dataset?.filter(vendor => vendor.category === "Education" || vendor.category === "Essentials/Non Essentials" || vendor.category === "Lifestyles" || vendor.category === "Lifestyles"), "Dataset value is")


    const data = {
        columns: [
            { field: 'product_title', title: 'Product Title', align: 'left', },
            { field: 'vendor_first_name', title: 'Vendor First Name', align: 'left', },
            { field: 'vendor_last_name', title: 'Vendor Last Name', align: 'left', },
            { field: 'vendor_email', title: 'Vendor Email', align: 'left', },
            { field: 'vendor_address', title: 'Vendor Address', align: 'left', },
            { field: 'vendor_company_name', title: 'Vendor Company Name', align: 'left', },
            { field: 'vendor_phone', title: 'Vendor Phone', align: 'left', },
        ],
        rows: props.dataset?.filter(vendor => vendor.category === "Education" || vendor.category === "Essentials/Non Essentials" || vendor.category === "Lifestyles" || vendor.category === "Lifestyles")?.map((vendor) => {
            return {
                product_title: vendor.product_title,
                vendor_first_name: vendor?.first_name,
                vendor_last_name: vendor?.last_name,
                vendor_email: vendor?.email,
                vendor_address: vendor?.address,
                vendor_company_name: vendor?.company_name,
                vendor_phone: vendor?.phone,
            }
        })
    };

    return (
        <div>
            <div className='confirmation_container '>
                {/* <div className='expand_bar'>
                    <button type='button' className='btn confirm_details_title mx-2 btn_expand btn-sm' id='btn_expand' onClick={() => setToggle(!toggle)} >Supplier Details {toggle == true ? <i class="bi bi-dash-lg"></i> : <i className="bi bi-plus-lg"></i>}</button>
                </div> */}

                {
                    toggle && (

                        <div className="confirmation_table mt-3 mb-2" id='confirmation_table'>


                            <MaterialTable
                                data={data.rows}
                                columns={data.columns}
                                title="Product Details"
                                options={{

                                    sorting: true, search: true,
                                    searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                                    filtering: false, paging: false, pageSize: 3,
                                    paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                                    exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                                    showSelectAllCheckbox: false, showTextRowsSelected: false,
                                    grouping: false, columnsButton: false,
                                    rowStyle: { fontSize: "13px", width: "100%", color: "#000" },
                                    editCellStyle: { width: "100%" },
                                    headerStyle: { fontSize: "14px", backgroundColor: '#D8EFFF' }

                                    // fixedColumns: {
                                    //     left: 6
                                    // }
                                }}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default SupDetails