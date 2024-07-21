function calculateDurationHidden(departureTime, arrivalTime, dateAdjustment) {

    const departure = new Date("1970-01-01T" + departureTime + "Z");
    const arrival = new Date("1970-01-01T" + arrivalTime + "Z");

    // arrival.setDate(arrival.getDate() + dateAdjustment);

    let durationMs = arrival - departure;

    if (durationMs < 0) {
        durationMs += 24 * 60 * 60 * 1000;
    }

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours === 0) {
        return `${minutes} mins`;
    } else {
        if (minutes === 0) {
            return `${hours}h`;
        } else {
            return `${hours}h ${minutes}mins`;
        }
    }
}


export default calculateDurationHidden;