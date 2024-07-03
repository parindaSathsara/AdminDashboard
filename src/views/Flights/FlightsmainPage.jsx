import CIcon from '@coreui/icons-react'
import React, { useEffect, useState } from 'react'

import { cilFlightTakeoff, cilSortDescending, cilSortAscending, cilInfo } from '@coreui/icons'
import axios from 'axios'

function FlightsmainPage() {


    const [flightDetails, setFlightDetails] = useState([])
    const [flightDetailsCopy, setFlightDetailsCopy] = useState([])

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
            completed: completed,
            pending: pending,
            refunds: refunds,
            cancelled: cancelled
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
            let sortedByDate = flightDetails.toSorted((a, b) => { return new Date(a.departure_dates) - new Date(b.departure_dates) })
            setFlightDetailsCopy(sortedByDate)
            setSortedStatus({ ...sortedStatus, dataSort: false })
        } else {
            let sortedByDate = flightDetails.toSorted((a, b) => { return new Date(b.departure_dates) - new Date(a.departure_dates) })
            setFlightDetailsCopy(sortedByDate)
            setSortedStatus({ ...sortedStatus, dataSort: true })
        }
    }

    const getFlightBookingDetails = async () => {
        await axios.get('http://192.168.1.23:8000/api/bookings').then((response) => {
            console.log(response);
            setBookingCounts({
                completed: response.data.length,
                cancelled: response.data.length,
                pending: 0,
                refunded: 0,
                total: 0
            })
            setFlightDetails(response.data)
            setFlightDetailsCopy(response.data)
        })
    }

    useEffect(() => {
        getFlightBookingDetails()
    }, [])

    const getAmount = (value) => {
        let result = JSON.parse(value);
        return <p>{result.total_amount} : {result.currency}</p>
    }

    const getCustomerDetails = (value) => {
        let result = JSON.parse(value)
        return (
            <div className='d-flex flex-column align-items-center'>
                <p className='m-0 p-0'>{result.email}</p>
                <p className='m-0 p-0'>{result.contact}</p>
            </div>

        )
    }

    const getPaxDetails = (value) => {
        let result = JSON.parse(value)
        console.log(result);
        return <p> Adult x {result.adultCount}, Childs x {result.childCount}, Infants x {result.infCount}</p>
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

            <div className='d-flex p-0 flex-wrap'>

                <div className='col-12 rounded-2 mx-2' style={{ backgroundColor: 'whitesmoke', height: '800px', overflowY: 'scroll' }}>
                    <div className='d-flex col-12 justify-content-around border-bottom p-0 py-2'>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Order ID</header>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Pax Name</header>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Airline Name</header>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>
                            {sortedStatus.dataSort ? <CIcon icon={cilSortAscending} size='sm' className='mx-1' onClick={handleSortDate} /> : <CIcon icon={cilSortDescending} size='sm' className='mx-1' onClick={handleSortDate} />}
                            Flights date Name</header>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Amount</header>
                        <header className='text-center col-2 rounded-2 py-2' style={{ fontWeight: 600, fontSize: 12, backgroundColor: 'whitesmoke' }}>Pax</header>
                    </div>
                    {
                        flightDetailsCopy.length > 0 &&
                        flightDetailsCopy.map((value, key) => (
                            <div className='d-flex col-12 justify-content-around p-0 py-2' key={key}>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}><CIcon icon={cilInfo} className="text-info" size="sm" style={{ marginRight: 20 }} />{value.order_id}</span>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 10, backgroundColor: 'whitesmoke' }}>{getCustomerDetails(value.contact_details)}</span>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>"Airline_Name"</span>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{value.departure_dates}</span>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{getAmount(value.baseData)}</span>
                                <span className='text-center col-2 rounded-2 py-2' style={{ fontSize: 12, backgroundColor: 'whitesmoke' }}>{getPaxDetails(value.flightCustomerSearch)}</span>
                            </div>
                        ))
                    }
                </div>


                <div className='col-5 mr-auto m-0 p-0 mt-3'>

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

                </div>


                <div className='col-6 ms-auto m-0 p-0 mt-3'>

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
    )
}

export default FlightsmainPage

