


import React from 'react'
import MaterialTable from 'material-table';
import { CButton, CCard, CCardBody, CCol, CPopover, CRow } from '@coreui/react';
import Swal from 'sweetalert2';
import { updateDeliveryStatus,candelOrder } from 'src/service/api_calls';


export default function BookingExperience(props) {

    const customPopoverStyle = {
        '--cui-popover-max-width': '400px',
        '--cui-popover-border-color': '#0F1A36',
        '--cui-popover-header-bg': '#0F1A36',
        '--cui-popover-header-color': 'var(--cui-white)',
        '--cui-popover-body-padding-x': '1rem',
        '--cui-popover-body-padding-y': '.5rem',
    }

    const productData = props.dataset



    const QuantityContainer = ({ data }) => {


        console.log(data, "Data Value is")


        if (data.category == "Education") {
            return (
                <CCol style={{ width: '320px' }}>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Adult Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxAdultOccupancy}</h6></CCol>
                    </CRow>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Child Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxChildOccupancy}</h6></CCol>
                    </CRow>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Total Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.TotalOccupancy}</h6></CCol>
                    </CRow>
                </CCol>
            )
        }

        else if (data.category == "Essentials/Non Essentials") {
            return (
                <CCol style={{ width: '320px' }}>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Quantity</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.Quantity}</h6></CCol>
                    </CRow>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>SKU</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.SKU} {data.Unit}</h6></CCol>
                    </CRow>


                </CCol>
            )
        }

        else if (data.category == "Lifestyles") {
            return (
                <CCol style={{ width: '320px' }}>

                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Adult Count</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.AdultCount}</h6></CCol>
                    </CRow>

                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Child Count</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.ChildCount}</h6></CCol>
                    </CRow>


                    {data.ChildCount > 0 ?
                        <CRow>
                            <CCol style={{ flex: 2 }}><h6>Child Ages</h6></CCol>
                            <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.Age}</h6></CCol>
                        </CRow>
                        :
                        null
                    }



                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Total Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.TotalOccupancy}</h6></CCol>
                    </CRow>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Adult Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxAdultOccupancy}</h6></CCol>
                    </CRow>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Max Child Occupancy</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.MaxChildOccupancy}</h6></CCol>
                    </CRow>






                </CCol>
            )
        }

    }

    const handleDelStatusChange = (e, val) => {
        console.log(e, "Value Data set is 123")
        console.log(val.target.value, "Target Value is")

        var title = ""



        if (val.target.value == "Approved") {
            title = "Do You Want to Confirm This Order"
            Swal.fire({
              title: "Are you sure?",
              text: title,
              icon: "question",
              showCancelButton: true,
              confirmButtonColor: "#2eb85c",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes"
          }).then((result) => {
              console.log(result, "IS Confirmed")

              if (result.isConfirmed) {

                  updateDeliveryStatus(e.checkoutID, val.target.value, "").then(result => {
                      console.log(result)
                      // reload()
                      Swal.fire({
                          title: "Order " + e.checkoutID + " Confirmed",
                          text: "Order - " + e.checkoutID + " Order Confirmed",
                          icon: "success"
                      });
                  })

              }
          });
        }
        else if(val.target.value=="Cancel") {
            title = "Do You Want to Cancel"
            Swal.fire({
              title: title,
              text:"Please Enter the reason for cancel",
              input: "text",
              icon: "question",
              inputAttributes: {
                autocapitalize: "off"
              },
              showCancelButton: true,
              confirmButtonText: "Yes,Cancel",
              cancelButtonText:"No",
              confirmButtonColor: "#d33",
              showLoaderOnConfirm: true,
              preConfirm: async (reason) => {
                try {
                  if (!reason) {
                    return Swal.showValidationMessage(`Reason is required`);
                  }

                  let data={
                    reason:reason,
                    id:e.checkoutID,
                    value:val.target.value,
                  };
                  candelOrder(data);

                } catch (error) {
                  Swal.showValidationMessage(`
                    Request failed: ${error}
                  `);
                }
              },
              allowOutsideClick: () => !Swal.isLoading()
            });
        }
        // props.relord();
    }



    const columns = [
        { title: 'Product ID', field: 'pid' },
        { title: 'Name', field: 'name' },
        {
            title: 'QTY', field: 'qty', render: rowData =>
                <CPopover
                    content={<QuantityContainer data={rowData.qty} />}
                    placement="top"
                    title="Quantity Data"
                    style={customPopoverStyle}
                >
                    <CButton color="success" style={{ fontSize: 14, color: 'white' }}>View</CButton>
                </CPopover>

        },
        { title: 'Date', field: 'date' },
        { title: 'Address', field: 'address' },

        { title: 'Total Amount', field: 'total_amount' },
        { title: 'Paid Amount', field: 'paid_amount' },
        { title: 'Balance Amount', field: 'balance_amount' },

        {
            field: 'status',
            title: 'Order Status',
            align: 'left',
            hidden: props.hideStatus,
            render: (e) => {
                return (
                    <>
                        <select
                            className='form-select required'
                            name='delivery_status'
                            onChange={(value) => handleDelStatusChange(e, value)}
                            value={e.status} // Set the selected value here
                        >
                            <option>Select</option>
                            <option value="Approved" selected={e.qty.status === "Approved" ? true : false} >Confirm Order</option>
                            <option value="Cancel" selected={e.qty.status === "Cancel" ? true : false} >Cancel Order</option>
                        </select>
                    </>
                );
            }
        },
    ]


    const data = productData.map(value => ({
        pid: value?.['PID'],
        name: value?.['PName'],
        qty: value,
        date: value?.['DDate'],
        address: value?.['DAddress'],
        total_amount: value.currency + " " + value?.['total_amount'],
        paid_amount: value.currency + " " + value?.['paid_amount'],
        balance_amount: value.currency + " " + value?.['balance_amount'],
        checkoutID: value?.checkoutID
    }))


    return (
        <>
            <MaterialTable
                title="Booking Experience"
                columns={columns}
                data={data}
                options={{
                    headerStyle: {
                        fontSize: '14px', // Adjust the header font size here
                    },
                    cellStyle: {
                        fontSize: '14px', // Adjust the column font size here
                    },
                    paging: false,
                    search: false,
                    columnsButton: true,
                    exportButton: true,
                }}

            />
        </>
    )
}
