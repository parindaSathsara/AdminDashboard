import AirportCodes from '../../../../Data/AirportCodes.json'



const getAirportName = (data) => {


    return (
        AirportCodes.airport_codes?.filter(flight => flight?.iata_code == data)?.[0]?.['name']
    )
}



export default getAirportName;