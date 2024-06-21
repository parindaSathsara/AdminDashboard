import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'

import { cilFlightTakeoff, cilSortDescending, cilSortAscending, cilInfo } from '@coreui/icons'

function FlightsmainPage() {


    const [flightDetails, setFlightDetails] = useState([{ "PNR_No": "A1B2C3", "Pax_Name": "John Doe", "Airline_Name": "Airways International", "Flights_date_Name": "2024-07-15", "Amount": 450.75, "Status": "Confirmed" }, { "PNR_No": "D4E5F6", "Pax_Name": "Jane Smith", "Airline_Name": "Sky High Airlines", "Flights_date_Name": "2024-07-16", "Amount": 350.50, "Status": "Cancelled" }, { "PNR_No": "G7H8I9", "Pax_Name": "Robert Brown", "Airline_Name": "FlyAway Air", "Flights_date_Name": "2024-07-17", "Amount": 550.00, "Status": "Confirmed" }, { "PNR_No": "J1K2L3", "Pax_Name": "Emily White", "Airline_Name": "Jet Speed Airlines", "Flights_date_Name": "2024-07-18", "Amount": 600.25, "Status": "Pending" }, { "PNR_No": "M4N5O6", "Pax_Name": "Michael Green", "Airline_Name": "Altitude Air", "Flights_date_Name": "2024-07-19", "Amount": 475.50, "Status": "Confirmed" }, { "PNR_No": "P7Q8R9", "Pax_Name": "Linda Blue", "Airline_Name": "Flight Star", "Flights_date_Name": "2024-07-20", "Amount": 420.30, "Status": "Cancelled" }, { "PNR_No": "S1T2U3", "Pax_Name": "Chris Black", "Airline_Name": "Global Wings", "Flights_date_Name": "2024-07-21", "Amount": 300.45, "Status": "Confirmed" }, { "PNR_No": "V4W5X6", "Pax_Name": "Patricia Grey", "Airline_Name": "Aero Express", "Flights_date_Name": "2024-07-22", "Amount": 670.80, "Status": "Pending" }, { "PNR_No": "Y7Z8A1", "Pax_Name": "Daniel Purple", "Airline_Name": "High Flyer", "Flights_date_Name": "2024-07-23", "Amount": 510.20, "Status": "Confirmed" }, { "PNR_No": "B2C3D4", "Pax_Name": "Sara Red", "Airline_Name": "Sky Connect", "Flights_date_Name": "2024-07-24", "Amount": 490.75, "Status": "Cancelled" }, { "PNR_No": "E5F6G7", "Pax_Name": "James Yellow", "Airline_Name": "Air Stream", "Flights_date_Name": "2024-07-25", "Amount": 610.40, "Status": "Confirmed" }, { "PNR_No": "H8I9J1", "Pax_Name": "Mary Orange", "Airline_Name": "Fly Swift", "Flights_date_Name": "2024-07-26", "Amount": 395.60, "Status": "Pending" }, { "PNR_No": "K2L3M4", "Pax_Name": "William Pink", "Airline_Name": "Jet Set", "Flights_date_Name": "2024-07-27", "Amount": 580.50, "Status": "Confirmed" }, { "PNR_No": "N5O6P7", "Pax_Name": "Barbara Brown", "Airline_Name": "Air Connect", "Flights_date_Name": "2024-07-28", "Amount": 455.00, "Status": "Cancelled" }, { "PNR_No": "Q8R9S1", "Pax_Name": "Kevin White", "Airline_Name": "Fast Wings", "Flights_date_Name": "2024-07-29", "Amount": 430.30, "Status": "Confirmed" }, { "PNR_No": "T2U3V4", "Pax_Name": "Nancy Green", "Airline_Name": "Skyline Airways", "Flights_date_Name": "2024-07-30", "Amount": 500.25, "Status": "Pending" }, { "PNR_No": "W5X6Y7", "Pax_Name": "Jeffrey Blue", "Airline_Name": "Air Flow", "Flights_date_Name": "2024-07-31", "Amount": 445.70, "Status": "Confirmed" }, { "PNR_No": "Z8A1B2", "Pax_Name": "Donna Grey", "Airline_Name": "Fly Smart", "Flights_date_Name": "2024-08-01", "Amount": 620.15, "Status": "Cancelled" }, { "PNR_No": "C3D4E5", "Pax_Name": "Matthew Black", "Airline_Name": "Aero Jet", "Flights_date_Name": "2024-08-02", "Amount": 360.60, "Status": "Confirmed" }, { "PNR_No": "F6G7H8", "Pax_Name": "Elizabeth Red", "Airline_Name": "High Sky", "Flights_date_Name": "2024-08-03", "Amount": 515.45, "Status": "Pending" }, { "PNR_No": "A1B2C3", "Pax_Name": "John Doe", "Airline_Name": "Airways International", "Flights_date_Name": "2024-07-15", "Amount": 450.75, "Status": "Confirmed" }, { "PNR_No": "D4E5F6", "Pax_Name": "Jane Smith", "Airline_Name": "Sky High Airlines", "Flights_date_Name": "2024-07-16", "Amount": 350.50, "Status": "Cancelled" }, { "PNR_No": "G7H8I9", "Pax_Name": "Robert Brown", "Airline_Name": "FlyAway Air", "Flights_date_Name": "2024-07-17", "Amount": 550.00, "Status": "Confirmed" }, { "PNR_No": "J1K2L3", "Pax_Name": "Emily White", "Airline_Name": "Jet Speed Airlines", "Flights_date_Name": "2024-07-18", "Amount": 600.25, "Status": "Pending" }, { "PNR_No": "M4N5O6", "Pax_Name": "Michael Green", "Airline_Name": "Altitude Air", "Flights_date_Name": "2024-07-19", "Amount": 475.50, "Status": "Confirmed" }, { "PNR_No": "P7Q8R9", "Pax_Name": "Linda Blue", "Airline_Name": "Flight Star", "Flights_date_Name": "2024-07-20", "Amount": 420.30, "Status": "Cancelled" }, { "PNR_No": "S1T2U3", "Pax_Name": "Chris Black", "Airline_Name": "Global Wings", "Flights_date_Name": "2024-07-21", "Amount": 300.45, "Status": "Confirmed" }, { "PNR_No": "V4W5X6", "Pax_Name": "Patricia Grey", "Airline_Name": "Aero Express", "Flights_date_Name": "2024-07-22", "Amount": 670.80, "Status": "Pending" }, { "PNR_No": "Y7Z8A1", "Pax_Name": "Daniel Purple", "Airline_Name": "High Flyer", "Flights_date_Name": "2024-07-23", "Amount": 510.20, "Status": "Confirmed" }, { "PNR_No": "B2C3D4", "Pax_Name": "Sara Red", "Airline_Name": "Sky Connect", "Flights_date_Name": "2024-07-24", "Amount": 490.75, "Status": "Cancelled" }, { "PNR_No": "E5F6G7", "Pax_Name": "James Yellow", "Airline_Name": "Air Stream", "Flights_date_Name": "2024-07-25", "Amount": 610.40, "Status": "Confirmed" }, { "PNR_No": "H8I9J1", "Pax_Name": "Mary Orange", "Airline_Name": "Fly Swift", "Flights_date_Name": "2024-07-26", "Amount": 395.60, "Status": "Pending" }, { "PNR_No": "K2L3M4", "Pax_Name": "William Pink", "Airline_Name": "Jet Set", "Flights_date_Name": "2024-07-27", "Amount": 580.50, "Status": "Confirmed" }, { "PNR_No": "N5O6P7", "Pax_Name": "Barbara Brown", "Airline_Name": "Air Connect", "Flights_date_Name": "2024-07-28", "Amount": 455.00, "Status": "Cancelled" }, { "PNR_No": "Q8R9S1", "Pax_Name": "Kevin White", "Airline_Name": "Fast Wings", "Flights_date_Name": "2024-07-29", "Amount": 430.30, "Status": "Confirmed" }, { "PNR_No": "T2U3V4", "Pax_Name": "Nancy Green", "Airline_Name": "Skyline Airways", "Flights_date_Name": "2024-07-30", "Amount": 500.25, "Status": "Pending" }, { "PNR_No": "W5X6Y7", "Pax_Name": "Jeffrey Blue", "Airline_Name": "Air Flow", "Flights_date_Name": "2024-07-31", "Amount": 445.70, "Status": "Confirmed" }, { "PNR_No": "Z8A1B2", "Pax_Name": "Donna Grey", "Airline_Name": "Fly Smart", "Flights_date_Name": "2024-08-01", "Amount": 620.15, "Status": "Cancelled" }, { "PNR_No": "C3D4E5", "Pax_Name": "Matthew Black", "Airline_Name": "Aero Jet", "Flights_date_Name": "2024-08-02", "Amount": 360.60, "Status": "Confirmed" }, { "PNR_No": "F6G7H8", "Pax_Name": "Elizabeth Red", "Airline_Name": "High Sky", "Flights_date_Name": "2024-08-03", "Amount": 515.45, "Status": "Pending" }])
    const [flightDetailsCopy, setFlightDetailsCopy] = useState([{ "PNR_No": "A1B2C3", "Pax_Name": "John Doe", "Airline_Name": "Airways International", "Flights_date_Name": "2024-07-15", "Amount": 450.75, "Status": "Confirmed" }, { "PNR_No": "D4E5F6", "Pax_Name": "Jane Smith", "Airline_Name": "Sky High Airlines", "Flights_date_Name": "2024-07-16", "Amount": 350.50, "Status": "Cancelled" }, { "PNR_No": "G7H8I9", "Pax_Name": "Robert Brown", "Airline_Name": "FlyAway Air", "Flights_date_Name": "2024-07-17", "Amount": 550.00, "Status": "Confirmed" }, { "PNR_No": "J1K2L3", "Pax_Name": "Emily White", "Airline_Name": "Jet Speed Airlines", "Flights_date_Name": "2024-07-18", "Amount": 600.25, "Status": "Pending" }, { "PNR_No": "M4N5O6", "Pax_Name": "Michael Green", "Airline_Name": "Altitude Air", "Flights_date_Name": "2024-07-19", "Amount": 475.50, "Status": "Confirmed" }, { "PNR_No": "P7Q8R9", "Pax_Name": "Linda Blue", "Airline_Name": "Flight Star", "Flights_date_Name": "2024-07-20", "Amount": 420.30, "Status": "Cancelled" }, { "PNR_No": "S1T2U3", "Pax_Name": "Chris Black", "Airline_Name": "Global Wings", "Flights_date_Name": "2024-07-21", "Amount": 300.45, "Status": "Confirmed" }, { "PNR_No": "V4W5X6", "Pax_Name": "Patricia Grey", "Airline_Name": "Aero Express", "Flights_date_Name": "2024-07-22", "Amount": 670.80, "Status": "Pending" }, { "PNR_No": "Y7Z8A1", "Pax_Name": "Daniel Purple", "Airline_Name": "High Flyer", "Flights_date_Name": "2024-07-23", "Amount": 510.20, "Status": "Confirmed" }, { "PNR_No": "B2C3D4", "Pax_Name": "Sara Red", "Airline_Name": "Sky Connect", "Flights_date_Name": "2024-07-24", "Amount": 490.75, "Status": "Cancelled" }, { "PNR_No": "E5F6G7", "Pax_Name": "James Yellow", "Airline_Name": "Air Stream", "Flights_date_Name": "2024-07-25", "Amount": 610.40, "Status": "Confirmed" }, { "PNR_No": "H8I9J1", "Pax_Name": "Mary Orange", "Airline_Name": "Fly Swift", "Flights_date_Name": "2024-07-26", "Amount": 395.60, "Status": "Pending" }, { "PNR_No": "K2L3M4", "Pax_Name": "William Pink", "Airline_Name": "Jet Set", "Flights_date_Name": "2024-07-27", "Amount": 580.50, "Status": "Confirmed" }, { "PNR_No": "N5O6P7", "Pax_Name": "Barbara Brown", "Airline_Name": "Air Connect", "Flights_date_Name": "2024-07-28", "Amount": 455.00, "Status": "Cancelled" }, { "PNR_No": "Q8R9S1", "Pax_Name": "Kevin White", "Airline_Name": "Fast Wings", "Flights_date_Name": "2024-07-29", "Amount": 430.30, "Status": "Confirmed" }, { "PNR_No": "T2U3V4", "Pax_Name": "Nancy Green", "Airline_Name": "Skyline Airways", "Flights_date_Name": "2024-07-30", "Amount": 500.25, "Status": "Pending" }, { "PNR_No": "W5X6Y7", "Pax_Name": "Jeffrey Blue", "Airline_Name": "Air Flow", "Flights_date_Name": "2024-07-31", "Amount": 445.70, "Status": "Confirmed" }, { "PNR_No": "Z8A1B2", "Pax_Name": "Donna Grey", "Airline_Name": "Fly Smart", "Flights_date_Name": "2024-08-01", "Amount": 620.15, "Status": "Cancelled" }, { "PNR_No": "C3D4E5", "Pax_Name": "Matthew Black", "Airline_Name": "Aero Jet", "Flights_date_Name": "2024-08-02", "Amount": 360.60, "Status": "Confirmed" }, { "PNR_No": "F6G7H8", "Pax_Name": "Elizabeth Red", "Airline_Name": "High Sky", "Flights_date_Name": "2024-08-03", "Amount": 515.45, "Status": "Pending" }, { "PNR_No": "A1B2C3", "Pax_Name": "John Doe", "Airline_Name": "Airways International", "Flights_date_Name": "2024-07-15", "Amount": 450.75, "Status": "Confirmed" }, { "PNR_No": "D4E5F6", "Pax_Name": "Jane Smith", "Airline_Name": "Sky High Airlines", "Flights_date_Name": "2024-07-16", "Amount": 350.50, "Status": "Cancelled" }, { "PNR_No": "G7H8I9", "Pax_Name": "Robert Brown", "Airline_Name": "FlyAway Air", "Flights_date_Name": "2024-07-17", "Amount": 550.00, "Status": "Confirmed" }, { "PNR_No": "J1K2L3", "Pax_Name": "Emily White", "Airline_Name": "Jet Speed Airlines", "Flights_date_Name": "2024-07-18", "Amount": 600.25, "Status": "Pending" }, { "PNR_No": "M4N5O6", "Pax_Name": "Michael Green", "Airline_Name": "Altitude Air", "Flights_date_Name": "2024-07-19", "Amount": 475.50, "Status": "Confirmed" }, { "PNR_No": "P7Q8R9", "Pax_Name": "Linda Blue", "Airline_Name": "Flight Star", "Flights_date_Name": "2024-07-20", "Amount": 420.30, "Status": "Cancelled" }, { "PNR_No": "S1T2U3", "Pax_Name": "Chris Black", "Airline_Name": "Global Wings", "Flights_date_Name": "2024-07-21", "Amount": 300.45, "Status": "Confirmed" }, { "PNR_No": "V4W5X6", "Pax_Name": "Patricia Grey", "Airline_Name": "Aero Express", "Flights_date_Name": "2024-07-22", "Amount": 670.80, "Status": "Pending" }, { "PNR_No": "Y7Z8A1", "Pax_Name": "Daniel Purple", "Airline_Name": "High Flyer", "Flights_date_Name": "2024-07-23", "Amount": 510.20, "Status": "Confirmed" }, { "PNR_No": "B2C3D4", "Pax_Name": "Sara Red", "Airline_Name": "Sky Connect", "Flights_date_Name": "2024-07-24", "Amount": 490.75, "Status": "Cancelled" }, { "PNR_No": "E5F6G7", "Pax_Name": "James Yellow", "Airline_Name": "Air Stream", "Flights_date_Name": "2024-07-25", "Amount": 610.40, "Status": "Confirmed" }, { "PNR_No": "H8I9J1", "Pax_Name": "Mary Orange", "Airline_Name": "Fly Swift", "Flights_date_Name": "2024-07-26", "Amount": 395.60, "Status": "Pending" }, { "PNR_No": "K2L3M4", "Pax_Name": "William Pink", "Airline_Name": "Jet Set", "Flights_date_Name": "2024-07-27", "Amount": 580.50, "Status": "Confirmed" }, { "PNR_No": "N5O6P7", "Pax_Name": "Barbara Brown", "Airline_Name": "Air Connect", "Flights_date_Name": "2024-07-28", "Amount": 455.00, "Status": "Cancelled" }, { "PNR_No": "Q8R9S1", "Pax_Name": "Kevin White", "Airline_Name": "Fast Wings", "Flights_date_Name": "2024-07-29", "Amount": 430.30, "Status": "Confirmed" }, { "PNR_No": "T2U3V4", "Pax_Name": "Nancy Green", "Airline_Name": "Skyline Airways", "Flights_date_Name": "2024-07-30", "Amount": 500.25, "Status": "Pending" }, { "PNR_No": "W5X6Y7", "Pax_Name": "Jeffrey Blue", "Airline_Name": "Air Flow", "Flights_date_Name": "2024-07-31", "Amount": 445.70, "Status": "Confirmed" }, { "PNR_No": "Z8A1B2", "Pax_Name": "Donna Grey", "Airline_Name": "Fly Smart", "Flights_date_Name": "2024-08-01", "Amount": 620.15, "Status": "Cancelled" }, { "PNR_No": "C3D4E5", "Pax_Name": "Matthew Black", "Airline_Name": "Aero Jet", "Flights_date_Name": "2024-08-02", "Amount": 360.60, "Status": "Confirmed" }, { "PNR_No": "F6G7H8", "Pax_Name": "Elizabeth Red", "Airline_Name": "High Sky", "Flights_date_Name": "2024-08-03", "Amount": 515.45, "Status": "Pending" }])

    const [bookingCounts, setBookingCounts] = useState({
        completed: 0,
        cancelled: 0,
        pending: 0,
        refunded: 0,
        total: 0
    })

    const getBookingCounts = () => {
        let completed = 0;
        let pending = 0;
        let refunds = 0;
        let cancelled = 0;
        flightDetails.map((value) => {
            if (value.Status === 'Confirmed') {
                completed += 1
            } else if (value.Status === 'Pending') {
                pending += 1
            } else if (value.Status === 'Cancelled') {
                cancelled += 1
            } else if (value.Status === 'refunded') {
                refunds += 1
            }
        })
        const dataset = {
            completed : completed,
            pending  : pending ,
            refunds : refunds,
            cancelled : cancelled
        }
        return dataset;
     
    }

    useEffect(() => {
        let result = getBookingCounts();
        setBookingCounts({
            completed: result.completed,
            cancelled: result.cancelled,
            pending: result.pending,
            refunded: result.refunds,
            total: Number(result.completed) + Number(result.cancelled) + Number(result.pending) + Number(result.refunds)
        })
    }, [])

    const [sortedStatus, setSortedStatus] = useState({
        dataSort: false
    })

    const handleSortDate = () => {
        if (sortedStatus.dataSort) {
            let sortedByDate = flightDetails.toSorted((a, b) => { return new Date(a.Flights_date_Name) - new Date(b.Flights_date_Name) })
            setFlightDetailsCopy(sortedByDate)
            setSortedStatus({ ...sortedStatus, dataSort: false })
        } else {
            let sortedByDate = flightDetails.toSorted((a, b) => { return new Date(b.Flights_date_Name) - new Date(a.Flights_date_Name) })
            setFlightDetailsCopy(sortedByDate)
            setSortedStatus({ ...sortedStatus, dataSort: true })
        }
    }

    return (
        <div className='container-fluid p-0 m-0'>

            <h6 className='px-3 py-2 mx-2' style={{ backgroundColor: 'whitesmoke', fontSize: 18, fontWeight: 600, width: 'fit-content', paddingRight: 60 }}>Latest booking list</h6>

            <div className='col-12 mb-4  d-flex justify-content-between'>
                <div className='px-2 py-3 w-100 d-flex align-items-center mx-2 rounded-3' style={{ backgroundColor: 'whitesmoke' }}>
                    <div className='mx-2 p-2 rounded-2' style={{ backgroundColor: 'white', fontSize: 14 }}>
                        <CIcon icon={cilFlightTakeoff} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='p-0 m-0' style={{ fontSize: 10, color: 'gray' }}>Total air booking</h6>
                        <p className='p-0 m-0' style={{ fontSize: 14, fontWeight: 700, color: 'black' }}>{bookingCounts.total}</p>
                    </div>
                </div>
                <div className='px-2 py-3 w-100 d-flex align-items-center mx-2 rounded-3' style={{ backgroundColor: 'whitesmoke' }}>
                    <div className='mx-2 p-2 rounded-2' style={{ backgroundColor: 'white', fontSize: 14 }}>
                        <CIcon icon={cilFlightTakeoff} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='p-0 m-0' style={{ fontSize: 10, color: 'gray' }}>Success</h6>
                        <p className='p-0 m-0' style={{ fontSize: 14, fontWeight: 700, color: 'black' }}>{bookingCounts.completed}</p>
                    </div>
                </div>
                <div className='px-2 py-3 w-100 d-flex align-items-center mx-2 rounded-3' style={{ backgroundColor: 'whitesmoke' }}>
                    <div className='mx-2 p-2 rounded-2' style={{ backgroundColor: 'white', fontSize: 14 }}>
                        <CIcon icon={cilFlightTakeoff} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='p-0 m-0' style={{ fontSize: 10, color: 'gray' }}>Cancelled bookings</h6>
                        <p className='p-0 m-0' style={{ fontSize: 14, fontWeight: 700, color: 'black' }}>{bookingCounts.cancelled}</p>
                    </div>
                </div>
                <div className='px-2 py-3 w-100 d-flex align-items-center mx-2 rounded-3' style={{ backgroundColor: 'whitesmoke' }}>
                    <div className='mx-2 p-2 rounded-2' style={{ backgroundColor: 'white', fontSize: 14 }}>
                        <CIcon icon={cilFlightTakeoff} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='p-0 m-0' style={{ fontSize: 10, color: 'gray' }}>Pending</h6>
                        <p className='p-0 m-0' style={{ fontSize: 14, fontWeight: 700, color: 'black' }}>{bookingCounts.pending}</p>
                    </div>
                </div>
                <div className='px-2 py-3 w-100 d-flex align-items-center mx-2 rounded-3' style={{ backgroundColor: 'whitesmoke' }}>
                    <div className='mx-2 p-2 rounded-2' style={{ backgroundColor: 'white', fontSize: 14 }}>
                        <CIcon icon={cilFlightTakeoff} />
                    </div>
                    <div className='d-flex flex-column'>
                        <h6 className='p-0 m-0' style={{ fontSize: 10, color: 'gray' }}>Refund status</h6>
                        <p className='p-0 m-0' style={{ fontSize: 14, fontWeight: 700, color: 'black' }}>{bookingCounts.refunded}</p>
                    </div>
                </div>
            </div>

            <div className='d-flex p-0'>

                <div className='col-9 rounded-2 mx-2' style={{ backgroundColor: 'whitesmoke', height: '800px', overflowY: 'scroll' }}>
                    <div className='d-flex col-12 justify-content-around align-items-center p-0 mb-2 mt-2 border-bottom' style={{ position: 'sticky', top: '0px' }}>
                        <header className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>PNR No</header>
                        <header className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Pax Name</header>
                        <header className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Airline Name</header>
                        <header className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>
                            {sortedStatus.dataSort ? <CIcon icon={cilSortAscending} size='sm' className='mx-1' onClick={handleSortDate} /> : <CIcon icon={cilSortDescending} size='sm' className='mx-1' onClick={handleSortDate} />}
                            Flights date Name</header>
                        <header className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Amount</header>
                        <header className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Status</header>
                    </div>
                    {
                        flightDetailsCopy.map((value, key) => (
                            <div className='d-flex col-12 justify-content-around p-0 py-2' key={key}>
                                <span className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}><CIcon icon={cilInfo} className="text-info" size="sm" style={{ marginRight: 20 }} />{value.PNR_No}</span>
                                <span className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Pax_Name}</span>
                                <span className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Airline_Name}</span>
                                <span className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Flights_date_Name}</span>
                                <span className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Amount}</span>
                                <span className='w-100 text-center rounded-2 mx-1 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke', color: value.Status === 'Confirmed' ? 'green' : value.Status === "Pending" ? 'gray' : 'red' }}>{value.Status}</span>
                            </div>
                        ))
                    }
                </div>

                <div className='col-3'>

                    <div className='col-12 d-flex flex-column'>

                        <h6 className='p-3 rounded-3' style={{ fontWeight: 700, textTransform: 'capitalize', backgroundColor: 'whitesmoke' }}>Latest cancelled</h6>

                        <div className='col-12 d-flex flex-column align-items-center' style={{ backgroundColor: 'whitesmoke', height: "340px", overflowY: 'scroll', overflowX: 'hidden' }}>
                            <div className='d-flex col-12 justify-content-around p-0  border-bottom' style={{ position: 'sticky', top: '0px' }}>
                                <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>PNR No</header>
                                <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>PAX name</header>
                                <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>Amount</header>
                            </div>
                            {
                                flightDetailsCopy.map((value, key) => (
                                    value.Status === "Cancelled" &&
                                    <div className='d-flex col-12 justify-content-around p-0 py-1' key={key}>
                                        <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.PNR_No}</span>
                                        <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Pax_Name}</span>
                                        <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Amount}</span>
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                    <div className='col-12 d-flex flex-column mt-2'>

                        <h6 className='p-3 rounded-3' style={{ fontWeight: 700, textTransform: 'capitalize', backgroundColor: 'whitesmoke' }}>Reissue status</h6>

                        <div className='col-12 d-flex flex-column align-items-center' style={{ backgroundColor: 'whitesmoke', height: "340px", overflowY: 'scroll', overflowX: 'hidden' }}>
                            <div className='d-flex col-12 justify-content-around p-0  border-bottom' style={{ position: 'sticky', top: '0px' }}>
                                <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>PNR No</header>
                                <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>PAX name</header>
                                <header className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>Amount</header>
                            </div>
                            {
                                flightDetailsCopy.map((value, key) => (
                                    value.Status === "Pending" &&
                                    <div className='d-flex col-12 justify-content-around p-0 py-1' key={key}>
                                        <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.PNR_No}</span>
                                        <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Pax_Name}</span>
                                        <span className='w-100 text-center rounded-2 mx-1 py-1' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.Amount}</span>
                                    </div>
                                ))
                            }
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default FlightsmainPage