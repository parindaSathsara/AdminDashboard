import React, { useEffect, useState } from 'react'
import ImageContainer from './ImageContainer'
import convertToActualTimeMeta from '../Functions/convertToActualTimeMeta'
import getStopCount from '../Functions/getStopCount'
import getAirportName from '../Functions/getAirportName'
import calculateDuration from '../Functions/calculateDuration'
import moment from 'moment'
import getFlightNameMeta from '../Functions/getFlightName'
import getCountryName from '../Functions/getCountryName'
import getCityName from '../Functions/getCityName'

export default function ArrDepLine({ flightData, depDate, flightCodes, reVal = false }) {

    const images = ["https://gateway.aahaas.com/Airlines/3O.png"]


    var dataSet = {
        departureTime: "",
        departureCity: "",
        duration: "",
        stopCount: "",
        arrivalTime: "",
        arrivalCity: "",
        depDate: "",
        arrDate: "",
        arrivalCityLoc: "",
        departureCityLoc: ""
    }

    const [flightArrDepData, setFlightArrDepData] = useState([])
    const [flightCodesData, setFlightCodesData] = useState([])
    // var totalStopCount = calculateTotalStopCount(props.arrDepData)?

    //console.log(props.depDate, "Flights Data Are123")

    useEffect(() => {

        // //console.log("Arr Dep Data is", props.arrDepData)
        setFlightArrDepData(flightData)
        setFlightCodesData(flightCodes)


    }, [flightData, flightCodes])



    function calculateTotalStopCount(flights) {


        // console.log(flights, "Flight Validation Data set is")
        let totalStopCount = 0;
        for (const flight of flights) {
            totalStopCount += flight.stopCount;
        }
        return totalStopCount;
    }

    function calculateDateCount(scheduleData) {
        let totalDays = 0;



        for (let i = 0; i < scheduleData.length; i++) {
            totalDays += scheduleData[i].arrival.dateAdjustment || 0;
        }

        //console.log("Dates Count data is", totalDays)

        return totalDays;
    }


    dataSet = {
        departureCity: flightArrDepData[0]?.departure?.city,
        departureTerminal: flightArrDepData[0]?.departure?.terminal,
        arrivalCity: flightArrDepData[flightArrDepData.length - 1]?.arrival?.city,
        arrivalTerminal: flightArrDepData[0]?.arrival?.terminal,
        arrivalTime: convertToActualTimeMeta(flightArrDepData[flightArrDepData.length - 1]?.arrival?.time),
        departureTime: convertToActualTimeMeta(flightArrDepData[0]?.departure?.time),
        stopCount: getStopCount(calculateTotalStopCount(flightArrDepData)),
        duration: calculateDuration(flightArrDepData, "timeDiff"),
        depDate: depDate,
        arrDate: moment(depDate, "YYYY-MM-DD").add(calculateDateCount(flightArrDepData), 'days').format("YYYY-MM-DD"),
        arrivalCityLoc: getAirportName(flightArrDepData[flightArrDepData.length - 1]?.arrival?.city),
        departureCityLoc: getAirportName(flightArrDepData[0]?.departure?.city),
    }






    return (
        <div className="flight-section">

            {reVal == false ?
                <h4 className="section-header">
                    {getCityName(dataSet.departureCity) !== getCountryName(dataSet.departureCity)
                        ? `${getCityName(dataSet.departureCity)} (${getCountryName(dataSet.departureCity)})`
                        : getCountryName(dataSet.departureCity)}
                    {' to '}
                    {getCityName(dataSet.arrivalCity) !== getCountryName(dataSet.arrivalCity)
                        ? `${getCityName(dataSet.arrivalCity)} (${getCountryName(dataSet.arrivalCity)})`
                        : getCountryName(dataSet.arrivalCity)}
                </h4>

                :
                <h6 className="section-header">
                    {getCityName(dataSet.departureCity) !== getCountryName(dataSet.departureCity)
                        ? `${getCityName(dataSet.departureCity)} (${getCountryName(dataSet.departureCity)})`
                        : getCountryName(dataSet.departureCity)}
                    {' to '}
                    {getCityName(dataSet.arrivalCity) !== getCountryName(dataSet.arrivalCity)
                        ? `${getCityName(dataSet.arrivalCity)} (${getCountryName(dataSet.arrivalCity)})`
                        : getCountryName(dataSet.arrivalCity)}
                </h6>}


            <div className="row align-items-center mb-3">
                <div className="col-md-2 text-center">
                    <ImageContainer images={flightCodesData} />
                </div>
                <div className="col-md-4">
                    <h6 className="mb-1">{reVal == false ? dataSet?.depDate : ""} {dataSet?.departureTime}</h6>

                    <p className="mb-0 text-muted">{dataSet.departureCity}</p>
                    <p className="mb-0 text-muted">{dataSet?.departureCityLoc}</p>
                </div>
                <div className="col-md-1 text-center">
                    <p className="mb-0 text-muted">{dataSet?.duration}</p>
                    {reVal ? null : <p className="mb-0" style={{ color: 'red', fontWeight: '500' }}>{dataSet?.stopCount}</p>}
                </div>
                <div className="col-md-4 d-flex flex-column align-items-end">

                    <h6 className="mb-1 text-right">{reVal == false ? dataSet?.arrDate : ""} {dataSet?.arrivalTime}</h6>
                    <p className="mb-0 text-muted text-right">{dataSet?.arrivalCity}</p>
                    <p className="mb-0 text-muted text-right">
                        {dataSet?.arrivalCityLoc}
                        {dataSet?.arrivalTerminal ? ` (Terminal ${dataSet?.arrivalTerminal})` : null}
                    </p>
                </div>

                <div className="col-md-1 text-right">
                    {
                        flightCodesData.map((data, index) => (
                            <h5 className="mb-1">{getFlightNameMeta(data)}</h5>
                        ))
                    }

                </div>
            </div>
        </div>
    )
}