// {
//     "flightValidData": "{\"trip_type\":\"One Way\",\"flightId\":4,\"refKey\":122,\"maindep_datetime_one\":\"2024-06-27\",\"departure_datetime\":\"2024-06-27,2024-06-28,2024-06-28\",\"arrival_datetime\":\"2024-06-27,2024-06-28,2024-06-28\",\"origin_location\":\"LHR,DEL,BOM\",\"dest_location\":\"DEL,BOM,CMB\",\"passenger_type\":\"ADT\",\"seat_count\":1,\"flight_code\":\"UK,UK,UK\",\"flight_number\":\"18,981,131\",\"main_origin_location\":\"LHR\",\"main_dest_location\":\"CMB\"}",
//     "flightsData": null,
//     "flightCustomerSearch": "{\"trip_type\":\"One Way\",\"dep_date\":\"2024-06-27\",\"from_location\":\"LHR\",\"to_location\":\"CMB\",\"passenger_count\":\"1\",\"seat_count\":1,\"passenger_type\":\"ADT\",\"childCount\":0,\"adultCount\":1,\"infCount\":0,\"cabin_code\":\"Y\"}",
//     "adults": "[{\"gender\":\"Male\",\"title\":\"Mr\",\"type\":\"\",\"firstName\":\"Jsnsnns\",\"lastName\":\"Zbannana\",\"dob\":\"\",\"adultFirstName\":\"Znnsnsnsn\",\"adultLastName\":\"Snsjnsnsns\",\"passportDOB\":\"1996-06-18\",\"passportNo\":\"Tsi7189\",\"expiryDate\":\"2024-06-30\"}]",
//     "childs": "[]",
//     "infants": "[]",
//     "bookingDataSet": "{\"CreatePassengerNameRecordRS\":{\"ApplicationResults\":{\"status\":\"Complete\",\"Success\":[{\"timeStamp\":\"2024-06-18T15:34:22.363Z\"}],\"Warning\":[{\"type\":\"BusinessLogic\",\"timeStamp\":\"2024-06-18T15:34:20.932Z\",\"SystemSpecificResults\":[{\"Message\":[{\"code\":\"WARN.SWS.HOST.ERROR_IN_RESPONSE\",\"content\":\"EndTransactionLLSRQ: VERIFY ORDER OF ITINERARY SEGMENTS - MODIFY OR END TRANSACTION\"}]}]}]},\"ItineraryRef\":{\"ID\":\"OJWAGI\"},\"AirBook\":{\"OriginDestinationOption\":{\"FlightSegment\":[{\"ArrivalDateTime\":\"06-28T10:55\",\"DepartureDateTime\":\"06-27T22:20\",\"eTicket\":true,\"FlightNumber\":\"0018\",\"NumberInParty\":\"001\",\"ResBookDesigCode\":\"Y\",\"Status\":\"NN\",\"DestinationLocation\":{\"LocationCode\":\"DEL\"},\"MarketingAirline\":{\"Code\":\"UK\",\"FlightNumber\":\"0018\"},\"OriginLocation\":{\"LocationCode\":\"LHR\"}},{\"ArrivalDateTime\":\"06-28T15:00\",\"DepartureDateTime\":\"06-28T12:25\",\"eTicket\":true,\"FlightNumber\":\"0131\",\"NumberInParty\":\"001\",\"ResBookDesigCode\":\"Y\",\"Status\":\"NN\",\"DestinationLocation\":{\"LocationCode\":\"CMB\"},\"MarketingAirline\":{\"Code\":\"UK\",\"FlightNumber\":\"0131\"},\"OriginLocation\":{\"LocationCode\":\"BOM\"}},{\"ArrivalDateTime\":\"06-28T23:50\",\"DepartureDateTime\":\"06-28T21:40\",\"eTicket\":true,\"FlightNumber\":\"0981\",\"NumberInParty\":\"001\",\"ResBookDesigCode\":\"Y\",\"Status\":\"NN\",\"DestinationLocation\":{\"LocationCode\":\"BOM\"},\"MarketingAirline\":{\"Code\":\"UK\",\"FlightNumber\":\"0981\"},\"OriginLocation\":{\"LocationCode\":\"DEL\"}}]}},\"AirPrice\":[{\"PriceQuote\":{\"MiscInformation\":{\"BaggageInfo\":{\"SubCodeProperties\":[{\"SolutionSequenceNmbr\":1,\"RPH\":1,\"AncillaryFeeGroupCode\":\"BG\",\"CommercialNameofBaggageItemType\":\"FREE BAGGAGE ALLOWANCE\",\"EMD_Type\":\"4\",\"ExtendedSubCodeKey\":\"0DFAAUK\"},{\"SolutionSequenceNmbr\":1,\"RPH\":2,\"AncillaryFeeGroupCode\":\"BG\",\"AncillaryService\":{\"SubGroupCode\":\"CY\",\"Text\":\"CARRY ON HAND BAGGAGE\"},\"CommercialNameofBaggageItemType\":\"CARRYON HAND BAGGAGE ALLOWANCE\",\"EMD_Type\":\"4\",\"ExtendedSubCodeKey\":\"0LNABUK\"},{\"SolutionSequenceNmbr\":1,\"RPH\":3,\"AncillaryFeeGroupCode\":\"BG\",\"AncillaryService\":{\"SubGroupCode\":\"CY\",\"Text\":\"CARRY ON HAND BAGGAGE\"},\"CommercialNameofBaggageItemType\":\"HAND BAGGAGE 7KG\",\"DescriptionOne\":{\"Code\":\"07\",\"Text\":\"UP TO 15 POUNDS\\/7 KILOGRAMS\"},\"DescriptionTwo\":{\"Code\":\"4U\",\"Text\":\"UP TO 45 LINEAR INCHES\\/115 LINEAR CENTIMETERS\"},\"EMD_Type\":\"4\",\"ExtendedSubCodeKey\":\"0M3ACUK\",\"SizeWeightInfo\":{\"MaximumSizeInAlternate\":{\"Units\":\"C\",\"content\":\"115\"},\"MaximumSize\":{\"Units\":\"I\",\"content\":\"45\"},\"MaximumWeightInAlternate\":{\"Units\":\"K\",\"content\":\"7\"},\"MaximumWeight\":{\"Units\":\"L\",\"content\":\"15\"}}}]},\"HeaderInformation\":[{\"SolutionSequenceNmbr\":\"1\",\"DepartureDate\":\"2024-06-27\",\"Text\":[\"UK HAS NO TICKETING AGREEMENT-CHANGE VALIDATING CARRIER\",\"VALIDATING CARRIER - UK\",\"BAG ALLOWANCE     -LHRDEL-30KG\\/UK\",\"BAG ALLOWANCE     -BOMCMB-30KG\\/UK\",\"BAG ALLOWANCE     -DELBOM-35KG\\/UK\",\"CARRY ON ALLOWANCE\",\"LHRDEL BOMCMB DELBOM-01P\\/07KG\\/UK\",\"01\\/UP TO 15 POUNDS\\/7 KILOGRAMS AND UP TO 45 LINEAR INCHES\\/\",\"115 LINEAR CENTIMETERS\",\"CARRY ON CHARGES\",\"LHRDEL BOMCMB DELBOM-UK\",\"UP TO 15 POUNDS\\/7 KILOGRAMS AND UP TO 45 LINEAR INCHES\\/115\",\"LINEAR CENTIMETERS-LKR0\",\"ADDITIONAL ALLOWANCES AND\\/OR DISCOUNTS MAY APPLY DEPENDING ON\",\"FLYER-SPECIFIC FACTORS \\/E.G. FREQUENT FLYER STATUS\\/MILITARY\\/\",\"CREDIT CARD FORM OF PAYMENT\\/EARLY PURCHASE OVER INTERNET,ETC.\\/\"],\"ValidatingCarrier\":{\"Code\":\"UK\"}}],\"SolutionInformation\":[{\"SolutionSequenceNmbr\":\"1\",\"BaseFareCurrencyCode\":\"GBP\",\"CurrencyCode\":\"LKR\",\"GrandTotalBaseFareAmount\":\"1004000\",\"GrandTotalEquivFareAmount\":\"2565.00\",\"GrandTotalTaxes\":\"64423\",\"RequiresRebook\":\"false\",\"TicketNumber\":\"0\",\"TotalAmount\":\"1068423\"}]},\"PricedItinerary\":{\"AlternativePricing\":\"false\",\"CurrencyCode\":\"LKR\",\"MultiTicket\":false,\"TotalAmount\":\"1068423\",\"AirItineraryPricingInfo\":[{\"SolutionSequenceNmbr\":\"1\",\"BaggageProvisions\":[{\"RPH\":\"1\",\"Associations\":{\"CarrierCode\":[{\"RPH\":1,\"content\":\"UK\"}],\"CountForSegmentAssociatedID\":\"1\",\"DepartureDate\":[{\"RPH\":1,\"content\":\"2024-06-27\"}],\"DestinationLocation\":[{\"LocationCode\":\"DEL\",\"RPH\":1}],\"FlightNumber\":[{\"RPH\":1,\"content\":\"18\"}],\"OriginLocation\":[{\"LocationCode\":\"LHR\",\"RPH\":1}],\"PNR_Segment\":[{\"RPH\":1,\"content\":\"2\"}],\"ResBookDesigCode\":[{\"RPH\":1,\"content\":\"Y\"}],\"StatusCode\":[{\"RPH\":1,\"content\":\"SS\"}]},\"CarrierWhoseBaggageProvisionsApply\":\"UK\",\"ProvisionType\":\"A\",\"SubCodeInfo\":{\"SubCodeForChargesOthers\":\"0DFAAUK\"},\"WeightLimit\":{\"Units\":\"K\",\"content\":\"30\"}},{\"RPH\":\"2\",\"Associations\":{\"CarrierCode\":[{\"RPH\":1,\"content\":\"UK\"}],\"CountForSegmentAssociatedID\":\"1\",\"DepartureDate\":[{\"RPH\":1,\"content\":\"2024-06-28\"}],\"DestinationLocation\":[{\"LocationCode\":\"CMB\",\"RPH\":1}],\"FlightNumber\":[{\"RPH\":1,\"content\":\"131\"}],\"OriginLocation\":[{\"LocationCode\":\"BOM\",\"RPH\":1}],\"PNR_Segment\":[{\"RPH\":1,\"content\":\"4\"}],\"ResBookDesigCode\":[{\"RPH\":1,\"content\":\"Y\"}],\"StatusCode\":[{\"RPH\":1,\"content\":\"SS\"}]},\"CarrierWhoseBaggageProvisionsApply\":\"UK\",\"ProvisionType\":\"A\",\"SubCodeInfo\":{\"SubCodeForChargesOthers\":\"0DFAAUK\"},\"WeightLimit\":{\"Units\":\"K\",\"content\":\"30\"}},{\"RPH\":\"3\",\"Associations\":{\"CarrierCode\":[{\"RPH\":1,\"content\":\"UK\"}],\"CountForSegmentAssociatedID\":\"1\",\"DepartureDate\":[{\"RPH\":1,\"content\":\"2024-06-28\"}],\"DestinationLocation\":[{\"LocationCode\":\"BOM\",\"RPH\":1}],\"FlightNumber\":[{\"RPH\":1,\"content\":\"981\"}],\"OriginLocation\":[{\"LocationCode\":\"DEL\",\"RPH\":1}],\"PNR_Segment\":[{\"RPH\":1,\"content\":\"3\"}],\"ResBookDesigCode\":[{\"RPH\":1,\"content\":\"Y\"}],\"StatusCode\":[{\"RPH\":1,\"content\":\"SS\"}]},\"CarrierWhoseBaggageProvisionsApply\":\"UK\",\"ProvisionType\":\"A\",\"SubCodeInfo\":{\"SubCodeForChargesOthers\":\"0DFAAUK\"},\"WeightLimit\":{\"Units\":\"K\",\"content\":\"35\"}},{\"RPH\":\"4\",\"Associations\":{\"CarrierCode\":[{\"RPH\":1,\"content\":\"UK\"},{\"RPH\":2,\"content\":\"UK\"},{\"RPH\":3,\"content\":\"UK\"}],\"CountForSegmentAssociatedID\":\"3\",\"DepartureDate\":[{\"RPH\":1,\"content\":\"2024-06-27\"},{\"RPH\":2,\"content\":\"2024-06-28\"},{\"RPH\":3,\"content\":\"2024-06-28\"}],\"DestinationLocation\":[{\"LocationCode\":\"DEL\",\"RPH\":1},{\"LocationCode\":\"CMB\",\"RPH\":2},{\"LocationCode\":\"BOM\",\"RPH\":3}],\"FlightNumber\":[{\"RPH\":1,\"content\":\"18\"},{\"RPH\":2,\"content\":\"131\"},{\"RPH\":3,\"content\":\"981\"}],\"OriginLocation\":[{\"LocationCode\":\"LHR\",\"RPH\":1},{\"LocationCode\":\"BOM\",\"RPH\":2},{\"LocationCode\":\"DEL\",\"RPH\":3}],\"PNR_Segment\":[{\"RPH\":1,\"content\":\"2\"},{\"RPH\":2,\"content\":\"4\"},{\"RPH\":3,\"content\":\"3\"}],\"ResBookDesigCode\":[{\"RPH\":1,\"content\":\"Y\"},{\"RPH\":2,\"content\":\"Y\"},{\"RPH\":3,\"content\":\"Y\"}],\"StatusCode\":[{\"RPH\":1,\"content\":\"SS\"},{\"RPH\":2,\"content\":\"SS\"},{\"RPH\":3,\"content\":\"SS\"}]},\"CarrierWhoseBaggageProvisionsApply\":\"UK\",\"NumPiecesBDI\":\"1\",\"NumPiecesITR\":[\"1\"],\"ProvisionType\":\"B\",\"SubCodeInfo\":{\"SubCodeForAllowance\":[{\"RPH\":1,\"content\":\"0M3ACUK\"}],\"SubCodeForChargesOthers\":\"0LNABUK\"},\"WeightLimit\":{\"Units\":\"K\",\"content\":\"7\"}},{\"RPH\":\"5\",\"Associations\":{\"CarrierCode\":[{\"RPH\":1,\"content\":\"UK\"},{\"RPH\":2,\"content\":\"UK\"},{\"RPH\":3,\"content\":\"UK\"}],\"CountForSegmentAssociatedID\":\"3\",\"DepartureDate\":[{\"RPH\":1,\"content\":\"2024-06-27\"},{\"RPH\":2,\"content\":\"2024-06-28\"},{\"RPH\":3,\"content\":\"2024-06-28\"}],\"DestinationLocation\":[{\"LocationCode\":\"DEL\",\"RPH\":1},{\"LocationCode\":\"CMB\",\"RPH\":2},{\"LocationCode\":\"BOM\",\"RPH\":3}],\"FlightNumber\":[{\"RPH\":1,\"content\":\"18\"},{\"RPH\":2,\"content\":\"131\"},{\"RPH\":3,\"content\":\"981\"}],\"OriginLocation\":[{\"LocationCode\":\"LHR\",\"RPH\":1},{\"LocationCode\":\"BOM\",\"RPH\":2},{\"LocationCode\":\"DEL\",\"RPH\":3}],\"PNR_Segment\":[{\"RPH\":1,\"content\":\"2\"},{\"RPH\":2,\"content\":\"4\"},{\"RPH\":3,\"content\":\"3\"}],\"ResBookDesigCode\":[{\"RPH\":1,\"content\":\"Y\"},{\"RPH\":2,\"content\":\"Y\"},{\"RPH\":3,\"content\":\"Y\"}],\"StatusCode\":[{\"RPH\":1,\"content\":\"SS\"},{\"RPH\":2,\"content\":\"SS\"},{\"RPH\":3,\"content\":\"SS\"}]},\"CarrierWhoseBaggageProvisionsApply\":\"UK\",\"Commissionable\":\"N\",\"FeeNotGuaranteedIndicator\":\"N\",\"Interlineable\":\"Y\",\"NoChargeNotAvailableIndicator\":\"F\",\"PassengerType\":{\"Code\":\"ADT\"},\"PriceInformation\":{\"Base\":{\"Amount\":\"0\"},\"Equiv\":{\"CurrencyCode\":\"LKR\"}},\"ProvisionType\":\"CC\",\"RefundReissue\":\"N\",\"SubCodeInfo\":{\"SubCodeForChargesOthers\":\"0M3ACUK\"}}],\"FareCalculation\":{\"Text\":\"LON UK DEL Q137.79 1879.00\\/-BOM UK CMB Q46.00 742.84\\/-DEL UK BOM406.85NUC3212.48END ROE0.798295\"},\"FareCalculationBreakdown\":[{\"Branch\":{\"PCC\":\"Z7B8\",\"FirstJointCarrier\":\"UK\"},\"Departure\":{\"CityCode\":\"LON\",\"AirportCode\":\"LHR\",\"AirlineCode\":\"UK\",\"GenericInd\":\"X\",\"ArrivalCityCode\":\"DEL\",\"ArrivalAirportCode\":\"DEL\"},\"FareBasis\":{\"Code\":\"YLXOGBYV\\/YV\",\"FareAmount\":\"1879.00\",\"FarePassengerType\":\"ADT\",\"FareType\":\"P\",\"FilingCarrier\":\"UK\",\"GlobalInd\":\"EH\",\"TripTypeInd\":\"O\",\"Market\":\"LONDEL\",\"TicketDesignator\":\"YV\",\"Cabin\":\"Y\"},\"FreeBaggageAllowance\":\"KG030\",\"RuleCategoryIndicator\":[\"2\",\"3\",\"4\",\"5\",\"6\",\"7\",\"8\",\"9\",\"10\",\"12\",\"15\",\"16\",\"18\"],\"Surcharges\":[{\"Ind\":\"Q\",\"Type\":\"MIS\",\"content\":\"137.79\"}]},{\"Branch\":{\"PCC\":\"Z7B8\",\"FirstJointCarrier\":\"UK\"},\"Departure\":{\"CityCode\":\"BOM\",\"AirportCode\":\"BOM\",\"AirlineCode\":\"UK\",\"GenericInd\":\"X\",\"ArrivalCityCode\":\"CMB\",\"ArrivalAirportCode\":\"CMB\"},\"FareBasis\":{\"Code\":\"YOINYV\\/YV\",\"FareAmount\":\"742.84\",\"FarePassengerType\":\"ADT\",\"FareType\":\"P\",\"FilingCarrier\":\"UK\",\"GlobalInd\":\"EH\",\"TripTypeInd\":\"O\",\"Market\":\"BOMCMB\",\"TicketDesignator\":\"YV\",\"Cabin\":\"Y\"},\"FreeBaggageAllowance\":\"KG030\",\"RuleCategoryIndicator\":[\"4\",\"5\",\"7\",\"8\",\"9\",\"10\",\"12\",\"15\",\"16\",\"18\"],\"Surcharges\":[{\"Ind\":\"Q\",\"Type\":\"MIS\",\"content\":\"46.00\"}]},{\"Branch\":{\"PCC\":\"Z7B8\",\"FirstJointCarrier\":\"UK\"},\"Departure\":{\"CityCode\":\"DEL\",\"AirportCode\":\"DEL\",\"AirlineCode\":\"UK\",\"GenericInd\":\"O\",\"ArrivalCityCode\":\"BOM\",\"ArrivalAirportCode\":\"BOM\"},\"FareBasis\":{\"Code\":\"YOIATAYF\\/YF\",\"FareAmount\":\"406.85\",\"FarePassengerType\":\"ADT\",\"FareType\":\"P\",\"FilingCarrier\":\"UK\",\"GlobalInd\":\"EH\",\"TripTypeInd\":\"O\",\"Market\":\"DELBOM\",\"TicketDesignator\":\"YF\",\"Cabin\":\"Y\"},\"FreeBaggageAllowance\":\"KG035\",\"RuleCategoryIndicator\":[\"4\",\"5\",\"7\",\"8\",\"9\",\"10\",\"11\",\"12\",\"15\",\"16\",\"18\"]}],\"ItinTotalFare\":{\"NonRefundableInd\":\"O\",\"BaggageInfo\":{\"NonUS_DOT_Disclosure\":{\"Text\":[\"BAG ALLOWANCE     -LHRDEL-30KG\\/UK\",\"BAG ALLOWANCE     -BOMCMB-30KG\\/UK\",\"BAG ALLOWANCE     -DELBOM-35KG\\/UK\",\"CARRY ON ALLOWANCE\",\"LHRDEL BOMCMB DELBOM-01P\\/07KG\\/UK\",\"01\\/UP TO 15 POUNDS\\/7 KILOGRAMS AND UP TO 45 LINEAR INCHES\\/\",\"115 LINEAR CENTIMETERS\",\"CARRY ON CHARGES\",\"LHRDEL BOMCMB DELBOM-UK\",\"UP TO 15 POUNDS\\/7 KILOGRAMS AND UP TO 45 LINEAR INCHES\\/115\",\"LINEAR CENTIMETERS-LKR0\",\"ADDITIONAL ALLOWANCES AND\\/OR DISCOUNTS MAY APPLY DEPENDING ON\",\"FLYER-SPECIFIC FACTORS \\/E.G. FREQUENT FLYER STATUS\\/MILITARY\\/\",\"CREDIT CARD FORM OF PAYMENT\\/EARLY PURCHASE OVER INTERNET,ETC.\\/\"]}},\"BaseFare\":{\"Amount\":\"2565.00\",\"CurrencyCode\":\"GBP\"},\"Construction\":{\"Amount\":\"3212.48\",\"CurrencyCode\":\"NUC\",\"RateOfExchange\":\"0.798295\"},\"Endorsements\":{\"Text\":[\"NON ENDORSABLE\\/NON RE-ROUTABLE\\/REBOOKING SBJCT TO PENALTY\",\"NONEND\\/CHG-XXL-NOSHOW RFR\\/RULE\\/FLEXI FARE 2PC 32KG\\/EACH ELSE 2PC 23KG EACH\",\"NON ENDORSABLE\\/RE-ROUTABLE\\/REBOOKING SBJCT TO PENALTY\"]},\"EquivFare\":{\"Amount\":\"1004000\",\"CurrencyCode\":\"LKR\"},\"Taxes\":{\"TotalAmount\":\"64423\",\"Tax\":[{\"Amount\":\"34442\",\"TaxCode\":\"GB\",\"TaxName\":\"AIR PASSENGER DUTY APD\",\"TicketingTaxCode\":\"GB\"},{\"Amount\":\"19135\",\"TaxCode\":\"UB\",\"TaxName\":\"PASSENGER SERVICE CHARGE DEPAR\",\"TicketingTaxCode\":\"UB\"},{\"Amount\":\"704\",\"TaxCode\":\"WO\",\"TaxName\":\"PASSENGER SERVICE FEE\",\"TicketingTaxCode\":\"WO\"},{\"Amount\":\"1213\",\"TaxCode\":\"IN\",\"TaxName\":\"USER DEVELOPMENT FEE DEPARTURE\",\"TicketingTaxCode\":\"IN\"},{\"Amount\":\"2615\",\"TaxCode\":\"YM\",\"TaxName\":\"DEVELOPMENT FEE\",\"TicketingTaxCode\":\"YM\"},{\"Amount\":\"1073\",\"TaxCode\":\"YRF\",\"TaxName\":\"SERVICE FEE - CARRIER-IMPOSED\",\"TicketingTaxCode\":\"YR\"},{\"Amount\":\"5241\",\"TaxCode\":\"P2\",\"TaxName\":\"AVIATION SECURITY FEE\",\"TicketingTaxCode\":\"P2\"}]},\"TotalFare\":{\"Amount\":\"1068423\",\"CurrencyCode\":\"LKR\"}},\"PassengerTypeQuantity\":{\"Code\":\"ADT\",\"Quantity\":\"1\"},\"PTC_FareBreakdown\":[{\"Cabin\":\"Y\",\"FareBasis\":{\"Code\":\"YLXOGBYV\\/YV\",\"FareAmount\":\"1879.00\",\"FarePassengerType\":\"ADT\",\"FareType\":\"P\",\"FilingCarrier\":\"UK\",\"GlobalInd\":\"EH\",\"Market\":\"LONDEL\",\"TicketDesignator\":\"YV\"},\"FreeBaggageAllowance\":\"KG030\",\"Surcharges\":[{\"Ind\":\"Q\",\"Type\":\"MIS\",\"content\":\"137.79\"}]},{\"Cabin\":\"Y\",\"FareBasis\":{\"Code\":\"YOINYV\\/YV\",\"FareAmount\":\"742.84\",\"FarePassengerType\":\"ADT\",\"FareType\":\"P\",\"FilingCarrier\":\"UK\",\"GlobalInd\":\"EH\",\"Market\":\"BOMCMB\",\"TicketDesignator\":\"YV\"},\"FreeBaggageAllowance\":\"KG030\",\"Surcharges\":[{\"Ind\":\"Q\",\"Type\":\"MIS\",\"content\":\"46.00\"}]},{\"Cabin\":\"Y\",\"FareBasis\":{\"Code\":\"YOIATAYF\\/YF\",\"FareAmount\":\"406.85\",\"FarePassengerType\":\"ADT\",\"FareType\":\"P\",\"FilingCarrier\":\"UK\",\"GlobalInd\":\"EH\",\"Market\":\"DELBOM\",\"TicketDesignator\":\"YF\"},\"FreeBaggageAllowance\":\"KG035\"}]}]}}}],\"TravelItineraryRead\":{\"TravelItinerary\":{\"CustomerInfo\":{\"ContactNumbers\":{\"ContactNumber\":[{\"LocationCode\":\"CMB\",\"Phone\":\"94772897856-H\",\"RPH\":\"001\",\"Id\":\"7\"}]},\"PersonName\":[{\"WithInfant\":\"false\",\"NameNumber\":\"01.01\",\"PassengerType\":\"ADT\",\"RPH\":\"1\",\"elementId\":\"pnr-3.1\",\"Email\":[{\"Id\":\"6\",\"content\":\"PARINDASATHSARA2014@GMAIL.COM\"}],\"GivenName\":\"JSNSNNS\",\"Surname\":\"ZBANNANA\"}]},\"ItineraryInfo\":{\"ItineraryPricing\":{\"PriceQuote\":[{\"RPH\":\"1\",\"MiscInformation\":{\"SignatureLine\":[{\"ExpirationDateTime\":\"00:00\",\"Source\":\"SYS\",\"Status\":\"ACTIVE\",\"Text\":\"Z7B8 Z7B8*AWS 2104\\/18JUN24\"}]},\"PricedItinerary\":[{\"DisplayOnly\":false,\"InputMessage\":\"WPP1ADT\\u00a5RQ\",\"RPH\":\"1\",\"StatusCode\":\"A\",\"TaxExempt\":false,\"ValidatingCarrier\":\"UK\",\"StoredDateTime\":\"2024-06-18T21:04\",\"AirItineraryPricingInfo\":{\"ItinTotalFare\":[{\"BaseFare\":{\"Amount\":\"2565.00\",\"CurrencyCode\":\"GBP\"},\"EquivFare\":{\"Amount\":\"1004000\",\"CurrencyCode\":\"LKR\"},\"Taxes\":{\"Tax\":{\"Amount\":\"64423\",\"TaxCode\":\"XT\"},\"TaxBreakdownCode\":[{\"TaxPaid\":false,\"content\":\"34442GB\"},{\"TaxPaid\":false,\"content\":\"19135UB\"},{\"TaxPaid\":false,\"content\":\"704WO\"},{\"TaxPaid\":false,\"content\":\"1213IN\"},{\"TaxPaid\":false,\"content\":\"2615YM\"},{\"TaxPaid\":false,\"content\":\"1073YR\"},{\"TaxPaid\":false,\"content\":\"5241P2\"}]},\"TotalFare\":{\"Amount\":\"1068423\",\"CurrencyCode\":\"LKR\"},\"Totals\":{\"BaseFare\":{\"Amount\":\"2565.00\"},\"EquivFare\":{\"Amount\":\"1004000\"},\"Taxes\":{\"Tax\":{\"Amount\":\"64423\"}},\"TotalFare\":{\"Amount\":\"1068423\"}}}],\"PassengerTypeQuantity\":[{\"Code\":\"ADT\",\"Quantity\":\"01\"}],\"PTC_FareBreakdown\":[{\"Endorsements\":{\"Endorsement\":[{\"type\":\"PRICING_PARAMETER\",\"Text\":\"WPP1ADT$RQ\"},{\"type\":\"WARNING\",\"Text\":\"UK HAS NO TICKETING AGREEMENT-CHANGE VALIDATING CARRIER\"},{\"type\":\"WARNING\",\"Text\":\"VALIDATING CARRIER - UK\"},{\"type\":\"SYSTEM_ENDORSEMENT\",\"Text\":\"NON ENDORSABLE\\/NON RE-ROUTABLE\\/REBOOKING SBJCT TO PENALTY\"},{\"type\":\"SYSTEM_ENDORSEMENT\",\"Text\":\"NONEND\\/CHG-XXL-NOSHOW RFR\\/RULE\\/FLEXI FARE 2PC 32KG\\/EACH ELSE 2PC 23KG EACH\"},{\"type\":\"SYSTEM_ENDORSEMENT\",\"Text\":\"NON ENDORSABLE\\/RE-ROUTABLE\\/REBOOKING SBJCT TO PENALTY\"}]},\"FareBasis\":[{\"Code\":\"YLXOGBYV\\/YV\\/YOINYV\\/YV\\/YOIATAYF\\/YF\"}],\"FareCalculation\":{\"Text\":[\"LON UK DEL Q137.79 1879.00\\/-BOM UK CMB Q46.00 742.84\\/-DEL UK BOM406.85NUC3212.48END ROE0.798295\"]},\"FareSource\":\"ATPC\",\"FlightSegment\":[{\"ConnectionInd\":\"O\",\"DepartureDateTime\":\"06-27T22:20\",\"FlightNumber\":\"18\",\"ResBookDesigCode\":\"Y\",\"SegmentNumber\":\"1\",\"Status\":\"OK\",\"BaggageAllowance\":{\"Number\":\"30K\"},\"FareBasis\":{\"Code\":\"YLXOGBYV\\/YV\"},\"MarketingAirline\":{\"Code\":\"UK\",\"FlightNumber\":\"18\"},\"OriginLocation\":{\"LocationCode\":\"LHR\"},\"ValidityDates\":{\"NotValidAfter\":\"2024-06-27\",\"NotValidBefore\":\"2024-06-27\"}},{\"SegmentNumber\":\"2\",\"FareBasis\":{\"Code\":\"VOID\"},\"OriginLocation\":{\"LocationCode\":\"DEL\"}},{\"ConnectionInd\":\"X\",\"DepartureDateTime\":\"06-28T12:25\",\"FlightNumber\":\"131\",\"ResBookDesigCode\":\"Y\",\"SegmentNumber\":\"2\",\"Status\":\"OK\",\"BaggageAllowance\":{\"Number\":\"30K\"},\"FareBasis\":{\"Code\":\"YOINYV\\/YV\"},\"MarketingAirline\":{\"Code\":\"UK\",\"FlightNumber\":\"131\"},\"OriginLocation\":{\"LocationCode\":\"BOM\"},\"ValidityDates\":{\"NotValidAfter\":\"2024-06-28\",\"NotValidBefore\":\"2024-06-28\"}},{\"SegmentNumber\":\"4\",\"FareBasis\":{\"Code\":\"VOID\"},\"OriginLocation\":{\"LocationCode\":\"CMB\"}},{\"ConnectionInd\":\"X\",\"DepartureDateTime\":\"06-28T21:40\",\"FlightNumber\":\"981\",\"ResBookDesigCode\":\"Y\",\"SegmentNumber\":\"3\",\"Status\":\"OK\",\"BaggageAllowance\":{\"Number\":\"35K\"},\"FareBasis\":{\"Code\":\"YOIATAYF\\/YF\"},\"MarketingAirline\":{\"Code\":\"UK\",\"FlightNumber\":\"981\"},\"OriginLocation\":{\"LocationCode\":\"DEL\"},\"ValidityDates\":{\"NotValidAfter\":\"2025-06-27\"}},{\"OriginLocation\":{\"LocationCode\":\"BOM\"}}],\"FareComponent\":[{\"FareBasisCode\":\"YLXOGBYV\\/YV\",\"FareDirectionality\":\"FROM\",\"Amount\":\"187900\",\"TicketDesignator\":\"YV\",\"GoverningCarrier\":\"UK\",\"FareComponentNumber\":\"1\",\"Location\":{\"Origin\":\"LON\",\"Destination\":\"DEL\"},\"Dates\":{\"DepartureDateTime\":\"06-27T22:20\",\"ArrivalDateTime\":\"06-28T10:55\"},\"FlightSegmentNumbers\":{\"FlightSegmentNumber\":[\"1\"]}},{\"FareBasisCode\":\"YOINYV\\/YV\",\"FareDirectionality\":\"FROM\",\"Amount\":\"74284\",\"TicketDesignator\":\"YV\",\"GoverningCarrier\":\"UK\",\"FareComponentNumber\":\"2\",\"Location\":{\"Origin\":\"BOM\",\"Destination\":\"CMB\"},\"Dates\":{\"DepartureDateTime\":\"06-28T12:25\",\"ArrivalDateTime\":\"06-28T15:00\"},\"FlightSegmentNumbers\":{\"FlightSegmentNumber\":[\"2\"]}},{\"FareBasisCode\":\"YOIATAYF\\/YF\",\"FareDirectionality\":\"FROM\",\"Amount\":\"40685\",\"TicketDesignator\":\"YF\",\"GoverningCarrier\":\"UK\",\"FareComponentNumber\":\"3\",\"Location\":{\"Origin\":\"DEL\",\"Destination\":\"BOM\"},\"Dates\":{\"DepartureDateTime\":\"06-28T21:40\",\"ArrivalDateTime\":\"06-28T23:50\"},\"FlightSegmentNumbers\":{\"FlightSegmentNumber\":[\"3\"]}}]}]}}],\"ResponseHeader\":{\"Text\":[\"FARE - PRICE RETAINED\",\"FARE USED TO CALCULATE DISCOUNT\",\"FARE NOT GUARANTEED UNTIL TICKETED\"]},\"PriceQuotePlus\":{\"DomesticIntlInd\":\"I\",\"PricingStatus\":\"A\",\"VerifyFareCalc\":false,\"ItineraryChanged\":false,\"ManualFare\":false,\"NegotiatedFare\":false,\"SystemIndicator\":\"S\",\"NUCSuppresion\":false,\"SubjToGovtApproval\":false,\"IT_BT_Fare\":\"BT\",\"DisplayOnly\":false,\"DiscountAmount\":\"0\",\"PassengerInfo\":{\"PassengerType\":\"ADT\",\"PassengerData\":[{\"NameNumber\":\"01.01\",\"content\":\"ZBANNANA\\/JSNSNNS\"}]},\"TicketingInstructionsInfo\":[]}}],\"PriceQuoteTotals\":{\"BaseFare\":{\"Amount\":\"2565.00\"},\"EquivFare\":{\"Amount\":\"1004000.00\"},\"Taxes\":{\"Tax\":{\"Amount\":\"64423.00\"}},\"TotalFare\":{\"Amount\":\"1068423.00\"}}},\"ReservationItems\":{\"Item\":[{\"RPH\":\"1\",\"FlightSegment\":[{\"AirMilesFlown\":\"4191\",\"ArrivalDateTime\":\"06-28T10:55\",\"DayOfWeekInd\":\"4\",\"DepartureDateTime\":\"2024-06-27T22:20\",\"SegmentBookedDate\":\"2024-06-18T10:34:00\",\"ElapsedTime\":\"08.05\",\"eTicket\":true,\"FlightNumber\":\"0018\",\"NumberInParty\":\"01\",\"ResBookDesigCode\":\"Y\",\"SegmentNumber\":\"0001\",\"SmokingAllowed\":false,\"SpecialMeal\":false,\"Status\":\"HK\",\"StopQuantity\":\"00\",\"IsPast\":false,\"CodeShare\":false,\"Id\":\"8\",\"DestinationLocation\":{\"LocationCode\":\"DEL\",\"Terminal\":\"TERMINAL 3\",\"TerminalCode\":\"3\"},\"Equipment\":{\"AirEquipType\":\"789\"},\"MarketingAirline\":{\"Code\":\"UK\",\"FlightNumber\":\"0018\",\"ResBookDesigCode\":\"Y\",\"Banner\":\"MARKETED BY VISTARA\"},\"Meal\":[{\"Code\":\"M\"}],\"OperatingAirline\":[{\"Code\":\"UK\",\"FlightNumber\":\"0018\",\"ResBookDesigCode\":\"Y\",\"Banner\":\"OPERATED BY VISTARA\"}],\"OperatingAirlinePricing\":{\"Code\":\"UK\"},\"DisclosureCarrier\":{\"Code\":\"UK\",\"DOT\":false,\"Banner\":\"VISTARA\"},\"OriginLocation\":{\"LocationCode\":\"LHR\",\"Terminal\":\"TERMINAL 3\",\"TerminalCode\":\"3\"},\"SupplierRef\":{\"ID\":\"DCUK\"},\"UpdatedArrivalTime\":\"06-28T10:55\",\"UpdatedDepartureTime\":\"06-27T22:20\",\"Cabin\":{\"Code\":\"Y\",\"SabreCode\":\"Y\",\"Name\":\"ECONOMY\",\"ShortName\":\"ECONOMY\",\"Lang\":\"EN\"}}],\"Product\":{\"ProductDetails\":{\"productCategory\":\"AIR\",\"ProductName\":{\"type\":\"AIR\",\"content\":\"\"},\"Air\":{\"sequence\":1,\"segmentAssociationId\":2,\"DepartureAirport\":\"LHR\",\"DepartureTerminalName\":\"TERMINAL 3\",\"DepartureTerminalCode\":\"3\",\"ArrivalAirport\":\"DEL\",\"ArrivalTerminalName\":\"TERMINAL 3\",\"ArrivalTerminalCode\":\"3\",\"EquipmentType\":\"789\",\"MarketingAirlineCode\":\"UK\",\"MarketingFlightNumber\":\"18\",\"MarketingClassOfService\":\"Y\",\"Cabin\":{\"code\":\"Y\",\"sabreCode\":\"Y\",\"name\":\"ECONOMY\",\"shortName\":\"ECONOMY\",\"lang\":\"EN\"},\"MealCode\":[\"M\"],\"ElapsedTime\":485,\"AirMilesFlown\":4191,\"FunnelFlight\":false,\"ChangeOfGauge\":false,\"DisclosureCarrier\":{\"Code\":\"UK\",\"DOT\":false,\"Banner\":\"VISTARA\"},\"AirlineRefId\":\"DCUK\",\"Eticket\":true,\"DepartureDateTime\":\"2024-06-27T22:20:00\",\"ArrivalDateTime\":\"2024-06-28T10:55:00\",\"FlightNumber\":\"18\",\"ClassOfService\":\"Y\",\"ActionCode\":\"HK\",\"NumberInParty\":1,\"inboundConnection\":false,\"outboundConnection\":false,\"ScheduleChangeIndicator\":false,\"SegmentBookedDate\":\"2024-06-18T10:34:00\"}}}},{\"RPH\":\"2\",\"FlightSegment\":[{\"AirMilesFlown\":\"0945\",\"ArrivalDateTime\":\"06-28T15:00\",\"DayOfWeekInd\":\"5\",\"DepartureDateTime\":\"2024-06-28T12:25\",\"SegmentBookedDate\":\"2024-06-18T10:34:00\",\"ElapsedTime\":\"02.35\",\"eTicket\":true,\"FlightNumber\":\"0131\",\"NumberInParty\":\"01\",\"ResBookDesigCode\":\"Y\",\"SegmentNumber\":\"0002\",\"SmokingAllowed\":false,\"SpecialMeal\":false,\"Status\":\"HK\",\"StopQuantity\":\"00\",\"IsPast\":false,\"CodeShare\":false,\"Id\":\"10\",\"DestinationLocation\":{\"LocationCode\":\"CMB\"},\"Equipment\":{\"AirEquipType\":\"321\"},\"MarketingAirline\":{\"Code\":\"UK\",\"FlightNumber\":\"0131\",\"ResBookDesigCode\":\"Y\",\"Banner\":\"MARKETED BY VISTARA\"},\"Meal\":[{\"Code\":\"M\"}],\"OperatingAirline\":[{\"Code\":\"UK\",\"FlightNumber\":\"0131\",\"ResBookDesigCode\":\"Y\",\"Banner\":\"OPERATED BY VISTARA\"}],\"OperatingAirlinePricing\":{\"Code\":\"UK\"},\"DisclosureCarrier\":{\"Code\":\"UK\",\"DOT\":false,\"Banner\":\"VISTARA\"},\"OriginLocation\":{\"LocationCode\":\"BOM\",\"Terminal\":\"TERMINAL 2 DOM AND INTL\",\"TerminalCode\":\"2\"},\"SupplierRef\":{\"ID\":\"DCUK\"},\"UpdatedArrivalTime\":\"06-28T15:00\",\"UpdatedDepartureTime\":\"06-28T12:25\",\"Cabin\":{\"Code\":\"Y\",\"SabreCode\":\"Y\",\"Name\":\"ECONOMY\",\"ShortName\":\"ECONOMY\",\"Lang\":\"EN\"}}],\"Product\":{\"ProductDetails\":{\"productCategory\":\"AIR\",\"ProductName\":{\"type\":\"AIR\",\"content\":\"\"},\"Air\":{\"sequence\":2,\"segmentAssociationId\":4,\"DepartureAirport\":\"BOM\",\"DepartureTerminalName\":\"TERMINAL 2 DOM AND INTL\",\"DepartureTerminalCode\":\"2\",\"ArrivalAirport\":\"CMB\",\"EquipmentType\":\"321\",\"MarketingAirlineCode\":\"UK\",\"MarketingFlightNumber\":\"131\",\"MarketingClassOfService\":\"Y\",\"Cabin\":{\"code\":\"Y\",\"sabreCode\":\"Y\",\"name\":\"ECONOMY\",\"shortName\":\"ECONOMY\",\"lang\":\"EN\"},\"MealCode\":[\"M\"],\"ElapsedTime\":155,\"AirMilesFlown\":945,\"FunnelFlight\":false,\"ChangeOfGauge\":false,\"DisclosureCarrier\":{\"Code\":\"UK\",\"DOT\":false,\"Banner\":\"VISTARA\"},\"AirlineRefId\":\"DCUK\",\"Eticket\":true,\"DepartureDateTime\":\"2024-06-28T12:25:00\",\"ArrivalDateTime\":\"2024-06-28T15:00:00\",\"FlightNumber\":\"131\",\"ClassOfService\":\"Y\",\"ActionCode\":\"HK\",\"NumberInParty\":1,\"inboundConnection\":false,\"outboundConnection\":false,\"ScheduleChangeIndicator\":false,\"SegmentBookedDate\":\"2024-06-18T10:34:00\"}}}},{\"RPH\":\"3\",\"FlightSegment\":[{\"AirMilesFlown\":\"0705\",\"ArrivalDateTime\":\"06-28T23:50\",\"DayOfWeekInd\":\"5\",\"DepartureDateTime\":\"2024-06-28T21:40\",\"SegmentBookedDate\":\"2024-06-18T10:34:00\",\"ElapsedTime\":\"02.10\",\"eTicket\":true,\"FlightNumber\":\"0981\",\"NumberInParty\":\"01\",\"ResBookDesigCode\":\"Y\",\"SegmentNumber\":\"0003\",\"SmokingAllowed\":false,\"SpecialMeal\":false,\"Status\":\"HK\",\"StopQuantity\":\"00\",\"IsPast\":false,\"CodeShare\":false,\"Id\":\"9\",\"DestinationLocation\":{\"LocationCode\":\"BOM\",\"Terminal\":\"TERMINAL 2 DOM AND INTL\",\"TerminalCode\":\"2\"},\"Equipment\":{\"AirEquipType\":\"320\"},\"MarketingAirline\":{\"Code\":\"UK\",\"FlightNumber\":\"0981\",\"ResBookDesigCode\":\"Y\",\"Banner\":\"MARKETED BY VISTARA\"},\"Meal\":[{\"Code\":\"M\"}],\"OperatingAirline\":[{\"Code\":\"UK\",\"FlightNumber\":\"0981\",\"ResBookDesigCode\":\"Y\",\"Banner\":\"OPERATED BY VISTARA\"}],\"OperatingAirlinePricing\":{\"Code\":\"UK\"},\"DisclosureCarrier\":{\"Code\":\"UK\",\"DOT\":false,\"Banner\":\"VISTARA\"},\"OriginLocation\":{\"LocationCode\":\"DEL\",\"Terminal\":\"TERMINAL 3\",\"TerminalCode\":\"3\"},\"SupplierRef\":{\"ID\":\"DCUK\"},\"UpdatedArrivalTime\":\"06-28T23:50\",\"UpdatedDepartureTime\":\"06-28T21:40\",\"Cabin\":{\"Code\":\"Y\",\"SabreCode\":\"Y\",\"Name\":\"ECONOMY\",\"ShortName\":\"ECONOMY\",\"Lang\":\"EN\"}}],\"Product\":{\"ProductDetails\":{\"productCategory\":\"AIR\",\"ProductName\":{\"type\":\"AIR\",\"content\":\"\"},\"Air\":{\"sequence\":3,\"segmentAssociationId\":3,\"DepartureAirport\":\"DEL\",\"DepartureTerminalName\":\"TERMINAL 3\",\"DepartureTerminalCode\":\"3\",\"ArrivalAirport\":\"BOM\",\"ArrivalTerminalName\":\"TERMINAL 2 DOM AND INTL\",\"ArrivalTerminalCode\":\"2\",\"EquipmentType\":\"320\",\"MarketingAirlineCode\":\"UK\",\"MarketingFlightNumber\":\"981\",\"MarketingClassOfService\":\"Y\",\"Cabin\":{\"code\":\"Y\",\"sabreCode\":\"Y\",\"name\":\"ECONOMY\",\"shortName\":\"ECONOMY\",\"lang\":\"EN\"},\"MealCode\":[\"M\"],\"ElapsedTime\":130,\"AirMilesFlown\":705,\"FunnelFlight\":false,\"ChangeOfGauge\":false,\"DisclosureCarrier\":{\"Code\":\"UK\",\"DOT\":false,\"Banner\":\"VISTARA\"},\"AirlineRefId\":\"DCUK\",\"Eticket\":true,\"DepartureDateTime\":\"2024-06-28T21:40:00\",\"ArrivalDateTime\":\"2024-06-28T23:50:00\",\"FlightNumber\":\"981\",\"ClassOfService\":\"Y\",\"ActionCode\":\"HK\",\"NumberInParty\":1,\"inboundConnection\":false,\"outboundConnection\":false,\"ScheduleChangeIndicator\":false,\"SegmentBookedDate\":\"2024-06-18T10:34:00\"}}}}]},\"Ticketing\":[{\"RPH\":\"01\",\"TicketTimeLimit\":\"TAW\\/\"}]},\"ItineraryRef\":{\"AirExtras\":false,\"ID\":\"OJWAGI\",\"InhibitCode\":\"U\",\"PartitionID\":\"AA\",\"PrimeHostID\":\"1B\",\"Header\":[\"PRICE QUOTE RECORD - AUTOPRICED\"],\"Source\":{\"AAA_PseudoCityCode\":\"Z7B8\",\"CreateDateTime\":\"2024-06-18T10:34\",\"CreationAgent\":\"AWS\",\"HomePseudoCityCode\":\"Z7B8\",\"PseudoCityCode\":\"Z7B8\",\"ReceivedFrom\":\"SABREAPISTOOLS\",\"LastUpdateDateTime\":\"2024-06-18T10:34\",\"SequenceNumber\":\"1\"}},\"RemarkInfo\":{\"Remark\":[{\"RPH\":\"001\",\"Type\":\"General\",\"Id\":\"11\",\"Text\":\"CREATED WITH SABRE APIS CPNR TOOL\"},{\"RPH\":\"002\",\"Type\":\"Historical\",\"Id\":\"12\",\"Text\":\"TEST HISTORICAL REMARK\"}]},\"OpenReservationElements\":{\"OpenReservationElement\":[{\"id\":\"6\",\"type\":\"PSG_DETAILS_MAIL\",\"elementId\":\"pnr-6\",\"Email\":{\"comment\":\"\",\"Address\":\"PARINDASATHSARA2014@GMAIL.COM\"},\"NameAssociation\":[{\"LastName\":\"ZBANNANA\",\"FirstName\":\"JSNSNNS\",\"ReferenceId\":1,\"NameRefNumber\":\"01.01\"}]}]}},\"PriceQuote\":{\"PriceQuoteInfo\":{\"Reservation\":{\"updateToken\":\"eNc:::e8axgKJXvfKwyjWpMsuPcQ==\",\"activePqCount\":1,\"content\":\"OJWAGI\"},\"Summary\":{\"NameAssociation\":[{\"nameNumber\":\"1.1\",\"nameId\":1,\"firstName\":\"JSNSNNS\",\"lastName\":\"ZBANNANA\",\"PriceQuote\":[{\"type\":\"PQ\",\"number\":1,\"status\":\"A\",\"pricingType\":\"S\",\"pricingStatus\":\"AUTOPRICED\",\"latestPQFlag\":true,\"pqOwner\":\"1B\",\"Indicators\":[],\"Passenger\":{\"type\":\"ADT\",\"requestedType\":\"ADT\",\"passengerTypeCount\":1},\"ItineraryType\":\"I\",\"TicketDesignator\":[\"YV\"],\"ValidatingCarrier\":{\"content\":\"UK\"},\"Amounts\":{\"Total\":{\"currencyCode\":\"LKR\",\"content\":1068423}},\"LocalCreateDateTime\":\"2024-06-18T21:04:00\"}]}],\"SummaryByPassengerType\":{\"FareInfo\":[{\"passengerType\":\"ADT\",\"passengerTypeCount\":1,\"BaseFare\":{\"currencyCode\":\"GBP\",\"decimalPlace\":2,\"content\":2565},\"EquivalentFare\":{\"currencyCode\":\"LKR\",\"content\":1004000},\"TotalTax\":{\"currencyCode\":\"LKR\",\"content\":64423},\"TotalFare\":{\"currencyCode\":\"LKR\",\"content\":1068423}}],\"Total\":[{\"BaseFare\":{\"currencyCode\":\"GBP\",\"decimalPlace\":2,\"content\":2565},\"EquivalentFare\":{\"currencyCode\":\"LKR\",\"content\":1004000},\"TotalTax\":{\"currencyCode\":\"LKR\",\"content\":64423},\"TotalFare\":{\"currencyCode\":\"LKR\",\"content\":1068423}}]}},\"Details\":[{\"type\":\"PQ\",\"number\":1,\"passengerType\":\"ADT\",\"status\":\"A\",\"pricingType\":\"S\",\"pricingStatus\":\"AUTOPRICED\",\"ataFormat\":false,\"pqOwner\":\"1B\",\"AgentInfo\":{\"sine\":\"AWS\",\"duty\":\"*\",\"HomeLocation\":\"Z7B8\",\"WorkLocation\":\"Z7B8\"},\"TransactionInfo\":{\"CreateDateTime\":\"2024-06-18T10:34:00\",\"UpdateDateTime\":\"2024-06-18T10:34:00\",\"LocalCreateDateTime\":\"2024-06-18T21:04:00\",\"LocalUpdateDateTime\":\"2024-06-18T21:04:00\",\"InputEntry\":\"WPP1ADT$RQ\",\"PricedLocation\":{\"countryCode\":\"LK\",\"content\":\"CMB\"},\"TicketedLocation\":{\"countryCode\":\"LK\",\"content\":\"CMB\"},\"PricingQualifiers\":{\"Qualifier\":[{\"ActionCode\":\"WP\"},{\"mergeAllowed\":true,\"ActionCode\":\"P\",\"Data\":\"1ADT\"},{\"ActionCode\":\"RQ\"}]}},\"NameAssociationInfo\":[{\"nameNumber\":\"1.1\",\"nameId\":1,\"firstName\":\"JSNSNNS\",\"lastName\":\"ZBANNANA\"}],\"SegmentInfo\":[{\"number\":1,\"segmentStatus\":\"OK\",\"segNumber\":\"1\",\"segID\":\"2\",\"bookingStatus\":\"OK\",\"Flight\":{\"connectionIndicator\":\"O\",\"MarketingFlight\":{\"number\":\"18\",\"content\":\"UK\"},\"ClassOfService\":\"Y\",\"Departure\":{\"DateTime\":\"2024-06-27T22:20:00\",\"CityCode\":{\"name\":\"LONDON HEATHROW\",\"content\":\"LHR\"}},\"Arrival\":{\"DateTime\":\"2024-06-28T10:55:00\",\"CityCode\":{\"name\":\"DELHI\",\"content\":\"DEL\"}},\"OperatingFlight\":{\"number\":\"18\",\"content\":\"UK\"}},\"FareBasis\":\"YLXOGBYV\\/YV\",\"NotValidBefore\":\"2024-06-27\",\"NotValidAfter\":\"2024-06-27\",\"Baggage\":{\"type\":\"K\",\"allowance\":\"30\"},\"BrandedFare\":[]},{\"number\":2,\"type\":\"A\",\"Flight\":{\"Departure\":{\"CityCode\":{\"name\":\"DELHI\",\"content\":\"DEL\"}},\"Arrival\":{\"CityCode\":{\"name\":\"MUMBAI\",\"content\":\"BOM\"}}},\"BrandedFare\":[]},{\"number\":3,\"segmentStatus\":\"OK\",\"segNumber\":\"2\",\"segID\":\"4\",\"bookingStatus\":\"OK\",\"Flight\":{\"connectionIndicator\":\"X\",\"MarketingFlight\":{\"number\":\"131\",\"content\":\"UK\"},\"ClassOfService\":\"Y\",\"Departure\":{\"DateTime\":\"2024-06-28T12:25:00\",\"CityCode\":{\"name\":\"MUMBAI\",\"content\":\"BOM\"}},\"Arrival\":{\"DateTime\":\"2024-06-28T15:00:00\",\"CityCode\":{\"name\":\"COLOMBO\",\"content\":\"CMB\"}},\"OperatingFlight\":{\"number\":\"131\",\"content\":\"UK\"}},\"FareBasis\":\"YOINYV\\/YV\",\"NotValidBefore\":\"2024-06-28\",\"NotValidAfter\":\"2024-06-28\",\"Baggage\":{\"type\":\"K\",\"allowance\":\"30\"},\"BrandedFare\":[]},{\"number\":4,\"type\":\"A\",\"Flight\":{\"Departure\":{\"CityCode\":{\"name\":\"COLOMBO\",\"content\":\"CMB\"}},\"Arrival\":{\"CityCode\":{\"name\":\"DELHI\",\"content\":\"DEL\"}}},\"BrandedFare\":[]},{\"number\":5,\"segmentStatus\":\"OK\",\"segNumber\":\"3\",\"segID\":\"3\",\"bookingStatus\":\"OK\",\"Flight\":{\"connectionIndicator\":\"X\",\"MarketingFlight\":{\"number\":\"981\",\"content\":\"UK\"},\"ClassOfService\":\"Y\",\"Departure\":{\"DateTime\":\"2024-06-28T21:40:00\",\"CityCode\":{\"name\":\"DELHI\",\"content\":\"DEL\"}},\"Arrival\":{\"DateTime\":\"2024-06-28T23:50:00\",\"CityCode\":{\"name\":\"MUMBAI\",\"content\":\"BOM\"}},\"OperatingFlight\":{\"number\":\"981\",\"content\":\"UK\"}},\"FareBasis\":\"YOIATAYF\\/YF\",\"NotValidAfter\":\"2025-06-27\",\"Baggage\":{\"type\":\"K\",\"allowance\":\"35\"},\"BrandedFare\":[]}],\"FareInfo\":{\"source\":\"ATPC\",\"FareIndicators\":[],\"BaseFare\":{\"currencyCode\":\"GBP\",\"decimalPlace\":2,\"content\":\"2565.00\"},\"EquivalentFare\":{\"currencyCode\":\"LKR\",\"content\":\"1004000\"},\"TotalTax\":{\"currencyCode\":\"LKR\",\"content\":\"64423\"},\"TotalFare\":{\"currencyCode\":\"LKR\",\"content\":\"1068423\"},\"TaxInfo\":{\"CombinedTax\":[{\"code\":\"GB\",\"Amount\":{\"currencyCode\":\"LKR\",\"content\":34442}},{\"code\":\"UB\",\"Amount\":{\"currencyCode\":\"LKR\",\"content\":19135}},{\"code\":\"XT\",\"Amount\":{\"currencyCode\":\"LKR\",\"content\":10846}}],\"Tax\":[{\"code\":\"GB\",\"Amount\":{\"currencyCode\":\"LKR\",\"content\":34442}},{\"code\":\"UB\",\"Amount\":{\"currencyCode\":\"LKR\",\"content\":19135}},{\"code\":\"WO\",\"Amount\":{\"currencyCode\":\"LKR\",\"content\":704}},{\"code\":\"IN\",\"Amount\":{\"currencyCode\":\"LKR\",\"content\":1213}},{\"code\":\"YM\",\"Amount\":{\"currencyCode\":\"LKR\",\"content\":2615}},{\"code\":\"YR\",\"Amount\":{\"currencyCode\":\"LKR\",\"content\":1073}},{\"code\":\"P2\",\"Amount\":{\"currencyCode\":\"LKR\",\"content\":5241}}]},\"FareCalculation\":{\"rateOfExchange\":\"0.79829500\",\"Text\":\"LON UK DEL Q137.79 1879.00\\/-BOM UK CMB Q46.00 742.84\\/-DEL UK BOM406.85NUC3212.48END ROE0.798295\",\"Amount\":{\"currencyCode\":\"NUC\",\"decimalPlace\":2,\"content\":\"3212.48\"}},\"CurrencyConversion\":{\"fromCurrency\":\"GBP\",\"toCurrency\":\"LKR\",\"rateOfExchange\":\"391.384285\"},\"FareComponent\":[{\"type\":\"ER\",\"typeBitmap\":\"00\",\"number\":1,\"fareBasisCode\":\"YLXOGBYV\\/YV\",\"FlightSegmentNumbers\":{\"SegmentNumber\":[1]},\"FlightSegment\":[{\"fareBreakPoint\":true,\"SegmentNumber\":1,\"Surcharge\":[{\"nature\":\"S\",\"natureType\":\"Q\",\"Fare\":{\"currencyCode\":\"GBP\",\"decimalPlace\":2,\"content\":137.79},\"Description\":\"LON  LHR     DEL  DEL\"}],\"Amount\":{\"decimalPlace\":2,\"content\":1879}}],\"FareDirectionality\":{\"oneWay\":true,\"globalDirection\":\"EH\"},\"Departure\":{\"DateTime\":\"2024-06-27T22:20:00\",\"CityCode\":{\"name\":\"LONDON HEATHROW\",\"content\":\"LON\"}},\"Arrival\":{\"DateTime\":\"2024-06-28T10:55:00\",\"CityCode\":{\"name\":\"DELHI\",\"content\":\"DEL\"}},\"Amount\":{\"currencyCode\":\"NUC\",\"decimalPlace\":2,\"content\":1879},\"GoverningCarrier\":{\"content\":\"UK\"},\"TicketDesignator\":[\"YV\"],\"Rules\":{\"vendor\":\"ATP\",\"carrier\":\"UK\",\"tariff\":\"4\",\"rule\":\"GB10\"},\"FareIndicators\":{\"publishedFare\":true}},{\"type\":\"ER\",\"typeBitmap\":\"00\",\"number\":2,\"fareBasisCode\":\"YOINYV\\/YV\",\"FlightSegmentNumbers\":{\"SegmentNumber\":[3]},\"FlightSegment\":[{\"fareBreakPoint\":true,\"SegmentNumber\":3,\"Surcharge\":[{\"nature\":\"S\",\"natureType\":\"Q\",\"Fare\":{\"currencyCode\":\"GBP\",\"decimalPlace\":2,\"content\":46},\"Description\":\"BOM  BOM     CMB  CMB\"}],\"Amount\":{\"decimalPlace\":2,\"content\":742.84}}],\"FareDirectionality\":{\"oneWay\":true,\"globalDirection\":\"EH\"},\"Departure\":{\"DateTime\":\"2024-06-28T12:25:00\",\"CityCode\":{\"name\":\"MUMBAI\",\"content\":\"BOM\"}},\"Arrival\":{\"DateTime\":\"2024-06-28T15:00:00\",\"CityCode\":{\"name\":\"COLOMBO\",\"content\":\"CMB\"}},\"Amount\":{\"currencyCode\":\"NUC\",\"decimalPlace\":2,\"content\":742.84},\"GoverningCarrier\":{\"content\":\"UK\"},\"TicketDesignator\":[\"YV\"],\"Rules\":{\"vendor\":\"ATP\",\"carrier\":\"UK\",\"tariff\":\"8\",\"rule\":\"IN10\"},\"FareIndicators\":{\"publishedFare\":true}},{\"type\":\"EU\",\"typeBitmap\":\"00\",\"number\":3,\"fareBasisCode\":\"YOIATAYF\\/YF\",\"FlightSegmentNumbers\":{\"SegmentNumber\":[5]},\"FlightSegment\":[{\"fareBreakPoint\":true,\"SegmentNumber\":5,\"Amount\":{\"decimalPlace\":2,\"content\":406.85}}],\"FareDirectionality\":{\"oneWay\":true,\"globalDirection\":\"EH\"},\"Departure\":{\"DateTime\":\"2024-06-28T21:40:00\",\"CityCode\":{\"name\":\"DELHI\",\"content\":\"DEL\"}},\"Arrival\":{\"DateTime\":\"2024-06-28T23:50:00\",\"CityCode\":{\"name\":\"MUMBAI\",\"content\":\"BOM\"}},\"Amount\":{\"currencyCode\":\"NUC\",\"decimalPlace\":2,\"content\":406.85},\"GoverningCarrier\":{\"content\":\"UK\"},\"TicketDesignator\":[\"YF\"],\"Rules\":{\"vendor\":\"ATP\",\"carrier\":\"UK\",\"tariff\":\"302\",\"rule\":\"IN10\"},\"FareIndicators\":{\"publishedFare\":true}}],\"BaggageDisclosureInd\":6,\"CommencementDate\":\"2024-06-27T00:00:00\"},\"FeeInfo\":[[]],\"MiscellaneousInfo\":{\"ValidatingCarrier\":[{\"content\":\"UK\"}],\"ItineraryType\":\"I\"},\"MessageInfo\":{\"Message\":[{\"type\":\"WARNING\",\"content\":\"UK HAS NO TICKETING AGREEMENT-CHANGE VALIDATING CARRIER\"},{\"type\":\"WARNING\",\"content\":\"VALIDATING CARRIER - UK\"}],\"Remarks\":[{\"type\":\"ENS\",\"content\":\"NON ENDORSABLE\\/NON RE-ROUTABLE\\/REBOOKING SBJCT TO PENALTY\"},{\"type\":\"ENS\",\"content\":\"NONEND\\/CHG-XXL-NOSHOW RFR\\/RULE\\/FLEXI FARE 2PC 32KG\\/EACH ELSE 2PC 23KG EACH\"},{\"type\":\"ENS\",\"content\":\"NON ENDORSABLE\\/RE-ROUTABLE\\/REBOOKING SBJCT TO PENALTY\"}],\"PricingParameters\":\"WPP1ADT$RQ\"},\"HistoryInfo\":[{\"AgentInfo\":{\"sine\":\"AWS\",\"HomeLocation\":\"Z7B8\"},\"TransactionInfo\":{\"LocalDateTime\":\"2024-06-18T21:04:00\",\"InputEntry\":\"WPP1ADT$RQ\"}}]}],\"MiscellaneousData\":{\"Value\":[{\"type\":\"sorSource\",\"content\":\"PSS\"},{\"type\":\"PQMMsg\",\"content\":\"OJWAGI-PSS-PQM-NotProcessed\"},{\"type\":\"agencyDefaultCurrencyCode\",\"content\":\"LKR\"}]}}}}},\"Links\":[{\"rel\":\"self\",\"href\":\"https:\\/\\/api.cert.platform.sabre.com\\/v2.4.0\\/passenger\\/records?mode=create\"},{\"rel\":\"linkTemplate\",\"href\":\"https:\\/\\/api.cert.platform.sabre.com\\/<version>\\/passenger\\/records?mode=<mode>\"}]}",
//     "departure_dates": "2024-06-27",
//     "arrival_dates": "",
//     "departure_airports": "LHR",
//     "arrival_airports": "CMB",
//     "revalidated_data": null,
//     "passenger_count": 1,
//     "seat_count": 1,
//     "passenger_type": "ADT",
//     "adult_count": 1,
//     "child_count": 0,
//     "infant_count": 0,
//     "cabin_code": "Y",
//     "created_at": "2024-06-18T15:34:23.000000Z",
//     "updated_at": "2024-06-18T15:34:23.000000Z"
// }