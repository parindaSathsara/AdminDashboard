


import React, { useContext } from 'react'
import MaterialTable from 'material-table';
import { CButton, CCard, CCardBody, CCol, CPopover, CRow } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';
import { CurrencyContext } from 'src/Context/CurrencyContext';
import CurrencyConverter from 'src/Context/CurrencyConverter';


export default function DateWiseSummary(props) {
    console.log("DateWiseSummary", props)
    const customPopoverStyle = {
        '--cui-popover-max-width': '400px',
        '--cui-popover-border-color': '#0F1A36',
        '--cui-popover-header-bg': '#0F1A36',
        '--cui-popover-header-color': 'var(--cui-white)',
        '--cui-popover-body-padding-x': '1rem',
        '--cui-popover-body-padding-y': '.5rem',
    }

    const productData = props?.dataset
    console.log("Product Data is",productData )
    const groupedDates = props?.dates?.sort((a, b) => new Date(a) - new Date(b));


    const QuantityContainer = ({ data }) => {


        // console.log(data, "Data Value is")


        if (data?.category == "Education") {
            return (
                <CCol style={{ width: '320px' }}>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Student Type</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.student_type}</h6></CCol>
                    </CRow>
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

        else if (data?.category == "Essentials/Non Essentials") {
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

        else if (data?.category == "Lifestyles") {
            return (
                <CCol style={{ width: '320px' }}>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Time Slot</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.pickupTime}</h6></CCol>
                    </CRow>
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
        }else if (data?.category == "Hotels") {
            return (
                <CCol style={{ width: '320px' }}>


                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Number of Nights</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.NoOfNights}</h6></CCol>
                    </CRow>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Adult Count</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data.NoOfAdults}</h6></CCol>
                    </CRow>

                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Child Count</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data?.decoded_data.NoOfChild}</h6></CCol>
                    </CRow>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Number of rooms</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data?.decoded_data.NoOfRooms}</h6></CCol>
                    </CRow>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Provider</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data?.decoded_data.Provider}</h6></CCol>
                    </CRow>
                    <CRow>
                        <CCol style={{ flex: 2 }}><h6>Child Count</h6></CCol>
                        <CCol style={{ flex: 0.7, textAlign: 'right' }}><h6>{data?.decoded_data.NoOfChild}</h6></CCol>
                    </CRow>
                </CCol>
            )
        }

    }



    const columns = [
        {

            field: 'view', width: 5, title: '', align: 'left', render: (e) => {
                return (
                    <>
                        <CButton style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }} onClick={() => props.handleMoreInfoModal(e.ext, e.ext.catid)}>
                            <CIcon icon={cilInfo} className="text-info" size="xl" />
                        </CButton>

                    </>
                );
            }

        },


        { title: 'Product ID', field: 'pid' },
        { title: 'Category', field: 'category' },
        { title: 'Product Title', field: 'name' },
        {
            title: 'Extra Details', field: 'ext', render: rowData =>
                <CPopover
                    content={<QuantityContainer data={rowData.ext} />}
                    placement="right"
                    title="Quantity Data"
                    style={customPopoverStyle}
                    trigger="focus"
                >
                    <CButton color="info" style={{ fontSize: 14, color: 'white' }}>View</CButton>
                </CPopover>

        },

        { title: 'Address', field: 'address' },

        { title: 'Total Amount', field: 'total_amount' },
        { title: 'Paid Amount', field: 'paid_amount' },
        { title: 'Balance Amount', field: 'balance_amount' }
    ]


    const { currencyData, setCurrencyData } = useContext(CurrencyContext);


    const getProductData = (date) => {
        return productData?.filter(dateFil => dateFil?.DDate == date)?.map(value => ({
            pid: value?.['PID'],
            name: value?.['PName'],
            ext: value,
            category: value?.['category'],
            address: value?.['DAddress'],
            total_amount: CurrencyConverter(value.currency, value?.['total_amount']),
            paid_amount: CurrencyConverter(value.currency, value?.['paid_amount']),
            balance_amount: CurrencyConverter(value.currency, value?.['balance_amount']),

        }))
    }

    return (
        <>

            {groupedDates?.map(date => {
                const data = getProductData(date);
                return (
                    <div className='py-4' key={date}>
                        <h3 className='title-table'>{date}</h3>
                        <table className="table">
                            <thead className="table-header-orders">
                                <tr>
                                    {columns.map(col => (
                                        <th key={col.field} scope="col" style={{ width: col.width || 'auto', textAlign: col.align || 'left' }}>
                                            {col.title}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, rowIndex) => (
                                    <tr key={row.pid}>
                                        {columns.map(col => (
                                            <td key={col.field} style={{ textAlign: col.align || 'left' }}>
                                                {col.render ? col.render(row) : row[col.field]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <br />
                    </div>
                );
            })}

        </>
    )
}
