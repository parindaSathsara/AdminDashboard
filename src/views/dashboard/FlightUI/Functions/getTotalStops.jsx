var flightDataCount = 0;
const getTotalStops = (data) => {
    flightDataCount = data?.length;

    data?.forEach(schedule => {
        flightDataCount = flightDataCount + schedule.stopCount;
    });

    var flightCount = flightDataCount - 1;

    if (flightCount > 0) {
        if (flightCount > 1) {
            return "(" + flightCount + " Stops)";
        }
        else {
            return "(" + flightCount + " Stop)";
        }
    }
}


export default getTotalStops;