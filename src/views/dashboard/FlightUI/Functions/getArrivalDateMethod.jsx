import moment from "moment";

const getArrivalDate = (departureDate, dataSet) => {
    var dateAdjusments = [];

    // var depDate = new Date(departureDate)

    dataSet?.legsData?.schedules?.forEach(data => {
        if (data.departureDateAdjustment) {
            dateAdjusments.push(moment(departureDate).add(1, 'days').format("YYYY-MM-DD"))
        }
        else {
            dateAdjusments.push(moment(departureDate).format("YYYY-MM-DD"));
        }
    });


    return dateAdjusments

}



export default getArrivalDate;