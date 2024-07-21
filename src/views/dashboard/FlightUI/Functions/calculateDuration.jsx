import convertToActualTimeMeta from "./convertToActualTimeMeta";

function calculateDuration(scheduleData, status) {

    function calculateDuration(departureTime, arrivalTime, dateAdjustment) {

        const departure = new Date("1970-01-01T" + departureTime + "Z");
        const arrival = new Date("1970-01-01T" + arrivalTime + "Z");

        arrival.setDate(arrival.getDate() + dateAdjustment);

        let durationMs = arrival - departure;

        if (durationMs < 0) {
            durationMs += 24 * 60 * 60 * 1000;
        }

        const hours = Math.floor(durationMs / (1000 * 60 * 60));
        const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

        return { hours, minutes };
    }

    let totalHours = 0;
    let totalMinutes = 0;

    for (let i = 0; i < scheduleData.length; i++) {
        const departureTime = i === 0 ? scheduleData[i].departure.time : scheduleData[i - 1].arrival.time;
        const arrivalTime = scheduleData[i].arrival.time;
        const dateAdjustment = scheduleData[i].arrival.dateAdjustment || 0;

        const { hours, minutes } = calculateDuration(convertToActualTimeMeta(departureTime), convertToActualTimeMeta(arrivalTime), dateAdjustment);

        totalHours += hours;
        totalMinutes += minutes;
    }

    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;

    let totalDurationString = '';

    if (totalHours > 0) {
        totalDurationString += `${totalHours}h`;
    }

    if (totalMinutes > 0) {
        if (totalDurationString !== '') {
            totalDurationString += ' ';
        }
        totalDurationString += `${totalMinutes}mins`;
    }

    return totalDurationString || '0mins';
}

export default calculateDuration;