import { CContainer } from '@coreui/react'
import React, { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import ArrDepLine from './ArrDepLine'
import calculateDurationHidden from '../Functions/calculateDurationHidden'
import convertToActualTimeMeta from '../Functions/convertToActualTimeMeta'

export default function MoreOrderViewFlights({ revalidationData, customerSearchData, flightCodes }) {
    const departureArray = customerSearchData.from_location.split(",")
    const arrivalArray = customerSearchData.to_location.split(",")


    const [index, setIndex] = useState(0)
    const loadFlightData = (revalidateData, type, index) => {

        var flights = [];

        var originArray = [];


        //console.log("Trip type is data ddddd", type)

        if (type == "One Way") {
            originArray = revalidateData?.scheduleDescs

            revalidateData?.scheduleDescs
                ?.forEach(schedule => {
                    if (schedule.hiddenStops && schedule.hiddenStops.length > 0) {
                        // Add the direct flight from DXB to MLE
                        flights.push({
                            ...schedule,
                            id: 1,
                            departure: {
                                airport: schedule.departure.airport,
                                city: schedule.departure.city,
                                country: schedule.departure.country,
                                time: schedule.departure.time
                            },
                            arrival: {
                                airport: schedule.hiddenStops[0].airport,
                                city: schedule.hiddenStops[0].airport,
                                country: schedule.hiddenStops[0].airport,
                                time: schedule.hiddenStops[0].arrivalTime
                            }
                        });

                        // Add the flight from MLE to CMB without hiddenStops
                        const mleToCmbFlight = {
                            ...schedule,
                            id: 2,
                            departure: {
                                airport: schedule.hiddenStops[0].airport,
                                city: schedule.hiddenStops[0].airport,
                                country: schedule.hiddenStops[0].airport,
                                time: schedule.hiddenStops[0].departureTime
                            },
                            arrival: {
                                airport: schedule.arrival.airport,
                                city: schedule.arrival.city,
                                country: schedule.arrival.country,
                                time: schedule.arrival.time
                            }
                        };
                        delete mleToCmbFlight.hiddenStops;
                        flights.push(mleToCmbFlight);
                    } else {
                        flights.push(schedule);
                    }
                });
        }

        else if (type == "Round Trip" || type == "Multi City") {


            //console.log(type, "Trip type data is")
            originArray = revalidateData

            //console.log(originArray.scheduleDescs?.[index], "Schedule descs data is22222")

            // //console.log(originArray.scheduleDescs[0], "Origin Array ARRDEP")
            originArray.scheduleDescs?.[index].map(schedule => {
                //console.log(schedule, "DataD")

                if (schedule.hiddenStops && schedule.hiddenStops.length > 0) {
                    // Add the direct flight from DXB to MLE
                    flights.push({
                        ...schedule,
                        id: 1,
                        departure: {
                            airport: schedule.departure.airport,
                            city: schedule.departure.city,
                            country: schedule.departure.country,
                            time: schedule.departure.time
                        },
                        arrival: {
                            airport: schedule.hiddenStops[0].airport,
                            city: schedule.hiddenStops[0].airport,
                            country: schedule.hiddenStops[0].airport,
                            time: schedule.hiddenStops[0].arrivalTime
                        }
                    });

                    // Add the flight from MLE to CMB without hiddenStops
                    const mleToCmbFlight = {
                        ...schedule,
                        id: 2,
                        departure: {
                            airport: schedule.hiddenStops[0].airport,
                            city: schedule.hiddenStops[0].airport,
                            country: schedule.hiddenStops[0].airport,
                            time: schedule.hiddenStops[0].departureTime
                        },
                        arrival: {
                            airport: schedule.arrival.airport,
                            city: schedule.arrival.city,
                            country: schedule.arrival.country,
                            time: schedule.arrival.time
                        }
                    };
                    delete mleToCmbFlight.hiddenStops;
                    flights.push(mleToCmbFlight);
                } else {
                    flights.push(schedule);
                }




            })





        }




        return flights;
    }


    { console.log(index, "Index value is") }
    return (
        <CContainer fluid style={{ width: '100%', backgroundColor: '#E7ECEF', padding: 15, marginBottom: 20 }}>

            <h5 className='mb-3'>Flight More Info</h5>

            <Tabs defaultActiveKey={0} id="flight-tabs" className="mb-3" onChange={(e) => console.log(e)}>

                {departureArray?.map((data, datI) => {
                    return (
                        <Tab eventKey={datI} title={data + "  ✈  " + arrivalArray[datI]}>
                            {loadFlightData(revalidationData, customerSearchData.trip_type, datI).map((data, index) => {
                                var dataArray = []
                                if (customerSearchData.trip_type == "One Way") {
                                    dataArray = [data]
                                }
                                else {
                                    dataArray = [data]
                                }

                                if (data?.hiddenStops) {
                                    return (
                                        <CContainer fluid>
                                            <ArrDepLine flightData={dataArray} depDate={""} flightCodes={flightCodes} reVal={true} ></ArrDepLine>

                                            <div className="row align-items-center mb-3 bg-light py-2">
                                                <div className="col text-center">
                                                    <p className="mb-0 text-muted">{calculateDurationHidden(convertToActualTimeMeta(data.hiddenStops[0].arrivalTime), convertToActualTimeMeta(data.hiddenStops[0].departureTime), 0)} Layover in {data.hiddenStops[0].airport}</p>

                                                </div>
                                            </div>
                                        </CContainer>
                                    )
                                }
                                else {
                                    return (
                                        <CContainer fluid>
                                            <ArrDepLine flightData={dataArray} depDate={""} flightCodes={flightCodes} reVal={true} ></ArrDepLine>
                                        </CContainer>
                                    )
                                }

                            })}
                        </Tab>
                    )
                })}


            </Tabs>



        </CContainer>

    )
}
