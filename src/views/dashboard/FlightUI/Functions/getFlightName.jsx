import AirplaneCodes from '../../../../Data/AirplaneCodes.json'



const getFlightNameMeta = (data) => {


    return (
        AirplaneCodes?.filter(flight => flight?.AirlineCode == data)?.[0]?.['AlternativeBusinessName']
    )
}



export default getFlightNameMeta;