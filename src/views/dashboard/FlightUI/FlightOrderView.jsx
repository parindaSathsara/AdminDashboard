import React from 'react'
import './FlightOrderView.css'
import FlightCard from './Components/FlightCard'
import { CCardBody, CContainer } from '@coreui/react'
import MoreOrderView from 'src/Panels/OrderDetails/MoreOrderView/MoreOrderView'
import MoreOrderViewFlights from './Components/MoreOrderViewFlights'
import PassengerDetails from './Components/PassengerDetails'
import FareDetails from './Components/FareDetails'

export default function FlightOrderView({ flightMetadata = [] }) {





    const flightData = flightMetadata[0]?.validData

    const customerSearchData = flightMetadata[0]?.flightCustomerSearch


    const departureArray = customerSearchData.from_location.split(",")
    const arrivalArray = customerSearchData.to_location.split(",")

    const flightOriginData = flightMetadata[0]?.flightOriginData

    const flightRevalidationData = flightMetadata[0]?.flightRevalidation




    const paxDetails = flightMetadata[0]?.paxData

    var flightCodesData = [...new Set(flightOriginData.flightCodes)];


    const fetchClass = () => {
        if (customerSearchData.cabin_code == "P") {
            return "Premium First"
        }
        else if (customerSearchData.cabin_code == "F") {
            return "Premium First"
        }
        else if (customerSearchData.cabin_code == "J") {
            return "Business"
        }
        else if (customerSearchData?.cabin_code == "C") {
            return "Premium Economy"
        }
        else if (customerSearchData?.cabin_code == "Y") {
            return "Economy"
        }
    }


    const pricingData = flightMetadata[0]?.pricingData








    return (
        <CCardBody>
            <h5 className='mb-3'>Flight Details</h5>

            <CContainer fluid style={{ backgroundColor: '#070e1a', marginBottom: 0, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <h5 style={{ padding: 10, color: 'white' }}>{fetchClass()} Class </h5>
                <h5 style={{ padding: 10, color: 'white' }}> {customerSearchData?.adultCount} Adults  |  {customerSearchData?.childCount} Children  |  {customerSearchData?.infCount} Infants</h5>
            </CContainer>

            <FlightCard flightData={flightOriginData} flightCodes={flightCodesData} type={flightData?.trip_type}></FlightCard>

            <MoreOrderViewFlights revalidationData={flightRevalidationData} customerSearchData={customerSearchData} flightCodes={flightCodesData}>
            </MoreOrderViewFlights>

            <PassengerDetails customerSearchData={customerSearchData} paxDetails={paxDetails}></PassengerDetails>

            {/* <FareDetails fareDetails={pricingData}></FareDetails> */}


        </CCardBody>
    )
}
