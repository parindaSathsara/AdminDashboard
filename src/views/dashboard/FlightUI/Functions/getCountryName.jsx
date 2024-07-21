import AirportCodes from '../../../../Data/AirportCodes.json'



const getCountryName = (data) => {


    return (
        AirportCodes.airport_codes?.filter(flight => flight?.iata_code == data)?.[0]?.['country']
    )
}



export default getCountryName;