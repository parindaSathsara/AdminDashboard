import FlightArrDepLine from "../FlightMainCard/FlightArrDepLine";


function getFlightArrDepLine(data, type) {


    if (type == "OneWay") {
        return (
            <FlightArrDepLine arrDepData={[data]} detailView></FlightArrDepLine>
        )
    }
    else if (type == "RoundTrip") {
        return (
            <FlightArrDepLine arrDepData={data} detailView></FlightArrDepLine>
        )
    }
}

export default getFlightArrDepLine;