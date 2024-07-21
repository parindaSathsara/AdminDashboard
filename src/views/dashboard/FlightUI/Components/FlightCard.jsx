import React from 'react';
import './FlightCard.css'; // Custom CSS
import ImageContainer from './ImageContainer';
import ArrDepLine from './ArrDepLine';

const FlightCard = ({ flightData, flightCodes, type }) => {


    if (type == "One Way") {
        return (
            <div className="card mb-4 flight-card">
                <div className="card-body">

                    <ArrDepLine flightData={flightData?.scheduleData} depDate={flightData?.itenaryGroupData?.legDescriptions?.[0]?.departureDate} flightCodes={flightCodes} ></ArrDepLine>


                </div>
            </div>
        );
    }
    else if (type == "Round Trip" || type == "Multi City") {
        return (
            <>
                {flightData?.scheduleData?.map((data, index) => {
                    return (
                        <ArrDepLine flightData={data} depDate={flightData?.itenaryGroupData?.legDescriptions?.[index]?.departureDate} flightCodes={flightCodes}></ArrDepLine>
                    )
                })}
            </>
        )
    }

};

export default FlightCard;
