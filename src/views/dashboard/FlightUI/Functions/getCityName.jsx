import AirportCodes from '../../../../Data/AirportCodes.json'



const getCityName = (data) => {


    return (
        AirportCodes.airport_codes?.filter(flight => flight?.iata_code == data)?.[0]?.['city_name']
    )
}



export default getCityName;